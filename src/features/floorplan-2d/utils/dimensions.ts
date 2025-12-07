/**
 * Dimension utility functions for converting between pixels and architectural measurements
 * Uses meters as the base storage unit (100px = 1 meter)
 * Provides functions for pixel-to-feet/inches conversion and formatted dimension strings
 */
import { pixelsToMeters, metersToInches, formatMetersAsImperial, formatMetersAsMetric } from '@/lib/units/unitsSystem';

export interface Dimension {
  feet: number;
  inches: number;
  totalInches: number;
}

/**
 * Convert pixels to feet and inches
 * @param pixels - Number of pixels
 * @returns Dimension object with feet, inches, and total inches
 */
export const pixelsToFeetInches = (pixels: number): Dimension => {
  // Convert pixels → meters → inches
  const meters = pixelsToMeters(pixels);
  const totalInches = metersToInches(meters);
  const feet = Math.floor(totalInches / 12);
  const inches = Math.round((totalInches % 12) * 16) / 16; // Round to nearest 1/16 inch
  
  return {
    feet,
    inches,
    totalInches
  };
};

/**
 * Format dimension as a readable string
 * @param dimension - Dimension object
 * @returns Formatted string like "12' 6\""
 */
export const formatDimension = (dimension: Dimension): string => {
  if (dimension.feet === 0 && dimension.inches === 0) {
    return "0\"";
  }
  
  if (dimension.feet === 0) {
    return `${dimension.inches}"`;
  }
  
  if (dimension.inches === 0) {
    return `${dimension.feet}'`;
  }
  
  return `${dimension.feet}' ${dimension.inches}"`;
};

/**
 * Calculate wall length in meters (from pixel distance)
 * @param startPoint - Start point of wall (in pixels)
 * @param endPoint - End point of wall (in pixels)
 * @returns Length in meters
 */
export const calculateWallLengthMeters = (
  startPoint: { x: number; y: number },
  endPoint: { x: number; y: number }
): number => {
  const dx = endPoint.x - startPoint.x;
  const dy = endPoint.y - startPoint.y;
  const pixels = Math.sqrt(dx * dx + dy * dy);
  return pixelsToMeters(pixels); // Return meters
};

/**
 * Get wall dimension as formatted string
 * @param startPoint - Start point of wall (in pixels)
 * @param endPoint - End point of wall (in pixels)
 * @param unitSystem - Unit system for formatting
 * @returns Formatted dimension string
 */
export const getWallDimension = (
  startPoint: { x: number; y: number },
  endPoint: { x: number; y: number },
  unitSystem: 'imperial' | 'metric' = 'imperial'
): string => {
  const meters = calculateWallLengthMeters(startPoint, endPoint);
  if (unitSystem === 'imperial') {
    return formatMetersAsImperial(meters);
  }
  return formatMetersAsMetric(meters);
};

/**
 * Calculate the area of a polygon using the shoelace formula
 * @param points - Array of points [x, y] representing the polygon vertices
 * @returns Area in square pixels
 */
export const calculatePolygonArea = (points: Array<[number, number]>): number => {
  if (points.length < 3) {
    return 0;
  }
  
  let area = 0;
  for (let i = 0; i < points.length; i++) {
    const j = (i + 1) % points.length;
    const pointI = points[i];
    const pointJ = points[j];
    if (!pointI || !pointJ) {
      continue;
    }
    area += pointI[0] * pointJ[1];
    area -= pointJ[0] * pointI[1];
  }
  return Math.abs(area) / 2;
};

/**
 * Calculate the centroid (center of mass) of a polygon
 * @param points - Array of points [x, y] representing the polygon vertices
 * @returns Centroid point [x, y]
 */
export const calculatePolygonCentroid = (points: Array<[number, number]>): [number, number] => {
  if (points.length === 0) {
    return [0, 0];
  }
  if (points.length === 1) {
    const firstPoint = points[0];
    return firstPoint ? firstPoint : [0, 0];
  }
  
  let sumX = 0;
  let sumY = 0;
  for (const [x, y] of points) {
    sumX += x;
    sumY += y;
  }
  return [sumX / points.length, sumY / points.length];
};

/**
 * Convert square pixels to square meters
 * @param squarePixels - Area in square pixels
 * @returns Area in square meters
 */
export const squarePixelsToSquareMeters = (squarePixels: number): number => {
  const metersPerPixel = pixelsToMeters(1); // 0.01 meters per pixel
  return squarePixels * (metersPerPixel * metersPerPixel);
};

/**
 * Convert square pixels to square feet
 * @param squarePixels - Area in square pixels
 * @returns Area in square feet
 */
export const squarePixelsToSquareFeet = (squarePixels: number): number => {
  const squareMeters = squarePixelsToSquareMeters(squarePixels);
  const metersPerFoot = 0.3048; // METERS_PER_FOOT
  return squareMeters / (metersPerFoot * metersPerFoot);
};

/**
 * Format area for display
 * @param squarePixels - Area in square pixels
 * @param unitSystem - 'imperial' or 'metric'
 * @returns Formatted area string
 */
export const formatArea = (squarePixels: number, unitSystem: 'imperial' | 'metric'): string => {
  if (unitSystem === 'imperial') {
    const squareFeet = squarePixelsToSquareFeet(squarePixels);
    if (squareFeet < 1) {
      const squareInches = squareFeet * 144;
      return `${squareInches.toFixed(1)} sq in`;
    }
    return `${squareFeet.toFixed(2)} sq ft`;
  } else {
    const squareMeters = squarePixelsToSquareMeters(squarePixels);
    if (squareMeters < 1) {
      const squareCentimeters = squareMeters * 10000;
      return `${squareCentimeters.toFixed(0)} sq cm`;
    }
    return `${squareMeters.toFixed(2)} sq m`;
  }
};
