/**
 * Walls layer component rendering wall polygons with mitered corners
 * Displays walls with proper thickness, fill colors, and hatch patterns
 * Handles wall selection highlighting and visual feedback
 */

import React, { useEffect, useMemo } from 'react';
import { Line } from 'react-konva';
import type { WallPolygonShape } from '../../utils/wallGeometryMaker';
import type { WallGraph } from '../../types/wallGraph';
import { useWallGraphStoreContext } from '../../context/WallGraphStoreContext';
import { useLayerStore } from '../../store/layerStore';
import { DEFAULT_LAYER_ID } from '../../types/layers';
import { getStrokeWidths } from '../../utils/strokeWeights';

interface WallsLayerProps {
  wallPolygons: WallPolygonShape[];
  graph: WallGraph;
}

const WallsLayerComponent: React.FC<WallsLayerProps> = ({ wallPolygons, graph }) => {
  const useWallGraphStore = useWallGraphStoreContext();
  const selectedWallIds = useWallGraphStore((state) => state.selectedWallIds);
  const defaultWallFill = useWallGraphStore((state) => state.wallFill);
  const strokeWeight = useWallGraphStore((state) => state.strokeWeight);
  const setHoveredWallId = useWallGraphStore((state) => state.setHoveredWallId);
  const loadHatchPatternImage = useWallGraphStore((state) => state.loadHatchPatternImage);
  const hatchPatternImages = useWallGraphStore((state) => state.hatchPatternImages);
  
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

  // Filter walls by visible layers
  const visibleWallPolygons = useMemo(() => {
    return wallPolygons.filter(({ wallId }) => {
      const wall = graph.edges[wallId];
      const layerId = wall?.layer || DEFAULT_LAYER_ID;
      return visibleLayerIds.includes(layerId);
    });
  }, [wallPolygons, graph, visibleLayerIds]);

  // Collect all unique hatch patterns and preload them
  useEffect(() => {
    const patterns = new Set<string>();
    visibleWallPolygons.forEach(({ wallId }) => {
      const wall = graph.edges[wallId];
      if (wall?.hatchPattern) {
        patterns.add(wall.hatchPattern);
      }
    });
    
    patterns.forEach(patternName => {
      // Check current state to avoid infinite loops
      const currentImages = useWallGraphStore.getState().hatchPatternImages;
      if (!currentImages.has(patternName)) {
        loadHatchPatternImage(patternName);
      }
    });
    // Only depend on visibleWallPolygons and graph, not on hatchPatternImages to avoid infinite loops
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visibleWallPolygons, graph, loadHatchPatternImage]);

  return (
    <>
      {visibleWallPolygons.map(({ wallId, polygon }) => {
        if (polygon.length < 3) {
          return null;
        }

        const points = polygon.flat();
        const wall = graph.edges[wallId];
        const isSelected = selectedWallIds.includes(wallId);
        const layerId = wall?.layer || DEFAULT_LAYER_ID;
        const opacity = layerOpacityMap.get(layerId) ?? 1.0;
        
        // Determine if we should use hatch pattern or solid fill
        const hasHatchPattern = wall?.hatchPattern && !isSelected;
        const patternImage = hasHatchPattern && wall.hatchPattern ? hatchPatternImages.get(wall.hatchPattern) : null;
        
        // Use pattern if available and loaded, otherwise use solid fill
        const fillColor = isSelected
          ? '#0f7787'
          : hasHatchPattern && patternImage
            ? undefined // Konva will use fillPatternImage instead
            : wall?.fill ?? defaultWallFill ?? '#2C2A3B';
        
        // Always show black stroke for wall faces, except when selected (show selection color)
        const strokeColor = isSelected ? '#D97706' : '#000000';
        const strokeWidth = isSelected ? strokeWidths.wallSelected : strokeWidths.wall;

        return (
        <Line
            key={wallId}
            points={points}
            {...(fillColor !== undefined && { fill: fillColor })}
            {...(patternImage !== null && patternImage !== undefined && { fillPatternImage: patternImage })}
            {...(patternImage !== null && patternImage !== undefined && { fillPatternRepeat: 'repeat' })}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            opacity={opacity}
            closed
            onMouseEnter={() => setHoveredWallId(wallId)}
            onMouseLeave={() => setHoveredWallId(null)}
        />
        );
      })}
    </>
  );
};

WallsLayerComponent.displayName = 'WallsLayer';

export const WallsLayer = React.memo(WallsLayerComponent);
