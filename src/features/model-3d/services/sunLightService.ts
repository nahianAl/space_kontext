/**
 * Sun lighting service for calculating sun position based on location and time
 * Uses suncalc.js to get sun's azimuth and altitude, then converts to Three.js coordinates
 */

import SunCalc from 'suncalc';

export interface SunPosition {
  azimuth: number; // 0-360 degrees, 0 = North, 90 = East, 180 = South, 270 = West
  altitude: number; // -90 to 90 degrees, 0 = horizon, 90 = zenith
}

export interface SunLightConfig {
  latitude: number;
  longitude: number;
  date?: Date; // Optional date, defaults to current time
}

/**
 * Calculate sun position for given location and time
 * @param config Location and optional date
 * @returns Sun position with azimuth and altitude in degrees
 */
export function calculateSunPosition(config: SunLightConfig): SunPosition {
  const { latitude, longitude, date = new Date() } = config;
  
  const sunPosition = SunCalc.getPosition(date, latitude, longitude);
  
  // SunCalc returns azimuth in radians, measured from south (0 = south, positive = west)
  // Convert to degrees and adjust to standard convention: 0 = North, 90 = East, 180 = South, 270 = West
  const azimuthRad = sunPosition.azimuth;
  let azimuthDeg = (azimuthRad * (180 / Math.PI) + 180) % 360;
  // Handle negative modulo result
  if (azimuthDeg < 0) {
    azimuthDeg += 360;
  }
  
  // Altitude is in radians, convert to degrees
  const altitude = sunPosition.altitude * (180 / Math.PI); // -90 to 90 degrees
  
  return {
    azimuth: azimuthDeg,
    altitude,
  };
}

/**
 * Convert sun position (azimuth, altitude) to Three.js directional light position
 * @param sunPosition Sun position with azimuth and altitude
 * @param distance Distance from origin for the light (default: 50)
 * @returns Three.js position vector [x, y, z]
 */
export function sunPositionToThreeJS(
  sunPosition: SunPosition,
  distance: number = 50
): [number, number, number] {
  const { azimuth, altitude } = sunPosition;
  
  // Convert azimuth and altitude to radians
  const azimuthRad = (azimuth * Math.PI) / 180;
  const altitudeRad = (altitude * Math.PI) / 180;
  
  // Calculate position in spherical coordinates
  // In Three.js: x = east/west, y = up/down, z = north/south
  // Azimuth: 0 = North, 90 = East, 180 = South, 270 = West
  // Altitude: 0 = horizon, 90 = zenith
  
  const x = distance * Math.cos(altitudeRad) * Math.sin(azimuthRad);
  const y = distance * Math.sin(altitudeRad);
  const z = distance * Math.cos(altitudeRad) * Math.cos(azimuthRad);
  
  return [x, y, z];
}

/**
 * Get sun intensity based on altitude
 * Sun is brighter when higher in the sky
 * @param altitude Sun altitude in degrees
 * @returns Light intensity multiplier (higher values for more intense lighting)
 */
export function getSunIntensity(altitude: number): number {
  // Sun below horizon = minimal light
  if (altitude < 0) {
    return 0.1;
  }
  
  // Normalize altitude to 0-1 range (0 = horizon, 90 = zenith)
  const normalizedAltitude = altitude / 90;
  
  // Use a curve that gives more intensity when sun is higher
  // Minimum intensity at horizon: 1.5, maximum at zenith: 3.0
  // Much more intense than before for dramatic shadows
  return 1.5 + normalizedAltitude * 1.5;
}

/**
 * Get sunrise and sunset times for a given date and location
 * @param date Date to calculate sunrise/sunset for
 * @param latitude Latitude in degrees
 * @param longitude Longitude in degrees
 * @returns Object with sunrise and sunset Date objects
 */
export function getSunriseSunset(
  date: Date,
  latitude: number,
  longitude: number
): { sunrise: Date; sunset: Date } {
  const times = SunCalc.getTimes(date, latitude, longitude);
  return {
    sunrise: times.sunrise,
    sunset: times.sunset,
  };
}

/**
 * Calculate a date based on month (1-12) and time of day (0-1, sunrise to sunset)
 * @param month Month (1-12, January = 1, December = 12)
 * @param timeOfDay Time between sunrise and sunset (0 = sunrise, 1 = sunset)
 * @param latitude Latitude in degrees
 * @param longitude Longitude in degrees
 * @returns Date object representing the calculated time
 */
export function calculateDateFromMonthAndTime(
  month: number,
  timeOfDay: number,
  latitude: number,
  longitude: number
): Date {
  // Create a date for the middle of the specified month
  const year = new Date().getFullYear();
  const date = new Date(year, month - 1, 15, 12, 0, 0); // 15th of the month at noon
  
  // Get sunrise and sunset for this date
  const { sunrise, sunset } = getSunriseSunset(date, latitude, longitude);
  
  // Calculate time between sunrise and sunset
  const timeRange = sunset.getTime() - sunrise.getTime();
  const targetTime = sunrise.getTime() + timeRange * timeOfDay;
  
  return new Date(targetTime);
}

