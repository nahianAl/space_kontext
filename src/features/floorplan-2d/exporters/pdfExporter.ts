/**
 * PDF exporter for floor plan export
 * Creates print-ready PDF documents with title block
 */

import jsPDF from 'jspdf';
import type Konva from 'konva';
import type { getWallGraphStore } from '../store/wallGraphStore';
import React from 'react';
import { calculateContentBounds } from '../utils/exportUtils';
import { captureStageAsImage } from './rasterExporter';
import { pixelsToMeters, metersToMillimeters } from '@/lib/units/unitsSystem';
import type { ExportOptions, ContentBounds } from '../types/export';

type WallGraphStoreInstance = ReturnType<typeof getWallGraphStore>;

function pixelsToMillimeters(pixels: number): number {
  const meters = pixelsToMeters(pixels);
  return metersToMillimeters(meters);
}

/**
 * Export as PDF with title block
 */
export async function exportToPDF(
  stageRef: React.RefObject<Konva.Stage>,
  options: ExportOptions,
  wallGraphStore: WallGraphStoreInstance
): Promise<Blob> {
  const bounds = calculateContentBounds(options, wallGraphStore);
  if (!bounds) {
    throw new Error('No content to export');
  }

  const widthMM = pixelsToMillimeters(bounds.width);
  const heightMM = pixelsToMillimeters(bounds.height);

  // Determine orientation
  const isLandscape = widthMM > heightMM;

  // Create PDF with margins
  const marginMM = 20;
  const titleBlockHeight = 40;
  const pdf = new jsPDF({
    orientation: isLandscape ? 'landscape' : 'portrait',
    unit: 'mm',
    format: [
      widthMM + (marginMM * 2),
      heightMM + (marginMM * 2) + titleBlockHeight
    ]
  });

  // Add title block
  pdf.setFontSize(16);
  pdf.text('Floor Plan', marginMM, marginMM);

  pdf.setFontSize(10);
  pdf.text(`Date: ${new Date().toLocaleDateString()}`, marginMM, marginMM + 8);
  pdf.text(`Scale: 1:${calculateScale(bounds)}`, marginMM, marginMM + 14);

  // Capture and add image
  const dataURL = await captureStageAsImage(stageRef, bounds, 'png', 3);
  pdf.addImage(
    dataURL,
    'PNG',
    marginMM,
    marginMM + titleBlockHeight,
    widthMM,
    heightMM
  );

  return pdf.output('blob');
}

/**
 * Calculate architectural scale
 */
function calculateScale(bounds: ContentBounds): number {
  // Standard architectural scales: 1:20, 1:50, 1:100, 1:200
  const standardScales = [20, 50, 100, 200, 500, 1000];

  // Calculate current scale based on content size
  // Assume A3 paper (420mm x 297mm) as target
  const maxDimensionMM = Math.max(
    pixelsToMillimeters(bounds.width),
    pixelsToMillimeters(bounds.height)
  );

  const targetPageSize = 297; // A3 short edge in mm
  const rawScale = maxDimensionMM / targetPageSize;

  // Find closest standard scale
  return standardScales.reduce((prev, curr) =>
    Math.abs(curr - rawScale) < Math.abs(prev - rawScale) ? curr : prev
  );
}

