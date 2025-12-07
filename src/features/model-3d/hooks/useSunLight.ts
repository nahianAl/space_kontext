/**
 * Hook for managing sun lighting in 3D scene
 * Calculates sun position based on location and time, updates automatically
 */

import { useMemo } from 'react';
import {
  calculateSunPosition,
  sunPositionToThreeJS,
  getSunIntensity,
  calculateDateFromMonthAndTime,
  type SunPosition,
} from '../services/sunLightService';

export interface UseSunLightOptions {
  latitude: number;
  longitude: number;
  month?: number; // 1-12 (January = 1, December = 12)
  timeOfDay?: number; // 0-1 (0 = sunrise, 1 = sunset)
  date?: Date; // Optional explicit date (overrides month/timeOfDay)
  lightDistance?: number; // Distance of light from origin (default: 50)
}

export interface SunLightState {
  position: [number, number, number];
  intensity: number;
  sunPosition: SunPosition;
  isDaytime: boolean;
}

/**
 * Hook to calculate and manage sun lighting
 * @param options Configuration for sun lighting
 * @returns Sun light state with position, intensity, and sun position data
 */
export function useSunLight(options: UseSunLightOptions): SunLightState {
  const {
    latitude,
    longitude,
    month,
    timeOfDay,
    date,
    lightDistance = 50,
  } = options;

  // Calculate the date to use for sun position
  const targetDate = useMemo(() => {
    if (date) {
      // Explicit date provided, use it
      return date;
    }
    
    if (month !== undefined && timeOfDay !== undefined) {
      // Use month and time of day to calculate date
      return calculateDateFromMonthAndTime(month, timeOfDay, latitude, longitude);
    }
    
    // Default to current date/time
    return new Date();
  }, [date, month, timeOfDay, latitude, longitude]);

  // Calculate sun position
  const sunPosition = useMemo(
    () =>
      calculateSunPosition({
        latitude,
        longitude,
        date: targetDate,
      }),
    [latitude, longitude, targetDate]
  );

  // Convert to Three.js position
  const position = useMemo(
    () => sunPositionToThreeJS(sunPosition, lightDistance),
    [sunPosition, lightDistance]
  );

  // Calculate intensity based on altitude
  const intensity = useMemo(
    () => getSunIntensity(sunPosition.altitude),
    [sunPosition.altitude]
  );

  // Determine if it's daytime (sun above horizon)
  const isDaytime = useMemo(() => sunPosition.altitude > 0, [sunPosition.altitude]);

  return {
    position,
    intensity,
    sunPosition,
    isDaytime,
  };
}

