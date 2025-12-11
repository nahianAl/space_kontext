/**
 * Elevation Service
 * Fetches elevation data and generates contour lines
 */
import { GeoDataService } from './geoDataService';
import * as turf from '@turf/turf';
import type { FeatureCollection, LineString, MultiLineString } from 'geojson';

export interface ElevationGrid {
  points: Array<{
    lat: number;
    lng: number;
    elevation: number;
  }>;
  minElevation: number;
  maxElevation: number;
}

export class ElevationService extends GeoDataService {
  private static readonly BASE_URL = 'https://api.open-meteo.com/v1/elevation';

  /**
   * Fetch elevation grid for a bounding box
   * @param bounds [south, west, north, east]
   * @param resolution Number of points per axis (e.g. 20 for 20x20 grid)
   */
  static async fetchElevationGrid(
    bounds: [number, number, number, number],
    resolution: number = 10
  ): Promise<ElevationGrid> {
    const [south, west, north, east] = bounds;
    
    // Generate grid coordinates
    const lats: number[] = [];
    const lngs: number[] = [];
    
    const latStep = (north - south) / (resolution - 1);
    const lngStep = (east - west) / (resolution - 1);
    
    for (let i = 0; i < resolution; i++) {
      for (let j = 0; j < resolution; j++) {
        lats.push(south + i * latStep);
        lngs.push(west + j * lngStep);
      }
    }

    // Batch requests if necessary (Open-Meteo URL length limit)
    // But for ~400 points, it might be too long for URL params.
    // Open-Meteo docs say "Up to 10000 coordinates per request" but via URL it might hit 2048 chars.
    // 400 points * ~20 chars (lat,lng) = ~8000 chars. Too long for standard GET.
    // We need to chunk it.
    
    const CHUNK_SIZE = 100; // Safe chunk size for URL length
    const elevations: number[] = [];
    
    for (let i = 0; i < lats.length; i += CHUNK_SIZE) {
      const chunkLats = lats.slice(i, i + CHUNK_SIZE);
      const chunkLngs = lngs.slice(i, i + CHUNK_SIZE);
      
      const url = `${this.BASE_URL}?latitude=${chunkLats.join(',')}&longitude=${chunkLngs.join(',')}`;
      
      try {
        // Add delay between chunks to avoid 429
        if (i > 0) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
        const response = await this.fetchWithRetry(url);
        const data = await response.json();
        if (data.elevation) {
          elevations.push(...data.elevation);
        }
      } catch (error) {
        console.error('Error fetching elevation chunk:', error);
        // If 429 or other error, return a mock grid to allow UI to function
        if (error instanceof Error && error.message.includes('429')) {
           console.warn('Rate limit hit, using mock elevation data');
           return this.generateMockGrid(bounds, resolution);
        }
        throw error;
      }
    }

    // Combine into grid points
    let min = Infinity;
    let max = -Infinity;
    const points = lats.map((lat, index) => {
      const ele = elevations[index] || 0; // Default to 0 if missing
      const lng = lngs[index];
      if (lng === undefined) {
        throw new Error(`Missing longitude at index ${index}`);
      }
      if (ele < min) {min = ele;}
      if (ele > max) {max = ele;}
      return {
        lat,
        lng,
        elevation: ele
      };
    });

    return {
      points,
      minElevation: min === Infinity ? 0 : min,
      maxElevation: max === -Infinity ? 0 : max
    };
  }

  private static generateMockGrid(
    bounds: [number, number, number, number],
    resolution: number
  ): Promise<ElevationGrid> {
    const [south, west, north, east] = bounds;
    const points = [];
    for (let i = 0; i < resolution; i++) {
      for (let j = 0; j < resolution; j++) {
        // Simple slope
        const lat = south + (i * (north - south)) / (resolution - 1);
        const lng = west + (j * (east - west)) / (resolution - 1);
        const elevation = 10 + i * 2 + j * 1;
        points.push({ lat, lng, elevation });
      }
    }
    return Promise.resolve({
      points,
      minElevation: 10,
      maxElevation: 10 + resolution * 3
    });
  }

  /**
   * Generate contour lines from elevation grid
   */
  static generateContours(
    grid: ElevationGrid,
    interval: number = 1 // Contour interval in meters
  ): FeatureCollection<LineString | MultiLineString> {
    // Convert grid points to turf point grid
    // Turf expects a FeatureCollection of Points with "elevation" property
    const points = turf.featureCollection(
      grid.points.map(p => 
        turf.point([p.lng, p.lat], { elevation: p.elevation })
      )
    );

    // Calculate breaks based on min/max and interval
    // Ensure we cover the range
    const breaks: number[] = [];
    const start = Math.floor(grid.minElevation / interval) * interval;
    for (let h = start; h <= grid.maxElevation; h += interval) {
      breaks.push(h);
    }

    // Generate isolines
    // breaks must be an array of numbers
    const lines = turf.isolines(points, breaks, { zProperty: 'elevation' });
    
    return lines;
  }
}

