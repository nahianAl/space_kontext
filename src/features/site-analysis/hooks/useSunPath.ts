/**
 * Hook for sun path calculations and data
 * Provides reactive sun path data based on location and date
 */
import { useMemo, useState } from 'react';
import {
  generateSunPath,
  generateSeasonalSunPaths,
  type SunPathData,
  type SunPathOptions,
} from '../services/sunPathService';

export interface UseSunPathOptions {
  latitude: number;
  longitude: number;
  date?: Date;
  interval?: number;
  includeNight?: boolean;
}

export interface UseSunPathReturn {
  sunPath: SunPathData | null;
  seasonalPaths: {
    winter: SunPathData;
    spring: SunPathData;
    summer: SunPathData;
    fall: SunPathData;
  } | null;
  isLoading: boolean;
  error: Error | null;
  setDate: (date: Date) => void;
  refresh: () => void;
}

/**
 * Hook to calculate and manage sun path data
 */
export function useSunPath(options: UseSunPathOptions): UseSunPathReturn {
  const { latitude, longitude, date: initialDate, interval, includeNight } = options;
  const [date, setDate] = useState<Date>(initialDate || new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Calculate sun path for current date
  const sunPath = useMemo(() => {
    try {
      setIsLoading(true);
      setError(null);
      const options: SunPathOptions = {};
      if (interval !== undefined) {options.interval = interval;}
      if (includeNight !== undefined) {options.includeNight = includeNight;}
      return generateSunPath(latitude, longitude, {
        date,
        ...options,
      });
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to calculate sun path');
      setError(error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [latitude, longitude, date, interval, includeNight]);

  // Calculate seasonal sun paths
  const seasonalPaths = useMemo(() => {
    try {
      const options: Omit<SunPathOptions, 'date'> = {};
      if (interval !== undefined) {options.interval = interval;}
      if (includeNight !== undefined) {options.includeNight = includeNight;}
      return generateSeasonalSunPaths(latitude, longitude, date.getFullYear(), options);
    } catch (err) {
      console.error('Failed to calculate seasonal sun paths:', err);
      return null;
    }
  }, [latitude, longitude, date.getFullYear(), interval, includeNight]);

  const refresh = () => {
    // Force recalculation by updating date slightly
    setDate(new Date(date.getTime() + 1));
    setDate(new Date(date.getTime() - 1));
  };

  return {
    sunPath,
    seasonalPaths,
    isLoading,
    error,
    setDate,
    refresh,
  };
}

