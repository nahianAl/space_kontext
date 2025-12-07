import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface SiteCoordinates {
  center: { lat: number; lng: number };
  boundary: GeoJSON.Polygon | null;
  areaSqFeet: number | null; // Area in square feet
  areaSqMeters: number | null; // Also store in square meters for compatibility
  scale: number | null; // meters per pixel (for 2D floorplan scaling)
  rotation: number; // north alignment in degrees (0 = north is up)
}

export interface MapState {
  // Map view state
  center: [number, number]; // [lat, lng]
  zoom: number;
  bounds: [[number, number], [number, number]] | null; // [[south, west], [north, east]]
  
  // Site boundary
  siteBoundary: GeoJSON.FeatureCollection | null;
  siteArea: number | null; // in square feet (primary unit)
  siteCoordinates: SiteCoordinates | null;
  drawingPoints: Array<{ lat: number; lng: number }>; // Track points being drawn
  
  // Map layers
  activeLayers: string[];
  layerVisibility: Record<string, boolean>;

  // Fixed image state
  capturedImage: string | null;
  capturedBounds: [[number, number], [number, number]] | null; // [[south, west], [north, east]]
  
  // Analysis Data (Stored for static view)
  contours: GeoJSON.FeatureCollection | null;
  buildings: GeoJSON.FeatureCollection | null;
  roads: GeoJSON.FeatureCollection | null;

  // Climate data
  climateData: import('../services/climateService').ClimateData | null;
  climateLoading: boolean;
  climateError: string | null;
  
  // Map controls
  isDrawing: boolean;
  drawingMode: 'polygon' | 'rectangle' | 'circle' | null;
  
  // Loading states
  isLoading: boolean;
  error: string | null;
}

export interface MapActions {
  // Map view actions
  setCenter: (center: [number, number]) => void;
  setZoom: (zoom: number) => void;
  setBounds: (bounds: [[number, number], [number, number]]) => void;
  fitBounds: (bounds: [[number, number], [number, number]]) => void;
  
  // Site boundary actions
  setSiteBoundary: (boundary: GeoJSON.FeatureCollection | null) => void;
  setSiteArea: (area: number | null) => void;
  clearSiteBoundary: () => void;
  setSiteCoordinates: (coords: SiteCoordinates | null) => void;
  setDrawingPoints: (points: Array<{ lat: number; lng: number }>) => void;
  addDrawingPoint: (point: { lat: number; lng: number }) => void;
  removeLastDrawingPoint: () => void;
  clearDrawingPoints: () => void;
  
  // Layer actions
  toggleLayer: (layerId: string) => void;
  setLayerVisibility: (layerId: string, visible: boolean) => void;
  setActiveLayers: (layers: string[]) => void;

  // Fixed image actions
  setCapturedImage: (url: string | null) => void;
  setCapturedBounds: (bounds: [[number, number], [number, number]] | null) => void;
  
  // Analysis Data Actions
  setContours: (contours: GeoJSON.FeatureCollection | null) => void;
  setBuildings: (buildings: GeoJSON.FeatureCollection | null) => void;
  setRoads: (roads: GeoJSON.FeatureCollection | null) => void;

  // Climate actions
  setClimateData: (data: import('../services/climateService').ClimateData | null) => void;
  setClimateLoading: (loading: boolean) => void;
  setClimateError: (error: string | null) => void;
  
  // Drawing actions
  setDrawingMode: (mode: 'polygon' | 'rectangle' | 'circle' | null) => void;
  startDrawing: () => void;
  stopDrawing: () => void;
  
  // Utility actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const initialState: MapState = {
  center: [40.7128, -74.0060], // New York City default
  zoom: 13,
  bounds: null,
  siteBoundary: null,
  siteArea: null,
  siteCoordinates: null,
  drawingPoints: [],
  activeLayers: ['osm'],
  layerVisibility: {
    osm: true,
    satellite: false,
    terrain: false,
    sunPath: false,
    climate: false,
    buildings: false,
    roads: false,
    topography: false,
    boundary: true,
    wind: false,
    vegetation: false,
    contours: false,
  },
  capturedImage: null,
  capturedBounds: null,
  contours: null,
  buildings: null,
  roads: null,
    climateData: null,
    climateLoading: false,
    climateError: null,
    isDrawing: false,
  drawingMode: null,
  isLoading: false,
  error: null,
};

export const useMapStore = create<MapState & MapActions>()(
  persist(
    (set, get) => ({
      ...initialState,
      
      // Map view actions
      setCenter: (center) => set({ center }),
      setZoom: (zoom) => set({ zoom }),
      setBounds: (bounds) => set({ bounds }),
      fitBounds: (bounds) => {
        // Calculate center from bounds
        const center: [number, number] = [
          (bounds[0][0] + bounds[1][0]) / 2, // lat
          (bounds[0][1] + bounds[1][1]) / 2, // lng
        ];
        set({ center, bounds });
      },
      
      // Site boundary actions
      setSiteBoundary: (siteBoundary) => set({ siteBoundary }),
      setSiteArea: (siteArea) => set({ siteArea }),
      clearSiteBoundary: () => set({
        siteBoundary: null,
        siteArea: null,
        siteCoordinates: null,
        capturedImage: null,
        capturedBounds: null,
        contours: null, // Clear contours when site cleared
        buildings: null, // Clear buildings
        roads: null,
      }),
      setSiteCoordinates: (siteCoordinates) => set({ siteCoordinates }),
      setDrawingPoints: (drawingPoints) => set({ drawingPoints }),
      addDrawingPoint: (point) => set((state) => ({ 
        drawingPoints: [...state.drawingPoints, point] 
      })),
      removeLastDrawingPoint: () => set((state) => ({ 
        drawingPoints: state.drawingPoints.slice(0, -1) 
      })),
      clearDrawingPoints: () => set({ drawingPoints: [] }),
      
      // Layer actions
      toggleLayer: (layerId) => {
        const { layerVisibility } = get();
        set({
          layerVisibility: {
            ...layerVisibility,
            [layerId]: !layerVisibility[layerId],
          },
        });
      },
      setLayerVisibility: (layerId, visible) => {
        const { layerVisibility } = get();
        set({
          layerVisibility: {
            ...layerVisibility,
            [layerId]: visible,
          },
        });
      },
      setActiveLayers: (activeLayers) => set({ activeLayers }),

      // Fixed image actions
      setCapturedImage: (capturedImage) => set({ capturedImage }),
      setCapturedBounds: (capturedBounds) => set({ capturedBounds }),

      // Analysis Data Actions
      setContours: (contours) => set({ contours }),
      setBuildings: (buildings) => set({ buildings }),
      setRoads: (roads) => set({ roads }),

      // Climate actions
      setClimateData: (climateData) => set({ climateData }),
      setClimateLoading: (climateLoading) => set({ climateLoading }),
      setClimateError: (climateError) => set({ climateError }),
      
      // Drawing actions
      setDrawingMode: (drawingMode) => set({ drawingMode }),
      startDrawing: () => set({ isDrawing: true }),
      stopDrawing: () => set({ isDrawing: false, drawingMode: null }),
      
      // Utility actions
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      reset: () => set(initialState),
    }),
    {
      name: 'map-store',
      version: 1,
      migrate: (persistedState: any, version: number) => {
        // Ensure layerVisibility has all required keys
        const defaultLayerVisibility = initialState.layerVisibility;
        const persistedLayerVisibility = persistedState?.layerVisibility || {};
        
        // Merge to ensure all keys from initial state are present
        const mergedLayerVisibility = {
          ...defaultLayerVisibility,
          ...persistedLayerVisibility,
        };
        
        return {
          ...initialState,
          ...persistedState,
          layerVisibility: mergedLayerVisibility,
        };
      },
      partialize: (state) => {
        // Only persist small, essential data to avoid localStorage quota issues
        // Large data (capturedImage, contours, buildings) is kept in memory only
        return {
          center: state.center,
          zoom: state.zoom,
          siteBoundary: state.siteBoundary,
          siteArea: state.siteArea,
          siteCoordinates: state.siteCoordinates,
          activeLayers: state.activeLayers,
          layerVisibility: state.layerVisibility,
          // Persist bounds (small data - just 4 numbers)
          capturedBounds: state.capturedBounds,
          // NOTE: capturedImage is NOT persisted because base64 data URLs are too large
          // for localStorage (quota limit ~5-10MB). The image is kept in memory only
          // and will be lost on page refresh. User must re-capture after refresh.
          // capturedImage: state.capturedImage, // Too large for localStorage
          // Static analysis data is session-only (large data)
          // contours: state.contours, 
          // buildings: state.buildings,
        };
      },
      // Add error handling for localStorage quota issues
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.warn('[mapStore] Error rehydrating from localStorage:', error);
          if (error instanceof Error && error.name === 'QuotaExceededError') {
            console.warn('[mapStore] localStorage quota exceeded. Clearing old data...');
            try {
              localStorage.removeItem('map-store');
            } catch (e) {
              console.error('[mapStore] Failed to clear localStorage:', e);
            }
          }
        }
      },
    }
  )
);
