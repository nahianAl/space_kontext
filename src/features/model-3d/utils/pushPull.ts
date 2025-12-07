/**
 * Push-Pull tool utilities
 * Handles face detection, normal calculation, and extrusion
 * Supports both browser-side and backend (Manifold 3D) implementations
 */

'use client';

import * as THREE from 'three';
import type { FaceData } from '../types/cadObjects';
import type { SerializedGeometryData } from './geometry';

export interface FaceDetectionResult extends FaceData {
  mesh: THREE.Mesh;
}

export interface ExtrudeFaceBackendPayload {
  geometry: SerializedGeometryData;
  face: {
    normal: [number, number, number];
    planeOffset: number;
    center: [number, number, number];
    vertices: Array<[number, number, number]>;
  };
  distance: number;
}

export interface ExtrudeFaceBackendResponse {
  geometry: SerializedGeometryData;
}

const NORMAL_DOT_THRESHOLD = 1e-3;
const PLANE_OFFSET_THRESHOLD = 1e-3;

export function detectFaceAtPoint(
  raycaster: THREE.Raycaster,
  mesh: THREE.Mesh,
  recursive = false
): FaceDetectionResult | null {
  const intersections = raycaster.intersectObject(mesh, recursive);
  if (!intersections.length) {
    return null;
  }

  const hit = intersections[0];
  if (!hit) {
    return null;
  }

  const faceIndex = hit.faceIndex;
  
  if (faceIndex === null || faceIndex === undefined) {
    return null;
  }
  
  return buildFaceData(mesh, faceIndex, hit.point);
}

export function buildFaceData(
  mesh: THREE.Mesh,
  faceIndex: number,
  hitPoint?: THREE.Vector3
): FaceDetectionResult {
  const geometry = mesh.geometry;
  const positionAttr = geometry.getAttribute('position') as THREE.BufferAttribute | undefined;
  if (!positionAttr) {
    throw new Error('Geometry is missing position attribute');
  }

  const referenceNormal = getFaceNormal(geometry, faceIndex).normalize();
  const referenceVertices = getFaceVertices(geometry, faceIndex);
  const referenceCenter = getFaceCenter(geometry, referenceVertices);
  const referencePlaneOffset = computePlaneOffset(referenceNormal, referenceCenter);

  const triangleIndices: number[] = [];
  const vertexIndexSet = new Set<number>();

  const totalFaces = getFaceCount(geometry);
  for (let i = 0; i < totalFaces; i += 1) {
    const triNormal = getFaceNormal(geometry, i).normalize();
    const dot = triNormal.dot(referenceNormal);
    if (dot < 1 - NORMAL_DOT_THRESHOLD) {
      continue;
    }

    const triVertices = getFaceVertices(geometry, i);
    const triCenter = getFaceCenter(geometry, triVertices);
    const triPlaneOffset = computePlaneOffset(referenceNormal, triCenter);

    if (Math.abs(triPlaneOffset - referencePlaneOffset) <= PLANE_OFFSET_THRESHOLD) {
      triangleIndices.push(i);
      triVertices.forEach((vertex) => vertexIndexSet.add(vertex));
    }
  }

  const uniqueVertexIndices = Array.from(vertexIndexSet.values()).sort((a, b) => a - b);

  const worldCenter = referenceCenter.clone();
  mesh.updateMatrixWorld(true);
  mesh.localToWorld(worldCenter);

  const normalMatrix = new THREE.Matrix3().getNormalMatrix(mesh.matrixWorld);
  const worldNormal = referenceNormal.clone().applyMatrix3(normalMatrix).normalize();

  const meshId =
    (mesh.userData && typeof mesh.userData.cadObjectId === 'string'
      ? (mesh.userData.cadObjectId as string)
      : mesh.uuid);

  return {
    mesh,
    objectId: meshId,
    faceIndex,
    normal: referenceNormal,
    worldNormal,
    vertices: uniqueVertexIndices,
    center: referenceCenter,
    worldCenter,
    planeOffset: referencePlaneOffset,
    triangleIndices,
    hitPoint: hitPoint ? hitPoint.clone() : worldCenter.clone(),
  };
}

export function getFaceVertices(geometry: THREE.BufferGeometry, faceIndex: number): number[] {
  const index = geometry.getIndex();

  if (index) {
    const i0 = index.getX(faceIndex * 3);
    const i1 = index.getX(faceIndex * 3 + 1);
    const i2 = index.getX(faceIndex * 3 + 2);
    return [i0, i1, i2];
  }

  return [faceIndex * 3, faceIndex * 3 + 1, faceIndex * 3 + 2];
}

export function getFaceCenter(geometry: THREE.BufferGeometry, vertexIndices: number[]): THREE.Vector3 {
  const position = geometry.getAttribute('position') as THREE.BufferAttribute | undefined;
  if (!position) {
    throw new Error('Geometry is missing position attribute');
  }
  
  const center = new THREE.Vector3();
  const temp = new THREE.Vector3();

  vertexIndices.forEach((vertexIndex) => {
    temp.fromBufferAttribute(position, vertexIndex);
    center.add(temp);
  });

  center.divideScalar(vertexIndices.length);
  return center;
}

export function getFaceNormal(geometry: THREE.BufferGeometry, faceIndex: number): THREE.Vector3 {
  const position = geometry.getAttribute('position') as THREE.BufferAttribute | undefined;
  if (!position) {
    throw new Error('Geometry is missing position attribute');
  }

  const vertices = getFaceVertices(geometry, faceIndex);
  const i0 = vertices[0];
  const i1 = vertices[1];
  const i2 = vertices[2];

  if (i0 === undefined || i1 === undefined || i2 === undefined) {
    throw new Error('Invalid face vertices');
  }

  const v0 = new THREE.Vector3().fromBufferAttribute(position, i0);
  const v1 = new THREE.Vector3().fromBufferAttribute(position, i1);
  const v2 = new THREE.Vector3().fromBufferAttribute(position, i2);

  const edge1 = new THREE.Vector3().subVectors(v1, v0);
  const edge2 = new THREE.Vector3().subVectors(v2, v0);

  return new THREE.Vector3().crossVectors(edge1, edge2).normalize();
}

const getFaceCount = (geometry: THREE.BufferGeometry): number => {
  const index = geometry.getIndex();
  if (index) {
    return index.count / 3;
  }
  const position = geometry.getAttribute('position');
  if (!position) {
    throw new Error('Geometry is missing position attribute');
  }
  return position.count / 3;
};

const computePlaneOffset = (normal: THREE.Vector3, point: THREE.Vector3): number => {
  return -normal.dot(point);
};

export const computeFaceVertexPositions = (
  vertexIndices: number[],
  positions: Float32Array | number[]
): Array<[number, number, number]> => {
  const result: Array<[number, number, number]> = [];
  vertexIndices.forEach((index) => {
    const base = index * 3;
    const x = positions[base];
    const y = positions[base + 1];
    const z = positions[base + 2];

    if (x !== undefined && y !== undefined && z !== undefined) {
      result.push([x, y, z]);
    }
  });
  return result;
};

/**
 * Helper function to convert THREE.Vector3 to strict tuple type
 */
export const vector3ToTuple = (v: THREE.Vector3): [number, number, number] => {
  return [v.x, v.y, v.z];
};

const LOCAL_RAY_ORIGIN = new THREE.Vector3();
const LOCAL_RAY_DIRECTION = new THREE.Vector3();
const TEMP_VECTOR = new THREE.Vector3();

export interface PushPullDragContext {
  mesh: THREE.Mesh;
  inverseMatrix: THREE.Matrix4;
  axisPointLocal: THREE.Vector3;
  normalLocal: THREE.Vector3;
  baseline: number;
}

const computeLocalRay = (
  ray: THREE.Ray,
  inverseMatrix: THREE.Matrix4,
  targetOrigin: THREE.Vector3,
  targetDirection: THREE.Vector3
) => {
  targetOrigin.copy(ray.origin).applyMatrix4(inverseMatrix);
  targetDirection.copy(ray.direction).transformDirection(inverseMatrix).normalize();
};

const solveNormalDistance = (
  axisPointLocal: THREE.Vector3,
  normalLocal: THREE.Vector3,
  rayOriginLocal: THREE.Vector3,
  rayDirectionLocal: THREE.Vector3
): number => {
  const p = TEMP_VECTOR.copy(axisPointLocal).sub(rayOriginLocal);
  const ap = normalLocal.dot(p);
  const bp = rayDirectionLocal.dot(p);
  const c = normalLocal.dot(rayDirectionLocal);
  const denom = 1 - c * c;

  if (Math.abs(denom) < 1e-6) {
    return ap;
  }

  return (ap - c * bp) / denom;
};

export const createPushPullDragContext = (
  face: FaceData,
  pointerRay: THREE.Ray
): PushPullDragContext => {
  face.mesh.updateMatrixWorld(true);
  const inverseMatrix = face.mesh.matrixWorld.clone().invert();
  const axisPointLocal = face.center.clone();
  const normalLocal = face.normal.clone().normalize();

  const localOrigin = new THREE.Vector3();
  const localDirection = new THREE.Vector3();
  computeLocalRay(pointerRay, inverseMatrix, localOrigin, localDirection);

  const baseline = solveNormalDistance(axisPointLocal, normalLocal, localOrigin, localDirection);

  return {
    mesh: face.mesh,
    inverseMatrix,
    axisPointLocal,
    normalLocal,
    baseline,
  };
};

export const computeDistanceFromDragContext = (
  context: PushPullDragContext,
  pointerRay: THREE.Ray
): number => {
  computeLocalRay(pointerRay, context.inverseMatrix, LOCAL_RAY_ORIGIN, LOCAL_RAY_DIRECTION);
  const rawDistance = solveNormalDistance(
    context.axisPointLocal,
    context.normalLocal,
    LOCAL_RAY_ORIGIN,
    LOCAL_RAY_DIRECTION
  );

  return context.baseline - rawDistance;
};

export const extrudeFaceBackend = async (
  payload: ExtrudeFaceBackendPayload
): Promise<SerializedGeometryData> => {
  const response = await fetch('/api/geometry-operations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      operation: 'extrude',
      ...payload,
    }),
  });

  if (!response.ok) {
    let errorMessage = `Backend extrusion failed: ${response.statusText}`;
    try {
      const errorData = await response.json();
      if (errorData.error) {
        errorMessage = errorData.error;
        if (errorData.message) {
          errorMessage += `: ${errorData.message}`;
        }
        if (errorData.details) {
          console.error('[push-pull] Validation error details:', errorData.details);
        }
      }
    } catch {
      // If JSON parsing fails, try text
      try {
        const text = await response.text();
        if (text) {
          errorMessage = text;
        }
      } catch {
        // Use default message
      }
    }
    throw new Error(errorMessage);
  }

  const result = (await response.json()) as ExtrudeFaceBackendResponse;
  return result.geometry;
};