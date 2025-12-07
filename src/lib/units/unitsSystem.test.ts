/**
 * Unit tests for unitsSystem.ts
 * Critical tests to prevent bugs from previous implementation attempt
 */

import {
  pixelsToMeters,
  metersToPixels,
  metersToFeet,
  feetToMeters,
  metersToInches,
  inchesToMeters,
  metersToCentimeters,
  centimetersToMeters,
  formatMetersAsImperial,
  formatMetersAsMetric,
  roundToMicrometer,
  areEqual,
  arePointsCoincident,
  validateCoordinate,
  validateDistance,
  PRECISION,
  COORDINATE_LIMITS,
  parseImperialInput,
  parseMetricInput,
} from './unitsSystem';

describe('unitsSystem', () => {
  describe('Core Pixel/Meter Conversions', () => {
    test('pixelsToMeters converts correctly', () => {
      expect(pixelsToMeters(100)).toBe(1.0);
      expect(pixelsToMeters(381)).toBe(3.81);
      expect(pixelsToMeters(400)).toBe(4.0);
    });

    test('metersToPixels converts correctly', () => {
      expect(metersToPixels(1.0)).toBe(100);
      expect(metersToPixels(3.81)).toBe(381);
      expect(metersToPixels(4.0)).toBe(400);
    });

    test('Round-trip conversion maintains precision', () => {
      const original = 3.8104827;
      const pixels = metersToPixels(original);
      const back = pixelsToMeters(pixels);
      expect(areEqual(original, back)).toBe(true);
    });
  });

  describe('Imperial Conversions', () => {
    test('metersToFeet converts correctly', () => {
      expect(areEqual(metersToFeet(0.3048), 1.0)).toBe(true);
      expect(areEqual(metersToFeet(3.81), 12.5)).toBe(true);
      expect(areEqual(metersToFeet(4.0), 13.123359580052493)).toBe(true);
    });

    test('feetToMeters converts correctly', () => {
      expect(areEqual(feetToMeters(1.0), 0.3048)).toBe(true);
      expect(areEqual(feetToMeters(12.5), 3.81)).toBe(true);
    });

    test('metersToInches converts correctly', () => {
      expect(areEqual(metersToInches(0.3048), 12.0)).toBe(true);
      expect(areEqual(metersToInches(3.81), 150.0)).toBe(true);
      expect(areEqual(metersToInches(4.0), 157.48031496062993)).toBe(true);
    });

    test('inchesToMeters converts correctly', () => {
      expect(areEqual(inchesToMeters(12.0), 0.3048)).toBe(true);
      expect(areEqual(inchesToMeters(150.0), 3.81)).toBe(true);
    });

    test('Round-trip conversions maintain precision', () => {
      const originalMeters = 3.81;
      const feet = metersToFeet(originalMeters);
      const back = feetToMeters(feet);
      expect(areEqual(originalMeters, back)).toBe(true);
    });
  });

  describe('Metric Conversions', () => {
    test('metersToCentimeters converts correctly', () => {
      expect(metersToCentimeters(1.0)).toBe(100);
      expect(metersToCentimeters(3.81)).toBe(381);
    });

    test('centimetersToMeters converts correctly', () => {
      expect(centimetersToMeters(100)).toBe(1.0);
      expect(centimetersToMeters(381)).toBe(3.81);
    });

    test('metersToMillimeters converts correctly', () => {
      expect(metersToMillimeters(1.0)).toBe(1000);
      expect(metersToMillimeters(3.81)).toBe(3810);
    });

    test('millimetersToMeters converts correctly', () => {
      expect(millimetersToMeters(1000)).toBe(1.0);
      expect(millimetersToMeters(3810)).toBe(3.81);
    });
  });

  describe('formatMetersAsImperial - Critical Bug Prevention', () => {
    test('MUST NOT treat meters as feet directly', () => {
      // This is the bug that happened in production!
      const result = formatMetersAsImperial(4.0);
      expect(result).not.toBe("4' 0\"");  // ❌ WRONG - treating meters as feet
      expect(result).toBe("13' 1.5\"");    // ✅ CORRECT - converted properly
    });

    test('400 pixel wall converts correctly', () => {
      // User's reported issue: 400px wall showed as "4'" instead of "13' 1.5""
      const pixels = 400;
      const meters = pixelsToMeters(pixels);  // 4.0 meters
      const formatted = formatMetersAsImperial(meters);
      expect(formatted).toBe("13' 1.5\"");  // NOT "4' 0"!
    });

    test('Standard examples convert correctly', () => {
      expect(formatMetersAsImperial(3.81)).toBe("12' 6\"");
      expect(formatMetersAsImperial(0.3048)).toBe("1' 0\"");
      expect(formatMetersAsImperial(12.192)).toBe("40' 0\"");
    });

    test('Small values under 1 foot', () => {
      expect(formatMetersAsImperial(0.127)).toBe("5\"");  // 5 inches only
    });

    test('Zero and edge cases', () => {
      expect(formatMetersAsImperial(0)).toBe("0\"");
      expect(formatMetersAsImperial(0.0254)).toBe("1\"");  // 1 inch
    });
  });

  describe('formatMetersAsMetric', () => {
    test('Standard examples convert correctly', () => {
      expect(formatMetersAsMetric(3.81)).toBe("3 m 81 cm");
      expect(formatMetersAsMetric(1.0)).toBe("1 m");
      expect(formatMetersAsMetric(4.0)).toBe("4 m");
      expect(formatMetersAsMetric(0.5)).toBe("50 cm");
    });

    test('Edge cases', () => {
      expect(formatMetersAsMetric(0)).toBe("0 m");
      expect(formatMetersAsMetric(0.01)).toBe("1 cm");
    });
  });

  describe('Input Parsing', () => {
    describe('parseImperialInput', () => {
      test('Parses feet-inches format', () => {
        const result1 = parseImperialInput("12' 6\"");
        expect(result1).toBeCloseTo(3.81, 2);
        
        const result2 = parseImperialInput("12'6\"");
        expect(result2).toBeCloseTo(3.81, 2);
      });

      test('Parses decimal feet', () => {
        const result = parseImperialInput("12.5'");
        expect(result).toBeCloseTo(3.81, 2);
      });

      test('Parses inches only', () => {
        const result = parseImperialInput('6"');
        expect(result).toBeCloseTo(0.1524, 4);
      });

      test('Returns null for invalid input', () => {
        expect(parseImperialInput('invalid')).toBeNull();
        expect(parseImperialInput('')).toBeNull();
      });
    });

    describe('parseMetricInput', () => {
      test('Parses meters-centimeters format', () => {
        const result = parseMetricInput("3 m 81 cm");
        expect(result).toBeCloseTo(3.81, 2);
      });

      test('Parses decimal meters', () => {
        const result = parseMetricInput("3.81m");
        expect(result).toBe(3.81);
      });

      test('Parses centimeters only', () => {
        const result = parseMetricInput("381cm");
        expect(result).toBe(3.81);
      });

      test('Returns null for invalid input', () => {
        expect(parseMetricInput('invalid')).toBeNull();
        expect(parseMetricInput('')).toBeNull();
      });
    });
  });

  describe('Precision & Tolerance', () => {
    test('Epsilon comparison catches floating point errors', () => {
      const result = 0.3048 * 3.28084;  // Should be ~1.0
      expect(result === 1.0).toBe(false);  // Fails with strict equality
      expect(areEqual(result, 1.0)).toBe(true);  // Passes with epsilon
    });

    test('Round-trip conversion maintains precision', () => {
      const original = 3.8104827;
      const pixels = metersToPixels(original);
      const back = pixelsToMeters(pixels);
      expect(areEqual(original, back)).toBe(true);
      expect(Math.abs(original - back)).toBeLessThan(PRECISION.EPSILON);
    });

    test('Cumulative precision in large buildings', () => {
      const wallLengths = Array(1000).fill(3.8104827);
      const sum = wallLengths.reduce((acc, val) => acc + val, 0);
      const expected = 3810.4827;
      expect(areEqual(sum, expected)).toBe(true);
      expect(Math.abs(sum - expected)).toBeLessThan(0.000001);  // < 1 micrometer error
    });

    test('Coordinate validation enforces limits', () => {
      expect(validateCoordinate(50000)).toBe(true);     // 50km - OK
      expect(validateCoordinate(99999)).toBe(true);     // < 100km - OK
      expect(validateCoordinate(150000)).toBe(false);   // > 100km - Invalid
      expect(validateCoordinate(NaN)).toBe(false);      // NaN - Invalid
      expect(validateCoordinate(Infinity)).toBe(false); // Infinity - Invalid
    });

    test('Distance validation rejects too-small values', () => {
      expect(validateDistance(0.001)).toBe(true);       // 1mm - OK
      expect(validateDistance(0.000001)).toBe(true);    // 1μm - OK (minimum)
      expect(validateDistance(0.0000005)).toBe(false);  // 0.5μm - Too small
      expect(validateDistance(-1)).toBe(false);        // Negative - Invalid
    });

    test('Point coincidence detection', () => {
      const p1: [number, number] = [100.0000001, 200.0000001];
      const p2: [number, number] = [100.0000002, 200.0000002];
      expect(arePointsCoincident(p1, p2)).toBe(true);  // Within tolerance

      const p3: [number, number] = [100.00001, 200.00001];
      expect(arePointsCoincident(p1, p3)).toBe(false);  // Outside tolerance
    });

    test('Storage rounding to micrometer precision', () => {
      expect(roundToMicrometer(3.8104827456)).toBe(3.810483);
      expect(roundToMicrometer(0.0000004)).toBe(0.0);  // Below precision
      expect(roundToMicrometer(0.0000006)).toBe(0.000001);  // Rounds to 1μm
    });
  });
});
