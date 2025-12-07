import * as THREE from 'three';

export interface SerializedGeometryData {
  positions: number[];
  indices: number[] | null;
}

export const extractGeometryData = (geometry: THREE.BufferGeometry): SerializedGeometryData => {
  const positionAttribute = geometry.getAttribute('position');
  if (!positionAttribute) {
    throw new Error('Geometry is missing position attribute');
  }

  const positions = Array.from((positionAttribute.array as ArrayLike<number>));

  const indexAttribute = geometry.getIndex();
  let indices: number[] | null = null;

  if (indexAttribute) {
    indices = Array.from(indexAttribute.array as ArrayLike<number>);
    console.log('[geometry] Extracted indexed geometry:', {
      vertexCount: positions.length / 3,
      indexCount: indices.length,
      triangleCount: indices.length / 3,
    });
  } else {
    console.log('[geometry] Extracted non-indexed geometry:', {
      vertexCount: positions.length / 3,
      triangleCount: positions.length / 9,
    });
  }

  return {
    positions,
    indices,
  };
};

export const createGeometryFromData = (data: SerializedGeometryData): THREE.BufferGeometry => {
  const geometry = new THREE.BufferGeometry();
  const positionArray = new Float32Array(data.positions);
  geometry.setAttribute('position', new THREE.BufferAttribute(positionArray, 3));

  if (data.indices && data.indices.length > 0) {
    const indexArray = new Uint32Array(data.indices);
    geometry.setIndex(new THREE.BufferAttribute(indexArray, 1));
    console.log('[geometry] Created indexed geometry:', {
      vertexCount: data.positions.length / 3,
      indexCount: data.indices.length,
      triangleCount: data.indices.length / 3,
    });
  } else {
    console.log('[geometry] Created non-indexed geometry:', {
      vertexCount: data.positions.length / 3,
      triangleCount: data.positions.length / 9,
    });
  }

  // Convert to non-indexed for consistent normals after boolean operations
  // This helps avoid shared vertex normal issues
  const nonIndexed = geometry.toNonIndexed();

  // Compute normals with flat shading (per-triangle normals)
  nonIndexed.computeVertexNormals();

  nonIndexed.computeBoundingBox();
  nonIndexed.computeBoundingSphere();

  // Clean up original geometry
  geometry.dispose();

  return nonIndexed;
};

