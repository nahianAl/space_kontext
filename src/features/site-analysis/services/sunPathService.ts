/**
 * Sun Path Service for site analysis
 * Calculates sun position, sun path, and solar analysis data
 * Uses suncalc.js library for calculations
 */
// @ts-ignore - suncalc doesn't have TypeScript definitions
import SunCalc from 'suncalc';
import type { GeoJSON } from 'geojson';

export interface SunPosition {
  time: Date;
  azimuth: number; // 0-360 degrees, 0 = North, 90 = East, 180 = South, 270 = West
  altitude: number; // -90 to 90 degrees, 0 = horizon, 90 = zenith
}

export interface SunPathData {
  date: Date;
  latitude: number;
  longitude: number;
  sunrise: Date;
  sunset: Date;
  positions: SunPosition[];
  maxAltitude: number;
  maxAltitudeTime: Date;
}

export interface SunPathOptions {
  date?: Date;
  interval?: number; // Minutes between calculations (default: 15)
  includeNight?: boolean; // Include positions below horizon (default: false)
}

/**
 * Calculate sun position for a specific time and location
 */
export function calculateSunPosition(
  latitude: number,
  longitude: number,
  date: Date = new Date()
): SunPosition {
  const sunPosition = SunCalc.getPosition(date, latitude, longitude);

  // SunCalc returns azimuth in radians, measured from south (0 = south, positive = west)
  // Convert to degrees and adjust to standard convention: 0 = North, 90 = East, 180 = South, 270 = West
  const azimuthRad = sunPosition.azimuth;
  let azimuthDeg = (azimuthRad * (180 / Math.PI) + 180) % 360;
  if (azimuthDeg < 0) {
    azimuthDeg += 360;
  }

  // Altitude is in radians, convert to degrees
  const altitude = sunPosition.altitude * (180 / Math.PI);

  return {
    time: date,
    azimuth: azimuthDeg,
    altitude,
  };
}

/**
 * Generate sun path for a full day
 */
export function generateSunPath(
  latitude: number,
  longitude: number,
  options: SunPathOptions = {}
): SunPathData {
  const {
    date = new Date(),
    interval = 15, // 15 minutes
    includeNight = false,
  } = options;

  // Get sunrise and sunset times
  const times = SunCalc.getTimes(date, latitude, longitude);
  const sunrise = times.sunrise;
  const sunset = times.sunset;

  // Generate positions throughout the day
  const positions: SunPosition[] = [];
  let maxAltitude = -90;
  let maxAltitudeTime = sunrise;

  // Start from sunrise, end at sunset (or extend if includeNight is true)
  const startTime = includeNight
    ? new Date(sunrise.getTime() - 2 * 60 * 60 * 1000) // 2 hours before sunrise
    : sunrise;
  const endTime = includeNight
    ? new Date(sunset.getTime() + 2 * 60 * 60 * 1000) // 2 hours after sunset
    : sunset;

  const currentTime = new Date(startTime);
  while (currentTime <= endTime) {
    const position = calculateSunPosition(latitude, longitude, new Date(currentTime));

    // Only include positions above horizon (or all if includeNight is true)
    if (includeNight || position.altitude >= 0) {
      positions.push(position);

      // Track maximum altitude
      if (position.altitude > maxAltitude) {
        maxAltitude = position.altitude;
        maxAltitudeTime = new Date(currentTime);
      }
    }

    // Move to next interval
    currentTime.setMinutes(currentTime.getMinutes() + interval);
  }

  return {
    date,
    latitude,
    longitude,
    sunrise,
    sunset,
    positions,
    maxAltitude,
    maxAltitudeTime,
  };
}

/**
 * Generate sun path for multiple dates (e.g., solstices and equinoxes)
 */
export function generateSunPathForDates(
  latitude: number,
  longitude: number,
  dates: Date[],
  options: Omit<SunPathOptions, 'date'> = {}
): SunPathData[] {
  return dates.map((date) => generateSunPath(latitude, longitude, { ...options, date }));
}

/**
 * Generate seasonal sun paths (winter solstice, spring equinox, summer solstice, fall equinox)
 */
export function generateSeasonalSunPaths(
  latitude: number,
  longitude: number,
  year: number = new Date().getFullYear(),
  options: Omit<SunPathOptions, 'date'> = {}
): {
  winter: SunPathData;
  spring: SunPathData;
  summer: SunPathData;
  fall: SunPathData;
} {
  // Approximate dates for solstices and equinoxes
  const winterSolstice = new Date(year, 11, 21); // December 21
  const springEquinox = new Date(year, 2, 20); // March 20
  const summerSolstice = new Date(year, 5, 21); // June 21
  const fallEquinox = new Date(year, 8, 22); // September 22

  return {
    winter: generateSunPath(latitude, longitude, { ...options, date: winterSolstice }),
    spring: generateSunPath(latitude, longitude, { ...options, date: springEquinox }),
    summer: generateSunPath(latitude, longitude, { ...options, date: summerSolstice }),
    fall: generateSunPath(latitude, longitude, { ...options, date: fallEquinox }),
  };
}

/**
 * Convert sun path to GeoJSON for visualization on map
 */
export function sunPathToGeoJSON(sunPath: SunPathData): GeoJSON.FeatureCollection {
  // Create a line string from sun positions (only above horizon)
  const coordinates = sunPath.positions
    .filter((pos) => pos.altitude >= 0)
    .map((pos) => {
      // Convert azimuth and altitude to lat/lng for visualization
      // This is a simplified projection - in reality, you'd need to project onto the map
      // For now, we'll create a circular path based on azimuth
      const radius = 0.01; // Small radius for visualization
      const lat = sunPath.latitude + radius * Math.cos((pos.azimuth - 90) * (Math.PI / 180));
      const lng = sunPath.longitude + radius * Math.sin((pos.azimuth - 90) * (Math.PI / 180));
      return [lng, lat];
    });

  return {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates,
        },
        properties: {
          date: sunPath.date.toISOString(),
          sunrise: sunPath.sunrise.toISOString(),
          sunset: sunPath.sunset.toISOString(),
          maxAltitude: sunPath.maxAltitude,
        },
      },
    ],
  };
}

/**
 * Get sun exposure hours for a given date
 */
export function getSunExposureHours(
  latitude: number,
  longitude: number,
  date: Date = new Date()
): number {
  const times = SunCalc.getTimes(date, latitude, longitude);
  const duration = times.sunset.getTime() - times.sunrise.getTime();
  return duration / (1000 * 60 * 60); // Convert to hours
}

