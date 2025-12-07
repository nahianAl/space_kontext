/**
 * Wall seam cover layer that hides black stroke lines at split points and edge snap points
 * Creates fill overlays to cover internal edges where walls meet or split
 */
'use client';

import React, { useMemo } from 'react';
import { Group, Rect } from 'react-konva';
import type { WallGraph, WallEdge, Point } from '../../types/wallGraph';
import { useWallGraphStoreContext } from '../../context/WallGraphStoreContext';
import { useLayerStore } from '../../store/layerStore';
import { DEFAULT_LAYER_ID } from '../../types/layers';
import { distance, distanceToLineSegment } from '../../utils/geometryUtils';
import { metersToPixels } from '@/lib/units/unitsSystem';

interface WallSeamCoverLayerProps {
  graph: WallGraph;
}

export const WallSeamCoverLayer: React.FC<WallSeamCoverLayerProps> = ({ graph }) => {
  const wallGraphStore = useWallGraphStoreContext();
  const defaultWallFill = wallGraphStore((state) => state.wallFill);
  const layers = useLayerStore((state) => state.layers);
  
  const visibleLayerIds = useMemo(() => {
    return layers.filter(l => l.visible).map(l => l.id);
  }, [layers]);

  // Find all points that need seam covers:
  // 1. Split points: nodes with exactly 2 edges (wall was split here)
  // 2. Edge snap points: nodes that are close to a wall's edge face (where new wall snapped to existing wall)
  const seamCovers = useMemo(() => {
    const covers: Array<{
      position: Point;
      fillColor: string;
      thickness: number;
      layerId: string;
    }> = [];
    const coveredPositions = new Set<string>(); // Track positions to avoid duplicates

    Object.keys(graph.nodes).forEach(nodeId => {
      const node = graph.nodes[nodeId];
      if (!node) {
        return;
      }

      const nodePos = node.position;
      const posKey = `${nodePos[0].toFixed(1)},${nodePos[1].toFixed(1)}`;
      if (coveredPositions.has(posKey)) {
        return; // Skip if already covered
      }

      // Get all edges connected to this node
      const connectedEdges = Object.values(graph.edges).filter(
        edge => edge.startNodeId === nodeId || edge.endNodeId === nodeId
      );

      // Case 1: Split point - node with exactly 2 edges (wall was split here)
      if (connectedEdges.length === 2) {
        const [edge1, edge2] = connectedEdges;
        // edge.thickness is in METERS, convert to pixels for rendering
        const thickness1Px = metersToPixels(edge1?.thickness || 0.05);
        const thickness2Px = metersToPixels(edge2?.thickness || 0.05);
        const maxThickness = Math.max(thickness1Px, thickness2Px);
        
        // Get fill color (prefer matching colors, otherwise use default)
        const fills = [edge1?.fill, edge2?.fill].filter((f): f is string => Boolean(f));
        const fillColor: string = fills.length > 0 && fills.every(f => f === fills[0]) && fills[0]
          ? fills[0]
          : (defaultWallFill ?? '#2C2A3B');

        // Get layer ID
        const layerId = edge1?.layer || edge2?.layer || DEFAULT_LAYER_ID;

        if (visibleLayerIds.includes(layerId)) {
          covers.push({
            position: nodePos,
            fillColor,
            thickness: maxThickness,
            layerId,
          });
          coveredPositions.add(posKey);
        }
      }

      // Case 2: Edge snap point - check if node is close to any wall's edge face
      // This detects where a new wall snapped to an existing wall's edge
      for (const otherEdge of Object.values(graph.edges)) {
        // Skip if this edge is already connected to this node
        if (otherEdge.startNodeId === nodeId || otherEdge.endNodeId === nodeId) {
          continue;
        }

        const startNode = graph.nodes[otherEdge.startNodeId];
        const endNode = graph.nodes[otherEdge.endNodeId];
        if (!startNode || !endNode) {
          continue;
        }

        const wallStart = startNode.position;
        const wallEnd = endNode.position;
        // edge.thickness is in METERS, convert to pixels for calculations
        const thicknessMeters = otherEdge.thickness || 0.05; // Default: 50mm = 0.05m
        const thickness = metersToPixels(thicknessMeters);
        const offset = thickness / 2;

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

        // Check distance to both edge faces
        const leftDist = distanceToLineSegment(nodePos, leftEdgeStart, leftEdgeEnd);
        const rightDist = distanceToLineSegment(nodePos, rightEdgeStart, rightEdgeEnd);
        const minEdgeDist = Math.min(leftDist, rightDist);

        // If node is very close to an edge face (within 5px tolerance), it's an edge snap point
        if (minEdgeDist < 5) {
          // Convert all thicknesses from meters to pixels
          const connectedThicknesses = connectedEdges.map(e => metersToPixels(e?.thickness || 0.05));
          const maxThickness = Math.max(...connectedThicknesses, thickness);
          
          // Get fill color from connected edges or the wall being snapped to
          const fills = [
            ...connectedEdges.map(e => e?.fill),
            otherEdge.fill
          ].filter((f): f is string => Boolean(f));
          const fillColor: string = fills.length > 0 && fills.every(f => f === fills[0]) && fills[0]
            ? fills[0]
            : (defaultWallFill ?? '#2C2A3B');

          // Get layer ID
          const layerId = connectedEdges[0]?.layer || otherEdge.layer || DEFAULT_LAYER_ID;

          if (visibleLayerIds.includes(layerId)) {
            covers.push({
              position: nodePos,
              fillColor,
              thickness: maxThickness,
              layerId,
            });
            coveredPositions.add(posKey);
            break; // Found edge snap, no need to check other walls
          }
        }
      }

      // Case 3: T-junction - node with 3+ edges (also covers edge snap cases)
      if (connectedEdges.length >= 3 && !coveredPositions.has(posKey)) {
        // Convert all thicknesses from meters to pixels
        const maxThickness = Math.max(...connectedEdges.map(e => metersToPixels(e?.thickness || 0.05)));
        
        // Get most common fill color
        const fills = connectedEdges.map(e => e?.fill).filter((f): f is string => Boolean(f));
        const fillColor: string = fills.length > 0 && fills.every(f => f === fills[0]) && fills[0]
          ? fills[0]
          : (defaultWallFill ?? '#2C2A3B');

        // Get layer ID from first edge
        const layerId = connectedEdges[0]?.layer || DEFAULT_LAYER_ID;

        if (visibleLayerIds.includes(layerId)) {
          covers.push({
            position: nodePos,
            fillColor,
            thickness: maxThickness,
            layerId,
          });
          coveredPositions.add(posKey);
        }
      }
    });

    return covers;
  }, [graph, defaultWallFill, visibleLayerIds]);

  return (
    <>
      {seamCovers.map(({ position, fillColor, thickness }, index) => {
        // Create a square cover that's just large enough to cover internal stroke lines
        // Use 95% of thickness to cover seams while staying within wall boundaries
        const coverSize = thickness * 0.95;
        
        return (
          <Group
            key={`seam-cover-${position[0]}-${position[1]}-${index}`}
            x={position[0]}
            y={position[1]}
            listening={false}
          >
            <Rect
              x={-coverSize / 2}
              y={-coverSize / 2}
              width={coverSize}
              height={coverSize}
              fill={fillColor}
              // No stroke - this is just a fill overlay to hide the black edges
              listening={false}
            />
          </Group>
        );
      })}
    </>
  );
};

