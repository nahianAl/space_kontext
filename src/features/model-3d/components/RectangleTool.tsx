'use client';

import React from 'react';
import * as THREE from 'three';
import { useThree } from '@react-three/fiber';
import { useCADToolsStore } from '../store/cadToolsStore';
import { useThreeSceneStore } from '../store/threeSceneStore';
import { createCADObject } from '../utils/shapeGenerators';
import { buildFaceData } from '../utils/pushPull';
import { generateAllSnapCandidates, extractEdgesForInference } from '../utils/snapCandidateGenerator';
import { snapPoint, AxisLock } from '../utils/snapping';
import type { FaceData } from '../types/cadObjects';

const MIN_DRAW_SIZE = 0.02;
const MIN_FINAL_SIZE = 0.05;
const PREVIEW_OFFSET = 0.004;
const RECTANGLE_THICKNESS = 0.01; // Very thin for near-2D behavior

interface DrawingState {
  plane: THREE.Plane;
  startPoint: THREE.Vector3;
  normal: THREE.Vector3;
  basisU: THREE.Vector3;
  basisV: THREE.Vector3;
  supportObjectId: string | null;
  faceData: FaceData | null; // Store face data for splitting
}

interface PreviewData {
  center: [number, number, number];
  quaternion: [number, number, number, number];
  width: number;
  height: number;
  normal: [number, number, number];
}

const vectorToTuple = (vector: THREE.Vector3): [number, number, number] => [vector.x, vector.y, vector.z];
const quaternionToTuple = (quat: THREE.Quaternion): [number, number, number, number] => [
  quat.x,
  quat.y,
  quat.z,
  quat.w,
];

const computePlaneBasis = (normal: THREE.Vector3): { u: THREE.Vector3; v: THREE.Vector3 } => {
  const normalized = normal.clone().normalize();
  const fallback = Math.abs(normalized.y) < 0.9 ? new THREE.Vector3(0, 1, 0) : new THREE.Vector3(1, 0, 0);
  const u = new THREE.Vector3().crossVectors(fallback, normalized);
  if (u.lengthSq() < 1e-4) {
    u.crossVectors(new THREE.Vector3(0, 0, 1), normalized);
  }
  u.normalize();
  const v = new THREE.Vector3().crossVectors(normalized, u).normalize();
  return { u, v };
};

/**
 * Rectangle drawing tool for CAD mode.
 * Allows users to drag out planar rectangles on ground plane or any mesh face.
 */
export const RectangleTool = () => {
  const activeTool = useCADToolsStore((state) => state.activeTool);
  const addObject = useCADToolsStore((state) => state.addObject);
  const setActiveTool = useCADToolsStore((state) => state.setActiveTool);
  const setRectanglePreview = useCADToolsStore((state) => state.setRectanglePreview);
  const cadObjects = useCADToolsStore((state) => state.objects);
  const snapSettings = useCADToolsStore((state) => state.snapSettings);
  const gridSize = useCADToolsStore((state) => state.gridSize);
  const wallMeshes = useThreeSceneStore((state) => state.meshes);
  const { camera, gl, raycaster, controls, size } = useThree((state) => ({
    camera: state.camera,
    gl: state.gl,
    raycaster: state.raycaster,
    controls: state.controls as THREE.EventDispatcher & { enabled?: boolean } | undefined,
    size: state.size,
  }));

  const [preview, setPreview] = React.useState<PreviewData | null>(null);
  const previewRef = React.useRef<PreviewData | null>(null);
  const drawingStateRef = React.useRef<DrawingState | null>(null);
  const mouseRef = React.useRef(new THREE.Vector2());
  const [axisLock, setAxisLock] = React.useState<AxisLock>(null);

  const setOrbitControlsEnabled = React.useCallback(
    (enabled: boolean) => {
      if (controls && 'enabled' in controls) {
        (controls as { enabled: boolean }).enabled = enabled;
      }
    },
    [controls]
  );

  const updatePreviewState = React.useCallback((data: PreviewData | null) => {
    previewRef.current = data;
    setPreview(data);
    // Update store for dimension display
    setRectanglePreview({
      active: data !== null,
      width: data?.width ?? 0,
      height: data?.height ?? 0,
    });
  }, [setRectanglePreview]);

  const cancelDrawing = React.useCallback(() => {
    drawingStateRef.current = null;
    updatePreviewState(null);
    setOrbitControlsEnabled(true);
    setAxisLock(null);
    useCADToolsStore.setState({ activeSnap: null });
  }, [setOrbitControlsEnabled, updatePreviewState]);

  const getMouseFromEvent = React.useCallback(
    (event: PointerEvent | MouseEvent) => {
      const rect = gl.domElement.getBoundingClientRect();
      const mouse = mouseRef.current;
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      return mouse;
    },
    [gl]
  );

  const projectEventToPlane = React.useCallback(
    (event: PointerEvent, plane: THREE.Plane): THREE.Vector3 | null => {
      const mouse = getMouseFromEvent(event);
      raycaster.setFromCamera(mouse, camera);
      const point = new THREE.Vector3();
      const hit = raycaster.ray.intersectPlane(plane, point);
      return hit ? point.clone() : null;
    },
    [camera, getMouseFromEvent, raycaster]
  );

  const pickDrawingPlane = React.useCallback(
    (event: PointerEvent): DrawingState | null => {
      const mouse = getMouseFromEvent(event);
      raycaster.setFromCamera(mouse, camera);

      const cadMeshes = useCADToolsStore
        .getState()
        .objects.map((obj) => obj.mesh)
        .filter((mesh): mesh is THREE.Mesh => !!mesh);
      const intersectables: THREE.Object3D[] = [...wallMeshes, ...cadMeshes];

      let plane: THREE.Plane | null = null;
      let startPoint: THREE.Vector3 | null = null;
      let normal: THREE.Vector3 | null = null;
      let supportObjectId: string | null = null;
      let faceData: FaceData | null = null;

      if (intersectables.length > 0) {
        const intersections = raycaster.intersectObjects(intersectables, true);
        const hit = intersections.find(
          (intersection) => intersection.faceIndex !== null && intersection.object instanceof THREE.Mesh
        );
        if (hit && hit.faceIndex !== null && hit.faceIndex !== undefined && hit.object instanceof THREE.Mesh) {
          faceData = buildFaceData(hit.object, hit.faceIndex, hit.point);
          normal = faceData.worldNormal.clone().normalize();

          // Use the actual surface we hit, not the ground plane
          startPoint = hit.point.clone();
          plane = new THREE.Plane().setFromNormalAndCoplanarPoint(normal, startPoint);
          if (hit.object.userData && typeof hit.object.userData.cadObjectId === 'string') {
            supportObjectId = hit.object.userData.cadObjectId as string;
          }
        }
      }

      if (!plane || !startPoint || !normal) {
        const groundNormal = new THREE.Vector3(0, 1, 0);
        const groundPlane = new THREE.Plane(groundNormal, 0);
        const intersectionPoint = new THREE.Vector3();
        const didHit = raycaster.ray.intersectPlane(groundPlane, intersectionPoint);
        if (!didHit) {
          return null;
        }
        plane = groundPlane.clone();
        startPoint = intersectionPoint.clone();
        normal = groundNormal.clone();
        supportObjectId = null;
        faceData = null;
      }

      // Apply snapping to start point
      const candidates = generateAllSnapCandidates(cadObjects, wallMeshes, startPoint);
      const snapResult = snapPoint(
        startPoint,
        candidates,
        {
          settings: snapSettings,
          gridSize: gridSize,
          objectSnapDistance: 0.2,
          hitFace: true, // We hit a face/ground to get this point
        },
        camera,
        size.width,
        size.height
      );

      // Update snap indicator
      useCADToolsStore.setState({ activeSnap: snapResult });

      // Use snapped point
      const snappedStart = snapResult.point;

      const { u, v } = computePlaneBasis(normal);
      return {
        plane: plane.clone(),
        startPoint: snappedStart.clone(),
        normal: normal.clone().normalize(),
        basisU: u,
        basisV: v,
        supportObjectId,
        faceData,
      };
    },
    [camera, getMouseFromEvent, raycaster, wallMeshes, cadObjects, snapSettings, gridSize, size]
  );

  const updatePreviewFromPoint = React.useCallback(
    (event: PointerEvent) => {
      const drawingState = drawingStateRef.current;
      if (!drawingState) {
        return;
      }
      let currentPoint = projectEventToPlane(event, drawingState.plane);
      if (!currentPoint) {
        updatePreviewState(null);
        useCADToolsStore.setState({ activeSnap: null });
        return;
      }

      // Apply snapping to current point
      const candidates = generateAllSnapCandidates(cadObjects, wallMeshes, currentPoint);
      const edgeCandidates = extractEdgesForInference(candidates);

      const snapResult = snapPoint(
        currentPoint,
        candidates,
        {
          settings: snapSettings,
          gridSize: gridSize,
          objectSnapDistance: 0.2,
          hitFace: true, // We're on the drawing plane
          axisLock: axisLock,
          axisLockOrigin: drawingState.startPoint,
          drawingOrigin: drawingState.startPoint,
          edgeCandidates: edgeCandidates,
        },
        camera,
        size.width,
        size.height
      );

      // Update snap indicator
      useCADToolsStore.setState({ activeSnap: snapResult });

      // Use snapped point
      currentPoint = snapResult.point;

      const delta = currentPoint.clone().sub(drawingState.startPoint);
      const widthSigned = delta.dot(drawingState.basisU);
      const heightSigned = delta.dot(drawingState.basisV);

      if (Math.abs(widthSigned) < MIN_DRAW_SIZE || Math.abs(heightSigned) < MIN_DRAW_SIZE) {
        updatePreviewState(null);
        return;
      }

      const center = drawingState.startPoint.clone().add(currentPoint).multiplyScalar(0.5);
      const width = Math.abs(widthSigned);
      const height = Math.abs(heightSigned);

      const planeMatrix = new THREE.Matrix4().makeBasis(
        drawingState.basisU.clone(),
        drawingState.basisV.clone(),
        drawingState.normal.clone()
      );
      const quaternion = new THREE.Quaternion().setFromRotationMatrix(planeMatrix);

      updatePreviewState({
        center: vectorToTuple(center),
        quaternion: quaternionToTuple(quaternion),
        width,
        height,
        normal: vectorToTuple(drawingState.normal),
      });
    },
    [projectEventToPlane, updatePreviewState, cadObjects, wallMeshes, snapSettings, gridSize, camera, size, axisLock]
  );

  const finalizeRectangle = React.useCallback(() => {
    const drawingState = drawingStateRef.current;
    const previewData = previewRef.current;
    drawingStateRef.current = null;
    setOrbitControlsEnabled(true);
    setAxisLock(null);

    if (!previewData || !drawingState) {
      updatePreviewState(null);
      return;
    }

    if (previewData.width < MIN_FINAL_SIZE || previewData.height < MIN_FINAL_SIZE) {
      updatePreviewState(null);
      return;
    }

    const center = new THREE.Vector3(...previewData.center);
    const normal = new THREE.Vector3(...previewData.normal).normalize();

    // Offset by half thickness along normal for all surfaces
    const finalCenter = center.clone().addScaledVector(normal, RECTANGLE_THICKNESS / 2);

    const orientationMatrix = new THREE.Matrix4().makeBasis(
      drawingState.basisU.clone(),
      drawingState.basisV.clone(),
      normal.clone()
    );
    const quaternion = new THREE.Quaternion().setFromRotationMatrix(orientationMatrix);
    const euler = new THREE.Euler().setFromQuaternion(quaternion, 'XYZ');

    // Create thin 3D box geometry
    const newObject = createCADObject(
      'box',
      [finalCenter.x, finalCenter.y, finalCenter.z],
      [euler.x, euler.y, euler.z],
      [1, 1, 1],
      undefined,
      {
        width: previewData.width,
        height: previewData.height,
        depth: RECTANGLE_THICKNESS,
      }
    );
    newObject.mesh.userData.originFeature = 'rectangle-tool';
    if (drawingState.supportObjectId) {
      newObject.mesh.userData.supportObjectId = drawingState.supportObjectId;
    }

    // Simply add the rectangle as a new object (face splitting removed)
    addObject(newObject);
    updatePreviewState(null);
    setActiveTool('select');
  }, [addObject, setActiveTool, setOrbitControlsEnabled, updatePreviewState, cadObjects]);

  const handlePointerDown = React.useCallback(
    (event: PointerEvent) => {
      if (activeTool !== 'rectangle' || event.button !== 0) {
        return;
      }
      event.preventDefault();
      event.stopPropagation();
      if (typeof event.stopImmediatePropagation === 'function') {
        event.stopImmediatePropagation();
      }

      const drawingState = pickDrawingPlane(event);
      if (!drawingState) {
        return;
      }

      drawingStateRef.current = drawingState;
      updatePreviewState(null);
      setOrbitControlsEnabled(false);
    },
    [activeTool, pickDrawingPlane, setOrbitControlsEnabled, updatePreviewState]
  );

  const handlePointerMove = React.useCallback(
    (event: PointerEvent) => {
      // If we're drawing, update the preview
      if (drawingStateRef.current) {
        event.preventDefault();
        updatePreviewFromPoint(event);
        return;
      }

      // If we're just hovering (not drawing), show snap indicators
      if (activeTool === 'rectangle') {
        const mouse = getMouseFromEvent(event);
        raycaster.setFromCamera(mouse, camera);

        // Try to find a point under cursor
        const cadMeshes = cadObjects.map((obj) => obj.mesh).filter((mesh): mesh is THREE.Mesh => !!mesh);
        const intersectables: THREE.Object3D[] = [...wallMeshes, ...cadMeshes];

        let hoverPoint: THREE.Vector3 | null = null;

        // Check intersections with objects
        if (intersectables.length > 0) {
          const intersections = raycaster.intersectObjects(intersectables, true);
          if (intersections.length > 0 && intersections[0]) {
            hoverPoint = intersections[0].point.clone();
          }
        }

        // Check ground plane if no object hit
        if (!hoverPoint) {
          const groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
          const intersectionPoint = new THREE.Vector3();
          const didHit = raycaster.ray.intersectPlane(groundPlane, intersectionPoint);
          if (didHit) {
            hoverPoint = intersectionPoint.clone();
          }
        }

        // Apply snapping to hover point
        if (hoverPoint) {
          const candidates = generateAllSnapCandidates(cadObjects, wallMeshes, hoverPoint);
          const snapResult = snapPoint(
            hoverPoint,
            candidates,
            {
              settings: snapSettings,
              gridSize: gridSize,
              objectSnapDistance: 0.2,
              hitFace: true,
            },
            camera,
            size.width,
            size.height
          );
          useCADToolsStore.setState({ activeSnap: snapResult });
        } else {
          useCADToolsStore.setState({ activeSnap: null });
        }
      }
    },
    [updatePreviewFromPoint, activeTool, getMouseFromEvent, raycaster, camera, wallMeshes, cadObjects, snapSettings, gridSize, size]
  );

  const handlePointerUp = React.useCallback(
    (event: PointerEvent) => {
      if (!drawingStateRef.current) {
        return;
      }
      event.preventDefault();
      finalizeRectangle();
    },
    [finalizeRectangle]
  );

  const handleKeyDown = React.useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape' && drawingStateRef.current) {
        event.preventDefault();
        cancelDrawing();
        return;
      }

      // Axis locking with Shift + arrow keys (only while drawing)
      if (drawingStateRef.current && event.shiftKey) {
        switch (event.key) {
          case 'ArrowLeft':
          case 'ArrowRight':
            event.preventDefault();
            setAxisLock((prev) => (prev === 'x' ? null : 'x')); // Toggle X axis
            break;
          case 'ArrowUp':
          case 'ArrowDown':
            event.preventDefault();
            setAxisLock((prev) => (prev === 'z' ? null : 'z')); // Toggle Z axis (ground plane depth)
            break;
          case 'PageUp':
          case 'PageDown':
            event.preventDefault();
            setAxisLock((prev) => (prev === 'y' ? null : 'y')); // Toggle Y axis (vertical)
            break;
        }
      }
    },
    [cancelDrawing]
  );

  React.useEffect(() => {
    if (activeTool !== 'rectangle') {
      if (drawingStateRef.current) {
        cancelDrawing();
      } else {
        updatePreviewState(null);
        setOrbitControlsEnabled(true);
        useCADToolsStore.setState({ activeSnap: null });
      }
      return;
    }

    const canvas = gl.domElement;
    canvas.addEventListener('pointerdown', handlePointerDown, { capture: true });
    return () => {
      canvas.removeEventListener('pointerdown', handlePointerDown, { capture: true });
    };
  }, [activeTool, cancelDrawing, gl, handlePointerDown, setOrbitControlsEnabled, updatePreviewState]);

  React.useEffect(() => {
    if (activeTool !== 'rectangle') {
      return;
    }

    window.addEventListener('pointermove', handlePointerMove, { passive: false });
    window.addEventListener('pointerup', handlePointerUp, { passive: false });
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeTool, handleKeyDown, handlePointerMove, handlePointerUp]);

  const previewQuaternion = React.useMemo(() => {
    if (!preview) {
      return undefined;
    }
    const [x, y, z, w] = preview.quaternion;
    return new THREE.Quaternion(x, y, z, w);
  }, [preview]);

  const previewPosition = React.useMemo(() => {
    if (!preview) {
      return undefined;
    }
    const base = new THREE.Vector3(...preview.center);
    const normal = new THREE.Vector3(...preview.normal).normalize();
    const offset = normal.multiplyScalar(PREVIEW_OFFSET);
    return base.add(offset).toArray() as [number, number, number];
  }, [preview]);

  if (!preview || !previewPosition) {
    return null;
  }

  return (
    <mesh
      position={previewPosition}
      {...(previewQuaternion ? { quaternion: previewQuaternion } : {})}
      scale={[preview.width, preview.height, 1]}
      renderOrder={1002}
    >
      <planeGeometry args={[1, 1, 1, 1]} />
      <meshBasicMaterial
        color="#0f7787"
        opacity={0.35}
        transparent
        depthTest={false}
        depthWrite={false}
        polygonOffset
        polygonOffsetFactor={-1}
        polygonOffsetUnits={-1}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};

