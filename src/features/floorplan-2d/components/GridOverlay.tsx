/**
 * Grid overlay component for rendering the background grid
 * Displays a visual grid pattern to help with alignment and snapping
 */
'use client';

import React from 'react';
import { Line } from 'react-konva';

interface GridOverlayProps {
  width: number;
  height: number;
  gridSize: number;
  majorGridSize?: number; // Optional: major grid size (defaults to gridSize * 4 if not provided)
  visible: boolean;
  scale: number;
  position: { x: number; y: number };
  viewWidth: number;
  viewHeight: number;
}

const MINOR_GRID_COLOR = '#eaeaea';
const MINOR_GRID_WIDTH = 0.5;
const MAJOR_GRID_COLOR = '#d0d0d0';
const MAJOR_GRID_WIDTH = 1;

export const GridOverlay: React.FC<GridOverlayProps> = ({
  width, height, gridSize, majorGridSize, visible, scale, position, viewWidth, viewHeight
}) => {
  if (!visible || gridSize <= 0) {
    return null;
  }

  // Use provided majorGridSize or default to gridSize * 4
  const effectiveMajorGridSize = majorGridSize ?? gridSize * 4;
  const lines: React.ReactNode[] = [];

  const viewRect = {
    x1: -position.x / scale,
    y1: -position.y / scale,
    x2: (-position.x + viewWidth) / scale,
    y2: (-position.y + viewHeight) / scale,
  };

  const buffer = 100;

  const xStart = Math.floor((viewRect.x1 - buffer) / gridSize) * gridSize;
  const xEnd = Math.ceil((viewRect.x2 + buffer) / gridSize) * gridSize;

  for (let x = xStart; x <= xEnd; x += gridSize) {
    // Use tolerance-based check for floating point numbers (imperial grid values)
    const remainder = Math.abs(x % effectiveMajorGridSize);
    const isMajorLine = remainder < 0.01 || remainder > effectiveMajorGridSize - 0.01;
    lines.push(
      <Line
        key={`v-${x}`}
        points={[x, viewRect.y1 - buffer, x, viewRect.y2 + buffer]}
        stroke={isMajorLine ? MAJOR_GRID_COLOR : MINOR_GRID_COLOR}
        strokeWidth={isMajorLine ? MAJOR_GRID_WIDTH / scale : MINOR_GRID_WIDTH / scale}
        listening={false}
      />
    );
  }

  const yStart = Math.floor((viewRect.y1 - buffer) / gridSize) * gridSize;
  const yEnd = Math.ceil((viewRect.y2 + buffer) / gridSize) * gridSize;

  for (let y = yStart; y <= yEnd; y += gridSize) {
    // Use tolerance-based check for floating point numbers (imperial grid values)
    const remainder = Math.abs(y % effectiveMajorGridSize);
    const isMajorLine = remainder < 0.01 || remainder > effectiveMajorGridSize - 0.01;
    lines.push(
      <Line
        key={`h-${y}`}
        points={[viewRect.x1 - buffer, y, viewRect.x2 + buffer, y]}
        stroke={isMajorLine ? MAJOR_GRID_COLOR : MINOR_GRID_COLOR}
        strokeWidth={isMajorLine ? MAJOR_GRID_WIDTH / scale : MINOR_GRID_WIDTH / scale}
        listening={false}
      />
    );
  }

  return <>{lines}</>;
};
