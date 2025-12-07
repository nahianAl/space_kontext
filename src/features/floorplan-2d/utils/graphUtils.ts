/**
 * Graph utility functions for creating deep copies of wall graphs
 * Needed because Zustand requires new object references to detect changes
 * Ensures proper state updates when mutating graph data
 */

import { WallGraph, Point } from '../types/wallGraph';

/**
 * Create a deep copy of a wall graph
 * This ensures Zustand detects changes when the graph is mutated
 */
export function deepCopyGraph(graph: WallGraph): WallGraph {
  const newGraph: WallGraph = {
    nodes: {},
    edges: {}
  };

  // Deep copy nodes
  Object.keys(graph.nodes).forEach(nodeId => {
    const node = graph.nodes[nodeId];
    if (!node) {
      return;
    }
    newGraph.nodes[nodeId] = {
      ...node,
      id: nodeId,
      position: [...node.position] as Point,
      connectedEdges: [...node.connectedEdges]
    };
  });

  // Deep copy edges (including fill, layer, and hatchPattern properties)
  Object.keys(graph.edges).forEach(edgeId => {
    const edge = graph.edges[edgeId];
    if (!edge) {
      return;
    }
    newGraph.edges[edgeId] = {
      ...edge,
      id: edgeId,
      centerline: [[...edge.centerline[0]], [...edge.centerline[1]]] as [Point, Point],
      openings: edge.openings ? [...edge.openings] : [],
      ...(edge.fill && { fill: edge.fill }),
      ...(edge.layer && { layer: edge.layer }),
      ...(edge.hatchPattern && { hatchPattern: edge.hatchPattern })
    };
  });

  return newGraph;
}

