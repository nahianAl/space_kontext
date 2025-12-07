/**
 * Reference layer component for rendering reference elements
 * Displays wall centerlines and nodes for visual reference
 * Conditionally shows/hides based on active tool state
 */

import React, { useMemo } from 'react';
import { Layer, Line } from 'react-konva';
import { useWallGraphStoreContext } from '../../context/WallGraphStoreContext';

interface ReferenceLayerProps {
  graph: any;
}

export const ReferenceLayer: React.FC<ReferenceLayerProps> = ({ graph }) => {
  const useWallGraphStore = useWallGraphStoreContext();
  const selectedWallIds = useWallGraphStore((state) => state.selectedWallIds);
  const hoveredWallId = useWallGraphStore((state) => state.hoveredWallId);
  const isOpeningToolActive = useWallGraphStore((state) => state.isOpeningToolActive);

  const activeWallIds = useMemo(() => {
    const ids = new Set<string>(selectedWallIds);
    if (hoveredWallId) {
      ids.add(hoveredWallId);
    }
    return Array.from(ids);
  }, [selectedWallIds, hoveredWallId]);

  if (!graph || !graph.edges || activeWallIds.length === 0) {
    return null;
  }

  const showCenterlines = !isOpeningToolActive;

  if (!showCenterlines) {
    return null;
  }

  return (
    <Layer listening={false}>
      {activeWallIds.map(wallId => {
        const edge = graph.edges[wallId];
        if (!edge) {
          return null;
        }

        return (
        <Line
            key={`centerline-${wallId}`}
            points={edge.centerline.flat()}
            stroke="#fc3aa2"
            strokeWidth={2}
            listening={false}
        />
        );
      })}
    </Layer>
  );
};
