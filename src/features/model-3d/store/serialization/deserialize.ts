/**
 * Deserialization utilities for CAD objects
 */
import * as THREE from 'three';
import { createGeometryFromData } from '../../utils/geometry';
import { createMaterialFromProperties } from '../utils/materialUtils';
import type { CADObject, SerializedCADObjectState } from '../types';

export const deserializeCADObject = (data: SerializedCADObjectState): CADObject => {
  const geometry = createGeometryFromData(data.geometry);
  const material = createMaterialFromProperties(data.material);
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(...data.position);
  mesh.rotation.set(...data.rotation);
  mesh.scale.set(...data.scale);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  mesh.userData = {
    ...(data.userData ?? {}),
    cadObjectId: data.id,
    shapeType: data.type,
  };

  const result: CADObject = {
    id: data.id,
    type: data.type,
    mesh,
    position: data.position,
    rotation: data.rotation,
    scale: data.scale,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };

  if (data.material) {
    result.material = data.material;
  }

  return result;
};

export const cloneObjectsFromSnapshot = (snapshot: SerializedCADObjectState[]): CADObject[] => {
  return snapshot.map(deserializeCADObject);
};
