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
const POLYGON_THICKNESS = 0.01; // Very thin for near-2D behavior
const PREVIEW_LINE_WIDTH = 0.01; // Thick preview line

interface DrawingState {
  plane: THREE.Plane;
  normal: THREE.Vector3;
  basisU: THREE.Vector3;
  basisV: THREE.Vector3;
  supportObjectId: string | null;
  vertices: THREE.Vector3[];
}

interface PreviewData {
  vertices: [number, number, number][];
  normal: [number, number, number];
  quaternion: [number, number, number, number];
  currentPoint: [number, number, number] | null;
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
 * Polygon drawing tool for CAD mode.
 * Allows users to draw polygons by clicking multiple points, last click completes.
 */
export const PolygonTool = () => {
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
        normal: normal.clone().normalize(),
        basisU: u,
        basisV: v,
        supportObjectId,
        vertices: [startPoint.clone()],
      };
    },
    [camera, getMouseFromEvent, raycaster, wallMeshes]
  );

  const updatePreviewFromPoint = React.useCallback(
    (event: PointerEvent) => {
      const drawingState = drawingStateRef.current;
      if (!drawingState || drawingState.vertices.length === 0) {
        return;
      }
      const currentPoint = projectEventToPlane(event, drawingState.plane);
      if (!currentPoint) {
        if (drawingState.vertices.length > 0) {
          updatePreviewState({
            vertices: drawingState.vertices.map(vectorToTuple),
            normal: vectorToTuple(drawingState.normal),
            quaternion: quaternionToTuple(
              new THREE.Quaternion().setFromRotationMatrix(
                new THREE.Matrix4().makeBasis(drawingState.basisU, drawingState.basisV, drawingState.normal)
              )
            ),
            currentPoint: null,
          });
        }
        return;
      }

      updatePreviewState({
        vertices: drawingState.vertices.map(vectorToTuple),
        normal: vectorToTuple(drawingState.normal),
        quaternion: quaternionToTuple(
          new THREE.Quaternion().setFromRotationMatrix(
            new THREE.Matrix4().makeBasis(drawingState.basisU, drawingState.basisV, drawingState.normal)
          )
        ),
        currentPoint: vectorToTuple(currentPoint),
      });
    },
    [projectEventToPlane, updatePreviewState]
  );

  const finalizePolygon = React.useCallback(() => {
    const drawingState = drawingStateRef.current;
    const previewData = previewRef.current;
    drawingStateRef.current = null;
    setOrbitControlsEnabled(true);

    if (!previewData || !drawingState || drawingState.vertices.length < 3) {
      updatePreviewState(null);
      return;
    }

    // Use the vertices from drawing state (excluding the current hover point)
    const vertices = drawingState.vertices;
    
    // Calculate center
    const center = new THREE.Vector3();
    vertices.forEach((v) => center.add(v));
    center.divideScalar(vertices.length);

    // Calculate bounding box to determine size
    let minX = Infinity, maxX = -Infinity;
    let minZ = Infinity, maxZ = -Infinity;
    vertices.forEach((v) => {
      const local = v.clone().sub(center);
      const x = local.dot(drawingState.basisU);
      const z = local.dot(drawingState.basisV);
      minX = Math.min(minX, x);
      maxX = Math.max(maxX, x);
      minZ = Math.min(minZ, z);
      maxZ = Math.max(maxZ, z);
    });

    const width = Math.max(maxX - minX, MIN_FINAL_SIZE);
    const height = Math.max(maxZ - minZ, MIN_FINAL_SIZE);

    if (width < MIN_FINAL_SIZE || height < MIN_FINAL_SIZE) {
      updatePreviewState(null);
      return;
    }

    // Create shape from vertices
    const shape = new THREE.Shape();
    const firstVertex = vertices[0];
    if (!firstVertex) {
      console.error('[PolygonTool] No vertices available');
      return;
    }
    const localFirst = firstVertex.clone().sub(center);
    const firstX = localFirst.dot(drawingState.basisU);
    const firstZ = localFirst.dot(drawingState.basisV);
    shape.moveTo(firstX, firstZ);

    for (let i = 1; i < vertices.length; i++) {
      const vertex = vertices[i];
      if (!vertex) {
        continue;
      }
      const local = vertex.clone().sub(center);
      const x = local.dot(drawingState.basisU);
      const z = local.dot(drawingState.basisV);
      shape.lineTo(x, z);
    }
    shape.lineTo(firstX, firstZ); // Close the shape

    // Create thin 3D geometry from shape
    const geometry = new THREE.ExtrudeGeometry(shape, {
      depth: POLYGON_THICKNESS,
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
    // Offset by half thickness along normal for all surfaces
    const finalCenter = center.clone().addScaledVector(drawingState.normal, POLYGON_THICKNESS / 2);

    mesh.position.copy(finalCenter);

    const orientationMatrix = new THREE.Matrix4().makeBasis(
      drawingState.basisU.clone(),
      drawingState.basisV.clone(),
      drawingState.normal.clone()
    );
    const quaternion = new THREE.Quaternion().setFromRotationMatrix(orientationMatrix);
    mesh.setRotationFromQuaternion(quaternion);

    // Create CAD object
    const euler = new THREE.Euler().setFromQuaternion(quaternion, 'XYZ');
    const id = `cad-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    mesh.userData.cadObjectId = id;
    mesh.userData.originFeature = 'polygon-tool';
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
      if (activeTool !== 'polygon' || event.button !== 0) {
        return;
      }
      event.preventDefault();
      event.stopPropagation();
      if (typeof event.stopImmediatePropagation === 'function') {
        event.stopImmediatePropagation();
      }

      const drawingState = drawingStateRef.current;
      if (!drawingState) {
        // First click - initialize drawing state
        const newState = pickDrawingPlane(event);
        if (!newState) {
          return;
        }
        drawingStateRef.current = newState;
        const firstVertex = newState.vertices[0];
        if (!firstVertex) {
          console.error('[PolygonTool] No vertices in new state');
          return;
        }
        updatePreviewState({
          vertices: [vectorToTuple(firstVertex)],
          normal: vectorToTuple(newState.normal),
          quaternion: quaternionToTuple(
            new THREE.Quaternion().setFromRotationMatrix(
              new THREE.Matrix4().makeBasis(newState.basisU, newState.basisV, newState.normal)
            )
          ),
          currentPoint: null,
        });
        setOrbitControlsEnabled(false);
      } else {
        // Subsequent clicks - add vertex
        const currentPoint = projectEventToPlane(event, drawingState.plane);
        if (!currentPoint) {
          return;
        }

        // Check if clicking near the first vertex (close polygon)
        const firstVertex = drawingState.vertices[0];
        if (!firstVertex) {
          console.error('[PolygonTool] No first vertex found');
          return;
        }
        const distanceToFirst = currentPoint.distanceTo(firstVertex);
        if (drawingState.vertices.length >= 3 && distanceToFirst < MIN_DRAW_SIZE * 2) {
          // Close the polygon
          finalizePolygon();
        } else {
          // Add new vertex
          drawingState.vertices.push(currentPoint.clone());
          updatePreviewState({
            vertices: drawingState.vertices.map(vectorToTuple),
            normal: vectorToTuple(drawingState.normal),
            quaternion: quaternionToTuple(
              new THREE.Quaternion().setFromRotationMatrix(
                new THREE.Matrix4().makeBasis(drawingState.basisU, drawingState.basisV, drawingState.normal)
              )
            ),
            currentPoint: null,
          });
        }
      }
    },
    [activeTool, pickDrawingPlane, projectEventToPlane, finalizePolygon, setOrbitControlsEnabled, updatePreviewState]
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
      } else if (event.key === 'Enter' && drawingStateRef.current) {
        // Enter key completes the polygon
        event.preventDefault();
        if (drawingStateRef.current.vertices.length >= 3) {
          finalizePolygon();
        }
      }
    },
    [cancelDrawing, finalizePolygon]
  );

  React.useEffect(() => {
    if (activeTool !== 'polygon') {
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
    if (activeTool !== 'polygon') {
      return;
    }

    window.addEventListener('pointermove', handlePointerMove, { passive: false });
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeTool, handleKeyDown, handlePointerMove]);

  if (!preview || preview.vertices.length === 0) {
    return null;
  }

  const normal = new THREE.Vector3(...preview.normal).normalize();
  const quaternion = new THREE.Quaternion(...preview.quaternion);
  
  // Calculate center for positioning
  const vertices3D = preview.vertices.map((v) => new THREE.Vector3(...v));
  const center = new THREE.Vector3();
  vertices3D.forEach((v) => center.add(v));
  center.divideScalar(vertices3D.length);
  const offsetCenter = center.clone().addScaledVector(normal, PREVIEW_OFFSET);

  // Create line segments for polygon preview using tubes
  const offsetPoints: THREE.Vector3[] = [];
  
  // Add all vertices
  vertices3D.forEach((v) => {
    offsetPoints.push(v.clone().addScaledVector(normal, PREVIEW_OFFSET));
  });
  
  // Add current point if available
  if (preview.currentPoint) {
    offsetPoints.push(new THREE.Vector3(...preview.currentPoint).clone().addScaledVector(normal, PREVIEW_OFFSET));
  }
  
  // Create line segments for each edge
  const segments: React.ReactNode[] = [];
  for (let i = 0; i < offsetPoints.length; i++) {
    const start = offsetPoints[i];
    const end = offsetPoints[(i + 1) % offsetPoints.length];
    if (!start || !end) {
      continue;
    }
    const curve = new THREE.CatmullRomCurve3([start, end]);
    const geometry = new THREE.TubeGeometry(curve, 2, PREVIEW_LINE_WIDTH, 8, false);
    segments.push(
      <mesh key={i} geometry={geometry} renderOrder={1002}>
        <meshBasicMaterial
          color="#000000"
          depthTest={false}
          depthWrite={false}
        />
      </mesh>
    );
  }
  
  return <group>{segments}</group>;
};

