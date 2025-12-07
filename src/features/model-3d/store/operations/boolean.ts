/**
 * Boolean operation utilities (union, subtract, intersect)
 */
import * as THREE from 'three';
import { performBoolean, validateMeshesForBoolean } from '../../utils/booleanOperations';
import { disposeMeshResources } from '../utils/meshUtils';
import type { CADObject, BooleanOperation } from '../types';

export const attemptRectangleBooleanCut = (
  toolObjectId: string,
  pushDistance: number,
  faceNormal: THREE.Vector3,
  faceCenter: THREE.Vector3,
  objects: CADObject[],
  pushHistorySnapshot: () => void,
  recordBooleanOperation: (baseId: string, toolId: string, operation: 'subtract') => void
): {
  updatedObjects?: CADObject[];
  performed: boolean;
} => {
  if (pushDistance >= 0) {
    return { performed: false };
  }

  const toolObject = objects.find((obj) => obj.id === toolObjectId);
  if (!toolObject) {
    return { performed: false };
  }

  const originFeature = toolObject.mesh.userData?.originFeature;
  if (originFeature !== 'rectangle-tool' && originFeature !== 'offset-tool') {
    return { performed: false };
  }

  const supportObjectId =
    typeof toolObject.mesh.userData?.supportObjectId === 'string'
      ? (toolObject.mesh.userData.supportObjectId as string)
      : null;

  let baseObject: CADObject | null = null;

  if (supportObjectId) {
    baseObject = objects.find((obj) => obj.id === supportObjectId) ?? null;
  }

  if (!baseObject) {
    const direction = faceNormal.clone().multiplyScalar(pushDistance < 0 ? -1 : 1).normalize();
    const rayOrigin = faceCenter.clone().addScaledVector(direction, 1e-3);
    const raycaster = new THREE.Raycaster(rayOrigin, direction, 0, Infinity);

    for (const candidate of objects) {
      if (candidate.id === toolObjectId) {
        continue;
      }
      candidate.mesh.updateMatrixWorld(true);
      const intersections = raycaster.intersectObject(candidate.mesh, false);
      if (!intersections.length) {
        continue;
      }
      const hit = intersections[0];
      if (!hit || hit.distance <= 1e-3) {
        continue;
      }
      baseObject = candidate;
      break;
    }
  }

  if (!baseObject) {
    return { performed: false };
  }

  // Create extruded cutting volume from the thin rectangle
  const extrudeDepth = Math.abs(pushDistance);

  // Get the rectangle's dimensions and transform
  const rectGeometry = toolObject.mesh.geometry as THREE.BoxGeometry;
  const params = rectGeometry.parameters;
  const width = params?.width ?? 1;
  const height = params?.height ?? 1;

  // Create a new box geometry with the extruded depth
  const extrudedGeometry = new THREE.BoxGeometry(width, height, extrudeDepth);

  // Compute normals and bounds on the cutting geometry
  extrudedGeometry.computeVertexNormals();
  extrudedGeometry.computeBoundingBox();
  extrudedGeometry.computeBoundingSphere();

  // Create a mesh with the same position/rotation as the original
  const toolMesh = new THREE.Mesh(
    extrudedGeometry,
    toolObject.mesh.material
  );

  // Copy transform from original rectangle
  toolMesh.position.copy(toolObject.mesh.position);
  toolMesh.rotation.copy(toolObject.mesh.rotation);
  toolMesh.scale.copy(toolObject.mesh.scale);

  // Offset the position in the direction of the face normal
  // For cutting (negative distance), we need to extrude INTO the surface
  // The face normal points outward from the surface, so we need to offset in the OPPOSITE direction
  // We offset by HALF the extrude depth to center the cutting volume on the surface
  const offsetDirection = faceNormal.clone().normalize().negate(); // Into the surface
  const offset = offsetDirection.multiplyScalar(extrudeDepth / 2);
  toolMesh.position.add(offset);

  toolMesh.updateMatrix();
  toolMesh.updateMatrixWorld(true);

  const validation = validateMeshesForBoolean(baseObject.mesh, toolMesh);
  if (!validation.valid) {
    toolMesh.geometry.dispose();
    return { performed: false };
  }

  try {
    const resultMesh = performBoolean(baseObject.mesh, toolMesh, 'subtract');

    // Clean up the temporary extruded tool mesh
    toolMesh.geometry.dispose();
    resultMesh.userData.cadObjectId = baseObject.id;
    resultMesh.userData.shapeType = baseObject.mesh.userData?.shapeType ?? baseObject.type;
    resultMesh.castShadow = true;
    resultMesh.receiveShadow = true;
    resultMesh.updateMatrixWorld(true);

    const updatedBase: CADObject = {
      ...baseObject,
      mesh: resultMesh,
      position: [resultMesh.position.x, resultMesh.position.y, resultMesh.position.z],
      rotation: [resultMesh.rotation.x, resultMesh.rotation.y, resultMesh.rotation.z],
      scale: [resultMesh.scale.x, resultMesh.scale.y, resultMesh.scale.z],
      updatedAt: Date.now(),
    };

    disposeMeshResources(baseObject.mesh);
    disposeMeshResources(toolObject.mesh);

    pushHistorySnapshot();

    const updatedObjects = objects
      .map((obj) => (obj.id === baseObject.id ? updatedBase : obj))
      .filter((obj) => obj.id !== toolObjectId);

    recordBooleanOperation(baseObject.id, toolObjectId, 'subtract');

    return { updatedObjects, performed: true };
  } catch (error) {
    // Clean up the temporary extruded tool mesh on error
    if (toolMesh) {
      toolMesh.geometry.dispose();
    }
    return { performed: false };
  }
};

export const addBooleanOperation = (
  booleanOperations: BooleanOperation[],
  baseId: string,
  toolId: string,
  operation: 'union' | 'subtract' | 'intersect'
): BooleanOperation[] => {
  const id = `bool-${Date.now()}`;
  return [
    ...booleanOperations,
    {
      id,
      baseId,
      toolId,
      operation,
      resultId: '', // Will be set after operation completes
      timestamp: Date.now(),
    },
  ];
};

export const undoBooleanOperation = (booleanOperations: BooleanOperation[]): BooleanOperation[] => {
  return booleanOperations.slice(0, -1);
};
