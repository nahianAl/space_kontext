/**
 * Wall polygons component rendering walls with selection highlighting
 * Displays wall polygons with proper mitered corners and visual feedback
 * Handles selection state and hover effects
 */

import React from 'react';
import { Line } from 'react-konva';
import type { WallPolygonShape } from '../../utils/wallGeometryMaker';
import type { WallGraph } from '../../types/wallGraph';
import { useWallGraphStoreContext } from '../../context/WallGraphStoreContext';

interface WallPolygonsProps {
  wallPolygons: WallPolygonShape[];
  graph: WallGraph;
}

export const WallPolygons: React.FC<WallPolygonsProps> = ({ wallPolygons, graph }) => {
  const useWallGraphStore = useWallGraphStoreContext();
  const selectedWallIds = useWallGraphStore((state) => state.selectedWallIds);
  const defaultWallFill = useWallGraphStore((state) => state.wallFill);
  const setHoveredWallId = useWallGraphStore((state) => state.setHoveredWallId);

  return (
    <>
      {wallPolygons.map(({ wallId, polygon }) => {
        if (polygon.length < 3) {
          return null;
        }

        // Convert polygon to flat array for Konva
        const points = polygon.flat();
        
        const wall = wallId ? graph.edges[wallId] : null;
        
        // Check if this wall is selected
        const isSelected = wallId ? selectedWallIds.includes(wallId) : false;
        
        // Use wall's fill color if available, otherwise use white (default) or selection highlight
        const fillColor = isSelected
          ? "#0f7787"
          : wall?.fill ?? defaultWallFill ?? "#2C2A3B";
        const strokeColor = isSelected ? "#D97706" : undefined;
        
        return (
          <Line
            key={`wall-${wallId}`}
            points={points}
            closed
            fill={fillColor}
            {...(strokeColor && { stroke: strokeColor })}
            strokeEnabled={isSelected}
            strokeWidth={isSelected ? 2 : 0}
            onMouseEnter={() => setHoveredWallId(wallId)}
            onMouseLeave={() => setHoveredWallId(null)}
          />
        );
      })}
    </>
  );
};
