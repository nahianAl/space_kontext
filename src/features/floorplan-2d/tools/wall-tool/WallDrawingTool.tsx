/**
 * Wall drawing tool component for visual representation of drawing state
 * Renders the current wall being drawn as a line from start to current point
 * Provides visual feedback during wall creation
 */

import React from 'react';
import { Line } from 'react-konva';
import { Point } from '../../types/wallGraph';
import { useWallGraphStoreContext } from '../../context/WallGraphStoreContext';

interface WallDrawingToolProps {
  drawingStartPoint: Point | null;
  drawingCurrentPoint: Point | null;
  scale: number;
}

export const WallDrawingTool: React.FC<WallDrawingToolProps> = ({
  drawingStartPoint,
  drawingCurrentPoint,
  scale
}) => {
  const useWallGraphStore = useWallGraphStoreContext();
  const isDrawing = useWallGraphStore((state) => state.isDrawing);

  // Don't render anything if not drawing
  if (!isDrawing || !drawingStartPoint || !drawingCurrentPoint) {
    return null;
  }

  // Calculate dynamic stroke width: 2.5 / scale
  // This maintains visual thickness across zoom levels
  const dynamicStrokeWidth = 2.5 / scale;

  return (
    <Line
      points={[drawingStartPoint[0], drawingStartPoint[1], drawingCurrentPoint[0], drawingCurrentPoint[1]]}
      stroke="#0f7787"
      strokeWidth={dynamicStrokeWidth}
    />
  );
};