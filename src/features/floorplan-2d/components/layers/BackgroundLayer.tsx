/**
 * Background layer component rendering the grid overlay
 * Provides the base visual reference for the canvas with grid lines
 */
'use client';

import React from 'react';
import { Layer } from 'react-konva';
import { GridOverlay } from '../GridOverlay';

interface BackgroundLayerProps {
  width: number;
  height: number;
  gridSize: number;
  majorGridSize?: number; // Optional: major grid size (defaults to gridSize * 4 if not provided)
  gridVisible: boolean;
  scale: number;
  position: { x: number; y: number };
  viewWidth: number; // Viewport width
  viewHeight: number; // Viewport height
}

export const BackgroundLayer: React.FC<BackgroundLayerProps> = ({
  width,
  height,
  gridSize,
  majorGridSize,
  gridVisible,
  scale,
  position,
  viewWidth,
  viewHeight,
}) => {
  return (
    <Layer listening={false}>
      <GridOverlay
        width={width}
        height={height}
        gridSize={gridSize}
        {...(majorGridSize !== undefined && { majorGridSize })}
        visible={gridVisible}
        scale={scale}
        position={position}
        viewWidth={viewWidth}
        viewHeight={viewHeight}
      />
    </Layer>
  );
};
