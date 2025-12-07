/**
 * T-junction geometry utilities for handling multi-way junction miters
 * Provides functions to calculate proper miters for T-junctions, cross junctions, and star junctions
 */

import type { WallEdge, Point, WallGraph } from '../types/wallGraph';

export interface FaceAlignmentResult {
  offset: number;
  alignment: 'center' | 'inner-face' | 'outer-face';
}

export interface JunctionMiterResult {
  point1: Point; // First edge point (one side of wall)
  point2: Point; // Second edge point (other side of wall)
}

/**
 * Calculate face alignment for different wall thicknesses
 */
export function calculateFaceAlignment(
  stemWall: WallEdge,
  crossbarWall: WallEdge,
  alignmentMode: 'center' | 'inner-face' | 'outer-face' = 'center'
): FaceAlignmentResult {
  const thicknessDiff = Math.abs(stemWall.thickness - crossbarWall.thickness);

  if (thicknessDiff < 0.01) {
    // Same thickness - simple center alignment
    return { offset: 0, alignment: 'center' };
  }

  // Different thicknesses - calculate offset based on mode
  switch (alignmentMode) {
    case 'inner-face':
      // Align interior faces (common for internal walls)
      return {
        offset: (crossbarWall.thickness - stemWall.thickness) / 2,
        alignment: 'inner-face'
      };

    case 'outer-face':
      // Align exterior faces (less common)
      return {
        offset: (stemWall.thickness - crossbarWall.thickness) / 2,
        alignment: 'outer-face'
      };

    case 'center':
    default:
      // Center-to-center alignment (default CAD behavior)
      return { offset: 0, alignment: 'center' };
  }
}

/**
 * Normalize angle to 0-2π range
 */
function normalizeAngle(angle: number): number {
  while (angle < 0) {
    angle += 2 * Math.PI;
  }
  while (angle >= 2 * Math.PI) {
    angle -= 2 * Math.PI;
  }
  return angle;
}

/**
 * Calculate the angle of a wall from a specific point
 * Returns the angle pointing AWAY from the point
 */
function getWallAngleFromPoint(wall: WallEdge, point: Point, graph: WallGraph): number {
  const startNode = graph.nodes[wall.startNodeId];
  const endNode = graph.nodes[wall.endNodeId];

  if (!startNode || !endNode) {
    return 0;
  }

  // Check which end is at the point
  const startDist = Math.hypot(
    point[0] - startNode.position[0],
    point[1] - startNode.position[1]
  );
  const endDist = Math.hypot(
    point[0] - endNode.position[0],
    point[1] - endNode.position[1]
  );

  // Return angle pointing away from the point
  if (startDist < endDist) {
    // Point is at start, angle points toward end
    return wall.angle;
  } else {
    // Point is at end, angle points away (reverse direction)
    return normalizeAngle(wall.angle + Math.PI);
  }
}

/**
 * Calculate T-junction miter points for a specific wall at a junction
 * Handles 3-way intersections properly
 */
export function calculateTJunctionMiter(
  junctionPoint: Point,
  currentWall: WallEdge,
  allWallsAtJunction: WallEdge[],
  graph: WallGraph
): JunctionMiterResult {
  console.log(`[T-JUNCTION] Calculating miter for wall ${currentWall.id} at point [${junctionPoint[0].toFixed(1)}, ${junctionPoint[1].toFixed(1)}]`);
  console.log(`[T-JUNCTION] All walls at junction: ${allWallsAtJunction.map(w => w.id).join(', ')}`);

  const offset = currentWall.thickness / 2;

  // Get angles of all walls at this junction (pointing away from junction)
  const wallAngles = allWallsAtJunction.map(wall => ({
    wall,
    angle: getWallAngleFromPoint(wall, junctionPoint, graph)
  }));

  console.log(`[T-JUNCTION] Wall angles (degrees): ${wallAngles.map(wa => `${wa.wall.id}=${(wa.angle * 180 / Math.PI).toFixed(1)}°`).join(', ')}`);

  // Sort by angle
  wallAngles.sort((a, b) => a.angle - b.angle);

  console.log(`[T-JUNCTION] Sorted angles (degrees): ${wallAngles.map(wa => `${wa.wall.id}=${(wa.angle * 180 / Math.PI).toFixed(1)}°`).join(', ')}`);

  // Find current wall in sorted list
  const currentIndex = wallAngles.findIndex(wa => wa.wall.id === currentWall.id);
  if (currentIndex === -1) {
    console.log(`[T-JUNCTION] WARNING: Current wall not found in sorted list! Using fallback.`);
    // Fallback to simple perpendicular offset
    const dx = Math.cos(currentWall.angle);
    const dy = Math.sin(currentWall.angle);
    const perpX = -dy;
    const perpY = dx;
    return {
      point1: [junctionPoint[0] + perpX * offset, junctionPoint[1] + perpY * offset],
      point2: [junctionPoint[0] - perpX * offset, junctionPoint[1] - perpY * offset]
    };
  }

  const currentAngle = wallAngles[currentIndex]!.angle;

  // Find adjacent walls (cyclically)
  const prevIndex = (currentIndex - 1 + wallAngles.length) % wallAngles.length;
  const nextIndex = (currentIndex + 1) % wallAngles.length;

  const prevAngle = wallAngles[prevIndex]!.angle;
  const nextAngle = wallAngles[nextIndex]!.angle;

  console.log(`[T-JUNCTION] Current wall index: ${currentIndex}, prev: ${prevIndex}, next: ${nextIndex}`);
  console.log(`[T-JUNCTION] Adjacent angles: prev=${(prevAngle * 180 / Math.PI).toFixed(1)}°, current=${(currentAngle * 180 / Math.PI).toFixed(1)}°, next=${(nextAngle * 180 / Math.PI).toFixed(1)}°`);

  // Calculate bisector angles
  // For the "left" side (point1), bisect with previous wall
  const leftBisector = calculateBisector(prevAngle, currentAngle);

  // For the "right" side (point2), bisect with next wall
  const rightBisector = calculateBisector(currentAngle, nextAngle);

  console.log(`[T-JUNCTION] Bisector angles: left=${(leftBisector * 180 / Math.PI).toFixed(1)}°, right=${(rightBisector * 180 / Math.PI).toFixed(1)}°`);

  // Calculate miter lengths (prevent extreme miters)
  const leftMiterLength = calculateSafeMiterLength(offset, prevAngle, currentAngle);
  const rightMiterLength = calculateSafeMiterLength(offset, currentAngle, nextAngle);

  console.log(`[T-JUNCTION] Miter lengths: left=${leftMiterLength.toFixed(2)}, right=${rightMiterLength.toFixed(2)}, offset=${offset.toFixed(2)}`);

  // Calculate miter points
  const point1: Point = [
    junctionPoint[0] + Math.cos(leftBisector) * leftMiterLength,
    junctionPoint[1] + Math.sin(leftBisector) * leftMiterLength
  ];

  const point2: Point = [
    junctionPoint[0] + Math.cos(rightBisector) * rightMiterLength,
    junctionPoint[1] + Math.sin(rightBisector) * rightMiterLength
  ];

  console.log(`[T-JUNCTION] Final miter points: point1=[${point1[0].toFixed(1)}, ${point1[1].toFixed(1)}], point2=[${point2[0].toFixed(1)}, ${point2[1].toFixed(1)}]`);

  return { point1, point2 };
}

/**
 * Calculate the bisector angle between two angles
 */
function calculateBisector(angle1: number, angle2: number): number {
  // Normalize angles
  const a1 = normalizeAngle(angle1);
  const a2 = normalizeAngle(angle2);

  // Calculate difference
  let diff = a2 - a1;

  // Handle wrap-around
  if (diff > Math.PI) {
    diff -= 2 * Math.PI;
  } else if (diff < -Math.PI) {
    diff += 2 * Math.PI;
  }

  // Bisector is perpendicular to the angle between them
  const bisectorAngle = a1 + diff / 2 + Math.PI / 2;

  return normalizeAngle(bisectorAngle);
}

/**
 * Calculate safe miter length to prevent extreme miters
 */
function calculateSafeMiterLength(
  offset: number,
  angle1: number,
  angle2: number
): number {
  // Calculate angle between walls
  let angleDiff = angle2 - angle1;

  // Normalize to -π to π
  while (angleDiff > Math.PI) {
    angleDiff -= 2 * Math.PI;
  }
  while (angleDiff < -Math.PI) {
    angleDiff += 2 * Math.PI;
  }

  const halfAngle = Math.abs(angleDiff) / 2;

  // For very sharp angles, limit miter length
  const maxMiterLength = offset * 3; // Max 3x the offset

  if (halfAngle < 0.1) {
    // Near-parallel, use offset directly
    return offset;
  }

  // Calculate miter length using sine formula
  const miterLength = offset / Math.sin(halfAngle);

  // Clamp to reasonable bounds
  return Math.min(Math.abs(miterLength), maxMiterLength);
}

/**
 * Check if a point is at the start or end of a wall
 */
export function isPointAtWallStart(wall: WallEdge, point: Point, graph: WallGraph, tolerance = 1): boolean {
  const startNode = graph.nodes[wall.startNodeId];
  if (!startNode) {
    return false;
  }

  const dist = Math.hypot(
    point[0] - startNode.position[0],
    point[1] - startNode.position[1]
  );

  return dist <= tolerance;
}

/**
 * Check if a point is at the end of a wall
 */
export function isPointAtWallEnd(wall: WallEdge, point: Point, graph: WallGraph, tolerance = 1): boolean {
  const endNode = graph.nodes[wall.endNodeId];
  if (!endNode) {
    return false;
  }

  const dist = Math.hypot(
    point[0] - endNode.position[0],
    point[1] - endNode.position[1]
  );

  return dist <= tolerance;
}
