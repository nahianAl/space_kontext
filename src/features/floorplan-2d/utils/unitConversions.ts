/**
 * Unit conversion utilities - Re-exports from central units system
 * This file maintains backward compatibility while delegating to the central units system
 */
import type { UnitSystem } from '@/lib/units/unitsSystem';
export type { UnitSystem };

export {
  PIXELS_PER_METER,
  METERS_PER_PIXEL,
  PRECISION,
  COORDINATE_LIMITS,
  pixelsToMeters,
  metersToPixels,
  metersToFeet,
  feetToMeters,
  metersToInches,
  inchesToMeters,
  metersToCentimeters,
  centimetersToMeters,
  metersToMillimeters,
  millimetersToMeters,
  formatMetersAsImperial,
  formatMetersAsMetric,
  roundToMicrometer,
  areEqual,
  arePointsCoincident,
  validateCoordinate,
  validateDistance,
} from '@/lib/units/unitsSystem';

// Legacy-specific wrapper functions that convert user input to pixels/meters
import { inchesToMeters, centimetersToMeters, metersToPixels, metersToMillimeters } from '@/lib/units/unitsSystem';

/**
 * Convert width from user units to pixels (for rendering)
 * @param width - Width in inches (imperial) or cm (metric)
 * @param system - Unit system
 * @returns Width in pixels
 */
export const widthToPixels = (width: number, system: UnitSystem): number => {
  // width comes in as inches (imperial) or cm (metric)
  const meters = system === 'imperial'
    ? inchesToMeters(width)
    : centimetersToMeters(width);
  return metersToPixels(meters);
};

/**
 * Convert height from user units to meters
 * @param height - Height in inches (imperial) or cm (metric)
 * @param system - Unit system
 * @returns Height in meters
 */
export const heightToMeters = (height: number, system: UnitSystem): number => {
  if (system === 'imperial') {
    return inchesToMeters(height);
  }
  return centimetersToMeters(height);
};

/**
 * Convert sill height from user units to millimeters
 * @param sillHeight - Sill height in inches (imperial) or cm (metric)
 * @param system - Unit system
 * @returns Sill height in millimeters
 */
export const sillHeightToMillimeters = (sillHeight: number, system: UnitSystem): number => {
  const meters = heightToMeters(sillHeight, system);
  return metersToMillimeters(meters);
};

/**
 * Convert user height to meters with fallback
 */
export const userHeightToUnitMeters = (height: number | undefined, system: UnitSystem, fallback: number): number => {
  if (height === undefined) {
    return fallback;
  }
  return heightToMeters(height, system);
};

/**
 * Convert user sill height to millimeters with fallback
 */
export const userSillToMillimeters = (
  userSillHeight: number | undefined,
  openingSystem: UnitSystem,
  defaultSystem: UnitSystem,
  defaultSillHeight: number
): number => {
  if (userSillHeight === undefined) {
    return sillHeightToMillimeters(defaultSillHeight, defaultSystem);
  }
  return sillHeightToMillimeters(userSillHeight, openingSystem);
};

