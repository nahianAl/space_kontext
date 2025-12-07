/**
 * Geometric utility functions for canvas operations
 * Provides distance calculations, point-on-line projections, line intersections, and angle calculations
 * Used for hit testing, snapping, and geometric transformations
 */

import { Point } from '../types/wallGraph';

/**
 * Calculate distance between two points
 */
export const distance = (p1: [number, number], p2: [number, number]): number => {
  if (!p1 || !p2 || !Array.isArray(p1) || !Array.isArray(p2)) {
    console.warn('Invalid points passed to distance function:', { p1, p2 });
    return Infinity;
  }
  
  const x1 = p1[0];
  const y1 = p1[1];
  const x2 = p2[0];
  const y2 = p2[1];
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
};

/**
 * Calculate distance from a point to a line segment
 */
export const distanceToLineSegment = (point: [number, number], start: [number, number], end: [number, number]): number => {
  const px = point[0];
  const py = point[1];
  const x1 = start[0];
  const y1 = start[1];
  const x2 = end[0];
  const y2 = end[1];
  
  const A = px - x1;
  const B = py - y1;
  const C = x2 - x1;
  const D = y2 - y1;
  
  const dot = A * C + B * D;
  const lenSq = C * C + D * D;
  
  if (lenSq === 0) {
    return Math.sqrt(A * A + B * B);
  }
  
  let param = dot / lenSq;
  param = Math.max(0, Math.min(1, param));
  
  const xx = x1 + param * C;
  const yy = y1 + param * D;
  
  const dx = px - xx;
  const dy = py - yy;
  
  return Math.sqrt(dx * dx + dy * dy);
};

/**
 * Check if two line segments intersect
 */
export const lineIntersectsLine = (
  x1: number, y1: number, x2: number, y2: number,
  x3: number, y3: number, x4: number, y4: number
): boolean => {
  const denom = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
  if (Math.abs(denom) < 1e-10) {
    return false; // Parallel lines
  }
  
  const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denom;
  const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / denom;
  
  return t >= 0 && t <= 1 && u >= 0 && u <= 1;
};

/**
 * Check if a line segment intersects with a rectangle
 */
export const lineIntersectsRectangle = (
  start: [number, number], 
  end: [number, number], 
  minX: number, 
  minY: number, 
  maxX: number, 
  maxY: number
): boolean => {
  const x1 = start[0];
  const y1 = start[1];
  const x2 = end[0];
  const y2 = end[1];
  
  // Check if both points are outside the rectangle on the same side
  if ((x1 < minX && x2 < minX) || (x1 > maxX && x2 > maxX) || 
      (y1 < minY && y2 < minY) || (y1 > maxY && y2 > maxY)) {
    return false;
  }
  
  // Check if line intersects any of the rectangle edges
  return lineIntersectsLine(x1, y1, x2, y2, minX, minY, maxX, minY) || // top
         lineIntersectsLine(x1, y1, x2, y2, maxX, minY, maxX, maxY) || // right
         lineIntersectsLine(x1, y1, x2, y2, maxX, maxY, minX, maxY) || // bottom
         lineIntersectsLine(x1, y1, x2, y2, minX, maxY, minX, minY) || // left
         (x1 >= minX && x1 <= maxX && y1 >= minY && y1 <= maxY) || // start point inside
         (x2 >= minX && x2 <= maxX && y2 >= minY && y2 <= maxY); // end point inside
};

export function findClosestPointOnLine(p1: Point, p2: Point, p: Point) {
  const dx = p2[0] - p1[0];
  const dy = p2[1] - p1[1];
  if (dx === 0 && dy === 0) {
    // It's a point not a line.
    const dist = Math.hypot(p[0] - p1[0], p[1] - p1[1]);
    return { point: p1, distance: dist, t: 0 };
  }
  
  const t = ((p[0] - p1[0]) * dx + (p[1] - p1[1]) * dy) / (dx * dx + dy * dy);
  
  let closestPoint: Point;
  if (t < 0) {
    closestPoint = p1;
  } else if (t > 1) {
    closestPoint = p2;
  } else {
    closestPoint = [p1[0] + t * dx, p1[1] + t * dy];
  }
  
  const distance = Math.hypot(p[0] - closestPoint[0], p[1] - closestPoint[1]);
  return { point: closestPoint, distance, t };
}
