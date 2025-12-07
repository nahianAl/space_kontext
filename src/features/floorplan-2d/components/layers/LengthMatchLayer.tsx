/**
 * Length Match layer component rendering inference guidelines
 * Shows temporary guidelines when drawing wall matches existing wall lengths
 * Helps users create consistent wall lengths (similar to AutoCAD/SketchUp inference)
 */
'use client';

import React, { useMemo } from 'react';
import { Line, Group } from 'react-konva';
import { useWallGraphStoreContext } from '../../context/WallGraphStoreContext';
import { findLengthMatches } from '../../utils/lengthMatchUtils';

interface LengthMatchLayerProps {
  scale: number;
}

export const LengthMatchLayer: React.FC<LengthMatchLayerProps> = ({ scale }) => {
  const useWallGraphStore = useWallGraphStoreContext();
  const graph = useWallGraphStore((state) => state.graph);
  const isDrawing = useWallGraphStore((state) => state.isDrawing);
  const drawingStartPoint = useWallGraphStore((state) => state.drawingStartPoint);
  const drawingCurrentPoint = useWallGraphStore((state) => state.drawingCurrentPoint);

  // Find length matches whenever drawing state changes
  const lengthMatches = useMemo(() => {
    if (!isDrawing || !drawingStartPoint || !drawingCurrentPoint) {
      return [];
    }

    return findLengthMatches(drawingStartPoint, drawingCurrentPoint, graph);
  }, [isDrawing, drawingStartPoint, drawingCurrentPoint, graph]);

  // Calculate dynamic stroke width based on zoom level
  // As zoom decreases (scale gets smaller), stroke width increases proportionally
  // This ensures guidelines remain visible when zoomed out
  const dynamicStrokeWidth = useMemo(() => {
    const baseStrokeWidth = 1;
    return baseStrokeWidth / scale;
  }, [scale]);

  if (!isDrawing || lengthMatches.length === 0) {
    return null;
  }

  return (
    <Group>
      {lengthMatches.map((match) => (
        <Line
          key={match.matchedWallId}
          points={[
            match.guidelineStart[0],
            match.guidelineStart[1],
            match.guidelineEnd[0],
            match.guidelineEnd[1]
          ]}
          stroke="#00CED1"
          strokeWidth={dynamicStrokeWidth}
          dash={[10, 8]}
          listening={false}
          opacity={0.7}
        />
      ))}
    </Group>
  );
};
