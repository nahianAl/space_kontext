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
const ARC_THICKNESS = 0.05;
const PREVIEW_LINE_WIDTH = 0.01; // Thick preview line

interface DrawingState {
  plane: THREE.Plane;
  normal: THREE.Vector3;
  basisU: THREE.Vector3;
  basisV: THREE.Vector3;
  supportObjectId: string | null;
  startPoint: THREE.Vector3 | null;
  endPoint: THREE.Vector3 | null;
  phase: 'first-point' | 'second-point' | 'arc-bulge';
}

interface PreviewData {
  start: [number, number, number] | null;
  end: [number, number, number] | null;
  control: [number, number, number] | null;
  normal: [number, number, number];
  quaternion: [number, number, number, number];
  arcPoints: [number, number, number][];
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
 * Calculate arc points using quadratic Bezier curve
 */
const calculateArcPoints = (
  start: THREE.Vector3,
  end: THREE.Vector3,
  control: THREE.Vector3,
  segments: number = 32
): THREE.Vector3[] => {
  const points: THREE.Vector3[] = [];
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const point = new THREE.Vector3();
    point.x = (1 - t) * (1 - t) * start.x + 2 * (1 - t) * t * control.x + t * t * end.x;
    point.y = (1 - t) * (1 - t) * start.y + 2 * (1 - t) * t * control.y + t * t * end.y;
    point.z = (1 - t) * (1 - t) * start.z + 2 * (1 - t) * t * control.z + t * t * end.z;
    points.push(point);
  }
  return points;
};

/**
 * Arc drawing tool for CAD mode.
 * First click sets start, second click sets end, then drag perpendicular to determine arc bulge.
 */
export const ArcTool = () => {
  const activeTool = useCADToolsStore((state) => state.activeTool);
  const addObject = useCADToolsStore((state) => state.addObject);
  const setActiveTool = useCADToolsStore((state) => state.setActiveTool);
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
  }, []);

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
        normal: normal.clone().normalize(),
        basisU: u,
        basisV: v,
        supportObjectId,
        startPoint: null,
        endPoint: null,
        phase: 'first-point',
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
        return;
      }

      if (drawingState.phase === 'first-point') {
        // Just show the start point
        updatePreviewState({
          start: vectorToTuple(currentPoint),
          end: null,
          control: null,
          normal: vectorToTuple(drawingState.normal),
          quaternion: quaternionToTuple(
            new THREE.Quaternion().setFromRotationMatrix(
              new THREE.Matrix4().makeBasis(drawingState.basisU, drawingState.basisV, drawingState.normal)
            )
          ),
          arcPoints: [],
        });
      } else if (drawingState.phase === 'second-point') {
        // Show line from start to current point
        if (!drawingState.startPoint) {
          return;
        }
        updatePreviewState({
          start: vectorToTuple(drawingState.startPoint),
          end: vectorToTuple(currentPoint),
          control: null,
          normal: vectorToTuple(drawingState.normal),
          quaternion: quaternionToTuple(
            new THREE.Quaternion().setFromRotationMatrix(
              new THREE.Matrix4().makeBasis(drawingState.basisU, drawingState.basisV, drawingState.normal)
            )
          ),
          arcPoints: [],
        });
      } else if (drawingState.phase === 'arc-bulge' && drawingState.startPoint && drawingState.endPoint) {
        // Calculate control point based on perpendicular distance from line
        const lineStart = drawingState.startPoint;
        const lineEnd = drawingState.endPoint;
        const lineDir = lineEnd.clone().sub(lineStart).normalize();
        const lineLength = lineStart.distanceTo(lineEnd);

        if (lineLength < MIN_DRAW_SIZE) {
          return;
        }

        // Project current point onto the line
        const toCurrent = currentPoint.clone().sub(lineStart);
        const projection = toCurrent.dot(lineDir);
        const projectedPoint = lineStart.clone().addScaledVector(lineDir, projection);

        // Calculate perpendicular distance
        const perpVector = currentPoint.clone().sub(projectedPoint);
        const perpDistance = perpVector.length();

        // Control point is at the midpoint of the line, offset by perpendicular distance
        const midpoint = lineStart.clone().add(lineEnd).multiplyScalar(0.5);
        const perpDir = perpVector.normalize();
        const controlPoint = midpoint.clone().addScaledVector(perpDir, perpDistance);

        // Calculate arc points
        const arcPoints = calculateArcPoints(lineStart, lineEnd, controlPoint);
        const arcPointsTuples = arcPoints.map(vectorToTuple);

        updatePreviewState({
          start: vectorToTuple(lineStart),
          end: vectorToTuple(lineEnd),
          control: vectorToTuple(controlPoint),
          normal: vectorToTuple(drawingState.normal),
          quaternion: quaternionToTuple(
            new THREE.Quaternion().setFromRotationMatrix(
              new THREE.Matrix4().makeBasis(drawingState.basisU, drawingState.basisV, drawingState.normal)
            )
          ),
          arcPoints: arcPointsTuples,
        });
      }
    },
    [projectEventToPlane, updatePreviewState]
  );

  const finalizeArc = React.useCallback(() => {
    const drawingState = drawingStateRef.current;
    const previewData = previewRef.current;
    drawingStateRef.current = null;
    setOrbitControlsEnabled(true);

    if (!previewData || !drawingState || !previewData.start || !previewData.end || !previewData.control) {
      updatePreviewState(null);
      return;
    }

    if (previewData.arcPoints.length < 2) {
      updatePreviewState(null);
      return;
    }

    const start = new THREE.Vector3(...previewData.start);
    const end = new THREE.Vector3(...previewData.end);
    const control = new THREE.Vector3(...previewData.control);
    const normal = new THREE.Vector3(...previewData.normal).normalize();

    // Calculate arc length
    const arcPoints = previewData.arcPoints.map((p) => new THREE.Vector3(...p));
    let arcLength = 0;
    for (let i = 1; i < arcPoints.length; i++) {
      const prevPoint = arcPoints[i - 1];
      const currentPoint = arcPoints[i];
      if (!prevPoint || !currentPoint) {
        continue;
      }
      arcLength += prevPoint.distanceTo(currentPoint);
    }

    if (arcLength < MIN_FINAL_SIZE) {
      updatePreviewState(null);
      return;
    }

    // Create shape from arc points
    const shape = new THREE.Shape();
    const firstPointData = arcPoints[0];
    if (!firstPointData) {
      return;
    }
    const firstPoint = firstPointData.clone().sub(start);
    const basisU = drawingState.basisU;
    const basisV = drawingState.basisV;
    const firstX = firstPoint.dot(basisU);
    const firstZ = firstPoint.dot(basisV);
    shape.moveTo(firstX, firstZ);

    for (let i = 1; i < arcPoints.length; i++) {
      const pointData = arcPoints[i];
      if (!pointData) {
        continue;
      }
      const point = pointData.clone().sub(start);
      const x = point.dot(basisU);
      const z = point.dot(basisV);
      shape.lineTo(x, z);
    }

    // Create geometry from shape
    const geometry = new THREE.ExtrudeGeometry(shape, {
      depth: ARC_THICKNESS,
      bevelEnabled: false,
    });

    // Create material
    const material = new THREE.MeshStandardMaterial({
      color: 0xcccccc,
      metalness: 0.1,
      roughness: 0.7,
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    // Position and orient the mesh
    const offsetStart = start.clone().addScaledVector(normal, ARC_THICKNESS / 2);
    mesh.position.copy(offsetStart);

    const orientationMatrix = new THREE.Matrix4().makeBasis(
      drawingState.basisU.clone(),
      drawingState.basisV.clone(),
      normal.clone()
    );
    const quaternion = new THREE.Quaternion().setFromRotationMatrix(orientationMatrix);
    mesh.setRotationFromQuaternion(quaternion);

    // Create CAD object
    const euler = new THREE.Euler().setFromQuaternion(quaternion, 'XYZ');
    const id = `cad-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    mesh.userData.cadObjectId = id;
    mesh.userData.originFeature = 'arc-tool';
    if (drawingState.supportObjectId) {
      mesh.userData.supportObjectId = drawingState.supportObjectId;
    }

    const newObject = {
      id,
      type: 'plane' as const,
      mesh,
      position: [offsetStart.x, offsetStart.y, offsetStart.z] as [number, number, number],
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
      if (activeTool !== 'arc' || event.button !== 0) {
        return;
      }
      event.preventDefault();
      event.stopPropagation();
      if (typeof event.stopImmediatePropagation === 'function') {
        event.stopImmediatePropagation();
      }

      const drawingState = drawingStateRef.current;
      if (!drawingState) {
        // First click - set start point
        const newState = pickDrawingPlane(event);
        if (!newState) {
          return;
        }
        const currentPoint = projectEventToPlane(event, newState.plane);
        if (!currentPoint) {
          return;
        }
        newState.startPoint = currentPoint;
        newState.phase = 'second-point';
        drawingStateRef.current = newState;
        setOrbitControlsEnabled(false);
      } else if (drawingState.phase === 'second-point') {
        // Second click - set end point
        const currentPoint = projectEventToPlane(event, drawingState.plane);
        if (!currentPoint || !drawingState.startPoint) {
          return;
        }
        const distance = drawingState.startPoint.distanceTo(currentPoint);
        if (distance < MIN_DRAW_SIZE) {
          return;
        }
        drawingState.endPoint = currentPoint;
        drawingState.phase = 'arc-bulge';
      } else if (drawingState.phase === 'arc-bulge') {
        // Third click - finalize arc
        finalizeArc();
      }
    },
    [activeTool, pickDrawingPlane, projectEventToPlane, finalizeArc, setOrbitControlsEnabled]
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
    if (activeTool !== 'arc') {
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
    if (activeTool !== 'arc') {
      return;
    }

    window.addEventListener('pointermove', handlePointerMove, { passive: false });
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeTool, handleKeyDown, handlePointerMove]);

  if (!preview) {
    return null;
  }

  const drawingState = drawingStateRef.current;
  if (!drawingState) {
    return null;
  }

  const normal = new THREE.Vector3(...preview.normal).normalize();
  const quaternion = new THREE.Quaternion(...preview.quaternion);

  // Render preview based on phase
  if (drawingState.phase === 'second-point' && preview.start && preview.end) {
    // Show line from start to end using tube
    const start = new THREE.Vector3(...preview.start).clone().addScaledVector(normal, PREVIEW_OFFSET);
    const end = new THREE.Vector3(...preview.end).clone().addScaledVector(normal, PREVIEW_OFFSET);
    const curve = new THREE.CatmullRomCurve3([start, end]);
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
  } else if (drawingState.phase === 'arc-bulge' && preview.arcPoints.length > 0 && preview.start && preview.end) {
    // Show arc as tube
    const arcPoints = preview.arcPoints.map((p) => 
      new THREE.Vector3(...p).clone().addScaledVector(normal, PREVIEW_OFFSET)
    );
    const curve = new THREE.CatmullRomCurve3(arcPoints);
    const geometry = new THREE.TubeGeometry(curve, arcPoints.length, PREVIEW_LINE_WIDTH, 8, false);

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
  }

  return null;
};

