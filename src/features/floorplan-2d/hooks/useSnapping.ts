/**
 * Snapping hook integrating snapping functionality with tool management
 * Provides snap point calculation for drawing operations
 * Handles snap-to-grid, snap-to-walls, and snap-to-nodes functionality
 */

import { useCallback, useMemo } from 'react';
import { Point } from '../types/wallGraph';
import { snapPoint, SnapOptions, SnapResult } from '../utils/snapUtils';
import { useWallGraphStoreContext } from '../context/WallGraphStoreContext';

export const useSnapping = () => {
  const useWallGraphStore = useWallGraphStoreContext();
  const graph = useWallGraphStore((state) => state.graph);
  const snapOptions = useWallGraphStore((state) => state.snapOptions);

  const snapPointToFeatures = useCallback((point: Point): SnapResult => {
    return snapPoint(point, graph, snapOptions);
  }, [graph, snapOptions]);

  const isSnappingEnabled = useMemo(() => {
    return snapOptions.snapToGrid || snapOptions.snapToWalls || snapOptions.snapToNodes || snapOptions.snapToAngles;
  }, [snapOptions]);

  return {
    snapPointToFeatures,
    isSnappingEnabled,
    snapOptions,
  };
};
