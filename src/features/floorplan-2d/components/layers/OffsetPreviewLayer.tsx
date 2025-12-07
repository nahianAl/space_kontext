/**
 * Offset preview layer component showing a preview of the offset shape while dragging
 * Displays a dashed preview of the offset shape to visualize the result before finalizing
 * Only visible when the offset tool is active and dragging
 */
import React from 'react';
import { Layer, Line, Circle, Rect, Arrow } from 'react-konva';
import { useOffsetStore } from '../../store/offsetStore';
import type { LineShape, PolylineShape, CircleShape, SquareShape, TriangleShape, ArrowShape, GuideLineShape, CurveShape, ZoneShape } from '../../types/shapes';

export const OffsetPreviewLayer: React.FC = React.memo(() => {
  const previewShape = useOffsetStore((state) => state.previewShape);
  const isOffsetToolActive = useOffsetStore((state) => state.isOffsetToolActive);
  const isDraggingOffset = useOffsetStore((state) => state.isDraggingOffset);

  if (!isOffsetToolActive || !isDraggingOffset || !previewShape) {
    return null;
  }

  const renderPreviewShape = () => {
    const commonProps = {
      stroke: '#00d4ff',
      strokeWidth: 2,
      dash: [8, 4],
      listening: false,
      opacity: 0.7,
    };

    switch (previewShape.type) {
      case 'line':
      case 'guide-line': {
        const shape = previewShape as LineShape | GuideLineShape;
        return (
          <Line
            key={previewShape.id}
            points={[shape.start[0], shape.start[1], shape.end[0], shape.end[1]]}
            {...commonProps}
          />
        );
      }

      case 'arrow': {
        const shape = previewShape as ArrowShape;
        return (
          <Arrow
            key={previewShape.id}
            points={[shape.start[0], shape.start[1], shape.end[0], shape.end[1]]}
            {...commonProps}
            pointerLength={10}
            pointerWidth={10}
          />
        );
      }

      case 'polyline':
      case 'zone': {
        const shape = previewShape as PolylineShape | ZoneShape;
        const points = shape.points.flatMap(p => [p[0], p[1]]);
        const fillColor = shape.type === 'zone' ? 'rgba(0, 212, 255, 0.1)' : undefined;
        return (
          <Line
            key={previewShape.id}
            points={points}
            closed={shape.type === 'zone'}
            {...commonProps}
            {...(fillColor !== undefined && { fill: fillColor })}
          />
        );
      }

      case 'circle': {
        const shape = previewShape as CircleShape;
        return (
          <Circle
            key={previewShape.id}
            x={shape.center[0]}
            y={shape.center[1]}
            radius={shape.radius}
            {...commonProps}
          />
        );
      }

      case 'square': {
        const shape = previewShape as SquareShape;
        return (
          <Rect
            key={previewShape.id}
            x={shape.center[0] - shape.width / 2}
            y={shape.center[1] - shape.height / 2}
            width={shape.width}
            height={shape.height}
            {...commonProps}
          />
        );
      }

      case 'triangle': {
        const shape = previewShape as TriangleShape;
        const points = [
          shape.point1[0], shape.point1[1],
          shape.point2[0], shape.point2[1],
          shape.point3[0], shape.point3[1],
        ];
        return (
          <Line
            key={previewShape.id}
            points={points}
            closed
            {...commonProps}
          />
        );
      }

      case 'curve': {
        const shape = previewShape as CurveShape;
        // Render a quadratic curve using a Line with bezier approximation
        const steps = 20;
        const points: number[] = [];
        for (let i = 0; i <= steps; i++) {
          const t = i / steps;
          const x = (1 - t) * (1 - t) * shape.start[0] + 2 * (1 - t) * t * shape.control[0] + t * t * shape.end[0];
          const y = (1 - t) * (1 - t) * shape.start[1] + 2 * (1 - t) * t * shape.control[1] + t * t * shape.end[1];
          points.push(x, y);
        }
        return (
          <Line
            key={previewShape.id}
            points={points}
            {...commonProps}
          />
        );
      }

      default:
        return null;
    }
  };

  return (
    <Layer listening={false}>
      {renderPreviewShape()}
    </Layer>
  );
});

OffsetPreviewLayer.displayName = 'OffsetPreviewLayer';
