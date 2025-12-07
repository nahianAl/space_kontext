/**
 * Wall graph utility functions for graph operations
 * Provides functions for creating graphs, adding/removing walls, finding snap points, and graph queries
 * Core utilities for manipulating the wall graph data structure
 */
import { Point, WallNode, WallEdge, WallGraph, SnapResult, SnapOptions, Opening } from '../types/wallGraph';
import { pixelsToMeters } from '@/lib/units/unitsSystem';

/**
 * Calculate distance between two points
 */
export function distance(p1: Point, p2: Point): number {
  const dx = p1[0] - p2[0];
  const dy = p1[1] - p2[1];
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Calculate angle between two points (in radians)
 */
export function angleBetweenPoints(p1: Point, p2: Point): number {
  return Math.atan2(p2[1] - p1[1], p2[0] - p1[0]);
}

/**
 * Create a new wall graph
 */
export function createWallGraph(): WallGraph {
  return {
    nodes: {},
    edges: {}
  };
}

/**
 * Add a wall to the graph
 */
export function addWallToGraph(
  graph: WallGraph, 
  centerline: [Point, Point], 
  thickness: number,
  fill?: string,
  layer?: string,
  hatchPattern?: string
): string {
  const [start, end] = centerline;
  
  // Calculate wall metadata
  const wallLengthPixels = distance(start, end);
  const wallLengthMeters = pixelsToMeters(wallLengthPixels); // Convert to meters for storage
  const wallAngle = angleBetweenPoints(start, end);
  
  // Find or create nodes for start and end points
  const startNodeId = findOrCreateNode(graph, start);
  const endNodeId = findOrCreateNode(graph, end);
  
  // Create wall edge
  const edgeId = generateId();
  const edge: WallEdge = {
    id: edgeId,
    startNodeId,
    endNodeId,
    centerline: [start, end],
    thickness,
    angle: wallAngle,
    length: wallLengthMeters, // Store in meters
    openings: [],
    ...(fill && { fill }),
    ...(layer && { layer }),
    ...(hatchPattern && { hatchPattern })
  };
  
  // Add edge to graph
  graph.edges[edgeId] = edge;
  
  // Update node connections
  const startNode = graph.nodes[startNodeId];
  const endNode = graph.nodes[endNodeId];
  
  if (startNode) {
    startNode.connectedEdges.push(edgeId);
  }
  
  if (endNode) {
    endNode.connectedEdges.push(edgeId);
  }
  
  return edgeId;
}

/**
 * Find existing node at position or create new one
 */
function findOrCreateNode(graph: WallGraph, position: Point, tolerance: number = 1): string {
  // Look for existing node at this position
  for (const [nodeId, node] of Object.entries(graph.nodes)) {
    if (distance(node.position, position) <= tolerance) {
      return nodeId;
    }
  }
  
  // Create new node
  const nodeId = generateId();
  const node: WallNode = {
    id: nodeId,
    position,
    connectedEdges: []
  };
  
  graph.nodes[nodeId] = node;
  return nodeId;
}

/**
 * Get all walls connected to a specific wall
 */
export function getConnectedWalls(graph: WallGraph, wallId: string): WallEdge[] {
  const wall = graph.edges[wallId];
  if (!wall) {
    return [];
  }
  
  const connectedWalls: WallEdge[] = [];
  
  // console.log('Getting connected walls for:', wallId, 'startNode:', wall.startNodeId, 'endNode:', wall.endNodeId);
  
  // Get walls connected through start node
  const startNode = graph.nodes[wall.startNodeId];
  if (startNode) {
    // console.log('Start node connected edges:', startNode.connectedEdges);
    for (const edgeId of startNode.connectedEdges) {
      if (edgeId !== wallId) {
        const connectedWall = graph.edges[edgeId];
        if (connectedWall) {
          connectedWalls.push(connectedWall);
          // console.log('Added connected wall from start node:', edgeId);
        }
      }
    }
  }
  
  // Get walls connected through end node
  const endNode = graph.nodes[wall.endNodeId];
  if (endNode) {
    // console.log('End node connected edges:', endNode.connectedEdges);
    for (const edgeId of endNode.connectedEdges) {
      if (edgeId !== wallId) {
        const connectedWall = graph.edges[edgeId];
        if (connectedWall) {
          connectedWalls.push(connectedWall);
          // console.log('Added connected wall from end node:', edgeId);
        }
      }
    }
  }
  
  // console.log('Total connected walls found:', connectedWalls.length);
  return connectedWalls;
}

/**
 * Get all walls in a connected component
 */
export function getConnectedComponent(graph: WallGraph, startWallId: string): WallEdge[] {
  const visited = new Set<string>();
  const component: WallEdge[] = [];
  const queue = [startWallId];
  
  // console.log('Getting connected component for wall:', startWallId);
  
  while (queue.length > 0) {
    const currentWallId = queue.shift()!;
    if (visited.has(currentWallId)) {
      continue;
    }
    
    visited.add(currentWallId);
    const wall = graph.edges[currentWallId];
    if (wall) {
      component.push(wall);
      // console.log('Added wall to component:', currentWallId);
      
      // Add connected walls to queue
      const connectedWalls = getConnectedWalls(graph, currentWallId);
      // console.log('Found connected walls:', connectedWalls.length);
      for (const connectedWall of connectedWalls) {
        if (!visited.has(connectedWall.id)) {
          queue.push(connectedWall.id);
        }
      }
    }
  }
  
  // console.log('Final component size:', component.length);
  return component;
}

/**
 * Snap a point to nearby nodes or grid
 */
export function snapPoint(point: Point, graph: WallGraph, options: SnapOptions): SnapResult {
  let bestSnap: SnapResult = {
    snapped: false,
    point,
    distance: Infinity
  };
  
  // Snap to existing nodes
  if (options.snapToNodes) {
    for (const [nodeId, node] of Object.entries(graph.nodes)) {
      const dist = distance(point, node.position);
      if (dist <= options.snapTolerance && dist < bestSnap.distance) {
        bestSnap = {
          snapped: true,
          point: node.position,
          nodeId,
          distance: dist
        };
      }
    }
  }
  
  // Snap to grid
  if (options.snapToGrid) {
    const snappedX = Math.round(point[0] / options.gridSize) * options.gridSize;
    const snappedY = Math.round(point[1] / options.gridSize) * options.gridSize;
    const gridPoint: Point = [snappedX, snappedY];
    const dist = distance(point, gridPoint);
    
    if (dist <= options.snapTolerance && dist < bestSnap.distance) {
      bestSnap = {
        snapped: true,
        point: gridPoint,
        distance: dist
      };
    }
  }
  
  return bestSnap;
}

/**
 * Find the best snap point for drawing a new wall
 */
export function findSnapPointForDrawing(point: Point, graph: WallGraph, options: SnapOptions): SnapResult {
  return snapPoint(point, graph, options);
}

/**
 * Generate a unique ID
 */
function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

/**
 * Remove a wall from the graph
 */
export function removeWallFromGraph(graph: WallGraph, wallId: string): void {
  const wall = graph.edges[wallId];
  if (!wall) {
    return;
  }
  
  // Remove edge from nodes
  const startNode = graph.nodes[wall.startNodeId];
  const endNode = graph.nodes[wall.endNodeId];
  
  if (startNode) {
    startNode.connectedEdges = startNode.connectedEdges.filter(id => id !== wallId);
  }
  
  if (endNode) {
    endNode.connectedEdges = endNode.connectedEdges.filter(id => id !== wallId);
  }
  
  // Remove edge
  delete graph.edges[wallId];
  
  // Clean up orphaned nodes
  cleanupOrphanedNodes(graph);
}

/**
 * Remove nodes that have no connected edges
 */
function cleanupOrphanedNodes(graph: WallGraph): void {
  const orphanedNodeIds: string[] = [];
  
  for (const [nodeId, node] of Object.entries(graph.nodes)) {
    if (node.connectedEdges.length === 0) {
      orphanedNodeIds.push(nodeId);
    }
  }
  
  for (const nodeId of orphanedNodeIds) {
    delete graph.nodes[nodeId];
  }
}

/**
 * Get all wall centerlines from the graph
 */
export function getWallCenterlines(graph: WallGraph): [Point, Point][] {
  return Object.values(graph.edges).map(edge => edge.centerline);
}

/**
 * Get wall thickness from the graph (assuming all walls have same thickness)
 */
export function getWallThickness(graph: WallGraph): number {
  const edges = Object.values(graph.edges);
  return edges.length > 0 && edges[0] ? edges[0].thickness : 50; // Default thickness
}

/**
 * Update a wall's centerline, length, and angle to match its connected nodes
 */
export function synchronizeWallWithNodes(graph: WallGraph, wallId: string): void {
  const wall = graph.edges[wallId];
  if (!wall) {
    return;
  }

  const startNode = graph.nodes[wall.startNodeId];
  const endNode = graph.nodes[wall.endNodeId];

  if (!startNode || !endNode) {
    return;
  }

  wall.centerline = [
    [...startNode.position] as Point,
    [...endNode.position] as Point,
  ];
  const pixelDistance = distance(startNode.position, endNode.position);
  wall.length = pixelsToMeters(pixelDistance); // Convert to meters for storage
  wall.angle = angleBetweenPoints(startNode.position, endNode.position);
}

/**
 * Update a node position and cascade metadata updates to connected walls
 */
export function updateNodePosition(graph: WallGraph, nodeId: string, position: Point): void {
  const node = graph.nodes[nodeId];
  if (!node) {
    return;
  }

  node.position = [...position] as Point;

  // Create a shallow copy of connected edges to avoid mutation issues during iteration
  const connectedEdges = [...node.connectedEdges];
  connectedEdges.forEach((edgeId) => {
    if (!graph.edges[edgeId]) {
      return;
    }
    synchronizeWallWithNodes(graph, edgeId);
  });
}

/**
 * Clamp openings to the wall length and invalidate cached geometry values
 */
export function normalizeWallOpeningsAfterGeometryChange(graph: WallGraph, wallId: string): void {
  const wall = graph.edges[wallId];
  if (!wall || !wall.openings || wall.openings.length === 0) {
    return;
  }

  const wallLength = wall.length;

  wall.openings = wall.openings.map((opening: Opening) => {
    const halfWidth = opening.width / 2;
    const safeMin = Math.min(wallLength, Math.max(0, halfWidth));
    const safeMax = Math.max(safeMin, wallLength - halfWidth);
    const basePosition = Number.isFinite(opening.position) ? opening.position : safeMin;
    const clampedPosition = Math.max(safeMin, Math.min(safeMax, basePosition));

    // Omit center2D, center3D, and angle to reset them (don't set to undefined with exactOptionalPropertyTypes)
    const { center2D, center3D, angle, ...openingWithoutComputed } = opening;
    return {
      ...openingWithoutComputed,
      position: clampedPosition,
    };
  });
}
