/**
 * Area calculation utilities for site analysis
 * Provides functions to calculate area from GeoJSON and convert between units
 */
import type { GeoJSON } from 'geojson';
import * as turf from '@turf/turf';

/**
 * Calculate area in square meters from a GeoJSON polygon
 * @param polygon GeoJSON Polygon or FeatureCollection containing polygons
 * @returns Area in square meters
 */
export function calculateAreaSqMeters(
  polygon: GeoJSON.Polygon | GeoJSON.FeatureCollection
): number {
  try {
    if (polygon.type === 'FeatureCollection') {
      // Sum areas of all features
      return polygon.features.reduce((total, feature) => {
        if (feature.geometry.type === 'Polygon') {
          return total + turf.area(feature);
        }
        return total;
      }, 0);
    } else if (polygon.type === 'Polygon') {
      return turf.area(turf.polygon(polygon.coordinates));
    }
    return 0;
  } catch (error) {
    console.error('Error calculating area:', error);
    return 0;
  }
}

/**
 * Convert square meters to square feet
 * @param sqMeters Area in square meters
 * @returns Area in square feet
 */
export function sqMetersToSqFeet(sqMeters: number): number {
  return sqMeters * 10.7639; // 1 square meter = 10.7639 square feet
}

/**
 * Convert square feet to square meters
 * @param sqFeet Area in square feet
 * @returns Area in square meters
 */
export function sqFeetToSqMeters(sqFeet: number): number {
  return sqFeet / 10.7639;
}

/**
 * Calculate area in square feet from a GeoJSON polygon
 * @param polygon GeoJSON Polygon or FeatureCollection containing polygons
 * @returns Area in square feet
 */
export function calculateAreaSqFeet(
  polygon: GeoJSON.Polygon | GeoJSON.FeatureCollection
): number {
  const sqMeters = calculateAreaSqMeters(polygon);
  return sqMetersToSqFeet(sqMeters);
}

/**
 * Format area for display
 * @param sqFeet Area in square feet
 * @param decimals Number of decimal places (default: 2)
 * @returns Formatted string with units
 */
export function formatArea(sqFeet: number, decimals: number = 2): string {
  if (sqFeet >= 43560) {
    // Convert to acres for large areas
    const acres = sqFeet / 43560;
    return `${acres.toFixed(decimals)} acres (${sqFeet.toLocaleString('en-US', { maximumFractionDigits: decimals })} sq ft)`;
  }
  return `${sqFeet.toLocaleString('en-US', { maximumFractionDigits: decimals })} sq ft`;
}

