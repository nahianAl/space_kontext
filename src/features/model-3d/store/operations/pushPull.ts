/**
 * Push-Pull operation utilities and state management
 */
import * as THREE from 'three';
import { extrudeFaceBackend, computeFaceVertexPositions, vector3ToTuple } from '../../utils/pushPull';
import { extractGeometryData, createGeometryFromData } from '../../utils/geometry';
import type { FaceData } from '../../types/cadObjects';
import type { PushPullState, CADObject, SerializedCADObjectState } from '../types';

export const createInitialPushPullState = (): PushPullState => ({
  active: false,
  selectedFace: null,
  distance: 0,
  basePositions: null,
  originalGeometryData: null,
  initialCenter: null,
  initialWorldCenter: null,
  initialPlaneOffset: null,
  isApplying: false,
  affectedVertexIndices: null,
  normal: null,
  controller: null,
  targetMesh: null,
  targetObjectId: null,
});

export const cloneFaceData = (face: FaceData): FaceData => {
  const cloned: FaceData = {
    objectId: face.objectId,
    faceIndex: face.faceIndex,
    normal: face.normal.clone(),
    worldNormal: face.worldNormal.clone(),
    vertices: [...face.vertices],
    center: face.center.clone(),
    worldCenter: face.worldCenter.clone(),
    mesh: face.mesh,
    planeOffset: face.planeOffset,
    triangleIndices: [...face.triangleIndices],
  };

  if (face.hitPoint) {
    cloned.hitPoint = face.hitPoint.clone();
  }

  return cloned;
};

export const startPushPullOperation = (
  face: FaceData,
  state: { objects: CADObject[]; pushPullState: PushPullState }
): { didStart: boolean; newState?: Partial<{ pushPullState: PushPullState }> } => {
  if (state.pushPullState.active) {
    return { didStart: false };
  }

  const targetObject = state.objects.find((obj) => obj.id === face.objectId);
  const targetMesh = targetObject ? targetObject.mesh : face.mesh;

  if (!targetMesh) {
    return { didStart: false };
  }

  const geometry = targetMesh.geometry;
  const positionAttr = geometry.getAttribute('position') as THREE.BufferAttribute | undefined;
  if (!positionAttr) {
    return { didStart: false };
  }

  const geometryData = extractGeometryData(geometry);
  const basePositions = new Float32Array(positionAttr.array as ArrayLike<number>);

  // Pre-compute which vertices are on the face plane (for performance)
  const normal = face.normal.clone().normalize();
  const planeOffset = face.planeOffset;
  const tolerance = 1e-5;
  const affectedVertexIndices: number[] = [];

  for (let i = 0; i < basePositions.length; i += 3) {
    const x = basePositions[i] as number;
    const y = basePositions[i + 1] as number;
    const z = basePositions[i + 2] as number;

    const planeDistance = normal.x * x + normal.y * y + normal.z * z + planeOffset;
    if (Math.abs(planeDistance) <= tolerance) {
      affectedVertexIndices.push(i);
    }
  }

  return {
    didStart: true,
    newState: {
      pushPullState: {
        active: true,
        selectedFace: cloneFaceData(face),
        distance: 0,
        basePositions,
        originalGeometryData: geometryData,
        initialCenter: face.center.clone(),
        initialWorldCenter: face.worldCenter.clone(),
        initialPlaneOffset: face.planeOffset,
        isApplying: false,
        affectedVertexIndices,
        normal: normal.clone(),
        controller: 'face',
        targetMesh,
        targetObjectId: targetObject ? targetObject.id : null,
      },
    },
  };
};

export const updatePushPullGeometry = (
  distance: number,
  state: { objects: CADObject[]; pushPullState: PushPullState }
): Partial<{ objects: CADObject[]; pushPullState: PushPullState }> | null => {
  const {
    selectedFace,
    basePositions,
    initialCenter,
    initialWorldCenter,
    initialPlaneOffset,
    isApplying,
    affectedVertexIndices,
    normal,
    targetMesh,
    targetObjectId,
  } = state.pushPullState;

  if (isApplying) {
    return null;
  }

  if (
    !selectedFace ||
    !basePositions ||
    !initialCenter ||
    !initialWorldCenter ||
    initialPlaneOffset === null || initialPlaneOffset === undefined ||
    !affectedVertexIndices ||
    !normal
  ) {
    return null;
  }

  let objectIndex = -1;
  let mesh: THREE.Mesh | null = null;
  let objects = state.objects;

  if (targetObjectId) {
    objectIndex = state.objects.findIndex((obj) => obj.id === targetObjectId);
    if (objectIndex !== -1) {
      objects = [...state.objects];
      const object = objects[objectIndex];
      if (!object) {
        return null;
      }
      mesh = object.mesh;
    }
  }

  if (!mesh && targetMesh) {
    mesh = targetMesh;
  }

  if (!mesh) {
    return null;
  }

  const geometry = mesh.geometry;
  const positionAttr = geometry.getAttribute('position') as THREE.BufferAttribute | undefined;

  if (!positionAttr) {
    return null;
  }

  const positions = positionAttr.array as Float32Array;
  if (positions.length !== basePositions.length) {
    return null;
  }

  // Safety check: ensure affectedVertexIndices are within bounds
  if (affectedVertexIndices.length === 0) {
    return null;
  }

  // Check bounds (avoid Math.max on empty array)
  const maxIndex = affectedVertexIndices.length > 0
    ? Math.max(...affectedVertexIndices)
    : -1;
  if (maxIndex >= 0 && maxIndex + 2 >= basePositions.length) {
    return null;
  }

  // Restore base positions first
  try {
    positions.set(basePositions);

    // Only update pre-computed affected vertices (much faster!)
    for (const vertexIndex of affectedVertexIndices) {
      if (vertexIndex + 2 >= basePositions.length) {
        continue;
      }

      const baseX = basePositions[vertexIndex] as number;
      const baseY = basePositions[vertexIndex + 1] as number;
      const baseZ = basePositions[vertexIndex + 2] as number;

      positions[vertexIndex] = baseX + normal.x * distance;
      positions[vertexIndex + 1] = baseY + normal.y * distance;
      positions[vertexIndex + 2] = baseZ + normal.z * distance;
    }
  } catch (error) {
    return null;
  }

  // Mark attribute as needing update (but don't compute normals/bounds yet - too expensive)
  positionAttr.needsUpdate = true;

  // Update face data for visual feedback
  const updatedSelectedFace = cloneFaceData(selectedFace);
  updatedSelectedFace.center = initialCenter.clone().addScaledVector(normal, distance);
  const worldNormal = selectedFace.worldNormal.clone().normalize();
  updatedSelectedFace.worldCenter = initialWorldCenter.clone().addScaledVector(worldNormal, distance);
  updatedSelectedFace.planeOffset = initialPlaneOffset - distance;
  if (updatedSelectedFace.hitPoint) {
    updatedSelectedFace.hitPoint = updatedSelectedFace.worldCenter.clone();
  }

  if (objectIndex !== -1) {
    const object = objects[objectIndex];
    if (object) {
      objects[objectIndex] = {
        ...object,
        mesh,
        updatedAt: Date.now(),
      };
    }
  }

  return {
    objects,
    pushPullState: {
      ...state.pushPullState,
      distance,
      selectedFace: updatedSelectedFace,
    },
  };
};

export const applyPushPullToBackend = async (
  state: { pushPullState: PushPullState; objects: CADObject[] },
  pushHistorySnapshot: () => void
): Promise<{
  success: boolean;
  newGeometry?: THREE.BufferGeometry;
  targetObject?: CADObject;
  targetMesh?: THREE.Mesh;
  shouldAttemptRectangleCut: boolean;
  distance: number;
  selectedFace?: FaceData;
  initialWorldCenter?: THREE.Vector3;
}> => {
  const {
    pushPullState: {
      selectedFace,
      distance,
      originalGeometryData,
      initialCenter,
      initialWorldCenter,
      initialPlaneOffset,
      basePositions,
      targetMesh,
      targetObjectId,
    },
  } = state;

  if (!selectedFace || !originalGeometryData || initialCenter === null || initialCenter === undefined || initialWorldCenter === null || initialWorldCenter === undefined || initialPlaneOffset === null || initialPlaneOffset === undefined) {
    return { success: false, shouldAttemptRectangleCut: false, distance: 0 };
  }

  if (Math.abs(distance) < 1e-6) {
    return { success: false, shouldAttemptRectangleCut: false, distance: 0 };
  }

  const targetObject = targetObjectId ? state.objects.find((obj) => obj.id === targetObjectId) : undefined;
  const mesh = targetObject ? targetObject.mesh : targetMesh;
  if (!mesh) {
    return { success: false, shouldAttemptRectangleCut: false, distance: 0 };
  }

  const shouldAttemptRectangleCut =
    !!targetObject &&
    distance < 0 &&
    (targetObject.mesh.userData?.originFeature === 'rectangle-tool' ||
     targetObject.mesh.userData?.originFeature === 'offset-tool');

  // For rectangle boolean cuts, use client-side (backend can't handle thin rectangles well)
  if (shouldAttemptRectangleCut) {
    console.log('[pushPull] Using client-side boolean cut for rectangle/offset');
    return {
      success: false, // This triggers the client-side boolean cut logic
      ...(targetObject && { targetObject }),
      targetMesh: mesh,
      shouldAttemptRectangleCut,
      distance,
      ...(selectedFace && { selectedFace }),
      ...(initialWorldCenter && { initialWorldCenter }),
    };
  }

  // For regular face extrusion (including split faces), use backend
  console.log('[pushPull] Using backend extrusion for regular faces');

  // Backend extrusion enabled for regular faces
  try {
    const sourcePositions =
      basePositions ?? new Float32Array(originalGeometryData.positions);
    const faceVertices = computeFaceVertexPositions(selectedFace.vertices, sourcePositions);

    console.log('[pushPull] Calling backend with face data:', {
      normalLength: selectedFace.normal.length(),
      centerLocal: initialCenter.toArray(),
      planeOffset: initialPlaneOffset,
      vertexCount: faceVertices.length,
      distance,
    });

    const result = await extrudeFaceBackend({
      geometry: originalGeometryData,
      face: {
        normal: vector3ToTuple(selectedFace.normal.clone().normalize()),
        center: vector3ToTuple(initialCenter),
        planeOffset: initialPlaneOffset,
        vertices: faceVertices,
      },
      distance,
    });

    if (!result.positions || result.positions.length === 0) {
      throw new Error('Backend returned empty geometry positions');
    }

    console.log('[pushPull] ✅ Backend extrusion successful:', {
      originalVertices: originalGeometryData.positions.length / 3,
      newVertices: result.positions.length / 3,
    });

    pushHistorySnapshot();

    const newGeometry = createGeometryFromData(result);

    return {
      success: true,
      newGeometry,
      ...(targetObject && { targetObject }),
      targetMesh: mesh,
      shouldAttemptRectangleCut,
      distance,
      ...(selectedFace && { selectedFace }),
      ...(initialWorldCenter && { initialWorldCenter }),
    };
  } catch (error) {
    console.error('[pushPull] ❌ Backend extrusion failed:', error);

    // Return failure - no client-side fallback
    return {
      success: false,
      ...(targetObject && { targetObject }),
      targetMesh: mesh,
      shouldAttemptRectangleCut,
      distance,
      ...(selectedFace && { selectedFace }),
      ...(initialWorldCenter && { initialWorldCenter }),
    };
  }
};

export const cancelPushPullOperation = (
  state: { objects: CADObject[]; pushPullState: PushPullState }
): { objects: CADObject[]; pushPullState: PushPullState } => {
  if (state.pushPullState.isApplying) {
    return {
      objects: state.objects,
      pushPullState: createInitialPushPullState(),
    };
  }

  const { basePositions, selectedFace, targetMesh, targetObjectId } = state.pushPullState;

  const objects = state.objects.map((obj) => {
    if (!selectedFace || !basePositions || obj.id !== targetObjectId) {
      return obj;
    }

    const mesh = obj.mesh;
    const geometry = mesh.geometry;
    const positionAttr = geometry.getAttribute('position') as THREE.BufferAttribute | undefined;
    if (positionAttr) {
      (positionAttr.array as Float32Array).set(basePositions);
      positionAttr.needsUpdate = true;
      geometry.computeVertexNormals();
      geometry.computeBoundingBox();
      geometry.computeBoundingSphere();
      mesh.updateMatrixWorld(true);
    }

    return {
      ...obj,
      mesh,
      updatedAt: Date.now(),
    };
  });

  if (!targetObjectId && targetMesh && basePositions) {
    const geometry = targetMesh.geometry;
    const positionAttr = geometry.getAttribute('position') as THREE.BufferAttribute | undefined;
    if (positionAttr) {
      (positionAttr.array as Float32Array).set(basePositions);
      positionAttr.needsUpdate = true;
      geometry.computeVertexNormals();
      geometry.computeBoundingBox();
      geometry.computeBoundingSphere();
      targetMesh.updateMatrixWorld(true);
    }
  }

  return {
    objects,
    pushPullState: createInitialPushPullState(),
  };
};
