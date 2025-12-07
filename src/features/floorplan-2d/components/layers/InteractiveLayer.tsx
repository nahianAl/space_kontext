/**
 * Interactive layer component for rendering interactive canvas elements
 * Handles drawing tools, snap indicators, selection boxes, and interactive feedback
 * Manages visual overlays for user interactions
 */

import React from 'react';
import { Layer, Rect, Line, Text } from 'react-konva';
import { WallDrawingTool } from '../../tools/wall-tool';
import { SnapIndicator } from '../SnapIndicator';
import { Point } from '../../types/wallGraph';
import { useWallGraphStoreContext } from '../../context/WallGraphStoreContext';
import { pixelsToMeters, formatMetersAsImperial, formatMetersAsMetric } from '@/lib/units/unitsSystem';

// Format meters as imperial (wrapper)
const formatImperial = (meters: number): string => {
  return formatMetersAsImperial(meters);
};

// Format meters as metric (wrapper)
const formatMetric = (meters: number): string => {
  return formatMetersAsMetric(meters);
};

interface InteractiveLayerProps {
  drawingStartPoint: Point | null;
  drawingCurrentPoint: Point | null;
  snapResult: any;
  isSnappingEnabled: boolean;
  scale: number;
  dragSelection?: {
    isDragging: boolean;
    dragStart: Point | null;
    dragEnd: Point | null;
  };
  shapeDragSelection?: {
    isDragging: boolean;
    dragStart: Point | null;
    dragEnd: Point | null;
  };
  dimensionPreview?: {
    isCreating: boolean;
    startPoint: Point | null;
    currentPoint: Point | null;
  };
}

export const InteractiveLayer: React.FC<InteractiveLayerProps> = ({
  drawingStartPoint,
  drawingCurrentPoint,
  snapResult,
  isSnappingEnabled,
  scale,
  dragSelection,
  shapeDragSelection,
  dimensionPreview
}) => {
  const useWallGraphStore = useWallGraphStoreContext();
  const unitSystem = useWallGraphStore((state) => state.unitSystem);

  const renderDragSelection = () => {
    if (!dragSelection?.isDragging || !dragSelection.dragStart || !dragSelection.dragEnd) {
      return null;
    }

    const [x1, y1] = dragSelection.dragStart;
    const [x2, y2] = dragSelection.dragEnd;
    
    const minX = Math.min(x1, x2);
    const maxX = Math.max(x1, x2);
    const minY = Math.min(y1, y2);
    const maxY = Math.max(y1, y2);

    return (
      <Rect
        x={minX}
        y={minY}
        width={maxX - minX}
        height={maxY - minY}
        stroke="#0f7787"
        strokeWidth={2}
        dash={[5, 5]}
        fill="rgba(15, 119, 135, 0.1)"
      />
    );
  };

  const renderShapeDragSelection = () => {
    if (!shapeDragSelection?.isDragging || !shapeDragSelection.dragStart || !shapeDragSelection.dragEnd) {
      return null;
    }

    const [x1, y1] = shapeDragSelection.dragStart;
    const [x2, y2] = shapeDragSelection.dragEnd;

    const minX = Math.min(x1, x2);
    const maxX = Math.max(x1, x2);
    const minY = Math.min(y1, y2);
    const maxY = Math.max(y1, y2);

    return (
      <Rect
        x={minX}
        y={minY}
        width={maxX - minX}
        height={maxY - minY}
        stroke="#0f7787"
        strokeWidth={2}
        dash={[5, 5]}
        fill="rgba(15, 119, 135, 0.1)"
      />
    );
  };

  const renderDimensionPreview = () => {
    if (!dimensionPreview?.isCreating || !dimensionPreview.startPoint || !dimensionPreview.currentPoint) {
      return null;
    }

    return (
      <Line
        points={[...dimensionPreview.startPoint, ...dimensionPreview.currentPoint]}
        stroke="#0f7787"
        strokeWidth={1}
        dash={[5, 5]}
      />
    );
  };

  const renderWallDimension = () => {
    if (!drawingStartPoint || !drawingCurrentPoint) {
      return null;
    }

    const [x1, y1] = drawingStartPoint;
    const [x2, y2] = drawingCurrentPoint;

    // Calculate distance
    const dx = x2 - x1;
    const dy = y2 - y1;
    const distancePixels = Math.sqrt(dx * dx + dy * dy);

    // Convert pixel distance to meters, then format based on unit system
    const distanceMeters = pixelsToMeters(distancePixels);
    const distanceText = unitSystem === 'imperial'
      ? formatImperial(distanceMeters)
      : formatMetric(distanceMeters);

    // Calculate midpoint
    const midX = (x1 + x2) / 2;
    const midY = (y1 + y2) / 2;

    // Calculate perpendicular offset for text position
    const lineLength = Math.max(distancePixels, 0.0001);
    const normalX = (-dy) / lineLength;
    const normalY = dx / lineLength;
    const textOffsetDistance = 30; // Distance from the line
    const textX = midX + normalX * textOffsetDistance;
    const textY = midY + normalY * textOffsetDistance;

    // Calculate rotation angle (in degrees)
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);

    // Normalize angle to be between -90 and 90 for readability
    // If text would be upside down, flip it 180 degrees
    const normalizedAngle = angle > 90 ? angle - 180 : angle < -90 ? angle + 180 : angle;

    // Dynamic font size based on zoom
    const fontSize = 16;
    const dynamicFontSize = fontSize / scale;

    return (
      <Text
        x={textX}
        y={textY}
        text={distanceText}
        fontSize={dynamicFontSize}
        fontFamily="Arial, sans-serif"
        fill="#0000FF"
        align="center"
        verticalAlign="middle"
        rotation={normalizedAngle}
        offsetX={0}
        offsetY={0}
      />
    );
  };

  return (
    <Layer name="interactive">
      {/* Display line while drawing */}
      {drawingStartPoint && drawingCurrentPoint && (
        <>
          <Line
            points={[drawingStartPoint, drawingCurrentPoint].flat()} // The correct way to flatten
            stroke="#0000FF"
            strokeWidth={1}
            // dash={[10, 5]} // Removed dash to make the line solid
          />
          {renderWallDimension()}
        </>
      )}
      <WallDrawingTool
        drawingStartPoint={drawingStartPoint}
        drawingCurrentPoint={drawingCurrentPoint}
        scale={scale}
      />
      <SnapIndicator
        snapResult={snapResult}
        visible={isSnappingEnabled}
      />
      {renderDragSelection()}
      {renderShapeDragSelection()}
      {renderDimensionPreview()}
    </Layer>
  );
};
