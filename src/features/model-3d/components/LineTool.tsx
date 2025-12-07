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

const MIN_DRAW_SIZE = 0.02;
const MIN_FINAL_SIZE = 0.05;
const PREVIEW_OFFSET = 0.004;
const LINE_THICKNESS = 0.01; // Reduced from 0.05
const LINE_WIDTH = 0.01; // Reduced from 0.02
const PREVIEW_LINE_WIDTH = 0.005; // Reduced from 0.01

interface DrawingState {
  plane: THREE.Plane;
  startPoint: THREE.Vector3;
  normal: THREE.Vector3;
  basisU: THREE.Vector3;
  basisV: THREE.Vector3;
  supportObjectId: string | null;
}

interface PreviewData {
  start: [number, number, number];
  end: [number, number, number];
  normal: [number, number, number];
  quaternion: [number, number, number, number];
  length: number;
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
 * Line drawing tool for CAD mode.
 * Allows users to draw lines on ground plane or any mesh face.
 */
export const LineTool = () => {
  const activeTool = useCADToolsStore((state) => state.activeTool);
  const addObject = useCADToolsStore((state) => state.addObject);
  const setActiveTool = useCADToolsStore((state) => state.setActiveTool);
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
  }, []);

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

      if (intersectables.length > 0) {
        const intersections = raycaster.intersectObjects(intersectables, true);
        const hit = intersections.find(
          (intersection) => intersection.faceIndex !== null && intersection.object instanceof THREE.Mesh
        );
        if (hit && hit.faceIndex !== null && hit.faceIndex !== undefined && hit.object instanceof THREE.Mesh) {
          const faceData = buildFaceData(hit.object, hit.faceIndex, hit.point);
          normal = faceData.worldNormal.clone().normalize();
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
          hitFace: true, // We hit a face (or ground) to get this point
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
      const length = delta.length();

      if (length < MIN_DRAW_SIZE) {
        updatePreviewState(null);
        return;
      }

      // Calculate direction along the line
      const direction = delta.clone().normalize();
      const lineDirection = direction.clone();
      
      // Create a basis where one axis is along the line, another is perpendicular in the plane
      const perpInPlane = new THREE.Vector3().crossVectors(drawingState.normal, lineDirection).normalize();
      
      const planeMatrix = new THREE.Matrix4().makeBasis(
        lineDirection,
        perpInPlane,
        drawingState.normal.clone()
      );
      const quaternion = new THREE.Quaternion().setFromRotationMatrix(planeMatrix);

      updatePreviewState({
        start: vectorToTuple(drawingState.startPoint),
        end: vectorToTuple(currentPoint),
        normal: vectorToTuple(drawingState.normal),
        quaternion: quaternionToTuple(quaternion),
        length,
      });
    },
    [projectEventToPlane, updatePreviewState, cadObjects, wallMeshes, snapSettings, gridSize, camera, size, axisLock]
  );

  const finalizeLine = React.useCallback(() => {
    const drawingState = drawingStateRef.current;
    const previewData = previewRef.current;
    drawingStateRef.current = null;
    setOrbitControlsEnabled(true);
    setAxisLock(null);

    if (!previewData || !drawingState) {
      updatePreviewState(null);
      return;
    }

    if (previewData.length < MIN_FINAL_SIZE) {
      updatePreviewState(null);
      return;
    }

    const start = new THREE.Vector3(...previewData.start);
    const end = new THREE.Vector3(...previewData.end);
    const normal = new THREE.Vector3(...previewData.normal).normalize();
    
    // Calculate center and direction
    const center = start.clone().add(end).multiplyScalar(0.5);
    const direction = end.clone().sub(start).normalize();
    const perpInPlane = new THREE.Vector3().crossVectors(normal, direction).normalize();
    
    // Offset center slightly above the plane
    const offsetCenter = center.clone().addScaledVector(normal, LINE_THICKNESS / 2);
    
    // Create rotation matrix
    const orientationMatrix = new THREE.Matrix4().makeBasis(
      direction,
      perpInPlane,
      normal.clone()
    );
    const quaternion = new THREE.Quaternion().setFromRotationMatrix(orientationMatrix);
    const euler = new THREE.Euler().setFromQuaternion(quaternion, 'XYZ');

    // Create a thin box representing the line
    const newObject = createCADObject(
      'box',
      [offsetCenter.x, offsetCenter.y, offsetCenter.z],
      [euler.x, euler.y, euler.z],
      [1, 1, 1],
      undefined,
      {
        width: previewData.length,
        height: LINE_WIDTH,
        depth: LINE_THICKNESS,
      }
    );
    newObject.mesh.userData.originFeature = 'line-tool';
    if (drawingState.supportObjectId) {
      newObject.mesh.userData.supportObjectId = drawingState.supportObjectId;
    }
    addObject(newObject);
    updatePreviewState(null);
    setActiveTool('select');
  }, [addObject, setActiveTool, setOrbitControlsEnabled, updatePreviewState]);

  const handlePointerDown = React.useCallback(
    (event: PointerEvent) => {
      if (activeTool !== 'line' || event.button !== 0) {
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
      if (activeTool === 'line') {
        const mouse = getMouseFromEvent(event);
        raycaster.setFromCamera(mouse, camera);

        // Try to find a point under cursor
        const cadMeshes = cadObjects.map((obj) => obj.mesh).filter((mesh): mesh is THREE.Mesh => !!mesh);
        const intersectables: THREE.Object3D[] = [...wallMeshes, ...cadMeshes];

        let hoverPoint: THREE.Vector3 | null = null;

        // Check intersections with objects
        if (intersectables.length > 0) {
          const intersections = raycaster.intersectObjects(intersectables, true);
          const firstIntersection = intersections[0];
          if (firstIntersection) {
            hoverPoint = firstIntersection.point.clone();
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
      finalizeLine();
    },
    [finalizeLine]
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
    if (activeTool !== 'line') {
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
    if (activeTool !== 'line') {
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

  if (!preview) {
    return null;
  }

  const start = new THREE.Vector3(...preview.start);
  const end = new THREE.Vector3(...preview.end);
  const normal = new THREE.Vector3(...preview.normal).normalize();
  const center = start.clone().add(end).multiplyScalar(0.5);
  const offsetCenter = center.clone().addScaledVector(normal, PREVIEW_OFFSET);
  const direction = end.clone().sub(start).normalize();
  const perpInPlane = new THREE.Vector3().crossVectors(normal, direction).normalize();
  const quaternion = new THREE.Quaternion(...preview.quaternion);

  // Create thick line using tube geometry
  const points = [start.clone().addScaledVector(normal, PREVIEW_OFFSET), end.clone().addScaledVector(normal, PREVIEW_OFFSET)];
  const curve = new THREE.CatmullRomCurve3(points);
  const geometry = new THREE.TubeGeometry(curve, 2, PREVIEW_LINE_WIDTH, 8, false);
  
  return (
    <mesh
      geometry={geometry}
      renderOrder={1002}
    >
      <meshBasicMaterial
        color="#000000"
        depthTest={false}
        depthWrite={false}
      />
    </mesh>
  );
};

