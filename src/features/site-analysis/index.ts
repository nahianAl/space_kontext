/**
 * Site Analysis Feature public API
 * Exports components, stores, services, and types for geospatial analysis
 * Provides tools for site mapping, coordinate management, and boundary definition
 */

// Components
export { SimpleMap } from './components/SimpleMap';
export { SunPathLayer } from './components/SunPathLayer';
export { SunPathControls } from './components/SunPathControls';
export { ClimatePanel } from './components/ClimatePanel';
export { ContoursLayer } from './components/ContoursLayer';
export { BuildingsLayer } from './components/BuildingsLayer';
export { RoadsLayer } from './components/RoadsLayer';
export { WindLayer } from './components/WindLayer';

// Hooks
export { useSunPath } from './hooks/useSunPath';
export type { UseSunPathOptions, UseSunPathReturn } from './hooks/useSunPath';
export { useClimate } from './hooks/useClimate';
export type { UseClimateOptions, UseClimateReturn } from './hooks/useClimate';

// Store
export { useMapStore } from './store/mapStore';
export type { MapState, MapActions, SiteCoordinates } from './store/mapStore';

// Services
export { SiteAnalysisService } from './services/siteAnalysisService';
export type { SiteAnalysisData as SiteAnalysisServiceData } from './services/siteAnalysisService';
export { GeoDataService } from './services/geoDataService';
export type { GeoApiOptions, GeoApiError } from './services/geoDataService';
export { ElevationService } from './services/elevationService';
export { OsmService } from './services/osmService';
export type { ElevationGrid } from './services/elevationService';
export {
  calculateSunPosition,
  generateSunPath,
  generateSeasonalSunPaths,
  sunPathToGeoJSON,
  getSunExposureHours,
} from './services/sunPathService';
export type { SunPosition, SunPathData, SunPathOptions } from './services/sunPathService';
export { fetchClimateData, getClimateClassification } from './services/climateService';
export type { ClimateData } from './services/climateService';

// Utils
export {
  calculateAreaSqFeet,
  calculateAreaSqMeters,
  sqMetersToSqFeet,
  sqFeetToSqMeters,
  formatArea,
} from './utils/areaCalculation';

// Types
export interface SiteAnalysisData {
  location: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  siteBoundary: GeoJSON.FeatureCollection | null;
  siteArea: number | null;
  sunPath: {
    sunrise: Date;
    sunset: Date;
    sunPosition: Array<{
      time: Date;
      azimuth: number;
      altitude: number;
    }>;
  };
  weather: {
    temperature: number;
    humidity: number;
    windSpeed: number;
    windDirection: number;
    precipitation: number;
  };
  context: {
    buildings: GeoJSON.FeatureCollection | null;
    topography: GeoJSON.FeatureCollection | null;
  };
}
