/**
 * Floor store for managing architectural floor data (zones, furniture, etc.)
 * Separate from shapes store - this contains actual scene data for 3D rendering
 * Project-specific store using the same pattern as wallGraphStore
 */
'use client';

import { create } from 'zustand';
import type { Zone, FurnitureBlock, BoundingBox, ZoneMaterial } from '../types/floor';
import type { Point } from '../types/wallGraph';

export interface FloorStore {
  // Zones
  zones: Zone[];
  selectedZoneId: string | null;
  selectedZoneIds: string[];

  // Furniture blocks (for future)
  furnitureBlocks: FurnitureBlock[];
  selectedFurnitureId: string | null;
  selectedFurnitureIds: string[];

  // Default zone settings
  defaultZoneFill: string;
  defaultZoneFillOpacity: number;
  defaultZoneMaterial: ZoneMaterial | undefined;

  // Zone actions
  addZone: (zone: Zone) => void;
  updateZone: (id: string, updates: Partial<Zone>) => void;
  deleteZone: (id: string) => void;
  deleteZones: (ids: string[]) => void;
  selectZone: (id: string | null) => void;
  selectZones: (ids: string[]) => void;
  addZoneToSelection: (id: string) => void;
  removeZoneFromSelection: (id: string) => void;
  clearZoneSelection: () => void;

  // Default settings actions
  setDefaultZoneFill: (fill: string) => void;
  setDefaultZoneFillOpacity: (opacity: number) => void;
  setDefaultZoneMaterial: (material: ZoneMaterial | undefined) => void;

  // Furniture actions (for future implementation)
  addFurnitureBlock: (block: FurnitureBlock) => void;
  updateFurnitureBlock: (id: string, updates: Partial<FurnitureBlock>) => void;
  deleteFurnitureBlock: (id: string) => void;
  selectFurnitureBlock: (id: string | null) => void;

  // Layer actions
  assignZonesToLayer: (zoneIds: string[], layerId: string) => void;
}

// Calculate bounding box for a polygon
const calculateBoundingBox = (points: Point[]): BoundingBox => {
  if (points.length === 0 || !points[0]) {
    return { min: [0, 0], max: [0, 0], center: [0, 0], width: 0, depth: 0 };
  }

  const firstPoint = points[0];
  let minX = firstPoint[0];
  let minY = firstPoint[1];
  let maxX = firstPoint[0];
  let maxY = firstPoint[1];

  for (const point of points) {
    minX = Math.min(minX, point[0]);
    minY = Math.min(minY, point[1]);
    maxX = Math.max(maxX, point[0]);
    maxY = Math.max(maxY, point[1]);
  }

  const width = maxX - minX;
  const depth = maxY - minY;
  const center: Point = [(minX + maxX) / 2, (minY + maxY) / 2];

  return {
    min: [minX, minY],
    max: [maxX, maxY],
    center,
    width,
    depth
  };
};

export const createFloorStore = () => {
  return create<FloorStore>((set, get) => ({
    // Initial state
    zones: [],
    selectedZoneId: null,
    selectedZoneIds: [],
    furnitureBlocks: [],
    selectedFurnitureId: null,
    selectedFurnitureIds: [],
    defaultZoneFill: '#808080',
    defaultZoneFillOpacity: 0.5,
    defaultZoneMaterial: undefined,

    // Zone actions
    addZone: (zone) => {
      // Auto-calculate bounding box
      const boundingBox = calculateBoundingBox(zone.points);
      const zoneWithBBox = { ...zone, boundingBox };

      set(state => ({
        zones: [...state.zones, zoneWithBBox]
      }));
    },

    updateZone: (id, updates) => {
      set(state => ({
        zones: state.zones.map(zone => {
          if (zone.id === id) {
            const updated = { ...zone, ...updates };
            // Recalculate bounding box if points changed
            if (updates.points) {
              updated.boundingBox = calculateBoundingBox(updates.points);
            }
            return updated;
          }
          return zone;
        })
      }));
    },

    deleteZone: (id) => {
      set(state => ({
        zones: state.zones.filter(zone => zone.id !== id),
        selectedZoneId: state.selectedZoneId === id ? null : state.selectedZoneId,
        selectedZoneIds: state.selectedZoneIds.filter(zoneId => zoneId !== id)
      }));
    },

    deleteZones: (ids) => {
      set(state => ({
        zones: state.zones.filter(zone => !ids.includes(zone.id)),
        selectedZoneIds: state.selectedZoneIds.filter(id => !ids.includes(id)),
        selectedZoneId: ids.includes(state.selectedZoneId || '') ? null : state.selectedZoneId
      }));
    },

    selectZone: (id) => {
      set({
        selectedZoneId: id,
        selectedZoneIds: id ? [id] : []
      });
    },

    selectZones: (ids) => {
      set({
        selectedZoneIds: ids,
        selectedZoneId: ids.length === 1 ? (ids[0] ?? null) : null
      });
    },

    addZoneToSelection: (id) => {
      const { selectedZoneIds } = get();
      if (selectedZoneIds.includes(id)) {
        return;
      }
      const newSelection = [...selectedZoneIds, id];
      set({
        selectedZoneIds: newSelection,
        selectedZoneId: newSelection.length === 1 ? (newSelection[0] ?? null) : null
      });
    },

    removeZoneFromSelection: (id) => {
      const { selectedZoneIds } = get();
      const newSelection = selectedZoneIds.filter(zoneId => zoneId !== id);
      set({
        selectedZoneIds: newSelection,
        selectedZoneId: newSelection.length === 1 ? (newSelection[0] ?? null) : null
      });
    },

    clearZoneSelection: () => {
      set({ selectedZoneIds: [], selectedZoneId: null });
    },

    // Default settings
    setDefaultZoneFill: (fill) => {
      set({ defaultZoneFill: fill });
    },

    setDefaultZoneFillOpacity: (opacity) => {
      set({ defaultZoneFillOpacity: opacity });
    },

    setDefaultZoneMaterial: (material) => {
      set({ defaultZoneMaterial: material });
    },

    // Furniture actions (stubbed for future)
    addFurnitureBlock: (block) => {
      set(state => ({
        furnitureBlocks: [...state.furnitureBlocks, block]
      }));
    },

    updateFurnitureBlock: (id, updates) => {
      set(state => ({
        furnitureBlocks: state.furnitureBlocks.map(block =>
          block.id === id ? { ...block, ...updates } : block
        )
      }));
    },

    deleteFurnitureBlock: (id) => {
      set(state => ({
        furnitureBlocks: state.furnitureBlocks.filter(block => block.id !== id),
        selectedFurnitureId: state.selectedFurnitureId === id ? null : state.selectedFurnitureId
      }));
    },

    selectFurnitureBlock: (id) => {
      set({ selectedFurnitureId: id });
    },

    // Layer actions
    assignZonesToLayer: (zoneIds, layerId) => {
      if (!zoneIds.length) {
        return;
      }

      set(state => ({
        zones: state.zones.map(zone =>
          zoneIds.includes(zone.id) ? { ...zone, layerId } : zone
        )
      }));
    }
  }));
};

// Project-specific store instances (same pattern as wallGraphStore)
const floorStores = new Map<string, ReturnType<typeof createFloorStore>>();

export const getFloorStore = (projectId: string) => {
  let store = floorStores.get(projectId);
  if (!store) {
    store = createFloorStore();
    floorStores.set(projectId, store);
  }
  return store;
};
