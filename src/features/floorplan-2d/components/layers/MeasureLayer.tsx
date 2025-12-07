/**
 * Measure layer component rendering measurement lines and distance labels
 * Displays the active measurement when the measure tool is being used
 * Shows distance between two points with formatted units
 */
'use client';

import React from 'react';
import { Line, Text, Group } from 'react-konva';
import { useMeasureStore } from '../../store/measureStore';
import { useWallGraphStoreContext } from '../../context/WallGraphStoreContext';
import { pixelsToMeters, formatMetersAsImperial, formatMetersAsMetric } from '@/lib/units/unitsSystem';

const GUIDELINE_LENGTH = 5000;

// Format meters as imperial (wrapper)
const formatImperial = (meters: number): string => {
  return formatMetersAsImperial(meters);
};

// Format meters as metric (wrapper)
const formatMetric = (meters: number): string => {
  return formatMetersAsMetric(meters);
};

interface MeasureLayerProps {
  scale: number;
}

export const MeasureLayer: React.FC<MeasureLayerProps> = ({ scale }) => {
  const useWallGraphStore = useWallGraphStoreContext();
  const unitSystem = useWallGraphStore((state) => state.unitSystem);
  const isMeasureActive = useMeasureStore((state) => state.isMeasureActive);
  const isMeasuring = useMeasureStore((state) => state.isMeasuring);
  const startPoint = useMeasureStore((state) => state.startPoint);
  const endPoint = useMeasureStore((state) => state.endPoint);
  const currentPoint = useMeasureStore((state) => state.currentPoint);
  const guidelinesEnabled = useMeasureStore((state) => state.guidelinesEnabled);
  const guidelines = useMeasureStore((state) => state.guidelines);
  const removeGuideline = useMeasureStore((state) => state.removeGuideline);

  const displayPoint = isMeasuring && currentPoint ? currentPoint : endPoint;

  const hasMeasurement = isMeasureActive && startPoint && displayPoint;

  if (!hasMeasurement && guidelines.length === 0) {
    return null;
  }

  const [x1, y1] = hasMeasurement && startPoint ? startPoint : [0, 0];
  const [x2, y2] = hasMeasurement && displayPoint ? displayPoint : [0, 0];

  const dx = x2 - x1;
  const dy = y2 - y1;
  const distancePixels = Math.sqrt(dx * dx + dy * dy);

  // Convert pixel distance to meters, then format
  const distanceMeters = pixelsToMeters(distancePixels);

  const distanceText = unitSystem === 'imperial' 
    ? formatImperial(distanceMeters)
    : formatMetric(distanceMeters);

  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2;

  const lineLength = Math.max(distancePixels, 0.0001);
  const normalX = (-dy) / lineLength;
  const normalY = dx / lineLength;
  const textOffsetDistance = 30;
  const textX = midX + normalX * textOffsetDistance;
  const textY = midY + normalY * textOffsetDistance;
  const fontSize = 16;

  // Calculate rotation angle (in degrees)
  const angle = Math.atan2(dy, dx) * (180 / Math.PI);

  // Normalize angle to be between -90 and 90 for readability
  const normalizedAngle = angle > 90 ? angle - 180 : angle < -90 ? angle + 180 : angle;

  // Calculate dynamic stroke widths and dash patterns based on zoom
  const dynamicStrokeWidth = 1 / scale;
  const dynamicMeasureStrokeWidth = 2 / scale;
  const dynamicDashPattern = [10 / scale, 8 / scale];
  const dynamicFontSize = fontSize / scale;

  const dynamicGuideline = hasMeasurement && guidelinesEnabled && isMeasuring && lineLength > 0
    ? [
        x2 - normalX * GUIDELINE_LENGTH,
        y2 - normalY * GUIDELINE_LENGTH,
        x2 + normalX * GUIDELINE_LENGTH,
        y2 + normalY * GUIDELINE_LENGTH,
      ]
    : null;

  return (
    <Group>
      {guidelines.map((guideline) => (
        <Line
          key={guideline.id}
          points={[guideline.start[0], guideline.start[1], guideline.end[0], guideline.end[1]]}
          stroke="#000000"
          strokeWidth={dynamicStrokeWidth}
          dash={dynamicDashPattern}
          onClick={() => removeGuideline(guideline.id)}
          onTap={() => removeGuideline(guideline.id)}
          listening
        />
      ))}

      {hasMeasurement && (
        <>
          {dynamicGuideline && (
            <Line
              points={dynamicGuideline}
              stroke="#000000"
              strokeWidth={dynamicStrokeWidth}
              dash={dynamicDashPattern}
              listening={false}
            />
          )}

          <Line
            points={[x1, y1, x2, y2]}
            stroke="#fc037b"
            strokeWidth={dynamicMeasureStrokeWidth}
          />

          <Text
            x={textX}
            y={textY}
            text={distanceText}
            fontSize={dynamicFontSize}
            fontFamily="Arial, sans-serif"
            fill="#fc037b"
            align="center"
            verticalAlign="middle"
            rotation={normalizedAngle}
            offsetX={0}
            offsetY={0}
          />
        </>
      )}
    </Group>
  );
};

