/**
 * 2D polygon utilities for boolean region selection
 * Uses point-in-polygon testing for clean region detection on ground plane
 */

import * as THREE from 'three';

/**
 * Test if a 2D point is inside a polygon using ray casting algorithm
 * @param point - Point to test (x, z coordinates)
 * @param polygon - Array of polygon vertices (x, z coordinates)
 * @returns true if point is inside polygon
 */
export function isPointInPolygon(
  point: { x: number; z: number },
  polygon: { x: number; z: number }[]
): boolean {
  if (polygon.length < 3) {
    return false;
  }

  let inside = false;
  const x = point.x;
  const z = point.z;

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const pointI = polygon[i];
    const pointJ = polygon[j];
    if (!pointI || !pointJ) {
      continue;
    }

    const xi = pointI.x;
    const zi = pointI.z;
    const xj = pointJ.x;
    const zj = pointJ.z;

    const intersect =
      zi > z !== zj > z && x < ((xj - xi) * (z - zi)) / (zj - zi) + xi;

    if (intersect) {
      inside = !inside;
    }
  }

  return inside;
}

/**
 * Extract 2D polygon from a 3D mesh at Y=0 plane
 * Projects all vertices to XZ plane and returns unique edge vertices
 * @param mesh - 3D mesh to extract polygon from
 * @returns Array of 2D points representing the polygon outline
 */
export function extract2DPolygonFromMesh(
  mesh: THREE.Mesh
): { x: number; z: number }[] {
  const geometry = mesh.geometry;
  if (!geometry || !geometry.attributes.position) {
    console.warn('[extract2DPolygon] Invalid geometry');
    return [];
  }

  const positions = geometry.attributes.position;
  const points: { x: number; z: number }[] = [];
  const pointSet = new Set<string>();

  // Extract all unique XZ coordinates
  for (let i = 0; i < positions.count; i++) {
    const vertex = new THREE.Vector3(
      positions.getX(i),
      positions.getY(i),
      positions.getZ(i)
    );

    // Transform to world space
    vertex.applyMatrix4(mesh.matrixWorld);

    // Project to XZ plane (ignore Y)
    const key = `${vertex.x.toFixed(6)},${vertex.z.toFixed(6)}`;
    if (!pointSet.has(key)) {
      pointSet.add(key);
      points.push({ x: vertex.x, z: vertex.z });
    }
  }

  // For ground plane shapes, we need the convex hull or boundary
  // For now, return all unique points (works for simple shapes)
  console.log('[extract2DPolygon] Extracted', points.length, 'unique 2D points');
  return points;
}

/**
 * Compute convex hull of 2D points using Graham scan
 * @param points - Array of 2D points
 * @returns Array of points forming the convex hull (counter-clockwise)
 */
export function computeConvexHull(
  points: { x: number; z: number }[]
): { x: number; z: number }[] {
  if (points.length < 3) {
    return points;
  }

  // Find the point with the lowest z-coordinate (and leftmost if tie)
  const firstPoint = points[0];
  if (!firstPoint) {
    return points;
  }

  let start = firstPoint;
  let startIndex = 0;
  for (let i = 1; i < points.length; i++) {
    const point = points[i];
    if (!point) {
      continue;
    }
    if (
      point.z < start.z ||
      (point.z === start.z && point.x < start.x)
    ) {
      start = point;
      startIndex = i;
    }
  }

  // Sort points by polar angle with respect to start point
  const sorted = [...points];
  const startPoint = start;
  sorted.sort((a, b) => {
    if (a === startPoint) {
      return -1;
    }
    if (b === startPoint) {
      return 1;
    }

    const angleA = Math.atan2(a.z - startPoint.z, a.x - startPoint.x);
    const angleB = Math.atan2(b.z - startPoint.z, b.x - startPoint.x);

    if (angleA !== angleB) {
      return angleA - angleB;
    }

    // If same angle, closer point comes first
    const distA =
      (a.x - startPoint.x) ** 2 + (a.z - startPoint.z) ** 2;
    const distB =
      (b.x - startPoint.x) ** 2 + (b.z - startPoint.z) ** 2;
    return distA - distB;
  });

  // Build convex hull
  const hull: { x: number; z: number }[] = [];

  for (const point of sorted) {
    // Remove points that make a clockwise turn
    while (hull.length >= 2) {
      const last = hull[hull.length - 1];
      const secondLast = hull[hull.length - 2];
      if (!last || !secondLast) {
        break;
      }

      const cross =
        (last.x - secondLast.x) * (point.z - secondLast.z) -
        (last.z - secondLast.z) * (point.x - secondLast.x);

      if (cross <= 0) {
        hull.pop();
      } else {
        break;
      }
    }
    hull.push(point);
  }

  return hull;
}

/**
 * Test if a 2D point is inside a mesh's 2D projection
 * Uses convex hull for faster testing
 * @param point - Point to test (x, z)
 * @param mesh - Mesh to test against
 * @returns true if point is inside mesh's 2D projection
 */
export function isPointInMesh2D(
  point: { x: number; z: number },
  mesh: THREE.Mesh
): boolean {
  const points = extract2DPolygonFromMesh(mesh);
  if (points.length === 0) {
    return false;
  }

  const hull = computeConvexHull(points);
  return isPointInPolygon(point, hull);
}
