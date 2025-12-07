/**
 * Wall splitting utilities for handling T-junction intersections
 * Provides functions to detect, calculate, and execute wall splits
 */

import type { Point, WallGraph, WallEdge, Opening } from '../types/wallGraph';
import { distance, findClosestPointOnLine } from './geometryUtils';
import { metersToPixels } from '@/lib/units/unitsSystem';

/**
 * Calculate intersection point between two infinite lines
 * Returns null if lines are parallel
 */
function lineIntersection(
  line1Start: Point,
  line1End: Point,
  line2Start: Point,
  line2End: Point
): Point | null {
  const [x1, y1] = line1Start;
  const [x2, y2] = line1End;
  const [x3, y3] = line2Start;
  const [x4, y4] = line2End;

  const denominator = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);

  // Lines are parallel
  if (Math.abs(denominator) < 0.0001) {
    return null;
  }

  const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denominator;

  // Calculate intersection point
  const x = x1 + t * (x2 - x1);
  const y = y1 + t * (y2 - y1);

  return [x, y];
}

/**
 * Find where a new wall's extended centerline intersects an old wall's centerline
 * Used for edge face snapping - the new wall ends at the edge face, but we want to
 * split the old wall where the new wall's centerline (extended) crosses it
 */
export function findExtendedCenterlineIntersection(
  newWallStart: Point,
  newWallEnd: Point,
  oldWallId: string,
  graph: WallGraph
): Point | null {
  console.log('[INTERSECTION] Finding extended centerline intersection');
  console.log('[INTERSECTION] New wall:', newWallStart, '->', newWallEnd);
  console.log('[INTERSECTION] Old wall ID:', oldWallId);

  const wall = graph.edges[oldWallId];
  if (!wall) {
    console.log('[INTERSECTION] Wall not found in graph');
    return null;
  }

  const startNode = graph.nodes[wall.startNodeId];
  const endNode = graph.nodes[wall.endNodeId];
  if (!startNode || !endNode) {
    console.log('[INTERSECTION] Wall nodes not found');
    return null;
  }

  const oldWallStart = startNode.position;
  const oldWallEnd = endNode.position;
  console.log('[INTERSECTION] Old wall positions:', oldWallStart, '->', oldWallEnd);

  // Calculate intersection of infinite lines
  const intersection = lineIntersection(
    newWallStart,
    newWallEnd,
    oldWallStart,
    oldWallEnd
  );

  if (!intersection) {
    console.log('[INTERSECTION] Lines are parallel - no intersection');
    return null;
  }

  console.log('[INTERSECTION] Intersection found at:', intersection);

  // Check if intersection is actually on the old wall segment
  const oldWallLength = distance(oldWallStart, oldWallEnd);
  const distToIntersection = distance(oldWallStart, intersection);
  const distFromIntersection = distance(intersection, oldWallEnd);

  console.log('[INTERSECTION] Old wall length:', oldWallLength);
  console.log('[INTERSECTION] Distance to intersection from start:', distToIntersection);
  console.log('[INTERSECTION] Distance from intersection to end:', distFromIntersection);
  console.log('[INTERSECTION] Sum of distances:', distToIntersection + distFromIntersection);

  // Intersection must be between start and end (with small tolerance for floating point)
  const tolerance = 0.1;
  if (
    distToIntersection < -tolerance ||
    distFromIntersection < -tolerance ||
    Math.abs(distToIntersection + distFromIntersection - oldWallLength) > tolerance
  ) {
    console.log('[INTERSECTION] Intersection is outside the old wall segment - rejecting');
    return null;
  }

  console.log('[INTERSECTION] Valid intersection found!');
  return intersection;
}

// Configuration
export const SPLIT_SNAP_TOLERANCE = 10; // pixels
export const MIN_SEGMENT_LENGTH = 6; // pixels (0.5 inches)

export interface WallIntersection {
  wallId: string;
  intersectionPoint: Point;
  distanceFromStart: number;
  isNearEndpoint: boolean;
}

export interface SplitWallResult {
  newNodeId: string;
  wall1: WallEdge;
  wall2: WallEdge;
  originalWallId: string;
}

/**
 * Detect if a point is near a wall's edge (not endpoints)
 * Returns intersection info if within tolerance
 */
export function detectWallEdgeIntersection(
  point: Point,
  wallId: string,
  graph: WallGraph,
  tolerance: number = SPLIT_SNAP_TOLERANCE
): WallIntersection | null {
  const wall = graph.edges[wallId];
  if (!wall) return null;

  const startNode = graph.nodes[wall.startNodeId];
  const endNode = graph.nodes[wall.endNodeId];
  if (!startNode || !endNode) return null;

  const wallStart = startNode.position;
  const wallEnd = endNode.position;

  // Calculate closest point on wall centerline
  const closest = findClosestPointOnLine(wallStart, wallEnd, point);

  // Check if within tolerance
  if (closest.distance > tolerance) {
    return null;
  }

  // Calculate distance from start
  const distanceFromStart = distance(wallStart, closest.point);
  const distanceFromEnd = distance(closest.point, wallEnd);

  // Check if too close to endpoints (would create tiny segments)
  const isNearStart = distanceFromStart < MIN_SEGMENT_LENGTH;
  const isNearEnd = distanceFromEnd < MIN_SEGMENT_LENGTH;

  if (isNearStart || isNearEnd) {
    return {
      wallId,
      intersectionPoint: isNearStart ? wallStart : wallEnd,
      distanceFromStart: isNearStart ? 0 : wall.length,
      isNearEndpoint: true
    };
  }

  return {
    wallId,
    intersectionPoint: closest.point,
    distanceFromStart,
    isNearEndpoint: false
  };
}

/**
 * Find all walls that the point intersects (excluding walls sharing nodes)
 */
export function findIntersectingWalls(
  point: Point,
  graph: WallGraph,
  excludeWallIds: string[] = [],
  tolerance: number = SPLIT_SNAP_TOLERANCE
): WallIntersection[] {
  const intersections: WallIntersection[] = [];

  Object.keys(graph.edges).forEach(wallId => {
    if (excludeWallIds.includes(wallId)) return;

    const intersection = detectWallEdgeIntersection(point, wallId, graph, tolerance);
    if (intersection && !intersection.isNearEndpoint) {
      intersections.push(intersection);
    }
  });

  return intersections;
}

/**
 * Calculate new wall properties after split
 */
function calculateSplitWallProperties(
  originalWall: WallEdge,
  newLength: number,
  startNode: Point,
  endNode: Point
): Partial<WallEdge> {
  const dx = endNode[0] - startNode[0];
  const dy = endNode[1] - startNode[1];
  const angle = Math.atan2(dy, dx);

  return {
    length: newLength,
    angle,
    centerline: [startNode, endNode] as [Point, Point]
  };
}

/**
 * Update opening 2D position based on new wall segment
 */
function updateOpening2DPosition(
  opening: Opening,
  wall: WallEdge,
  newPosition: number,
  graph: WallGraph
): Opening {
  const startNode = graph.nodes[wall.startNodeId];
  if (!startNode) return opening;

  const directionX = Math.cos(wall.angle);
  const directionY = Math.sin(wall.angle);
  const normalX = -Math.sin(wall.angle);
  const normalY = Math.cos(wall.angle);

  const alignment = opening.alignment ?? 'center';
  // wall.thickness is in METERS, convert to pixels for calculations
  const wallThicknessPixels = metersToPixels(wall.thickness);
  const alignmentOffset =
    alignment === 'inner' ? wallThicknessPixels / 2 :
    alignment === 'outer' ? -wallThicknessPixels / 2 : 0;

  // newPosition is in METERS, convert to pixels
  const newPositionPixels = metersToPixels(newPosition);
  const center2D: Point = [
    startNode.position[0] + directionX * newPositionPixels + normalX * alignmentOffset,
    startNode.position[1] + directionY * newPosition + normalY * alignmentOffset
  ];

  // Omit center3D to reset it (don't set to undefined with exactOptionalPropertyTypes)
  const { center3D, ...openingWithout3D } = opening;
  return {
    ...openingWithout3D,
    position: newPosition,
    center2D,
    angle: wall.angle,
    wallId: wall.id,
    // center3D will be recalculated when 3D view is regenerated
  };
}

/**
 * Redistribute openings to the correct wall segment after split
 */
function redistributeOpenings(
  originalWall: WallEdge,
  splitPoint: number, // distance from start where split occurs
  wall1Length: number,
  wall2Length: number,
  wall1: WallEdge,
  wall2: WallEdge,
  graph: WallGraph
): { wall1Openings: Opening[]; wall2Openings: Opening[] } {
  const wall1Openings: Opening[] = [];
  const wall2Openings: Opening[] = [];

  (originalWall.openings || []).forEach(opening => {
    if (opening.position <= splitPoint) {
      // Opening stays on first segment - update position if needed
      const updatedOpening = updateOpening2DPosition(opening, wall1, opening.position, graph);
      wall1Openings.push(updatedOpening);
    } else {
      // Opening moves to second segment, adjust position
      const newPosition = opening.position - splitPoint;
      const updatedOpening = updateOpening2DPosition(opening, wall2, newPosition, graph);
      wall2Openings.push(updatedOpening);
    }
  });

  return { wall1Openings, wall2Openings };
}

/**
 * Validate that split would not create invalid geometry
 */
export function validateSplitPoint(
  wall: WallEdge,
  splitDistance: number,
  minLength: number = MIN_SEGMENT_LENGTH
): { valid: boolean; reason?: string } {
  if (splitDistance < minLength) {
    return {
      valid: false,
      reason: `Split point too close to start (${splitDistance.toFixed(2)}px < ${minLength}px)`
    };
  }

  const remainingDistance = wall.length - splitDistance;
  if (remainingDistance < minLength) {
    return {
      valid: false,
      reason: `Split point too close to end (${remainingDistance.toFixed(2)}px < ${minLength}px)`
    };
  }

  return { valid: true };
}

/**
 * Split a wall at a specific point
 * Returns new node ID and two new wall segments
 */
export function splitWallAtPoint(
  wallId: string,
  intersectionPoint: Point,
  graph: WallGraph,
  generateNodeId: () => string,
  generateWallId: () => string
): SplitWallResult | null {
  const wall = graph.edges[wallId];
  if (!wall) return null;

  const startNode = graph.nodes[wall.startNodeId];
  const endNode = graph.nodes[wall.endNodeId];
  if (!startNode || !endNode) return null;

  const wallStart = startNode.position;
  const wallEnd = endNode.position;

  // Calculate split distances
  const distanceToSplit = distance(wallStart, intersectionPoint);
  const remainingDistance = distance(intersectionPoint, wallEnd);

  // Validate split would create valid segments
  const validation = validateSplitPoint(wall, distanceToSplit);
  if (!validation.valid) {
    console.warn('Split validation failed:', validation.reason);
    return null;
  }

  // Create new node at intersection
  const newNodeId = generateNodeId();

  // Calculate properties for first segment (start -> intersection)
  const wall1Props = calculateSplitWallProperties(
    wall,
    distanceToSplit,
    wallStart,
    intersectionPoint
  );

  // Calculate properties for second segment (intersection -> end)
  const wall2Props = calculateSplitWallProperties(
    wall,
    remainingDistance,
    intersectionPoint,
    wallEnd
  );

  // Create wall segments (temporarily without openings)
  const wall1: WallEdge = {
    ...wall,
    ...wall1Props,
    endNodeId: newNodeId,
    openings: []
  };

  const wall2: WallEdge = {
    ...wall,
    ...wall2Props,
    id: generateWallId(),
    startNodeId: newNodeId,
    openings: []
  };

  // Redistribute openings with updated positions
  const { wall1Openings, wall2Openings } = redistributeOpenings(
    wall,
    distanceToSplit,
    distanceToSplit,
    remainingDistance,
    wall1,
    wall2,
    graph
  );

  // Update wall segments with openings
  wall1.openings = wall1Openings;
  wall2.openings = wall2Openings;

  return {
    newNodeId,
    wall1,
    wall2,
    originalWallId: wallId
  };
}

