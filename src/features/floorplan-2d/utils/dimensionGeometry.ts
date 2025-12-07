/**
 * Geometry utilities for dimension annotations
 * Handles dimension line positioning, extension lines, and arrow heads
 * 
 * NOTE: This module works in canvas pixel space for rendering calculations.
 * All geometric calculations (distances, positions) are in pixels.
 * Conversion to meters happens in the display layer (DimensionRenderer).
 */

import type { Point } from '../types/wallGraph';

export interface DimensionGeometry {
  // Extension line 1 (from start point)
  extension1Start: Point;
  extension1End: Point;

  // Extension line 2 (from end point)
  extension2Start: Point;
  extension2End: Point;

  // Dimension line
  dimensionLineStart: Point;
  dimensionLineEnd: Point;

  // Text position (center of dimension line)
  textPosition: Point;
  textRotation: number; // in degrees

  // Measured distance
  distance: number;
}

/**
 * Calculate dimension geometry for aligned dimensions
 * @param startPoint - First measured point
 * @param endPoint - Second measured point
 * @param offset - Perpendicular offset from the measured line
 * @returns Dimension geometry
 */
export const calculateAlignedDimensionGeometry = (
  startPoint: Point,
  endPoint: Point,
  offset: number
): DimensionGeometry => {
  const [x1, y1] = startPoint;
  const [x2, y2] = endPoint;

  // Calculate distance
  const dx = x2 - x1;
  const dy = y2 - y1;
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance === 0) {
    // Degenerate case - return default geometry
    return {
      extension1Start: startPoint,
      extension1End: startPoint,
      extension2Start: endPoint,
      extension2End: endPoint,
      dimensionLineStart: startPoint,
      dimensionLineEnd: endPoint,
      textPosition: startPoint,
      textRotation: 0,
      distance: 0,
    };
  }

  // Unit vector along the measured line
  const ux = dx / distance;
  const uy = dy / distance;

  // Perpendicular vector (rotate 90° counterclockwise)
  const perpX = -uy;
  const perpY = ux;

  // Calculate dimension line endpoints (offset from measured line)
  const dimLineStartX = x1 + perpX * offset;
  const dimLineStartY = y1 + perpY * offset;
  const dimLineEndX = x2 + perpX * offset;
  const dimLineEndY = y2 + perpY * offset;

  // Extension lines: from measured points to dimension line (slightly beyond)
  const extensionOverhang = 5; // pixels beyond dimension line
  const ext1EndX = dimLineStartX + perpX * extensionOverhang;
  const ext1EndY = dimLineStartY + perpY * extensionOverhang;
  const ext2EndX = dimLineEndX + perpX * extensionOverhang;
  const ext2EndY = dimLineEndY + perpY * extensionOverhang;

  // Text position (center of dimension line)
  const textX = (dimLineStartX + dimLineEndX) / 2;
  const textY = (dimLineStartY + dimLineEndY) / 2;

  // Text rotation (align with dimension line)
  const angle = Math.atan2(dy, dx);
  let textRotation = angle * (180 / Math.PI);

  // Keep text right-side up (avoid upside-down text)
  if (textRotation > 90) {
    textRotation -= 180;
  } else if (textRotation < -90) {
    textRotation += 180;
  }

  return {
    extension1Start: startPoint,
    extension1End: [ext1EndX, ext1EndY],
    extension2Start: endPoint,
    extension2End: [ext2EndX, ext2EndY],
    dimensionLineStart: [dimLineStartX, dimLineStartY],
    dimensionLineEnd: [dimLineEndX, dimLineEndY],
    textPosition: [textX, textY],
    textRotation,
    distance,
  };
};

/**
 * Calculate dimension geometry for horizontal dimensions
 * @param startPoint - First measured point
 * @param endPoint - Second measured point
 * @param offset - Vertical offset from the measured points
 * @returns Dimension geometry
 */
export const calculateHorizontalDimensionGeometry = (
  startPoint: Point,
  endPoint: Point,
  offset: number
): DimensionGeometry => {
  const [x1, y1] = startPoint;
  const [x2, y2] = endPoint;

  // Horizontal distance
  const distance = Math.abs(x2 - x1);

  // Determine dimension line Y position (use offset from the higher point)
  const dimLineY = Math.min(y1, y2) - Math.abs(offset);

  // Extension lines: vertical lines from points to dimension line
  const extensionOverhang = 5;

  return {
    extension1Start: startPoint,
    extension1End: [x1, dimLineY - extensionOverhang],
    extension2Start: endPoint,
    extension2End: [x2, dimLineY - extensionOverhang],
    dimensionLineStart: [x1, dimLineY],
    dimensionLineEnd: [x2, dimLineY],
    textPosition: [(x1 + x2) / 2, dimLineY],
    textRotation: 0, // Always horizontal
    distance,
  };
};

/**
 * Calculate dimension geometry for vertical dimensions
 * @param startPoint - First measured point
 * @param endPoint - Second measured point
 * @param offset - Horizontal offset from the measured points
 * @returns Dimension geometry
 */
export const calculateVerticalDimensionGeometry = (
  startPoint: Point,
  endPoint: Point,
  offset: number
): DimensionGeometry => {
  const [x1, y1] = startPoint;
  const [x2, y2] = endPoint;

  // Vertical distance
  const distance = Math.abs(y2 - y1);

  // Determine dimension line X position (use offset from the leftmost point)
  const dimLineX = Math.min(x1, x2) - Math.abs(offset);

  // Extension lines: horizontal lines from points to dimension line
  const extensionOverhang = 5;

  return {
    extension1Start: startPoint,
    extension1End: [dimLineX - extensionOverhang, y1],
    extension2Start: endPoint,
    extension2End: [dimLineX - extensionOverhang, y2],
    dimensionLineStart: [dimLineX, y1],
    dimensionLineEnd: [dimLineX, y2],
    textPosition: [dimLineX, (y1 + y2) / 2],
    textRotation: -90, // Vertical text
    distance,
  };
};

/**
 * Calculate arrow head geometry for dimension lines
 * @param lineStart - Start of dimension line
 * @param lineEnd - End of dimension line
 * @param arrowLength - Length of arrow head
 * @param arrowWidth - Width of arrow head
 * @param atStart - Whether to draw arrow at start (true) or end (false)
 * @returns Array of points for arrow head polygon
 */
export const calculateArrowHead = (
  lineStart: Point,
  lineEnd: Point,
  arrowLength: number = 8,
  arrowWidth: number = 4,
  atStart: boolean = false
): Point[] => {
  const [x1, y1] = lineStart;
  const [x2, y2] = lineEnd;

  const dx = x2 - x1;
  const dy = y2 - y1;
  const length = Math.sqrt(dx * dx + dy * dy);

  if (length === 0) {
    return [];
  }

  const ux = dx / length;
  const uy = dy / length;

  // Perpendicular vector
  const perpX = -uy;
  const perpY = ux;

  // Arrow tip position
  const tipX = atStart ? x1 : x2;
  const tipY = atStart ? y1 : y2;

  // Arrow base position
  const baseX = atStart ? x1 + ux * arrowLength : x2 - ux * arrowLength;
  const baseY = atStart ? y1 + uy * arrowLength : y2 - uy * arrowLength;

  // Arrow head points (filled triangle)
  return [
    [tipX, tipY],
    [baseX + perpX * arrowWidth, baseY + perpY * arrowWidth],
    [baseX - perpX * arrowWidth, baseY - perpY * arrowWidth],
  ];
};

/**
 * Calculate slash mark geometry for dimension lines
 * @param lineStart - Start of dimension line
 * @param lineEnd - End of dimension line
 * @param slashLength - Length of slash mark
 * @param atStart - Whether to draw slash at start (true) or end (false)
 * @returns Points for slash line [x1, y1, x2, y2]
 */
export const calculateSlashMark = (
  lineStart: Point,
  lineEnd: Point,
  slashLength: number = 10,
  atStart: boolean = false
): [Point, Point] => {
  const [x1, y1] = lineStart;
  const [x2, y2] = lineEnd;

  const dx = x2 - x1;
  const dy = y2 - y1;
  const length = Math.sqrt(dx * dx + dy * dy);

  if (length === 0) {
    return [lineStart, lineStart];
  }

  const ux = dx / length;
  const uy = dy / length;

  // Perpendicular vector (for slash angle)
  const perpX = -uy;
  const perpY = ux;

  // Slash center position
  const centerX = atStart ? x1 : x2;
  const centerY = atStart ? y1 : y2;

  // Slash endpoints (45° angle)
  const halfLength = slashLength / 2;
  return [
    [centerX - perpX * halfLength, centerY - perpY * halfLength],
    [centerX + perpX * halfLength, centerY + perpY * halfLength],
  ];
};
