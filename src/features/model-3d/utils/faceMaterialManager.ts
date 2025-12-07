/**
 * Face Material Manager
 * Manages incremental material application to faces, preserving existing materials
 */
import * as THREE from 'three';
import { buildFaceData } from './pushPull';
import type { FaceSelection } from './faceMaterialApplicator';

/**
 * Stores face-to-material mapping for a mesh
 */
interface FaceMaterialMapping {
  // Map of triangle index -> material index
  triangleToMaterialIndex: Map<number, number>;
  // Array of materials in order
  materials: THREE.Material[];
  // Original default material
  defaultMaterial: THREE.Material;
}

// Store mappings per mesh UUID
const meshMaterialMappings = new Map<string, FaceMaterialMapping>();

/**
 * Apply material to selected faces while preserving existing face materials
 */
export function applyMaterialToFacesIncremental(
  mesh: THREE.Mesh,
  faceSelections: FaceSelection[],
  newMaterial: THREE.Material
): void {
  console.log('[faceMaterialManager] Applying material incrementally to', faceSelections.length, 'faces');

  const geometry = mesh.geometry;

  // Ensure geometry has normals
  if (!geometry.attributes.normal) {
    console.log('[faceMaterialManager] Computing vertex normals');
    geometry.computeVertexNormals();
  }

  // Ensure geometry has UVs for texture mapping
  if (!geometry.attributes.uv) {
    console.log('[faceMaterialManager] Generating UVs');
    const positions = geometry.getAttribute('position');
    const uvs = new Float32Array(positions.count * 2);

    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i);
      const z = positions.getZ(i);
      uvs[i * 2] = x * 0.5;
      uvs[i * 2 + 1] = z * 0.5;
    }

    geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
  }

  // Convert to indexed geometry if needed
  if (!geometry.index) {
    console.log('[faceMaterialManager] Converting to indexed geometry');
    const positions = geometry.getAttribute('position');
    const indices: number[] = [];
    for (let i = 0; i < positions.count; i++) {
      indices.push(i);
    }
    geometry.setIndex(indices);
  }

  // Get or create mapping for this mesh
  let mapping = meshMaterialMappings.get(mesh.uuid);
  if (!mapping) {
    // First time applying custom materials to this mesh
    const defaultMaterial = Array.isArray(mesh.material) ? mesh.material[0] : mesh.material;
    if (!defaultMaterial) {
      throw new Error('Mesh must have a material');
    }
    mapping = {
      triangleToMaterialIndex: new Map(),
      materials: [defaultMaterial],
      defaultMaterial: defaultMaterial
    };
    meshMaterialMappings.set(mesh.uuid, mapping);
    console.log('[faceMaterialManager] Created new mapping for mesh', mesh.uuid);
  }

  // Mark new material as user-applied
  if (!newMaterial.userData) {
    newMaterial.userData = {};
  }
  newMaterial.userData.isUserMaterial = true;

  // Find or add the new material to our materials array
  let newMaterialIndex = mapping.materials.findIndex(m => m === newMaterial);
  if (newMaterialIndex === -1) {
    mapping.materials.push(newMaterial);
    newMaterialIndex = mapping.materials.length - 1;
    console.log('[faceMaterialManager] Added new material at index', newMaterialIndex);
  }

  // Get all triangles for selected faces and assign to new material
  const triangleSet = new Set<number>();
  faceSelections.forEach((selection) => {
    const faceIndex = selection.faceIndex;
    try {
      const faceData = buildFaceData(mesh, faceIndex);
      faceData.triangleIndices.forEach((triIndex) => {
        triangleSet.add(triIndex);
        mapping!.triangleToMaterialIndex.set(triIndex, newMaterialIndex);
      });
      console.log('[faceMaterialManager] Assigned', faceData.triangleIndices.length, 'triangles from face', faceIndex, 'to material', newMaterialIndex);
    } catch (error) {
      console.warn('[faceMaterialManager] Failed to get face data for', faceIndex, error);
      triangleSet.add(faceIndex);
      mapping!.triangleToMaterialIndex.set(faceIndex, newMaterialIndex);
    }
  });

  // Rebuild geometry with new material assignments
  rebuildGeometryGroups(mesh, mapping);

  console.log('[faceMaterialManager] Applied material to', triangleSet.size, 'triangles. Total materials:', mapping.materials.length);
}

/**
 * Rebuild geometry groups based on current face-to-material mapping
 */
function rebuildGeometryGroups(mesh: THREE.Mesh, mapping: FaceMaterialMapping): void {
  const geometry = mesh.geometry;

  if (!geometry.index) {
    console.warn('[faceMaterialManager] Geometry must be indexed');
    return;
  }

  const faceCount = geometry.index.count / 3;
  const indexArray = geometry.index.array;

  // Group triangles by material index
  const materialGroups = new Map<number, number[]>();

  for (let triIndex = 0; triIndex < faceCount; triIndex++) {
    // Get material index for this triangle (default to 0 if not assigned)
    const materialIndex = mapping.triangleToMaterialIndex.get(triIndex) ?? 0;

    if (!materialGroups.has(materialIndex)) {
      materialGroups.set(materialIndex, []);
    }

    // Add this triangle's indices
    const i0 = triIndex * 3;
    const i1 = triIndex * 3 + 1;
    const i2 = triIndex * 3 + 2;
    const idx0 = indexArray[i0];
    const idx1 = indexArray[i1];
    const idx2 = indexArray[i2];
    if (idx0 !== undefined && idx1 !== undefined && idx2 !== undefined) {
      materialGroups.get(materialIndex)!.push(idx0, idx1, idx2);
    }
  }

  console.log('[faceMaterialManager] Rebuilt groups:', {
    materialCount: materialGroups.size,
    groupSizes: Array.from(materialGroups.entries()).map(([matIdx, indices]) => ({
      materialIndex: matIdx,
      triangleCount: indices.length / 3
    }))
  });

  // Rebuild index buffer with grouped triangles
  const newIndexArray: number[] = [];
  const groups: { start: number; count: number; materialIndex: number }[] = [];

  // Sort material indices to ensure consistent ordering
  const sortedMaterialIndices = Array.from(materialGroups.keys()).sort((a, b) => a - b);

  sortedMaterialIndices.forEach((materialIndex) => {
    const indices = materialGroups.get(materialIndex)!;
    const start = newIndexArray.length;
    newIndexArray.push(...indices);
    groups.push({
      start,
      count: indices.length,
      materialIndex
    });
  });

  // Update geometry
  const totalIndices = newIndexArray.length;
  const IndexArrayType = totalIndices > 65535 ? Uint32Array : Uint16Array;
  geometry.setIndex(new THREE.BufferAttribute(new IndexArrayType(newIndexArray), 1));

  // Clear and rebuild groups
  geometry.clearGroups();
  groups.forEach((group) => {
    geometry.addGroup(group.start, group.count, group.materialIndex);
  });

  // Apply materials array to mesh
  mesh.material = mapping.materials;

  // Force updates
  geometry.index.needsUpdate = true;
  geometry.computeBoundingSphere();
  geometry.computeBoundingBox();

  console.log('[faceMaterialManager] Geometry groups:', geometry.groups);
}

/**
 * Clear all custom materials from a mesh (reset to default)
 */
export function clearFaceMaterials(mesh: THREE.Mesh): void {
  meshMaterialMappings.delete(mesh.uuid);

  // Dispose custom materials
  if (Array.isArray(mesh.material)) {
    mesh.material.slice(1).forEach(mat => {
      if (mat.userData?.isUserMaterial) {
        mat.dispose();
      }
    });
    const firstMaterial = mesh.material[0];
    if (firstMaterial) {
      mesh.material = firstMaterial;
    }
  }

  // Clear groups
  mesh.geometry.clearGroups();

  console.log('[faceMaterialManager] Cleared all custom materials from mesh', mesh.uuid);
}
