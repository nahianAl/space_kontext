'use client';

import React from 'react';
import * as THREE from 'three';
import { useThree } from '@react-three/fiber';
import { useCADToolsStore } from '../store/cadToolsStore';
import { useThreeSceneStore } from '../store/threeSceneStore';
import { createCADObject } from '../utils/shapeGenerators';
import { buildFaceData } from '../utils/pushPull';

const MIN_DRAW_SIZE = 0.02;
const MIN_FINAL_SIZE = 0.05;
const PREVIEW_OFFSET = 0.004;
const CIRCLE_THICKNESS = 0.01; // Very thin for near-2D behavior
const PREVIEW_LINE_WIDTH = 0.01; // Thick preview line

interface DrawingState {
  plane: THREE.Plane;
  startPoint: THREE.Vector3;
  normal: THREE.Vector3;
  basisU: THREE.Vector3;
  basisV: THREE.Vector3;
  supportObjectId: string | null;
}

interface PreviewData {
  center: [number, number, number];
  radius: number;
  normal: [number, number, number];
  quaternion: [number, number, number, number];
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
 * Circle drawing tool for CAD mode.
 * Allows users to drag out circular shapes on ground plane or any mesh face.
 */
export const CircleTool = () => {
  const activeTool = useCADToolsStore((state) => state.activeTool);
  const addObject = useCADToolsStore((state) => state.addObject);
  const setActiveTool = useCADToolsStore((state) => state.setActiveTool);
  const setCirclePreview = useCADToolsStore((state) => state.setCirclePreview);
  const wallMeshes = useThreeSceneStore((state) => state.meshes);
  const { camera, gl, raycaster, controls } = useThree((state) => ({
    camera: state.camera,
    gl: state.gl,
    raycaster: state.raycaster,
    controls: state.controls as THREE.EventDispatcher & { enabled?: boolean } | undefined,
  }));

  const [preview, setPreview] = React.useState<PreviewData | null>(null);
  const previewRef = React.useRef<PreviewData | null>(null);
  const drawingStateRef = React.useRef<DrawingState | null>(null);
  const mouseRef = React.useRef(new THREE.Vector2());

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
    setCirclePreview({
      active: data !== null,
      radius: data?.radius ?? 0,
    });
  }, [setCirclePreview]);

  const cancelDrawing = React.useCallback(() => {
    drawingStateRef.current = null;
    updatePreviewState(null);
    setOrbitControlsEnabled(true);
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
      }

      const { u, v } = computePlaneBasis(normal);
      return {
        plane: plane.clone(),
        startPoint: startPoint.clone(),
        normal: normal.clone().normalize(),
        basisU: u,
        basisV: v,
        supportObjectId,
      };
    },
    [camera, getMouseFromEvent, raycaster, wallMeshes]
  );

  const updatePreviewFromPoint = React.useCallback(
    (event: PointerEvent) => {
      const drawingState = drawingStateRef.current;
      if (!drawingState) {
        return;
      }
      const currentPoint = projectEventToPlane(event, drawingState.plane);
      if (!currentPoint) {
        updatePreviewState(null);
        return;
      }

      const delta = currentPoint.clone().sub(drawingState.startPoint);
      const radius = delta.length();

      if (radius < MIN_DRAW_SIZE) {
        updatePreviewState(null);
        return;
      }

      const center = drawingState.startPoint.clone();
      const planeMatrix = new THREE.Matrix4().makeBasis(
        drawingState.basisU.clone(),
        drawingState.basisV.clone(),
        drawingState.normal.clone()
      );
      const quaternion = new THREE.Quaternion().setFromRotationMatrix(planeMatrix);

      updatePreviewState({
        center: vectorToTuple(center),
        radius,
        normal: vectorToTuple(drawingState.normal),
        quaternion: quaternionToTuple(quaternion),
      });
    },
    [projectEventToPlane, updatePreviewState]
  );

  const finalizeCircle = React.useCallback(() => {
    const drawingState = drawingStateRef.current;
    const previewData = previewRef.current;
    drawingStateRef.current = null;
    setOrbitControlsEnabled(true);

    if (!previewData || !drawingState) {
      updatePreviewState(null);
      return;
    }

    if (previewData.radius < MIN_FINAL_SIZE) {
      updatePreviewState(null);
      return;
    }

    const center = new THREE.Vector3(...previewData.center);
    const normal = new THREE.Vector3(...previewData.normal).normalize();

    // Offset by half thickness along normal for all surfaces
    const finalCenter = center.clone().addScaledVector(normal, CIRCLE_THICKNESS / 2);

    const orientationMatrix = new THREE.Matrix4().makeBasis(
      drawingState.basisU.clone(),
      drawingState.basisV.clone(),
      normal.clone()
    );
    const quaternion = new THREE.Quaternion().setFromRotationMatrix(orientationMatrix);
    const euler = new THREE.Euler().setFromQuaternion(quaternion, 'XYZ');

    // Create thin 3D circle (extruded disc)
    const shape = new THREE.Shape();
    shape.absarc(0, 0, previewData.radius, 0, Math.PI * 2, false);

    const geometry = new THREE.ExtrudeGeometry(shape, {
      depth: CIRCLE_THICKNESS,
      bevelEnabled: false,
    });

    const material = new THREE.MeshStandardMaterial({
      color: 0xcccccc,
      metalness: 0.1,
      roughness: 0.7,
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.position.copy(finalCenter);
    mesh.setRotationFromQuaternion(quaternion);

    const id = `cad-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    mesh.userData.cadObjectId = id;
    mesh.userData.originFeature = 'circle-tool';
    if (drawingState.supportObjectId) {
      mesh.userData.supportObjectId = drawingState.supportObjectId;
    }

    const newObject = {
      id,
      type: 'plane' as const,
      mesh,
      position: [finalCenter.x, finalCenter.y, finalCenter.z] as [number, number, number],
      rotation: [euler.x, euler.y, euler.z] as [number, number, number],
      scale: [1, 1, 1] as [number, number, number],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    addObject(newObject);
    updatePreviewState(null);
    setActiveTool('select');
  }, [addObject, setActiveTool, setOrbitControlsEnabled, updatePreviewState]);

  const handlePointerDown = React.useCallback(
    (event: PointerEvent) => {
      if (activeTool !== 'circle' || event.button !== 0) {
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
      if (!drawingStateRef.current) {
        return;
      }
      event.preventDefault();
      updatePreviewFromPoint(event);
    },
    [updatePreviewFromPoint]
  );

  const handlePointerUp = React.useCallback(
    (event: PointerEvent) => {
      if (!drawingStateRef.current) {
        return;
      }
      event.preventDefault();
      finalizeCircle();
    },
    [finalizeCircle]
  );

  const handleKeyDown = React.useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape' && drawingStateRef.current) {
        event.preventDefault();
        cancelDrawing();
      }
    },
    [cancelDrawing]
  );

  React.useEffect(() => {
    if (activeTool !== 'circle') {
      if (drawingStateRef.current) {
        cancelDrawing();
      } else {
        updatePreviewState(null);
        setOrbitControlsEnabled(true);
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
    if (activeTool !== 'circle') {
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

  const center = new THREE.Vector3(...preview.center);
  const normal = new THREE.Vector3(...preview.normal).normalize();
  const offsetCenter = center.clone().addScaledVector(normal, PREVIEW_OFFSET);
  const quaternion = new THREE.Quaternion(...preview.quaternion);

  // Create circle line geometry using tube
  const segments = 64;
  const points: THREE.Vector3[] = [];
  for (let i = 0; i <= segments; i++) {
    const angle = (i / segments) * Math.PI * 2;
    const x = Math.cos(angle) * preview.radius;
    const z = Math.sin(angle) * preview.radius;
    const point = new THREE.Vector3(x, 0, z);
    // Transform point to plane orientation
    point.applyQuaternion(quaternion);
    point.add(offsetCenter);
    points.push(point);
  }
  
  const curve = new THREE.CatmullRomCurve3(points);
  const geometry = new THREE.TubeGeometry(curve, segments, PREVIEW_LINE_WIDTH, 8, true);

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

