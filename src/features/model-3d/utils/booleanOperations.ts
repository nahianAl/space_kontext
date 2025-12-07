/**
 * Boolean operations using three-bvh-csg
 * Provides Union, Subtract, and Intersect operations for CAD objects
 */

import * as THREE from 'three';
import { Brush, Evaluator, SUBTRACTION, ADDITION, INTERSECTION } from 'three-bvh-csg';
import type { BooleanOperation } from '../types/cadObjects';

/**
 * Convert Three.js mesh to CSG Brush
 */
export function createBrushFromMesh(mesh: THREE.Mesh): Brush {
  // Clone geometry to avoid modifying original
  const geometry = mesh.geometry.clone();

  // Ensure the cloned geometry has all required attributes
  // (clone() should copy them, but let's be explicit)
  if (!geometry.attributes.position) {
    throw new Error('Cloned geometry missing position attribute');
  }

  // Apply mesh transform to geometry
  // Note: applyMatrix4 automatically transforms normals using the normal matrix
  geometry.applyMatrix4(mesh.matrixWorld);

  return new Brush(geometry);
}

/**
 * Convert CSG Brush back to Three.js mesh
 */
export function convertBrushToMesh(
  brush: Brush,
  material?: THREE.Material
): THREE.Mesh {
  const defaultMaterial = new THREE.MeshStandardMaterial({
    color: 0xcccccc,
    metalness: 0.1,
    roughness: 0.7,
  });

  // Create mesh from brush geometry
  const mesh = new THREE.Mesh(brush.geometry, material || defaultMaterial);

  // Reset transform (geometry already has transform applied)
  mesh.position.set(0, 0, 0);
  mesh.rotation.set(0, 0, 0);
  mesh.scale.set(1, 1, 1);
  mesh.updateMatrix();
  mesh.updateMatrixWorld(true);

  // Enable shadows
  mesh.castShadow = true;
  mesh.receiveShadow = true;

  return mesh;
}

/**
 * Perform boolean operation between two meshes
 */
export function performBoolean(
  baseMesh: THREE.Mesh,
  toolMesh: THREE.Mesh,
  operation: BooleanOperation
): THREE.Mesh {
  try {
    // Validate geometries
    if (!baseMesh.geometry.attributes.position) {
      throw new Error('Base mesh has no position attribute');
    }
    if (!toolMesh.geometry.attributes.position) {
      throw new Error('Tool mesh has no position attribute');
    }

    // Ensure all required attributes exist for three-bvh-csg
    // The library requires: position, normal, and optionally uv
    const ensureRequiredAttributes = (geometry: THREE.BufferGeometry) => {
      // Ensure normals exist
      if (!geometry.attributes.normal) {
        geometry.computeVertexNormals();
      }

      // Ensure UVs exist (three-bvh-csg may require this)
      if (!geometry.attributes.uv) {
        const positionAttr = geometry.attributes.position;
        if (!positionAttr) {
          throw new Error('Geometry missing position attribute');
        }
        const positionCount = positionAttr.count;
        const uvs = new Float32Array(positionCount * 2);
        // Fill with zeros - CSG doesn't need meaningful UVs
        geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
      }

      // Ensure bounds are computed
      geometry.computeBoundingSphere();
      geometry.computeBoundingBox();
    };

    ensureRequiredAttributes(baseMesh.geometry);
    ensureRequiredAttributes(toolMesh.geometry);

    // Convert meshes to CSG brushes
    const baseBrush = createBrushFromMesh(baseMesh);
    const toolBrush = createBrushFromMesh(toolMesh);

    // Create evaluator
    const evaluator = new Evaluator();

    // Determine operation type
    let operationType: typeof SUBTRACTION | typeof ADDITION | typeof INTERSECTION;
    switch (operation) {
      case 'subtract':
        operationType = SUBTRACTION;
        break;
      case 'union':
        operationType = ADDITION;
        break;
      case 'intersect':
        operationType = INTERSECTION;
        break;
      default:
        throw new Error(`Unknown boolean operation: ${operation}`);
    }

    // Perform boolean operation
    const resultBrush = evaluator.evaluate(baseBrush, toolBrush, operationType);

    // Validate result
    if (!resultBrush.geometry.attributes.position) {
      throw new Error('Result geometry has no position attribute');
    }

    // CRITICAL FIX: Compute normals and bounds on result geometry BEFORE creating mesh
    // This fixes the "black box" rendering issue

    // Convert to non-indexed for proper per-face normals (avoids shared vertex normal artifacts)
    const resultGeometry = resultBrush.geometry.toNonIndexed();

    // Compute vertex normals for proper lighting (flat shading for CAD-style rendering)
    resultGeometry.computeVertexNormals();

    // Ensure UV attribute exists on result (CSG may not preserve it correctly)
    const resultPositionAttr = resultGeometry.attributes.position;
    if (!resultPositionAttr) {
      throw new Error('Result geometry missing position attribute');
    }
    if (!resultGeometry.attributes.uv) {
      const positionCount = resultPositionAttr.count;
      const uvs = new Float32Array(positionCount * 2);
      resultGeometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
    }

    // Compute bounds for raycasting and culling
    resultGeometry.computeBoundingBox();
    resultGeometry.computeBoundingSphere();

    // Validate result geometry health
    const resultHealth = validateGeometryHealth(resultGeometry, `Result after ${operation}`);
    if (!resultHealth.valid) {
      throw new Error(`Result geometry is invalid: ${resultHealth.warnings.join(', ')}`);
    }

    // Convert back to mesh (preserve base material)
    const material = baseMesh.material instanceof THREE.Material
      ? baseMesh.material.clone() // Clone material to avoid shared state issues
      : Array.isArray(baseMesh.material) && baseMesh.material[0]
        ? baseMesh.material[0].clone()
        : new THREE.MeshStandardMaterial({
            color: 0xcccccc,
            metalness: 0.1,
            roughness: 0.7,
          });

    // Create mesh with properly processed geometry
    const resultMesh = new THREE.Mesh(resultGeometry, material);

    // Reset transform (geometry already has transform applied from createBrushFromMesh)
    resultMesh.position.set(0, 0, 0);
    resultMesh.rotation.set(0, 0, 0);
    resultMesh.scale.set(1, 1, 1);
    resultMesh.updateMatrix();
    resultMesh.updateMatrixWorld(true);

    // Enable shadows
    resultMesh.castShadow = true;
    resultMesh.receiveShadow = true;

    // Store metadata
    resultMesh.userData.cadObjectId = `bool-${Date.now()}`;
    resultMesh.userData.isBooleanResult = true;
    resultMesh.userData.operation = operation;

    // Dispose of intermediate geometries
    if (baseBrush.geometry !== resultBrush.geometry) {
      baseBrush.geometry.dispose();
    }
    if (toolBrush.geometry !== resultBrush.geometry) {
      toolBrush.geometry.dispose();
    }
    // Dispose the original result brush geometry (we're using the non-indexed version)
    if (resultBrush.geometry !== resultGeometry) {
      resultBrush.geometry.dispose();
    }

    return resultMesh;
  } catch (error) {
    console.error('[performBoolean] Boolean operation failed:', error);
    throw error;
  }
}

/**
 * Validate geometry health after operations
 */
export function validateGeometryHealth(
  geometry: THREE.BufferGeometry,
  context: string
): { valid: boolean; warnings: string[] } {
  const warnings: string[] = [];

  // Check position attribute
  if (!geometry.attributes.position) {
    return { valid: false, warnings: ['Missing position attribute'] };
  }

  const positionCount = geometry.attributes.position.count;
  if (positionCount === 0) {
    return { valid: false, warnings: ['Zero vertices'] };
  }

  // Check for degenerate triangles (very small or zero area)
  const positions = geometry.attributes.position;
  const v0 = new THREE.Vector3();
  const v1 = new THREE.Vector3();
  const v2 = new THREE.Vector3();
  const edge1 = new THREE.Vector3();
  const edge2 = new THREE.Vector3();
  const cross = new THREE.Vector3();

  let degenerateCount = 0;
  const maxCheckTriangles = Math.min(100, Math.floor(positionCount / 3)); // Sample first 100 triangles

  for (let i = 0; i < maxCheckTriangles; i++) {
    const idx = i * 3;
    v0.fromBufferAttribute(positions, idx);
    v1.fromBufferAttribute(positions, idx + 1);
    v2.fromBufferAttribute(positions, idx + 2);

    edge1.subVectors(v1, v0);
    edge2.subVectors(v2, v0);
    cross.crossVectors(edge1, edge2);

    const area = cross.length() / 2;
    if (area < 1e-10) {
      degenerateCount++;
    }
  }

  if (degenerateCount > maxCheckTriangles * 0.1) {
    warnings.push(`High degenerate triangle count: ${degenerateCount}/${maxCheckTriangles} sampled`);
  }

  // Check normals
  if (!geometry.attributes.normal) {
    warnings.push('Missing normals - will cause black rendering');
  } else if (geometry.attributes.normal.count !== positionCount) {
    warnings.push('Normal count mismatch with position count');
  }

  // Check bounds
  if (!geometry.boundingBox) {
    warnings.push('Missing bounding box - will affect raycasting');
  }
  if (!geometry.boundingSphere) {
    warnings.push('Missing bounding sphere - will affect culling');
  }

  return {
    valid: warnings.length === 0 || !warnings.some(w => w.includes('Missing position') || w.includes('Zero vertices')),
    warnings,
  };
}

/**
 * Validate meshes for boolean operations
 */
export function validateMeshesForBoolean(
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

  // Check if geometries are valid
  if (!mesh1.geometry.isBufferGeometry || !mesh2.geometry.isBufferGeometry) {
    return { valid: false, error: 'Meshes must use BufferGeometry' };
  }

  // Validate geometry health for both meshes
  const mesh1Health = validateGeometryHealth(mesh1.geometry, 'Base mesh validation');
  const mesh2Health = validateGeometryHealth(mesh2.geometry, 'Tool mesh validation');

  if (!mesh1Health.valid) {
    return { valid: false, error: `Base mesh invalid: ${mesh1Health.warnings.join(', ')}` };
  }
  if (!mesh2Health.valid) {
    return { valid: false, error: `Tool mesh invalid: ${mesh2Health.warnings.join(', ')}` };
  }

  return { valid: true };
}

