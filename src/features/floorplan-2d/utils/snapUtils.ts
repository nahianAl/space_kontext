/**
 * Snapping utilities for grid, wall, and node snapping
 * Provides functions for finding snap points based on snap options
 * Calculates closest snap targets and returns snap results with distance information
 */

import { Point } from '../types/wallGraph';
import { distance } from './geometryUtils';
import { metersToPixels } from '@/lib/units/unitsSystem';

export interface SnapOptions {
  snapToGrid: boolean;
  snapToWalls: boolean;
  snapToNodes: boolean;
  snapToAngles: boolean;
  gridSize: number;
  snapTolerance: number;
}

export interface SnapResult {
  point: Point;
  snapped: boolean;
  snapType?: 'grid' | 'wall' | 'node' | 'wall-edge';
  snapTarget?: Point;
  wallEdgeInfo?: {
    wallId: string;
    edgeFacePoint: Point;
    edge: 'left' | 'right';
  };
}

/**
 * Snap a point to the nearest grid intersection
 */
export function snapPointToGrid(point: Point, gridSize: number): Point {
  const [x, y] = point;
  return [
    Math.round(x / gridSize) * gridSize,
    Math.round(y / gridSize) * gridSize
  ];
}

/**
 * Snap to wall edge faces (for T-junction visual alignment)
 * Determines which edge (left/right) based on drag direction from start point
 */
export function snapToWallEdge(
  point: Point,
  startPoint: Point,
  graph: any,
  tolerance: number
): { point: Point; wallId: string; edgeFacePoint: Point; edge: 'left' | 'right' } | null {
  console.log('[EDGE-SNAP] snapToWallEdge called');
  console.log('[EDGE-SNAP] Point:', point, 'Start:', startPoint, 'Tolerance:', tolerance);

  if (!graph || !graph.edges) {
    console.log('[EDGE-SNAP] No graph or edges');
    return null;
  }

  let closestSnap: { point: Point; wallId: string; edgeFacePoint: Point; edge: 'left' | 'right' } | null = null;
  let minDistance = tolerance;

  // Calculate drag direction vector
  const dragDx = point[0] - startPoint[0];
  const dragDy = point[1] - startPoint[1];
  console.log('[EDGE-SNAP] Drag direction:', dragDx, dragDy);

  // Check if we have no direction (starting from point) - snap to closest edge
  const hasNoDirection = Math.abs(dragDx) < 0.001 && Math.abs(dragDy) < 0.001;

  for (const edgeId in graph.edges) {
    const edge = graph.edges[edgeId];
    if (!edge || !edge.startNodeId || !edge.endNodeId) {
      continue;
    }

    const startNode = graph.nodes[edge.startNodeId];
    const endNode = graph.nodes[edge.endNodeId];

    if (!startNode || !endNode) {
      continue;
    }

    const wallStart = startNode.position;
    const wallEnd = endNode.position;
    // edge.thickness is in METERS (per units fix plan)
    // Convert to pixels for hit detection calculations
    const thicknessMeters = edge.thickness || 0.05; // Default: 50mm = 0.05m
    const thicknessPixels = metersToPixels(thicknessMeters);
    const offset = thicknessPixels / 2;

    console.log(`[EDGE-SNAP] Checking wall ${edgeId}: ${wallStart} -> ${wallEnd}, thickness=${thicknessPixels}px (${thicknessMeters}m)`);

    // Calculate wall direction and perpendicular
    const wallDx = wallEnd[0] - wallStart[0];
    const wallDy = wallEnd[1] - wallStart[1];
    const wallLength = Math.sqrt(wallDx * wallDx + wallDy * wallDy);

    if (wallLength === 0) {
      continue;
    }

    const wallDirX = wallDx / wallLength;
    const wallDirY = wallDy / wallLength;
    const perpX = -wallDirY;
    const perpY = wallDirX;

    // Calculate both edge face lines
    const leftEdgeStart: Point = [wallStart[0] + perpX * offset, wallStart[1] + perpY * offset];
    const leftEdgeEnd: Point = [wallEnd[0] + perpX * offset, wallEnd[1] + perpY * offset];

    const rightEdgeStart: Point = [wallStart[0] - perpX * offset, wallStart[1] - perpY * offset];
    const rightEdgeEnd: Point = [wallEnd[0] - perpX * offset, wallEnd[1] - perpY * offset];

    // Project point onto both edge faces
    const leftProjected = projectPointToLine(point, leftEdgeStart, leftEdgeEnd);
    const rightProjected = projectPointToLine(point, rightEdgeStart, rightEdgeEnd);

    const leftDist = distance(point, leftProjected);
    const rightDist = distance(point, rightProjected);

    // Determine which edge based on drag direction (cross product)
    // Positive = left side, Negative = right side, Zero = perpendicular
    const crossProduct = dragDx * perpY - dragDy * perpX;

    console.log(`[EDGE-SNAP]   leftDist=${leftDist.toFixed(2)}, rightDist=${rightDist.toFixed(2)}, crossProduct=${crossProduct.toFixed(2)}, minDistance=${minDistance}, hasNoDirection=${hasNoDirection}`);

    // When starting from a point (no direction), snap to closest edge
    if (hasNoDirection) {
      // Just snap to whichever edge is closer (or left if equal)
      if (leftDist < minDistance && leftDist <= rightDist) {
        console.log(`[EDGE-SNAP]   ✓ Snapping to LEFT edge (closest, no direction)!`);
        minDistance = leftDist;
        closestSnap = {
          point: leftProjected,
          wallId: edgeId,
          edgeFacePoint: leftProjected,
          edge: 'left'
        };
      } else if (rightDist < minDistance && rightDist < leftDist) {
        console.log(`[EDGE-SNAP]   ✓ Snapping to RIGHT edge (closest, no direction)!`);
        minDistance = rightDist;
        closestSnap = {
          point: rightProjected,
          wallId: edgeId,
          edgeFacePoint: rightProjected,
          edge: 'right'
        };
      }
    } else {
      // Normal case: use drag direction to determine edge
      // For perpendicular drags (cross product ≈ 0), snap to whichever edge is closer
      const isPerpendicular = Math.abs(crossProduct) < 0.1;

      // Check left edge
      if (leftDist < minDistance && (crossProduct > 0 || (isPerpendicular && leftDist < rightDist))) {
        console.log(`[EDGE-SNAP]   ✓ Snapping to LEFT edge!`);
        minDistance = leftDist;
        closestSnap = {
          point: leftProjected,
          wallId: edgeId,
          edgeFacePoint: leftProjected,
          edge: 'left'
        };
      }

      // Check right edge
      if (rightDist < minDistance && (crossProduct < 0 || (isPerpendicular && rightDist < leftDist))) {
        console.log(`[EDGE-SNAP]   ✓ Snapping to RIGHT edge!`);
        minDistance = rightDist;
        closestSnap = {
          point: rightProjected,
          wallId: edgeId,
          edgeFacePoint: rightProjected,
          edge: 'right'
        };
      }
    }
  }

  console.log('[EDGE-SNAP] Result:', closestSnap);
  return closestSnap;
}

/**
 * Snap a point to the nearest wall (centerline)
 */
export function snapToWall(
  point: Point,
  graph: any,
  tolerance: number
): Point | null {
  if (!graph || !graph.edges) {
    return null;
  }

  let closestPoint: Point | null = null;
  let minDistance = tolerance;

  for (const edgeId in graph.edges) {
    const edge = graph.edges[edgeId];
    if (!edge || !edge.startNodeId || !edge.endNodeId) {continue;} // Safety check
    
    const startNode = graph.nodes[edge.startNodeId];
    const endNode = graph.nodes[edge.endNodeId];
    
    if (!startNode || !endNode) {continue;} // Safety check

    if (startNode && endNode) {
      // Find the closest point on the wall centerline
      const wallStart = startNode.position;
      const wallEnd = endNode.position;
      
      // Project point onto wall line
      const projectedPoint = projectPointToLine(point, wallStart, wallEnd);
      const dist = distance(point, projectedPoint);
      
      if (dist < minDistance) {
        minDistance = dist;
        closestPoint = projectedPoint;
      }
    }
  }

  return closestPoint;
}

/**
 * Snap a point to the nearest node
 */
export function snapToNode(
  point: Point, 
  graph: any, 
  tolerance: number
): Point | null {
  if (!graph || !graph.nodes) {
    return null;
  }

  let closestNode: Point | null = null;
  let minDistance = tolerance;

  for (const nodeId in graph.nodes) {
    const node = graph.nodes[nodeId];
    if (!node || !node.position) {continue;} // Safety check
    
    const dist = distance(point, node.position);
    
    if (dist < minDistance) {
      minDistance = dist;
      closestNode = node.position;
    }
  }

  return closestNode;
}

/**
 * Project a point onto a line segment
 */
function projectPointToLine(point: Point, lineStart: Point, lineEnd: Point): Point {
  const [px, py] = point;
  const [x1, y1] = lineStart;
  const [x2, y2] = lineEnd;

  const dx = x2 - x1;
  const dy = y2 - y1;
  const length = Math.sqrt(dx * dx + dy * dy);
  
  if (length === 0) {
    return lineStart;
  }
  
  const t = Math.max(0, Math.min(1, ((px - x1) * dx + (py - y1) * dy) / (length * length)));
  
  return [
    x1 + t * dx,
    y1 + t * dy
  ];
}

/**
 * Snap angle to architectural standard angles (45° increments)
 * Takes a start point and current point, returns end point with angle snapped
 */
export function snapAngle(startPoint: Point, currentPoint: Point): Point {
  const [x1, y1] = startPoint;
  const [x2, y2] = currentPoint;

  const dx = x2 - x1;
  const dy = y2 - y1;
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance < 0.0001) {
    return currentPoint;
  }

  // Calculate current angle in radians
  const currentAngle = Math.atan2(dy, dx);

  // Convert to degrees for easier calculation
  const currentAngleDeg = (currentAngle * 180) / Math.PI;

  // Snap to nearest 45° increment
  const snappedAngleDeg = Math.round(currentAngleDeg / 45) * 45;

  // Convert back to radians
  const snappedAngle = (snappedAngleDeg * Math.PI) / 180;

  // Calculate new end point with snapped angle
  const newX = x1 + Math.cos(snappedAngle) * distance;
  const newY = y1 + Math.sin(snappedAngle) * distance;

  return [newX, newY];
}

/**
 * Main snapping function that applies all enabled snap types
 */
export function snapPoint(
  point: Point,
  graph: any,
  options: SnapOptions = {
    snapToGrid: true,
    snapToWalls: true,
    snapToNodes: true,
    snapToAngles: false,
    gridSize: 25,
    snapTolerance: 10
  }
): SnapResult {
  const { snapToGrid, snapToWalls, snapToNodes, gridSize, snapTolerance } = options;
  
  let snappedPoint = point;
  let snapped = false;
  let snapType: 'grid' | 'wall' | 'node' | undefined;
  let snapTarget: Point | undefined;

  // Priority order: nodes > walls > grid
  if (snapToNodes) {
    const nodeSnap = snapToNode(point, graph, snapTolerance);
    if (nodeSnap) {
      snappedPoint = nodeSnap;
      snapped = true;
      snapType = 'node';
      snapTarget = nodeSnap;
    }
  }

  if (!snapped && snapToWalls) {
    // Pass snapTolerance to snapToWall, not wallThickness
    const wallSnap = snapToWall(point, graph, snapTolerance);
    if (wallSnap) {
      snappedPoint = wallSnap;
      snapped = true;
      snapType = 'wall';
      snapTarget = wallSnap;
    }
  }

  if (!snapped && snapToGrid) {
    const gridSnap = snapPointToGrid(point, gridSize);
    const dist = distance(point, gridSnap);
    if (dist <= snapTolerance) {
      snappedPoint = gridSnap;
      snapped = true;
      snapType = 'grid';
      snapTarget = gridSnap;
    }
  }

  const result: SnapResult = {
    point: snappedPoint,
    snapped
  };
  
  if (snapType) {
    result.snapType = snapType;
  }
  
  if (snapTarget) {
    result.snapTarget = snapTarget;
  }
  
  return result;
}
