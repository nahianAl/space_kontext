/**
 * Snap Candidate Generator
 * Extracts snap points from CAD objects and wall meshes
 * Implements spatial culling for web performance
 */
'use client';

import * as THREE from 'three';
import type { SnapCandidate } from './snapping';
import type { CADObject } from '../store/cadToolsStore';

const MAX_CANDIDATES_PER_FRAME = 100; // Limit for performance
const SPATIAL_CULL_DISTANCE = 10; // Only check objects within 10m of cursor

/**
 * Extract all unique vertices (endpoints) from a BufferGeometry
 */
function extractVertices(geometry: THREE.BufferGeometry, objectId: string): SnapCandidate[] {
  const candidates: SnapCandidate[] = [];
  const positionAttribute = geometry.getAttribute('position');

  if (!positionAttribute) {
    return candidates;
  }

  // Use a Map to deduplicate vertices (same position = same endpoint)
  const uniqueVertices = new Map<string, THREE.Vector3>();

  for (let i = 0; i < positionAttribute.count; i++) {
    const vertex = new THREE.Vector3(
      positionAttribute.getX(i),
      positionAttribute.getY(i),
      positionAttribute.getZ(i)
    );

    // Round to avoid floating point duplicates
    const key = `${vertex.x.toFixed(4)},${vertex.y.toFixed(4)},${vertex.z.toFixed(4)}`;

    if (!uniqueVertices.has(key)) {
      uniqueVertices.set(key, vertex);
    }
  }

  // Convert unique vertices to snap candidates
  let vertexIndex = 0;
  uniqueVertices.forEach((vertex) => {
    candidates.push({
      id: `${objectId}-endpoint-${vertexIndex++}`,
      type: 'endpoint',
      position: vertex.clone(),
      objectId,
    });
  });

  return candidates;
}

/**
 * Extract edge midpoints from geometry indices
 */
function extractEdgeMidpoints(geometry: THREE.BufferGeometry, objectId: string): SnapCandidate[] {
  const candidates: SnapCandidate[] = [];
  const positionAttribute = geometry.getAttribute('position');
  const indexAttribute = geometry.getIndex();

  if (!positionAttribute || !indexAttribute) {
    return candidates;
  }

  // Use EdgesGeometry to get unique edges
  const edgesGeometry = new THREE.EdgesGeometry(geometry, 15); // 15 degree threshold
  const edgePositions = edgesGeometry.getAttribute('position');

  if (!edgePositions) {
    edgesGeometry.dispose();
    return candidates;
  }

  // Each pair of vertices forms an edge
  for (let i = 0; i < edgePositions.count; i += 2) {
    const v1 = new THREE.Vector3(
      edgePositions.getX(i),
      edgePositions.getY(i),
      edgePositions.getZ(i)
    );

    const v2 = new THREE.Vector3(
      edgePositions.getX(i + 1),
      edgePositions.getY(i + 1),
      edgePositions.getZ(i + 1)
    );

    // Calculate midpoint
    const midpoint = new THREE.Vector3().addVectors(v1, v2).multiplyScalar(0.5);

    candidates.push({
      id: `${objectId}-midpoint-${i / 2}`,
      type: 'midpoint',
      position: midpoint,
      objectId,
      edgeStart: v1,
      edgeEnd: v2,
    });
  }

  edgesGeometry.dispose();
  return candidates;
}

/**
 * Apply object's world transform to snap candidates
 */
function transformCandidates(
  candidates: SnapCandidate[],
  mesh: THREE.Mesh
): SnapCandidate[] {
  mesh.updateMatrixWorld(true);

  return candidates.map((candidate) => {
    const transformed: SnapCandidate = {
      ...candidate,
      position: candidate.position.clone().applyMatrix4(mesh.matrixWorld),
    };
    
    if (candidate.edgeStart) {
      transformed.edgeStart = candidate.edgeStart.clone().applyMatrix4(mesh.matrixWorld);
    }
    if (candidate.edgeEnd) {
      transformed.edgeEnd = candidate.edgeEnd.clone().applyMatrix4(mesh.matrixWorld);
    }
    
    return transformed;
  });
}

/**
 * Spatial culling - only include candidates near cursor position
 * Prevents performance issues when scene has many objects
 */
function cullByDistance(
  candidates: SnapCandidate[],
  cursorPosition: THREE.Vector3,
  maxDistance: number = SPATIAL_CULL_DISTANCE
): SnapCandidate[] {
  return candidates.filter((candidate) =>
    candidate.position.distanceTo(cursorPosition) <= maxDistance
  );
}

/**
 * Generate endpoint snap candidates from CAD objects
 */
export function generateEndpointCandidates(
  objects: CADObject[],
  cursorPosition?: THREE.Vector3
): SnapCandidate[] {
  const allCandidates: SnapCandidate[] = [];

  for (const obj of objects) {
    if (!obj.mesh || !obj.mesh.geometry) {
      continue;
    }

    // Extract vertices in local space
    const localCandidates = extractVertices(obj.mesh.geometry, obj.id);

    // Transform to world space
    const worldCandidates = transformCandidates(localCandidates, obj.mesh);

    allCandidates.push(...worldCandidates);
  }

  // Apply spatial culling if cursor position provided
  if (cursorPosition) {
    const culled = cullByDistance(allCandidates, cursorPosition);

    // Limit total candidates for performance
    return culled.slice(0, MAX_CANDIDATES_PER_FRAME);
  }

  return allCandidates.slice(0, MAX_CANDIDATES_PER_FRAME);
}

/**
 * Generate midpoint snap candidates from CAD objects
 */
export function generateMidpointCandidates(
  objects: CADObject[],
  cursorPosition?: THREE.Vector3
): SnapCandidate[] {
  const allCandidates: SnapCandidate[] = [];

  for (const obj of objects) {
    if (!obj.mesh || !obj.mesh.geometry) {
      continue;
    }

    // Extract midpoints in local space
    const localCandidates = extractEdgeMidpoints(obj.mesh.geometry, obj.id);

    // Transform to world space
    const worldCandidates = transformCandidates(localCandidates, obj.mesh);

    allCandidates.push(...worldCandidates);
  }

  // Apply spatial culling if cursor position provided
  if (cursorPosition) {
    const culled = cullByDistance(allCandidates, cursorPosition);

    // Limit total candidates for performance
    return culled.slice(0, MAX_CANDIDATES_PER_FRAME);
  }

  return allCandidates.slice(0, MAX_CANDIDATES_PER_FRAME);
}

/**
 * Generate edge candidates for on-edge snapping
 * Returns edge segments (start/end pairs) for proximity testing
 */
export function generateEdgeCandidates(
  objects: CADObject[],
  cursorPosition?: THREE.Vector3
): SnapCandidate[] {
  const allCandidates: SnapCandidate[] = [];

  for (const obj of objects) {
    if (!obj.mesh || !obj.mesh.geometry) {
      continue;
    }

    // Use EdgesGeometry to get unique edges
    const edgesGeometry = new THREE.EdgesGeometry(obj.mesh.geometry, 15);
    const edgePositions = edgesGeometry.getAttribute('position');

    if (!edgePositions) {
      edgesGeometry.dispose();
      continue;
    }

    // Transform edges to world space
    obj.mesh.updateMatrixWorld(true);

    // Each pair of vertices forms an edge
    for (let i = 0; i < edgePositions.count; i += 2) {
      const v1 = new THREE.Vector3(
        edgePositions.getX(i),
        edgePositions.getY(i),
        edgePositions.getZ(i)
      ).applyMatrix4(obj.mesh.matrixWorld);

      const v2 = new THREE.Vector3(
        edgePositions.getX(i + 1),
        edgePositions.getY(i + 1),
        edgePositions.getZ(i + 1)
      ).applyMatrix4(obj.mesh.matrixWorld);

      // Calculate midpoint for spatial culling
      const midpoint = new THREE.Vector3().addVectors(v1, v2).multiplyScalar(0.5);

      // Skip if cursor position provided and edge is too far
      if (cursorPosition && midpoint.distanceTo(cursorPosition) > SPATIAL_CULL_DISTANCE) {
        continue;
      }

      allCandidates.push({
        id: `${obj.id}-edge-${i / 2}`,
        type: 'edge',
        position: midpoint, // Store midpoint as position for initial filtering
        objectId: obj.id,
        edgeStart: v1,
        edgeEnd: v2,
      });
    }

    edgesGeometry.dispose();
  }

  return allCandidates.slice(0, MAX_CANDIDATES_PER_FRAME);
}

/**
 * Find closest point on an edge to the cursor
 * Used for on-edge snapping
 */
export function findClosestPointOnEdge(
  cursorPosition: THREE.Vector3,
  edgeStart: THREE.Vector3,
  edgeEnd: THREE.Vector3
): THREE.Vector3 {
  const edge = new THREE.Vector3().subVectors(edgeEnd, edgeStart);
  const cursorToStart = new THREE.Vector3().subVectors(cursorPosition, edgeStart);

  const edgeLengthSq = edge.lengthSq();
  if (edgeLengthSq === 0) {
    return edgeStart.clone();
  }

  // Project cursor onto edge line
  const t = Math.max(0, Math.min(1, cursorToStart.dot(edge) / edgeLengthSq));

  // Return point on edge
  return edgeStart.clone().add(edge.multiplyScalar(t));
}

/**
 * Generate all snap candidates from CAD objects and walls
 * Combines endpoints, midpoints, and edges with spatial culling
 */
export function generateAllSnapCandidates(
  cadObjects: CADObject[],
  wallMeshes: THREE.Mesh[],
  cursorPosition?: THREE.Vector3
): SnapCandidate[] {
  const candidates: SnapCandidate[] = [];

  // Generate from CAD objects
  const cadEndpoints = generateEndpointCandidates(cadObjects, cursorPosition);
  const cadMidpoints = generateMidpointCandidates(cadObjects, cursorPosition);
  const cadEdges = generateEdgeCandidates(cadObjects, cursorPosition);

  candidates.push(...cadEndpoints, ...cadMidpoints, ...cadEdges);

  // Generate from wall meshes
  const wallObjects: CADObject[] = wallMeshes.map((mesh, index) => ({
    id: `wall-${mesh.userData?.wallId || index}`,
    type: 'plane' as const,
    mesh,
    position: [0, 0, 0] as [number, number, number],
    rotation: [0, 0, 0] as [number, number, number],
    scale: [1, 1, 1] as [number, number, number],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  }));

  const wallEndpoints = generateEndpointCandidates(wallObjects, cursorPosition);
  const wallMidpoints = generateMidpointCandidates(wallObjects, cursorPosition);
  const wallEdges = generateEdgeCandidates(wallObjects, cursorPosition);

  candidates.push(...wallEndpoints, ...wallMidpoints, ...wallEdges);

  // Final limit for performance
  return candidates.slice(0, MAX_CANDIDATES_PER_FRAME);
}

/**
 * Extract edge data from snap candidates for inference detection
 */
export function extractEdgesForInference(
  candidates: SnapCandidate[]
): Array<{ start: THREE.Vector3; end: THREE.Vector3; objectId: string }> {
  const edges: Array<{ start: THREE.Vector3; end: THREE.Vector3; objectId: string }> = [];

  for (const candidate of candidates) {
    if (!candidate.objectId) {
      continue;
    }
    
    if (candidate.type === 'edge' && candidate.edgeStart && candidate.edgeEnd) {
      edges.push({
        start: candidate.edgeStart,
        end: candidate.edgeEnd,
        objectId: candidate.objectId,
      });
    } else if (candidate.type === 'midpoint' && candidate.edgeStart && candidate.edgeEnd) {
      edges.push({
        start: candidate.edgeStart,
        end: candidate.edgeEnd,
        objectId: candidate.objectId,
      });
    }
  }

  return edges;
}
