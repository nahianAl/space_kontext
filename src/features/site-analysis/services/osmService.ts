/**
 * OpenStreetMap Service
 * Fetches context data (buildings, roads, etc.) using Overpass API
 */
import { GeoDataService } from './geoDataService';
import osmtogeojson from 'osmtogeojson';
import type { FeatureCollection } from 'geojson';

export class OsmService extends GeoDataService {
  // Try different Overpass endpoints if one fails
  private static readonly OVERPASS_URLS = [
    'https://overpass-api.de/api/interpreter',
    'https://overpass.kumi.systems/api/interpreter',
    'https://lz4.overpass-api.de/api/interpreter'
  ];
  private static readonly OVERPASS_URL = OsmService.OVERPASS_URLS[0] ?? 'https://overpass-api.de/api/interpreter';

  /**
   * Fetch buildings within a bounding box
   * @param bounds [south, west, north, east]
   */
  static async fetchBuildings(
    bounds: [number, number, number, number]
  ): Promise<FeatureCollection> {
    const [south, west, north, east] = bounds;

    // Overpass QL query for buildings
    // Increased timeout to 90s to handle larger areas or busy server
    const query = `
      [out:json][timeout:90];
      (
        way["building"](${south},${west},${north},${east});
        relation["building"](${south},${west},${north},${east});
      );
      (._;>;);
      out body;
    `;

    try {
      const response = await this.fetchWithRetry(OsmService.OVERPASS_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `data=${encodeURIComponent(query)}`,
      });

      const data = await response.json();
      
      // Convert OSM JSON to GeoJSON
      const geojson = osmtogeojson(data) as FeatureCollection;
      
      return geojson;
    } catch (error) {
      console.error('Error fetching buildings:', error);
      // Return empty collection on error to prevent crashes
      return {
        type: 'FeatureCollection',
        features: []
      };
    }
  }

  /**
   * Fetch roads/streets within a bounding box
   * Fetches all highway types (motorway, trunk, primary, secondary, tertiary, residential, etc.)
   * @param bounds [south, west, north, east]
   */
  static async fetchRoads(
    bounds: [number, number, number, number]
  ): Promise<FeatureCollection> {
    const [south, west, north, east] = bounds;

    // Overpass QL query for all highway types
    const query = `[out:json][timeout:90];
way["highway"](${south},${west},${north},${east});
out geom;`;

    try {
      // Try alternative endpoint if primary fails
      let response;
      let lastError;
      
      for (const endpoint of OsmService.OVERPASS_URLS) {
        try {
          const requestBody = `data=${encodeURIComponent(query)}`;
          
          response = await this.fetchWithRetry(
            endpoint,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
              },
              body: requestBody,
            }
            // Cache is now enabled - cache key includes request body, so highways and buildings are cached separately
          );
          break;
        } catch (error) {
          console.warn('OsmService: Failed with endpoint', endpoint, error);
          lastError = error;
          continue;
        }
      }
      
      if (!response) {
        throw lastError || new Error('All Overpass endpoints failed');
      }

      const data = await response.json();
      
      // Convert OSM JSON to GeoJSON
      const geojson = osmtogeojson(data) as FeatureCollection;
      
      // Filter GeoJSON to only include highways
      const highwayFeatures = geojson.features.filter((f: any) => {
        return f.properties && f.properties.highway;
      });
      
      const filteredGeoJson: FeatureCollection = {
        type: 'FeatureCollection',
        features: highwayFeatures
      };
      
      // Post-process: 
      // 1. Filter to only include features with highway property (safety check)
      // 2. Convert Polygon highways to LineString (roads should be lines, not areas)
      // osmtogeojson sometimes converts closed ways to Polygons, but roads should be LineStrings
      const processedFeatures = filteredGeoJson.features.map(feature => {
        // If it's a Polygon, convert to LineString using outer ring
        // We queried for highway=*, so all features are roads regardless of properties
        if (feature.geometry.type === 'Polygon') {
          const coords = feature.geometry.coordinates[0]; // Get outer ring
          if (!coords || coords.length === 0) {
            return null;
          }
          const firstCoord = coords[0];
          const lastCoord = coords[coords.length - 1];
          // Remove last coordinate if it's a duplicate of first (closed polygon)
          const lineCoords = coords.length > 1 && 
            firstCoord && lastCoord &&
            firstCoord[0] !== undefined && firstCoord[1] !== undefined &&
            lastCoord[0] !== undefined && lastCoord[1] !== undefined &&
            firstCoord[0] === lastCoord[0] && 
            firstCoord[1] === lastCoord[1]
            ? coords.slice(0, -1) 
            : coords;
          
          return {
            ...feature,
            geometry: {
              type: 'LineString' as const,
                coordinates: lineCoords
              }
            };
          }
          // If it's a MultiPolygon, convert to MultiLineString
          if (feature.geometry.type === 'MultiPolygon') {
            const lineStrings = feature.geometry.coordinates.map(polygon => {
              const outerRing = polygon[0];
              if (!outerRing || outerRing.length === 0) {
                return [];
              }
              const firstCoord = outerRing[0];
              const lastCoord = outerRing[outerRing.length - 1];
              if (outerRing.length > 1 && 
                  firstCoord && lastCoord &&
                  firstCoord[0] !== undefined && firstCoord[1] !== undefined &&
                  lastCoord[0] !== undefined && lastCoord[1] !== undefined &&
                  firstCoord[0] === lastCoord[0] && 
                  firstCoord[1] === lastCoord[1]) {
                return outerRing.slice(0, -1);
              }
              return outerRing;
            });
            return {
              ...feature,
              geometry: {
                type: 'MultiLineString' as const,
                coordinates: lineStrings
              }
            };
          }
          return feature;
        });
      
      return {
        type: 'FeatureCollection',
        features: processedFeatures.filter((f): f is NonNullable<typeof f> => f !== null)
      };
    } catch (error) {
      console.error('Error fetching roads:', error);
      // Return empty collection on error to prevent crashes
      return {
        type: 'FeatureCollection',
        features: []
      };
    }
  }
}

