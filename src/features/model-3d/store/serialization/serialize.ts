/**
 * Serialization utilities for CAD objects
 */
import * as THREE from 'three';
import { extractGeometryData } from '../../utils/geometry';
import type { CADObject, SerializedCADObjectState } from '../types';

export const serializeCADObject = (object: CADObject): SerializedCADObjectState => {
  const geometryData = extractGeometryData(object.mesh.geometry as THREE.BufferGeometry);
  const userData = object.mesh.userData ? { ...object.mesh.userData } : undefined;

  const result: SerializedCADObjectState = {
    id: object.id,
    type: object.type,
    position: [...object.position],
    rotation: [...object.rotation],
    scale: [...object.scale],
    geometry: geometryData,
    createdAt: object.createdAt,
    updatedAt: object.updatedAt,
  };

  if (object.material) {
    result.material = object.material;
  }

  if (userData) {
    result.userData = userData;
  }

  return result;
};
