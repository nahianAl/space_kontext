/**
 * Hook for fetching and managing climate data
 * Provides reactive climate data based on site coordinates
 */
import { useEffect, useState } from 'react';
import { fetchClimateData, getClimateClassification, type ClimateData } from '../services/climateService';
import { useMapStore } from '../store/mapStore';

export interface UseClimateOptions {
  autoFetch?: boolean; // Automatically fetch when coordinates are available
}

export interface UseClimateReturn {
  climate: ClimateData | null;
  classification: string | null;
  isLoading: boolean;
  error: string | null;
  fetchClimate: () => Promise<void>;
  clearClimate: () => void;
}

/**
 * Hook to fetch and manage climate data for the current site
 */
export function useClimate(options: UseClimateOptions = {}): UseClimateReturn {
  const { autoFetch = true } = options;
  const { siteCoordinates, climateData, climateLoading, climateError, setClimateData, setClimateLoading, setClimateError } = useMapStore();
  const [classification, setClassification] = useState<string | null>(null);

  const fetchClimate = async () => {
    if (!siteCoordinates?.center) {
      setClimateError('No site coordinates available');
      return;
    }

    try {
      setClimateLoading(true);
      setClimateError(null);

      const data = await fetchClimateData(
        siteCoordinates.center.lat,
        siteCoordinates.center.lng
      );

      setClimateData(data);
      const climateClass = getClimateClassification(data);
      setClassification(climateClass);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch climate data';
      setClimateError(message);
      console.error('Error fetching climate data:', error);
    } finally {
      setClimateLoading(false);
    }
  };

  const clearClimate = () => {
    setClimateData(null);
    setClimateError(null);
    setClassification(null);
  };

  // Auto-fetch when coordinates are available
  useEffect(() => {
    if (autoFetch && siteCoordinates?.center && !climateData && !climateLoading) {
      fetchClimate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoFetch, siteCoordinates?.center?.lat, siteCoordinates?.center?.lng, climateData, climateLoading]);

  // Update classification when climate data changes
  useEffect(() => {
    if (climateData) {
      setClassification(getClimateClassification(climateData));
    }
  }, [climateData]);

  return {
    climate: climateData,
    classification,
    isLoading: climateLoading,
    error: climateError,
    fetchClimate,
    clearClimate,
  };
}

