/**
 * Wall cutouts layer that erases wall sections where openings are located
 * Uses composite operations to cut out opening areas from walls
 * Cuts the entire wall thickness at opening positions regardless of alignment type
 * 
 * Note: This component returns cutout shapes that should be rendered in the same
 * Layer as walls for composite operations to work correctly
 */
'use client';

import React from 'react';
import { Group, Rect } from 'react-konva';
import type { WallGraph } from '../../types/wallGraph';
import { metersToPixels } from '@/lib/units/unitsSystem';

interface WallCutoutsLayerProps {
  graph: WallGraph;
}

export const WallCutoutsLayer: React.FC<WallCutoutsLayerProps> = ({ graph }) => {
  return (
    <>
      {Object.values(graph.edges).flatMap(wall => 
        (wall.openings || []).map(opening => {
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

          // Calculate opening center at wall centerline (no alignment offset)
          // This ensures we cut the entire wall thickness regardless of alignment
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

          const openingCenter = {
            x: openingCenterX,
            y: openingCenterY,
          };

          // Convert opening width from meters to pixels for rendering
          const openingWidthPixels = metersToPixels(opening.width);
          // Convert wall thickness from meters to pixels for rendering
          const wallThicknessPixels = metersToPixels(wall.thickness);

          return (
            <Group
              key={`cutout-${opening.id}`}
              x={openingCenter.x}
              y={openingCenter.y}
              rotation={wallAngleDegrees}
              listening={false}
            >
              <Rect
                x={-openingWidthPixels / 2}
                y={-wallThicknessPixels / 2}
                width={openingWidthPixels}
                height={wallThicknessPixels}
                fill="white"
                globalCompositeOperation="destination-out"
                listening={false}
              />
            </Group>
          );
        })
      )}
    </>
  );
};
