/**
 * Material creation and management utilities
 */
import * as THREE from 'three';
import type { MaterialProperties } from '../../types/cadObjects';

export const DEFAULT_MATERIAL_PROPS: MaterialProperties = {
  color: 0xcccccc,
  metalness: 0.1,
  roughness: 0.7,
};

export const createMaterialFromProperties = (properties?: MaterialProperties): THREE.MeshStandardMaterial => {
  return new THREE.MeshStandardMaterial({
    color: (properties?.color ?? DEFAULT_MATERIAL_PROPS.color)!,
    opacity: properties?.opacity ?? 1,
    transparent: properties?.transparent ?? (properties?.opacity !== undefined && properties.opacity < 1),
    metalness: (properties?.metalness ?? DEFAULT_MATERIAL_PROPS.metalness)!,
    roughness: (properties?.roughness ?? DEFAULT_MATERIAL_PROPS.roughness)!,
    polygonOffset: true,
    polygonOffsetFactor: 1,
    polygonOffsetUnits: 1,
    flatShading: true, // Use flat shading for crisp edges
  });
};
