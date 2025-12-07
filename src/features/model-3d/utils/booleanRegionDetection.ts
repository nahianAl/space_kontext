/**
 * Boolean region detection utilities
 * Determines which region of overlapping meshes a point belongs to
 */

import * as THREE from 'three';
import { performBoolean } from './booleanOperations';

export type RegionType = 'intersection' | 'union' | 'outer-shell' | 'base' | 'tool';

export interface RegionData {
  type: RegionType;
  mesh: THREE.Mesh | null; // Computed mesh for this region (null for base/tool which use original)
  bounds: THREE.Box3;
  color: number; // Color for preview
  label: string; // Tooltip label
}

/**
 * Check if a point is inside a mesh using raycasting
 * Uses multiple rays to get a reliable result
 */
function isPointInsideMesh(point: THREE.Vector3, mesh: THREE.Mesh): boolean {
  // Use raycasting from point in multiple directions
  // If odd number of intersections, point is inside
  const directions = [
    new THREE.Vector3(1, 0, 0),
    new THREE.Vector3(-1, 0, 0),
    new THREE.Vector3(0, 1, 0),
    new THREE.Vector3(0, -1, 0),
    new THREE.Vector3(0, 0, 1),
    new THREE.Vector3(0, 0, -1),
  ];

  let insideCount = 0;

  for (const direction of directions) {
    const raycaster = new THREE.Raycaster(point, direction);
    raycaster.far = 1000; // Set reasonable far distance
    const intersections = raycaster.intersectObject(mesh, false);

    // Odd number of intersections means inside
    if (intersections.length % 2 === 1) {
      insideCount++;
    }
  }

  // If majority of rays say we're inside, consider it inside
  return insideCount >= directions.length / 2;
}

/**
 * Compute intersection region (common area between meshes)
 */
export function computeIntersectionRegion(
  meshes: THREE.Mesh[]
): RegionData | null {
  if (meshes.length < 2) {
    return null;
  }

  try {
    // Start with first mesh
    const firstMesh = meshes[0];
    if (!firstMesh) {
      return null;
    }
    let resultMesh = firstMesh.clone();
    
    // Intersect with each subsequent mesh
    for (let i = 1; i < meshes.length; i++) {
      const mesh = meshes[i];
      if (!mesh) {
        continue;
      }
      const validation = validateMeshesForBoolean(resultMesh, mesh);
      if (!validation.valid) {
        return null;
      }
      
      resultMesh = performBoolean(resultMesh, mesh, 'intersect');
    }

    const bounds = new THREE.Box3().setFromObject(resultMesh);

    return {
      type: 'intersection',
      mesh: resultMesh,
      bounds,
      color: 0x5c2b34, // Dark maroon
      label: 'Intersection',
    };
  } catch (error) {
    console.error('Failed to compute intersection region:', error);
    return null;
  }
}

/**
 * Compute union region (combined area of all meshes)
 */
export function computeUnionRegion(meshes: THREE.Mesh[]): RegionData | null {
  if (meshes.length < 2) {
    return null;
  }

  try {
    // Start with first mesh
    const firstMesh = meshes[0];
    if (!firstMesh) {
      return null;
    }
    let resultMesh = firstMesh.clone();
    
    // Union with each subsequent mesh
    for (let i = 1; i < meshes.length; i++) {
      const mesh = meshes[i];
      if (!mesh) {
        continue;
      }
      const validation = validateMeshesForBoolean(resultMesh, mesh);
      if (!validation.valid) {
        return null;
      }
      
      resultMesh = performBoolean(resultMesh, mesh, 'union');
    }

    const bounds = new THREE.Box3().setFromObject(resultMesh);

    return {
      type: 'union',
      mesh: resultMesh,
      bounds,
      color: 0x5c2b34, // Dark maroon
      label: 'Union',
    };
  } catch (error) {
    console.error('Failed to compute union region:', error);
    return null;
  }
}

/**
 * Compute subtraction region (base minus tool)
 */
export function computeSubtractionRegion(
  baseMesh: THREE.Mesh,
  toolMesh: THREE.Mesh
): RegionData | null {
  try {
    const validation = validateMeshesForBoolean(baseMesh, toolMesh);
    if (!validation.valid) {
      return null;
    }

    const resultMesh = performBoolean(baseMesh, toolMesh, 'subtract');
    const bounds = new THREE.Box3().setFromObject(resultMesh);

    return {
      type: 'outer-shell',
      mesh: resultMesh,
      bounds,
      color: 0x5c2b34, // Dark maroon
      label: 'Subtraction (base - tool)',
    };
  } catch (error) {
    console.error('Failed to compute subtraction region:', error);
    return null;
  }
}

/**
 * Get bounds for a region
 */
export function getRegionBounds(region: RegionData): THREE.Box3 {
  return region.bounds.clone();
}

/**
 * Detect which region was clicked
 */
export function detectClickedRegion(
  raycaster: THREE.Raycaster,
  selectedObjects: THREE.Mesh[],
  clickPoint: THREE.Vector3
): RegionType | null {
  if (selectedObjects.length < 2) {
    return null;
  }

  // For simplicity with 2 objects, check which regions contain the point
  const [baseMesh, toolMesh] = selectedObjects;
  
  if (!baseMesh || !toolMesh) {
    return null;
  }

  // Check if point is in base only
  const inBase = isPointInsideMesh(clickPoint, baseMesh);
  const inTool = isPointInsideMesh(clickPoint, toolMesh);

  if (inBase && inTool) {
    // Point is in both - check intersection region
    const intersection = computeIntersectionRegion([baseMesh, toolMesh]);
    if (intersection?.mesh && isPointInsideMesh(clickPoint, intersection.mesh)) {
      return 'intersection';
    }
    // If intersection computation failed, default to intersection type
    return 'intersection';
  } else if (inBase && !inTool) {
    // Point is in base but not tool - could be base-only or subtraction result
    const subtraction = computeSubtractionRegion(baseMesh, toolMesh);
    if (subtraction?.mesh && isPointInsideMesh(clickPoint, subtraction.mesh)) {
      return 'outer-shell';
    }
    return 'base';
  } else if (!inBase && inTool) {
    // Point is in tool but not base
    return 'tool';
  } else {
    // Point is in neither - check union region
    const union = computeUnionRegion([baseMesh, toolMesh]);
    if (union?.mesh && isPointInsideMesh(clickPoint, union.mesh)) {
      return 'union';
    }
    return null;
  }
}

/**
 * Compute all possible regions for selected objects
 */
export function computeAllRegions(selectedObjects: THREE.Mesh[]): RegionData[] {
  const regions: RegionData[] = [];

  if (selectedObjects.length < 2) {
    console.warn('[BooleanRegionDetection] Need at least 2 objects');
    return regions;
  }

  // Validate all meshes first
  for (let i = 0; i < selectedObjects.length; i++) {
    const mesh = selectedObjects[i];
    if (!mesh || !mesh.geometry) {
      console.error('[BooleanRegionDetection] Invalid mesh at index', i);
      return regions;
    }
    if (!mesh.geometry.isBufferGeometry) {
      console.error('[BooleanRegionDetection] Mesh at index', i, 'is not BufferGeometry');
      return regions;
    }
  }

  // For 2 objects, compute all regions
  if (selectedObjects.length === 2) {
    const [baseMesh, toolMesh] = selectedObjects;
    
    if (!baseMesh || !toolMesh) {
      return regions;
    }

    console.log('[BooleanRegionDetection] Computing regions for 2 objects');

    // Base only region (base minus tool - the part of base that doesn't overlap)
    const baseOnly = computeSubtractionRegion(baseMesh, toolMesh);
    if (baseOnly) {
      console.log('[BooleanRegionDetection] Computed base-only region');
      regions.push({
        type: 'base',
        mesh: baseOnly.mesh,
        bounds: baseOnly.bounds,
        color: 0x5c2b34, // Dark maroon
        label: 'Base only',
      });
    } else {
      // Fallback to original base if computation fails
      const baseBounds = new THREE.Box3().setFromObject(baseMesh);
      regions.push({
        type: 'base',
        mesh: null, // Use original mesh
        bounds: baseBounds,
        color: 0x5c2b34, // Dark maroon
        label: 'Base only',
      });
    }

    // Tool only region (tool minus base - the part of tool that doesn't overlap)
    const toolOnly = computeSubtractionRegion(toolMesh, baseMesh);
    if (toolOnly) {
      console.log('[BooleanRegionDetection] Computed tool-only region');
      regions.push({
        type: 'tool',
        mesh: toolOnly.mesh,
        bounds: toolOnly.bounds,
        color: 0x5c2b34, // Dark maroon
        label: 'Tool only',
      });
    } else {
      // Fallback to original tool if computation fails
      const toolBounds = new THREE.Box3().setFromObject(toolMesh);
      regions.push({
        type: 'tool',
        mesh: null, // Use original mesh
        bounds: toolBounds,
        color: 0x5c2b34, // Dark maroon
        label: 'Tool only',
      });
    }

    // Intersection
    const intersection = computeIntersectionRegion([baseMesh, toolMesh]);
    if (intersection) {
      console.log('[BooleanRegionDetection] Computed intersection region');
      regions.push(intersection);
    } else {
      console.warn('[BooleanRegionDetection] Failed to compute intersection');
    }

    // Union
    const union = computeUnionRegion([baseMesh, toolMesh]);
    if (union) {
      console.log('[BooleanRegionDetection] Computed union region');
      regions.push(union);
    } else {
      console.warn('[BooleanRegionDetection] Failed to compute union');
    }

    // Subtraction (outer shell)
    const subtraction = computeSubtractionRegion(baseMesh, toolMesh);
    if (subtraction) {
      console.log('[BooleanRegionDetection] Computed subtraction region');
      regions.push(subtraction);
    } else {
      console.warn('[BooleanRegionDetection] Failed to compute subtraction');
    }
  } else {
    console.log('[BooleanRegionDetection] Computing regions for', selectedObjects.length, 'objects');

    // For 3+ objects, compute union and intersection
    const intersection = computeIntersectionRegion(selectedObjects);
    if (intersection) {
      regions.push(intersection);
    }

    const union = computeUnionRegion(selectedObjects);
    if (union) {
      regions.push(union);
    }
  }

  console.log('[BooleanRegionDetection] Computed', regions.length, 'regions');
  return regions;
}

/**
 * Validate meshes for boolean operations (re-export from booleanOperations)
 */
function validateMeshesForBoolean(
  mesh1: THREE.Mesh,
  mesh2: THREE.Mesh
): { valid: boolean; error?: string } {
  if (!mesh1.geometry || !mesh2.geometry) {
    return { valid: false, error: 'Meshes must have geometry' };
  }

  const pos1 = mesh1.geometry.attributes.position;
  const pos2 = mesh2.geometry.attributes.position;
  if (!pos1 || !pos2 || pos1.count === 0 || pos2.count === 0) {
    return { valid: false, error: 'Meshes must have vertices' };
  }

  if (!mesh1.geometry.isBufferGeometry || !mesh2.geometry.isBufferGeometry) {
    return { valid: false, error: 'Meshes must use BufferGeometry' };
  }

  return { valid: true };
}

