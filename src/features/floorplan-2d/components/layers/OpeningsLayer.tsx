/**
 * Openings layer component rendering all doors and windows on walls
 * Displays opening symbols (arcs for doors, rectangles for windows) with selection highlighting
 * Handles opening alignment, orientation, and visual representation
 */
'use client';

import React, { useMemo } from 'react';
import { Group, Rect, Arc, Line } from 'react-konva';
import { WallGraph, WallEdge, Opening } from '../../types/wallGraph';
import { useWallGraphStoreContext } from '../../context/WallGraphStoreContext';
import { useLayerStore } from '../../store/layerStore';
import { DEFAULT_LAYER_ID } from '../../types/layers';
import { getStrokeWidths } from '../../utils/strokeWeights';
import { metersToPixels } from '@/lib/units/unitsSystem';

interface OpeningsLayerProps {
  graph: WallGraph;
}

const OPENING_STROKE_COLOR = '#DC2626';
const OPENING_STROKE_COLOR_SELECTED = '#0f7787';

export const OpeningsLayer: React.FC<OpeningsLayerProps> = ({ graph }) => {
  const wallGraphStore = useWallGraphStoreContext();
  const selectedOpeningIds = wallGraphStore((state) => state.selectedOpeningIds ?? []);
  const strokeWeight = wallGraphStore((state) => state.strokeWeight);
  
  const strokeWidths = useMemo(() => getStrokeWidths(strokeWeight), [strokeWeight]);

  // Get visible layer IDs and layer opacity map for filtering and opacity
  const layers = useLayerStore((state) => state.layers);
  const visibleLayerIds = useMemo(() => {
    return layers.filter(l => l.visible).map(l => l.id);
  }, [layers]);
  const layerOpacityMap = useMemo(() => {
    const map = new Map<string, number>();
    layers.forEach(layer => {
      map.set(layer.id, layer.opacity ?? 1.0);
    });
    return map;
  }, [layers]);

  // Filter openings by visible layers
  const visibleOpenings = useMemo(() => {
    const allOpenings: Array<{ wall: WallEdge; opening: Opening }> = [];
    
    Object.values(graph.edges).forEach(wall => {
      (wall.openings || []).forEach(opening => {
        // Get layerId from opening, or inherit from parent wall, or default
        const layerId = opening.layerId || wall.layer || DEFAULT_LAYER_ID;
        if (visibleLayerIds.includes(layerId)) {
          allOpenings.push({ wall, opening });
        }
      });
    });
    
    return allOpenings;
  }, [graph, visibleLayerIds]);

  return (
    <Group>
      {visibleOpenings.map(({ wall, opening }) => {
          const startNode = graph.nodes[wall.startNodeId];
          if (!startNode) {
            return null;
          }

          const wallAngleDegrees = wall.angle * (180 / Math.PI);
          const wallVectorX = Math.cos(wall.angle);
          const wallVectorY = Math.sin(wall.angle);
          
          const normalizedVectorLength = Math.hypot(wallVectorX, wallVectorY) || 1;
          const directionX = wallVectorX / normalizedVectorLength;
          const directionY = wallVectorY / normalizedVectorLength;
          const normalX = -directionY;
          const normalY = directionX;

          const alignment = opening.alignment ?? 'center';
          // Convert wall thickness from meters to pixels for rendering
          const wallThicknessPixels = metersToPixels(wall.thickness);
          const alignmentOffset = alignment === 'inner' ? wallThicknessPixels / 2 : alignment === 'outer' ? -wallThicknessPixels / 2 : 0;

          // Calculate opening center position in pixels
          // Use pre-calculated center2D if available, otherwise convert from meters
          let openingCenterX: number;
          let openingCenterY: number;
          
          if (opening.center2D) {
            // Use pre-calculated center2D (already in pixels)
            openingCenterX = opening.center2D[0];
            openingCenterY = opening.center2D[1];
          } else {
            // Fallback: Convert position from meters to pixels
            const positionPixels = metersToPixels(opening.position);
            openingCenterX = startNode.position[0] + directionX * positionPixels;
            openingCenterY = startNode.position[1] + directionY * positionPixels;
          }

          // Apply alignment offset
          const openingCenter = {
            x: openingCenterX + normalX * alignmentOffset,
            y: openingCenterY + normalY * alignmentOffset,
          };

          // Convert opening width from meters to pixels for rendering
          const openingWidthPixels = metersToPixels(opening.width);

          const isSelected = selectedOpeningIds.includes(opening.id);
          const strokeColor = isSelected ? OPENING_STROKE_COLOR_SELECTED : OPENING_STROKE_COLOR;
          const orientation = opening.orientation ?? 'left-out';
          const hingeOnLeft = orientation.includes('left');
          const opensOut = orientation.includes('out');
          const orientationScaleX = hingeOnLeft ? 1 : -1;
          const orientationScaleY = opensOut ? 1 : -1;
          const layerId = opening.layerId || wall.layer || DEFAULT_LAYER_ID;
          const opacity = layerOpacityMap.get(layerId) ?? 1.0;

          return (
            // This is the fix: Use a single Konva <Group> for each opening
            <Group
              key={opening.id}
              x={openingCenter.x}
              y={openingCenter.y}
              rotation={wallAngleDegrees}
              opacity={opacity}
              listening={false}
            >
              {isSelected && (
                <Rect
                  x={-openingWidthPixels / 2 - 5}
                  y={-wallThicknessPixels / 2 - 5}
                  width={openingWidthPixels + 10}
                  height={wallThicknessPixels + 10}
                  stroke={strokeColor}
                  strokeWidth={strokeWidths.opening}
                  dash={[10, 6]}
                  fill="#0f7787"
                  opacity={0.08}
                  listening={false}
                  cornerRadius={2}
                />
              )}

              {/* The opening symbol */}
              {opening.type === 'door' && (
                <Group scaleX={orientationScaleX} scaleY={orientationScaleY} listening={false}>
                  <Arc
                    x={-openingWidthPixels / 2}
                    y={0}
                    innerRadius={0}
                    outerRadius={openingWidthPixels}
                    angle={90}
                    stroke={strokeColor}
                    strokeWidth={strokeWidths.opening}
                    listening={false}
                  />
                </Group>
              )}
              {opening.type === 'window' && (
                <Rect
                  x={-openingWidthPixels / 2}
                  y={-2}
                  width={openingWidthPixels}
                  height={4}
                  fill="transparent"
                  stroke={strokeColor}
                  strokeWidth={strokeWidths.opening}
                  listening={false}
                />
              )}
            </Group>
          );
      })}
    </Group>
  );
};
