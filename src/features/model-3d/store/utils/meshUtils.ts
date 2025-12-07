/**
 * Mesh resource management utilities
 */
import * as THREE from 'three';
import type { CADObject } from '../types';

export const disposeMeshResources = (mesh: THREE.Mesh) => {
  mesh.geometry.dispose();
  if (Array.isArray(mesh.material)) {
    mesh.material.forEach((material) => material.dispose());
  } else if (mesh.material) {
    mesh.material.dispose();
  }
};

export const disposeCADObjects = (objects: CADObject[]) => {
  objects.forEach((obj) => disposeMeshResources(obj.mesh));
};
