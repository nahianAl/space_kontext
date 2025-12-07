/**
 * Raster exporters for JPG and PNG formats
 * Captures Konva stage as high-resolution images
 */

import React from 'react';
import type Konva from 'konva';
import type { getWallGraphStore } from '../store/wallGraphStore';
import { calculateContentBounds } from '../utils/exportUtils';
import type { ExportOptions } from '../types/export';

type WallGraphStoreInstance = ReturnType<typeof getWallGraphStore>;

/**
 * Capture Konva stage as high-resolution image
 */
export async function captureStageAsImage(
  stageRef: React.RefObject<Konva.Stage>,
  bounds: { minX: number; minY: number; width: number; height: number },
  format: 'png' | 'jpeg',
  pixelRatio: number = 3
): Promise<string> {
  const stage = stageRef.current;
  if (!stage) {
    throw new Error('Stage not available');
  }

  // Save original state
  const originalPos = stage.position();
  const originalScale = stage.scaleX();

  // Calculate scale to fit content in viewport
  const viewport = stage.size();
  const scaleX = viewport.width / bounds.width;
  const scaleY = viewport.height / bounds.height;
  const fitScale = Math.min(scaleX, scaleY) * 0.95;

  // Position stage to show content
  stage.position({
    x: -bounds.minX * fitScale + (viewport.width - bounds.width * fitScale) / 2,
    y: -bounds.minY * fitScale + (viewport.height - bounds.height * fitScale) / 2
  });
  stage.scaleX(fitScale);
  stage.scaleY(fitScale);
  stage.batchDraw();

  // Wait for render
  await new Promise(resolve => setTimeout(resolve, 100));

  // Capture image
  const dataURL = stage.toDataURL({
    mimeType: `image/${format}`,
    pixelRatio,
    x: bounds.minX,
    y: bounds.minY,
    width: bounds.width,
    height: bounds.height
  });

  // Restore original state
  stage.position(originalPos);
  stage.scaleX(originalScale);
  stage.scaleY(originalScale);
  stage.batchDraw();

  return dataURL;
}

/**
 * Export as JPG
 */
export async function exportToJPG(
  stageRef: React.RefObject<Konva.Stage>,
  options: ExportOptions,
  wallGraphStore: WallGraphStoreInstance
): Promise<Blob> {
  const bounds = calculateContentBounds(options, wallGraphStore);
  if (!bounds) {
    throw new Error('No content to export');
  }

  const dataURL = await captureStageAsImage(stageRef, bounds, 'jpeg', 3);
  const response = await fetch(dataURL);
  return response.blob();
}

