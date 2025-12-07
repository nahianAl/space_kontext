/**
 * Units System - Single source of truth for all unit conversions
 * 
 * Three-layer architecture:
 * 1. Canvas Layer: Pixels (for rendering only)
 * 2. Storage Layer: Meters (single source of truth, 6 decimal precision)
 * 3. Display Layer: Formatted strings (imperial/metric based on user preference)
 * 
 * CRITICAL: All geometric data is stored in METERS. Only node positions are in pixels.
 */

// ============================================================================
// PHASE 1: Core Constants (MUST BE FIRST - all other code depends on these)
// ============================================================================

/** Physical constant: meters per foot (international foot definition) */
export const METERS_PER_FOOT = 0.3048;

/** Number of inches in a foot */
export const INCHES_PER_FOOT = 12;

/** Number of centimeters in a meter */
export const CENTIMETERS_PER_METER = 100;

/** Number of millimeters in a meter */
export const MILLIMETERS_PER_METER = 1000;

/** Viewport rendering scale: 100 canvas pixels = 1 meter in real world */
export const PIXELS_PER_METER = 100;

/** Derived: meters per pixel (for pixel to meter conversion) */
export const METERS_PER_PIXEL = 1 / PIXELS_PER_METER;  // = 0.01

/** Derived: pixels per foot (calculated from base constants, NEVER hardcode!) */
export const PIXELS_PER_FOOT = PIXELS_PER_METER * METERS_PER_FOOT;  // = 30.48

// ============================================================================
// PHASE 2: Core Pixel/Meter Conversions (Canvas ↔ Storage)
// ============================================================================

/**
 * Convert canvas pixels to meters (for storage)
 * @example pixelsToMeters(100) → 1.0 meters
 * @example pixelsToMeters(381) → 3.81 meters
 */
export function pixelsToMeters(pixels: number): number {
  return pixels * METERS_PER_PIXEL;  // pixels / 100
}

/**
 * Convert meters to canvas pixels (for rendering)
 * @example metersToPixels(1.0) → 100 pixels
 * @example metersToPixels(3.81) → 381 pixels
 */
export function metersToPixels(meters: number): number {
  return meters * PIXELS_PER_METER;  // meters * 100
}

// ============================================================================
// PHASE 3: Imperial Conversions (Storage ↔ Imperial Units)
// ============================================================================

/**
 * Convert meters to feet
 * CRITICAL: This is NOT a 1:1 conversion! 1 meter ≠ 1 foot
 * @example metersToFeet(0.3048) → 1.0 feet
 * @example metersToFeet(3.81) → 12.5 feet
 * @example metersToFeet(4.0) → 13.123 feet (NOT 4 feet!)
 */
export function metersToFeet(meters: number): number {
  return meters / METERS_PER_FOOT;
}

/**
 * Convert feet to meters
 * @example feetToMeters(1.0) → 0.3048 meters
 * @example feetToMeters(12.5) → 3.81 meters
 */
export function feetToMeters(feet: number): number {
  return feet * METERS_PER_FOOT;
}

/**
 * Convert meters to total inches
 * CRITICAL: Must convert to feet first, then to inches
 * @example metersToInches(0.3048) → 12.0 inches
 * @example metersToInches(3.81) → 150.0 inches (12.5 feet × 12)
 * @example metersToInches(4.0) → 157.48 inches (13.123 feet × 12)
 */
export function metersToInches(meters: number): number {
  const feet = metersToFeet(meters);
  return feet * INCHES_PER_FOOT;
}

/**
 * Convert inches to meters
 * @example inchesToMeters(12.0) → 0.3048 meters
 * @example inchesToMeters(150.0) → 3.81 meters
 */
export function inchesToMeters(inches: number): number {
  const feet = inches / INCHES_PER_FOOT;
  return feetToMeters(feet);
}

// ============================================================================
// PHASE 4: Metric Conversions (Storage ↔ Metric Display Units)
// ============================================================================

/**
 * Convert meters to centimeters
 * @example metersToCentimeters(1.0) → 100 cm
 * @example metersToCentimeters(3.81) → 381 cm
 */
export function metersToCentimeters(meters: number): number {
  return meters * CENTIMETERS_PER_METER;
}

/**
 * Convert centimeters to meters
 * @example centimetersToMeters(100) → 1.0 meters
 * @example centimetersToMeters(381) → 3.81 meters
 */
export function centimetersToMeters(cm: number): number {
  return cm / CENTIMETERS_PER_METER;
}

/**
 * Convert meters to millimeters
 * @example metersToMillimeters(1.0) → 1000 mm
 * @example metersToMillimeters(3.81) → 3810 mm
 */
export function metersToMillimeters(meters: number): number {
  return meters * MILLIMETERS_PER_METER;
}

/**
 * Convert millimeters to meters
 * @example millimetersToMeters(1000) → 1.0 meters
 * @example millimetersToMeters(3810) → 3.81 meters
 */
export function millimetersToMeters(mm: number): number {
  return mm / MILLIMETERS_PER_METER;
}

// ============================================================================
// PHASE 5: Display Formatting (Storage → User-Facing Strings)
// ============================================================================

/**
 * Format meters as imperial feet-inches string
 *
 * CRITICAL IMPLEMENTATION NOTES:
 * 1. MUST call metersToInches() first - DO NOT treat meters as feet!
 * 2. Convert total inches to feet + remaining inches
 * 3. Round inches to 1/16" precision for display
 *
 * COMMON BUG TO AVOID:
 * ❌ const feet = Math.floor(meters);  // WRONG! Treats meters as feet!
 * ✅ const totalInches = metersToInches(meters);  // CORRECT!
 *
 * @example formatMetersAsImperial(0.3048) → "1' 0\""
 * @example formatMetersAsImperial(3.81) → "12' 6\""
 * @example formatMetersAsImperial(4.0) → "13' 1.5\"" (NOT "4' 0\"!)
 * @example formatMetersAsImperial(12.192) → "40' 0\""
 */
export function formatMetersAsImperial(meters: number): string {
  // Step 1: Convert meters to total inches (CRITICAL!)
  const totalInches = metersToInches(meters);

  // Step 2: Calculate feet and remaining inches
  let feet = Math.floor(totalInches / INCHES_PER_FOOT);
    const remainingInches = totalInches % INCHES_PER_FOOT;

  // Step 3: Round to 1/16 inch precision for display
  let inches = Math.round(remainingInches * 16) / 16;

  // Step 4: Handle case where inches equals 12 (should be converted to 1 foot)
  // This can happen due to floating point precision issues
  if (inches >= 12) {
    const additionalFeet = Math.floor(inches / 12);
    feet += additionalFeet;
    inches = inches % 12;
  }

  // Step 5: Format based on values
  if (feet === 0 && inches === 0) {
    return '0"';
  }
  if (feet === 0) {
    return `${inches}"`;
  }
  if (inches === 0) {
    return `${feet}'`;
  }
  return `${feet}' ${inches}"`;
}

/**
 * Format meters as metric meters-centimeters string
 *
 * @example formatMetersAsMetric(1.0) → "1 m"
 * @example formatMetersAsMetric(3.81) → "3 m 81 cm"
 * @example formatMetersAsMetric(4.0) → "4 m"
 * @example formatMetersAsMetric(0.5) → "50 cm"
 */
export function formatMetersAsMetric(meters: number): string {
  const wholePart = Math.floor(meters);
  const fractionalPart = meters - wholePart;
  const centimeters = Math.round(fractionalPart * CENTIMETERS_PER_METER);

  if (wholePart === 0 && centimeters === 0) {
    return '0 m';
  }
  if (wholePart === 0) {
    return `${centimeters} cm`;
  }
  if (centimeters === 0) {
    return `${wholePart} m`;
  }
  return `${wholePart} m ${centimeters} cm`;
}

// ============================================================================
// PHASE 6: User Input Parsing (User Strings → Storage Meters)
// ============================================================================

/**
 * Parse imperial input string to meters
 * Supports formats: "12' 6\"", "12'6\"", "12' 6", "12.5'", "6\"", "12ft 6in"
 * @returns meters or null if invalid
 */
export function parseImperialInput(input: string): number | null {
  if (!input || typeof input !== 'string') {
    return null;
  }

  const trimmed = input.trim();
  if (trimmed === '') {
    return null;
  }

  // Pattern 1: "12' 6\"" or "12'6\"" or "12' 6"
  const pattern1 = /^(\d+(?:\.\d+)?)\s*['']\s*(\d+(?:\.\d+)?)?\s*[""]?$/;
  const match1 = trimmed.match(pattern1);
  if (match1 && match1[1]) {
    const feet = parseFloat(match1[1]);
    const inches = match1[2] ? parseFloat(match1[2]) : 0;
    return feetToMeters(feet) + inchesToMeters(inches);
  }

  // Pattern 2: "12.5'" or "12.5 ft" or "12.5 feet"
  const pattern2 = /^(\d+(?:\.\d+)?)\s*(?:'|ft|feet)$/;
  const match2 = trimmed.match(pattern2);
  if (match2 && match2[1]) {
    const feet = parseFloat(match2[1]);
    return feetToMeters(feet);
  }

  // Pattern 3: "6\"" or "6 in" or "6 inches"
  const pattern3 = /^(\d+(?:\.\d+)?)\s*(?:"|in|inches)$/;
  const match3 = trimmed.match(pattern3);
  if (match3 && match3[1]) {
    const inches = parseFloat(match3[1]);
    return inchesToMeters(inches);
  }

  // Pattern 4: "12ft 6in" or "12 ft 6 in"
  const pattern4 = /^(\d+(?:\.\d+)?)\s*(?:ft|feet)\s+(\d+(?:\.\d+)?)\s*(?:in|inches)$/;
  const match4 = trimmed.match(pattern4);
  if (match4 && match4[1] && match4[2]) {
    const feet = parseFloat(match4[1]);
    const inches = parseFloat(match4[2]);
    return feetToMeters(feet) + inchesToMeters(inches);
  }

  // Pattern 5: Just a number (assume feet)
  const pattern5 = /^(\d+(?:\.\d+)?)$/;
  const match5 = trimmed.match(pattern5);
  if (match5 && match5[1]) {
    const feet = parseFloat(match5[1]);
    return feetToMeters(feet);
  }

  return null;
}

/**
 * Parse metric input string to meters
 * Supports formats: "3 m 81 cm", "3m 81cm", "3.81m", "381cm"
 * @returns meters or null if invalid
 */
export function parseMetricInput(input: string): number | null {
  if (!input || typeof input !== 'string') {
    return null;
  }

  const trimmed = input.trim();
  if (trimmed === '') {
    return null;
  }

  // Pattern 1: "3 m 81 cm" or "3m 81cm"
  const pattern1 = /^(\d+(?:\.\d+)?)\s*m\s+(\d+(?:\.\d+)?)\s*cm$/;
  const match1 = trimmed.match(pattern1);
  if (match1 && match1[1] && match1[2]) {
    const meters = parseFloat(match1[1]);
    const cm = parseFloat(match1[2]);
    return meters + centimetersToMeters(cm);
  }

  // Pattern 2: "3.81m" or "3.81 m"
  const pattern2 = /^(\d+(?:\.\d+)?)\s*m$/;
  const match2 = trimmed.match(pattern2);
  if (match2 && match2[1]) {
    return parseFloat(match2[1]);
  }

  // Pattern 3: "381cm" or "381 cm"
  const pattern3 = /^(\d+(?:\.\d+)?)\s*cm$/;
  const match3 = trimmed.match(pattern3);
  if (match3 && match3[1]) {
    const cm = parseFloat(match3[1]);
    return centimetersToMeters(cm);
  }

  // Pattern 4: Just a number (assume meters)
  const pattern4 = /^(\d+(?:\.\d+)?)$/;
  const match4 = trimmed.match(pattern4);
  if (match4 && match4[1]) {
    return parseFloat(match4[1]);
  }

  return null;
}

// ============================================================================
// PHASE 7: Precision Control
// ============================================================================

/**
 * Round meters to micrometer precision (6 decimal places)
 * @example roundToMicrometer(3.8104827456) → 3.810483
 */
export function roundToMicrometer(meters: number): number {
  return Math.round(meters * 1000000) / 1000000;
}

// ============================================================================
// PHASE 8: Floating Point Comparison Utilities
// ============================================================================

/**
 * Compare two numbers with epsilon tolerance
 * USE THIS instead of === for all meter value comparisons!
 */
export function areEqual(a: number, b: number, epsilon: number = 1e-6): boolean {
  return Math.abs(a - b) < epsilon;
}

/**
 * Check if two points are coincident (within tolerance)
 */
export function arePointsCoincident(
  p1: [number, number],
  p2: [number, number]
): boolean {
  return (
    Math.abs(p1[0] - p2[0]) < 1e-6 &&
    Math.abs(p1[1] - p2[1]) < 1e-6
  );
}

// ============================================================================
// PHASE 9: Validation Utilities
// ============================================================================

/**
 * Validate coordinate is within safe precision range
 */
export function validateCoordinate(coord: number): boolean {
  if (!Number.isFinite(coord)) {
    return false;
  }
  if (Math.abs(coord) > 100000) {
    return false;  // 100km max
  }
  return true;
}

/**
 * Validate distance is meaningful (> minimum precision)
 */
export function validateDistance(distance: number): boolean {
  if (!Number.isFinite(distance) || distance < 0) {
    return false;
  }
  if (distance > 0 && distance < 1e-6) {
    return false;  // Below 1 micrometer
  }
  return true;
}

// ============================================================================
// Precision & Tolerance Constants
// ============================================================================

export const PRECISION = {
  // Storage precision (6 decimal places = micrometer precision)
  STORAGE_DECIMALS: 6,

  // Tolerance for floating point comparisons (1 micrometer)
  EPSILON: 1e-6,

  // Snap tolerance - adjustable by user (default 1mm)
  SNAP_TOLERANCE: 0.001,

  // Coincident point detection tolerance (1 micrometer)
  COINCIDENT_TOLERANCE: 1e-6,

  // Display precision
  DISPLAY_DECIMALS: {
    imperial: 16,  // 1/16 inch precision
    metric: 1,     // 1mm precision for display
  },
};

export const COORDINATE_LIMITS = {
  // Maximum distance from origin (meters)
  // JavaScript number precision: ~15 significant digits
  // At 100km, precision is ~1 micrometer
  MAX_COORDINATE: 100000,  // 100km

  // Minimum non-zero distance (meters)
  MIN_DISTANCE: 1e-6,  // 1 micrometer

  // Recommended working area for maximum precision
  RECOMMENDED_MAX: 10000,  // 10km (optimal precision range)

  // Warning threshold
  WARNING_THRESHOLD: 50000,  // 50km (warn user about potential precision loss)
};

// ============================================================================
// Type Definitions
// ============================================================================

export type UnitSystem = 'imperial' | 'metric';
