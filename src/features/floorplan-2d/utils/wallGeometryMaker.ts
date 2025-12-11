/**
 * Wall geometry maker using Maker.js for generating mitered wall polygons
 * Creates wall polygons with proper corner mitering from wall graph data
 * Handles wall intersections, connections, and geometric calculations
 */
import * as makerjs from 'makerjs';
import { WallGraph, WallEdge, Point } from '../types/wallGraph';
import { getConnectedComponent, distance } from './wallGraphUtils';
import { calculateTJunctionMiter } from './tJunctionGeometry';
import { metersToPixels } from '@/lib/units/unitsSystem';

// Type definitions (matching wallGeometry.ts API)
export type WallCenterline = [Point, Point];
export type WallPolygon = Point[];

export interface WallPolygonShape {
  wallId: string;
  polygon: WallPolygon;
}

/**
 * Create a thick wall polygon from a centerline using Maker.js
 * @param centerline - Array of two points representing the wall centerline
 * @param thickness - Wall thickness in METERS (will be converted to pixels for rendering)
 * @returns Polygon representing the thick wall
 */
export function createWallPolygonMaker(centerline: WallCenterline, thickness: number): WallPolygon {
  const [start, end] = centerline;
  
  // Use manual calculation (same as original working implementation)
  const dx = end[0] - start[0];
  const dy = end[1] - start[1];
  const length = Math.sqrt(dx * dx + dy * dy);

  if (length === 0) {
    return [];
  }

  const dirX = dx / length;
  const dirY = dy / length;
  const perpX = -dirY;
  const perpY = dirX;
  // Convert thickness from meters to pixels for rendering
  const thicknessPixels = metersToPixels(thickness);
  const offset = thicknessPixels / 2;

  return [
    [start[0] + perpX * offset, start[1] + perpY * offset],
    [end[0] + perpX * offset, end[1] + perpY * offset],
    [end[0] - perpX * offset, end[1] - perpY * offset],
    [start[0] - perpX * offset, start[1] - perpY * offset]
  ];
}


/**
 * Find all walls connected to a specific point
 * @param segment - Array of connected wall centerlines
 * @param point - The point to check connections for
 * @param tolerance - Distance tolerance for connection
 * @returns Array of connected walls
 */
function findWallsConnectedToPoint(
  segment: WallCenterline[],
  point: Point,
  tolerance: number = 1
): WallCenterline[] {
  return segment.filter(wall => {
    const [start, end] = wall;
    const distToStart = Math.sqrt(Math.pow(point[0] - start[0], 2) + Math.pow(point[1] - start[1], 2));
    const distToEnd = Math.sqrt(Math.pow(point[0] - end[0], 2) + Math.pow(point[1] - end[1], 2));
    return distToStart <= tolerance || distToEnd <= tolerance;
  });
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
 * Junction type information for a node
 */
export interface NodeJunctionInfo {
  nodeId: string;
  connectedEdges: WallEdge[];
  junctionType: 'endpoint' | 'corner' | 't-junction' | 'cross' | 'star';
  angles: number[]; // Sorted angles of all connected walls
}

/**
 * Analyze junction type based on number of connected walls
 */
export function analyzeNodeJunction(nodeId: string, graph: WallGraph): NodeJunctionInfo {
  const connectedEdges = Object.values(graph.edges).filter(
    edge => edge.startNodeId === nodeId || edge.endNodeId === nodeId
  );

  const count = connectedEdges.length;
  let junctionType: NodeJunctionInfo['junctionType'];

  if (count === 1) {
    junctionType = 'endpoint';
  } else if (count === 2) {
    junctionType = 'corner';
  } else if (count === 3) {
    junctionType = 't-junction';
  } else if (count === 4) {
    junctionType = 'cross';
  } else {
    junctionType = 'star';
  }

  // Calculate angles for each wall at this node
  const angles = connectedEdges.map(edge => {
    const isStart = edge.startNodeId === nodeId;
    // Angle pointing away from the node
    return isStart ? edge.angle : normalizeAngle(edge.angle + Math.PI);
  }).sort((a, b) => a - b);

  return { nodeId, connectedEdges, junctionType, angles };
}

/**
 * Calculate the shortest angle difference between two angles
 */
function angleDifference(angle1: number, angle2: number): number {
  let diff = angle2 - angle1;
  while (diff > Math.PI) {
    diff -= 2 * Math.PI;
  }
  while (diff < -Math.PI) {
    diff += 2 * Math.PI;
  }
  return diff;
}

/**
 * Calculate safe miter length with bounds checking
 */
function calculateMiterLength(offset: number, halfAngleDiff: number): number {
  const absAngle = Math.abs(halfAngleDiff);
  
  // Handle edge cases
  if (absAngle < 0.01) {
    // Parallel walls - use simple offset
    return offset;
  }
  
  if (absAngle > Math.PI / 2 - 0.01) {
    // Very sharp angle - limit miter length
    return offset * 2; // Reasonable maximum
  }
  
  // Normal case - use cosine formula
  const cosValue = Math.cos(halfAngleDiff);
  if (Math.abs(cosValue) < 0.01) {
    // Avoid division by very small numbers
    return offset * 2;
  }
  
  return Math.abs(offset / cosValue);
}

/**
 * Calculate miter for a point with multiple connected walls
 * @param point - The connection point
 * @param currentWall - The current wall we're processing
 * @param connectedWalls - All walls connected to this point
 * @param offset - Wall offset distance
 * @returns Mitered points [miter1, miter2]
 */
function calculateMiterForPoint(
  point: Point, 
  currentWall: WallCenterline, 
  connectedWalls: WallCenterline[], 
  offset: number
): [Point, Point] {
  if (connectedWalls.length <= 1) {
    // No other walls connected, use simple offset
    const dx = currentWall[1][0] - currentWall[0][0];
    const dy = currentWall[1][1] - currentWall[0][1];
    const length = Math.sqrt(dx * dx + dy * dy);
    
    if (length === 0) {
      return [point, point];
    }
    
    const dirX = dx / length;
    const dirY = dy / length;
    const perpX = -dirY;
    const perpY = dirX;
    
    return [
      [point[0] + perpX * offset, point[1] + perpY * offset] as Point,
      [point[0] - perpX * offset, point[1] - perpY * offset] as Point
    ];
  }
  
  // Find the wall that's different from current wall
  const otherWall = connectedWalls.find(wall => wall !== currentWall);
  if (!otherWall) {
    // Fallback to simple offset
    const dx = currentWall[1][0] - currentWall[0][0];
    const dy = currentWall[1][1] - currentWall[0][1];
    const length = Math.sqrt(dx * dx + dy * dy);
    
    if (length === 0) {
      return [point, point];
    }
    
    const dirX = dx / length;
    const dirY = dy / length;
    const perpX = -dirY;
    const perpY = dirX;
    
    return [
      [point[0] + perpX * offset, point[1] + perpY * offset] as Point,
      [point[0] - perpX * offset, point[1] - perpY * offset] as Point
    ];
  }
  
  // Calculate directions for both walls
  const currentDx = currentWall[1][0] - currentWall[0][0];
  const currentDy = currentWall[1][1] - currentWall[0][1];
  const currentLength = Math.sqrt(currentDx * currentDx + currentDy * currentDy);
  
  const otherDx = otherWall[1][0] - otherWall[0][0];
  const otherDy = otherWall[1][1] - otherWall[0][1];
  const otherLength = Math.sqrt(otherDx * otherDx + otherDy * otherDy);
  
  if (currentLength === 0 || otherLength === 0) {
    // Fallback to simple offset
    const dirX = currentDx / Math.max(currentLength, 1);
    const dirY = currentDy / Math.max(currentLength, 1);
    const perpX = -dirY;
    const perpY = dirX;
    
    return [
      [point[0] + perpX * offset, point[1] + perpY * offset] as Point,
      [point[0] - perpX * offset, point[1] - perpY * offset] as Point
    ];
  }
  
  const currentDirX = currentDx / currentLength;
  const currentDirY = currentDy / currentLength;
  const otherDirX = otherDx / otherLength;
  const otherDirY = otherDy / otherLength;
  
  // Calculate angles and normalize them
  const angleCurrent = normalizeAngle(Math.atan2(currentDirY, currentDirX));
  const angleOther = normalizeAngle(Math.atan2(otherDirY, otherDirX));
  
  // Calculate angle difference
  const angleDiff = angleDifference(angleOther, angleCurrent);
  const halfAngleDiff = angleDiff / 2;
  
  // Handle edge cases
  if (Math.abs(angleDiff) < 0.01) {
    // Parallel walls - use simple offset
    const perpX = -currentDirY;
    const perpY = currentDirX;
    return [
      [point[0] + perpX * offset, point[1] + perpY * offset] as Point,
      [point[0] - perpX * offset, point[1] - perpY * offset] as Point
    ];
  } else if (Math.abs(angleDiff) > Math.PI - 0.01) {
    // 180-degree turn - use simple offset
    const perpX = -currentDirY;
    const perpY = currentDirX;
    return [
      [point[0] + perpX * offset, point[1] + perpY * offset] as Point,
      [point[0] - perpX * offset, point[1] - perpY * offset] as Point
    ];
  } else {
    // Normal mitering
    const miterLength = calculateMiterLength(offset, halfAngleDiff);
    
    // Calculate bisector angle
    const bisectorAngle = normalizeAngle(angleOther + halfAngleDiff);
    const miterAngle = normalizeAngle(bisectorAngle + Math.PI / 2);
    
    // Calculate miter points
    const miterX1 = point[0] + Math.cos(miterAngle) * miterLength;
    const miterY1 = point[1] + Math.sin(miterAngle) * miterLength;
    const miterX2 = point[0] - Math.cos(miterAngle) * miterLength;
    const miterY2 = point[1] - Math.sin(miterAngle) * miterLength;
    
    return [
      [miterX1, miterY1] as Point,
      [miterX2, miterY2] as Point
    ];
  }
}

/**
 * Create mitered polygons for a connected segment of walls using Maker.js
 * Each wall gets its own polygon with mitered corners at connections
 * @param segment - Array of connected wall centerlines
 * @param graph - Optional wall graph for advanced T-junction/multi-way mitering
 * @returns Array of mitered polygons (one per wall)
 */
function createMiteredSegmentMaker(segmentEdges: WallEdge[], graph?: WallGraph): WallPolygonShape[] {
  if (segmentEdges.length === 0) {
    return [];
  }

  const polygons: WallPolygonShape[] = [];
  const segmentCenterlines = segmentEdges.map(edge => edge.centerline);

  console.log(`[MITER] Processing segment with ${segmentEdges.length} edges, graph=${!!graph}`);

  for (const currentEdge of segmentEdges) {
    if (!currentEdge) {continue;}

    const current = currentEdge.centerline;
    // Convert thickness from meters to pixels for rendering
    const thicknessPixels = metersToPixels(currentEdge.thickness);
    const offset = thicknessPixels / 2;

    // Find walls connected to start and end points (within segment)
    const startConnectedWalls = findWallsConnectedToPoint(segmentCenterlines, current[0]);
    const endConnectedWalls = findWallsConnectedToPoint(segmentCenterlines, current[1]);

    // If graph is available, use node-based lookup to find ALL walls at junctions
    let startAllEdges: WallEdge[] = [];
    let endAllEdges: WallEdge[] = [];

    if (graph) {
      // Find node IDs for start and end points
      const startNodeId = currentEdge.startNodeId;
      const endNodeId = currentEdge.endNodeId;

      // Get all edges connected to start node
      if (startNodeId && graph.nodes[startNodeId]) {
        const startNode = graph.nodes[startNodeId];
        startAllEdges = startNode.connectedEdges
          .map(edgeId => graph.edges[edgeId])
          .filter((edge): edge is WallEdge => edge !== undefined);
      }

      // Get all edges connected to end node
      if (endNodeId && graph.nodes[endNodeId]) {
        const endNode = graph.nodes[endNodeId];
        endAllEdges = endNode.connectedEdges
          .map(edgeId => graph.edges[edgeId])
          .filter((edge): edge is WallEdge => edge !== undefined);
      }
    }

    console.log(`[MITER] Wall ${currentEdge.id}:`);
    console.log(`  - Start point [${current[0][0].toFixed(1)}, ${current[0][1].toFixed(1)}]: ${startConnectedWalls.length} in-segment, ${startAllEdges.length} total`);
    console.log(`  - End point [${current[1][0].toFixed(1)}, ${current[1][1].toFixed(1)}]: ${endConnectedWalls.length} in-segment, ${endAllEdges.length} total`);

    // Calculate mitered points for start
    let startMiter1: Point, startMiter2: Point;

    if (graph && startAllEdges.length >= 3) {
      console.log(`  - START: Using T-junction miter (${startAllEdges.length} walls)`);
      // T-junction or multi-way junction - use advanced miter calculation
      const miterResult = calculateTJunctionMiter(current[0], currentEdge, startAllEdges, graph);
      startMiter1 = miterResult.point1;
      startMiter2 = miterResult.point2;
      console.log(`  - START: T-junction miter points: [${startMiter1[0].toFixed(1)}, ${startMiter1[1].toFixed(1)}], [${startMiter2[0].toFixed(1)}, ${startMiter2[1].toFixed(1)}]`);
    } else {
      console.log(`  - START: Using regular miter (${startConnectedWalls.length} walls)`);
      // 2-way junction (corner) or endpoint - use existing miter calculation
      [startMiter1, startMiter2] = calculateMiterForPoint(
        current[0],
        current,
        startConnectedWalls,
        offset
      );
      console.log(`  - START: Regular miter points: [${startMiter1[0].toFixed(1)}, ${startMiter1[1].toFixed(1)}], [${startMiter2[0].toFixed(1)}, ${startMiter2[1].toFixed(1)}]`);
    }

    // Calculate mitered points for end
    let endMiter1: Point, endMiter2: Point;

    if (graph && endAllEdges.length >= 3) {
      console.log(`  - END: Using T-junction miter (${endAllEdges.length} walls)`);
      // T-junction or multi-way junction - use advanced miter calculation
      const miterResult = calculateTJunctionMiter(current[1], currentEdge, endAllEdges, graph);
      endMiter1 = miterResult.point1;
      endMiter2 = miterResult.point2;
      console.log(`  - END: T-junction miter points: [${endMiter1[0].toFixed(1)}, ${endMiter1[1].toFixed(1)}], [${endMiter2[0].toFixed(1)}, ${endMiter2[1].toFixed(1)}]`);
    } else {
      console.log(`  - END: Using regular miter (${endConnectedWalls.length} walls)`);
      // 2-way junction (corner) or endpoint - use existing miter calculation
      [endMiter1, endMiter2] = calculateMiterForPoint(
        current[1],
        current,
        endConnectedWalls,
        offset
      );
      console.log(`  - END: Regular miter points: [${endMiter1[0].toFixed(1)}, ${endMiter1[1].toFixed(1)}], [${endMiter2[0].toFixed(1)}, ${endMiter2[1].toFixed(1)}]`);
    }

    // Create polygon with consistent ordering
    const polygon: WallPolygon = [
      startMiter1,
      endMiter1,
      endMiter2,
      startMiter2
    ];

    polygons.push({
      wallId: currentEdge.id,
      polygon,
    });
  }

  return polygons;
}

/**
 * Find connected wall segments from a list of walls
 * @param walls - Array of wall centerlines
 * @returns Array of connected wall segments
 */
function findConnectedWallSegments(walls: WallCenterline[]): WallCenterline[][] {
  if (walls.length === 0) {
    return [];
  }

  const segments: WallCenterline[][] = [];
  const used = new Set<number>();
  const tolerance = 1; // pixels

  for (let i = 0; i < walls.length; i++) {
    if (used.has(i)) {
      continue;
    }

    const wall = walls[i];
    if (!wall) {
      continue;
    }

    const segment: WallCenterline[] = [wall];
    used.add(i);

    // Find all walls connected to this one
    let foundConnection = true;
    while (foundConnection) {
      foundConnection = false;

      for (let j = 0; j < walls.length; j++) {
        if (used.has(j)) {continue;}

        const currentWall = segment[segment.length - 1];
        const candidateWall = walls[j];

        if (currentWall && candidateWall) {
          // Check if walls are connected
          if (areWallsConnected(currentWall, candidateWall, tolerance)) {
            segment.push(candidateWall);
            used.add(j);
            foundConnection = true;
            break;
          }
        }
      }
    }

    segments.push(segment);
  }

  return segments;
}

/**
 * Check if two walls are connected
 * @param wall1 - First wall centerline
 * @param wall2 - Second wall centerline
 * @param tolerance - Distance tolerance for connection
 * @returns True if walls are connected
 */
function areWallsConnected(wall1: WallCenterline, wall2: WallCenterline, tolerance: number): boolean {
  const [p1, p2] = wall1;
  const [p3, p4] = wall2;

  // Check all combinations of endpoints
  const connections: [Point, Point][] = [
    [p1, p3], [p1, p4], [p2, p3], [p2, p4]
  ];

  for (const [point1, point2] of connections) {
    if (point1 && point2) {
      const dist = Math.sqrt(
        Math.pow(point1[0] - point2[0], 2) + Math.pow(point1[1] - point2[1], 2)
      );
      if (dist <= tolerance) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Create mitered walls from array of centerlines using Maker.js
 * @param walls - Array of wall centerlines
 * @param thickness - Wall thickness
 * @returns Array of polygons with mitered corners (keeps walls separate)
 */
export function createMiteredWallsMaker(walls: WallCenterline[], thickness: number): WallPolygon[] {
  if (walls.length === 0) {
    return [];
  }

  if (walls.length === 1) {
    // Single wall, no mitering needed
    const wall = walls[0];
    if (wall) {
      return [createWallPolygonMaker(wall, thickness)];
    }
    return [];
  }

  // Find connected wall segments
  const connectedSegments = findConnectedWallSegments(walls);
  const allPolygons: WallPolygon[] = [];

  for (const segment of connectedSegments) {
    if (segment.length === 1) {
      // Single wall in segment
      const wall = segment[0];
      if (wall) {
        allPolygons.push(createWallPolygonMaker(wall, thickness));
      }
    } else {
      // Multiple connected walls - create mitered geometry
      // For WallCenterline[], we need to create polygons individually
      // TODO: Implement proper mitering for centerline arrays
      for (const wall of segment) {
        if (wall) {
          allPolygons.push(createWallPolygonMaker(wall, thickness));
        }
      }
    }
  }

  return allPolygons;
}

/**
 * Create mitered walls using graph-based approach with Maker.js
 * @param graph - Wall graph containing nodes and edges
 * @returns Array of polygons with mitered corners (keeps walls separate)
 */
export function createMiteredWallsFromGraphMaker(graph: WallGraph): WallPolygonShape[] {
  const allPolygons: WallPolygonShape[] = [];
  const processedEdges = new Set<string>();

  // First pass: Analyze all nodes for junction types
  const nodeJunctions = new Map<string, NodeJunctionInfo>();
  Object.keys(graph.nodes).forEach(nodeId => {
    nodeJunctions.set(nodeId, analyzeNodeJunction(nodeId, graph));
  });

  // Process each edge
  for (const [edgeId, edge] of Object.entries(graph.edges)) {
    if (processedEdges.has(edgeId)) {
      continue;
    }

    // Get connected component for this edge
    const connectedComponent = getConnectedComponent(graph, edgeId);

    if (connectedComponent.length === 1) {
      // Single wall, no mitering needed
      allPolygons.push({
        wallId: edge.id,
        polygon: createWallPolygonMaker(edge.centerline, edge.thickness),
      });
    } else {
      // Multiple connected walls - create mitered geometry
      // Pass the graph to enable advanced T-junction and multi-way mitering
      const miteredPolygons = createMiteredSegmentMaker(connectedComponent, graph);
      allPolygons.push(...miteredPolygons);
    }

    // Mark all edges in this component as processed
    for (const componentEdge of connectedComponent) {
      processedEdges.add(componentEdge.id);
    }
  }

  return allPolygons;
}

/**
 * Merge multiple wall polygons (stub implementation - returns walls as separate)
 * @param wallPolygons - Array of wall polygons to merge
 * @returns Array of wall polygons (not actually merged, keeping walls separate)
 */
export function mergeWallsMaker(wallPolygons: WallPolygonShape[]): WallPolygonShape[] {
  // For now, just return the walls as-is (separate polygons)
  // Could implement model combining with Maker.js if needed in the future
  return wallPolygons;
}