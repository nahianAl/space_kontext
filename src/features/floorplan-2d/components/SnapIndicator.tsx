/**
 * Snap indicator component showing visual feedback when snapping occurs
 * Displays a visual marker at the snap point to indicate successful snapping
 * Provides user feedback during drawing operations
 */

import React from 'react';
import { Circle, Line } from 'react-konva';
import { Point } from '../types/wallGraph';

interface SnapIndicatorProps {
  snapResult: {
    point: Point;
    snapped: boolean;
    snapType?: 'grid' | 'wall' | 'node';
    snapTarget?: Point;
  } | null;
  visible: boolean;
}

export const SnapIndicator: React.FC<SnapIndicatorProps> = ({ snapResult, visible }) => {
  if (!visible || !snapResult || !snapResult.snapped) {
    return null;
  }

  const [x, y] = snapResult.point;
  const [targetX, targetY] = snapResult.snapTarget || snapResult.point;

  const getSnapColor = (snapType?: string) => {
    switch (snapType) {
      case 'node': return '#EF4444'; // Red for nodes
      case 'wall': return '#0f7787'; // Teal for walls
      case 'grid': return '#0f7787'; // Teal for grid
      default: return '#6B7280'; // Gray for unknown
    }
  };

  const color = getSnapColor(snapResult.snapType);

  return (
    <>
      {/* Snap target circle */}
      <Circle
        x={targetX}
        y={targetY}
        radius={4}
        fill={color}
        stroke="#FFFFFF"
        strokeWidth={1}
        opacity={0.8}
        listening={false}
      />
      
      {/* Connection line from cursor to snap point */}
      <Line
        points={[x, y, targetX, targetY]}
        stroke={color}
        strokeWidth={1}
        dash={[3, 3]}
        opacity={0.6}
        listening={false}
      />
    </>
  );
};
