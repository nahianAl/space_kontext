/**
 * Face material applicator utility
 * Applies materials to specific faces within a Three.js mesh using geometry groups
 */
import * as THREE from 'three';
import { buildFaceData } from './pushPull';

export interface FaceSelection {
  wallId: string;
  faceIndex: number;
}

/**
 * Apply a material to specific faces within a mesh using geometry groups
 * This creates a multi-material setup where different faces can have different materials
 */
export function applyMaterialToFaces(
  mesh: THREE.Mesh,
  faceSelections: FaceSelection[],
  material: THREE.Material
): void {
  console.log('[applyMaterialToFaces] Starting:', {
    mesh,
    faceSelections,
    material,
    hasGeometry: !!mesh.geometry,
    hasIndex: !!mesh.geometry?.index
  });

  const geometry = mesh.geometry;

  // Ensure geometry has normals FIRST
  if (!geometry.attributes.normal) {
    console.log('[applyMaterialToFaces] Computing vertex normals for smooth shading');
    geometry.computeVertexNormals();
  }

  // Ensure geometry has UVs FIRST (needed for PBR materials)
  if (!geometry.attributes.uv) {
    console.log('[applyMaterialToFaces] Geometry missing UVs - generating basic UVs');
    const positions = geometry.getAttribute('position');
    const uvs = new Float32Array(positions.count * 2);

    // Generate simple planar UVs from world positions
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i);
      const z = positions.getZ(i);
      uvs[i * 2] = x * 0.5; // Scale factor for tiling
      uvs[i * 2 + 1] = z * 0.5;
    }

    geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
    console.log('[applyMaterialToFaces] Generated UVs for', positions.count, 'vertices');
  }

  // Convert non-indexed geometry to indexed
  if (!geometry.index) {
    console.log('[applyMaterialToFaces] Converting non-indexed geometry to indexed');

    const positions = geometry.getAttribute('position');

    if (!positions) {
      console.warn('[applyMaterialToFaces] No position attribute found');
      return;
    }

    // Create index array
    const indices: number[] = [];
    const vertexCount = positions.count;
    for (let i = 0; i < vertexCount; i++) {
      indices.push(i);
    }

    // Set the index
    geometry.setIndex(indices);
    console.log('[applyMaterialToFaces] Created index buffer with', indices.length, 'indices');
  }

  const faceCount = geometry.index!.count / 3;
  console.log('[applyMaterialToFaces] Face count:', faceCount);

  // Build a set of triangle indices to apply the material to
  const triangleSet = new Set<number>();

  faceSelections.forEach((selection) => {
    const faceIndex = selection.faceIndex;
    console.log('[applyMaterialToFaces] Processing face:', { wallId: selection.wallId, faceIndex, faceCount });

    if (faceIndex >= 0 && faceIndex < faceCount) {
      // Get all triangles that belong to this face
      try {
        const faceData = buildFaceData(mesh, faceIndex);
        console.log('[applyMaterialToFaces] Built face data:', {
          triangleCount: faceData.triangleIndices.length,
          triangleIndices: faceData.triangleIndices
        });
        faceData.triangleIndices.forEach((triIndex) => {
          triangleSet.add(triIndex);
        });
      } catch (error) {
        console.warn('[applyMaterialToFaces] buildFaceData failed, using single triangle:', error);
        // If buildFaceData fails, just use the single triangle
        triangleSet.add(faceIndex);
      }
    } else {
      console.warn('[applyMaterialToFaces] Face index out of range:', { faceIndex, faceCount });
    }
  });

  console.log('[applyMaterialToFaces] Triangle set size:', triangleSet.size);

  if (triangleSet.size === 0) {
    console.warn('[applyMaterialToFaces] No triangles to apply material to');
    return;
  }

  // Get original material
  const originalMaterial = Array.isArray(mesh.material)
    ? mesh.material[0]
    : mesh.material;
  
  if (!originalMaterial) {
    throw new Error('Mesh must have a material');
  }

  // Clear existing groups
  geometry.clearGroups();

  // Create index arrays for each material
  const originalIndices: number[] = [];
  const newMaterialIndices: number[] = [];

  if (!geometry.index) {
    throw new Error('Geometry must have an index attribute');
  }
  const indexArray = geometry.index.array;

  for (let i = 0; i < faceCount; i++) {
    const i0 = i * 3;
    const i1 = i * 3 + 1;
    const i2 = i * 3 + 2;

    const idx0 = indexArray[i0];
    const idx1 = indexArray[i1];
    const idx2 = indexArray[i2];
    
    if (idx0 === undefined || idx1 === undefined || idx2 === undefined) {
      continue;
    }
    
    if (triangleSet.has(i)) {
      // This triangle gets the new material
      newMaterialIndices.push(idx0, idx1, idx2);
    } else {
      // This triangle keeps the original material
      originalIndices.push(idx0, idx1, idx2);
    }
  }

  // Rebuild the index buffer with grouped triangles
  const totalIndices = originalIndices.length + newMaterialIndices.length;
  const IndexArrayType = totalIndices > 65535 ? Uint32Array : Uint16Array;
  const newIndexArray = new IndexArrayType([...originalIndices, ...newMaterialIndices]);
  geometry.setIndex(new THREE.BufferAttribute(newIndexArray, 1));

  // Add geometry groups
  if (originalIndices.length > 0) {
    geometry.addGroup(0, originalIndices.length, 0); // Original material group
  }
  if (newMaterialIndices.length > 0) {
    geometry.addGroup(originalIndices.length, newMaterialIndices.length, 1); // New material group
  }

  // Mark the new material as user-applied
  if (material.userData) {
    material.userData.isUserMaterial = true;
  }

  // Set up multi-material
  mesh.material = [originalMaterial, material];

  console.log('[applyMaterialToFaces] Applied materials:', {
    originalIndicesCount: originalIndices.length,
    newMaterialIndicesCount: newMaterialIndices.length,
    groups: geometry.groups,
    materials: mesh.material,
    hasNormals: !!geometry.attributes.normal
  });

  geometry.computeBoundingSphere();
  geometry.computeBoundingBox();

  // Force update all attributes
  const positionAttr = geometry.attributes.position;
  if (!positionAttr) {
    throw new Error('Geometry must have a position attribute');
  }
  positionAttr.needsUpdate = true;
  if (geometry.index) {
    geometry.index.needsUpdate = true;
  }
  if (geometry.attributes.normal) {
    geometry.attributes.normal.needsUpdate = true;
  }
  if (geometry.attributes.uv) {
    geometry.attributes.uv.needsUpdate = true;
  }

  console.log('[applyMaterialToFaces] Complete! Geometry now has:', {
    index: !!geometry.index,
    normals: !!geometry.attributes.normal,
    uvs: !!geometry.attributes.uv,
    groups: geometry.groups.length
  });
}

/**
 * Apply material to an entire wall mesh
 */
export function applyMaterialToWall(
  mesh: THREE.Mesh,
  material: THREE.Material
): void {
  console.log('[applyMaterialToWall] Starting:', {
    mesh,
    material,
    currentMaterial: mesh.material,
    wallId: mesh.userData?.wallId
  });

  const geometry = mesh.geometry;

  // Ensure geometry has normals for smooth shading
  if (!geometry.attributes.normal) {
    console.log('[applyMaterialToWall] Computing vertex normals for smooth shading');
    geometry.computeVertexNormals();
  }

  // Ensure geometry has UVs for texture mapping
  if (!geometry.attributes.uv) {
    console.log('[applyMaterialToWall] Geometry missing UVs - generating basic UVs');
    const positions = geometry.getAttribute('position');
    const uvs = new Float32Array(positions.count * 2);

    // Generate simple planar UVs from world positions
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i);
      const z = positions.getZ(i);
      uvs[i * 2] = x * 0.5; // Scale factor for tiling
      uvs[i * 2 + 1] = z * 0.5;
    }

    geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
    console.log('[applyMaterialToWall] Generated UVs for', positions.count, 'vertices');
  }

  // Dispose old material if it exists and is not shared
  if (mesh.material) {
    if (Array.isArray(mesh.material)) {
      mesh.material.forEach((mat) => {
        if (mat.userData?.isShared !== true && mat.userData?.isUserMaterial !== true) {
          mat.dispose();
        }
      });
    } else {
      if (mesh.material.userData?.isShared !== true && mesh.material.userData?.isUserMaterial !== true) {
        mesh.material.dispose();
      }
    }
  }

  // Mark as user-applied material
  if (!material.userData) {
    material.userData = {};
  }
  material.userData.isUserMaterial = true;

  // Apply new material
  mesh.material = material;
  material.needsUpdate = true;

  // Force geometry update
  if (geometry.attributes.normal) {
    geometry.attributes.normal.needsUpdate = true;
  }
  if (geometry.attributes.uv) {
    geometry.attributes.uv.needsUpdate = true;
  }

  console.log('[applyMaterialToWall] Complete!', {
    material: mesh.material,
    hasUVs: !!geometry.attributes.uv,
    hasNormals: !!geometry.attributes.normal
  });
}
