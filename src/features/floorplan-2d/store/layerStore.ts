/**
 * Layer Zustand store for managing CAD-style layers
 * Handles layer creation, deletion, visibility, locking, and active layer management
 * Provides layer organization for walls, openings, and shapes
 */
'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Layer } from '../types/layers';
import { DEFAULT_LAYER_ID, DEFAULT_LAYER_NAME, ANNOTATIONS_LAYER_ID, ANNOTATIONS_LAYER_NAME } from '../types/layers';

// Generate unique ID for layers
function generateLayerId(): string {
  return `layer-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Default layer colors for new layers
const DEFAULT_LAYER_COLORS = [
  '#ffffff', '#ff0000', '#00ff00', '#0000ff', '#ffff00', 
  '#ff00ff', '#00ffff', '#ff8800', '#8800ff', '#00ff88'
];

export interface LayerStore {
  // State
  layers: Layer[];
  activeLayerId: string;

  // Actions
  createLayer: (name: string, color?: string) => string;
  deleteLayer: (layerId: string) => void;
  updateLayer: (layerId: string, updates: Partial<Omit<Layer, 'id'>>) => void;
  setActiveLayer: (layerId: string) => void;
  toggleLayerVisibility: (layerId: string) => void;
  toggleLayerLock: (layerId: string) => void;
  reorderLayers: (layerId: string, newOrder: number) => void;
  getLayer: (layerId: string) => Layer | undefined;
  getVisibleLayers: () => Layer[];
  isLayerLocked: (layerId: string) => boolean;
  ensureSystemLayers: () => void;
}

const createDefaultLayer = (): Layer => ({
  id: DEFAULT_LAYER_ID,
  name: DEFAULT_LAYER_NAME,
  color: '#ffffff',
  visible: true,
  locked: false,
  order: 0,
  opacity: 1.0,
});

const createAnnotationsLayer = (): Layer => ({
  id: ANNOTATIONS_LAYER_ID,
  name: ANNOTATIONS_LAYER_NAME,
  color: '#00ffff', // Cyan color for annotations
  visible: true,
  locked: false,
  order: 100, // Place annotations layer on top by default
  opacity: 1.0,
});

export const useLayerStore = create<LayerStore>()(
  persist(
    (set, get) => ({
      layers: [createDefaultLayer(), createAnnotationsLayer()],
      activeLayerId: DEFAULT_LAYER_ID,

      createLayer: (name, color) => {
        const newId = generateLayerId();
        const layers = get().layers;
        const maxOrder = Math.max(...layers.map(l => l.order), -1);
        
        // Use provided color or pick from default colors
        let layerColor: string = color || '';
        if (!layerColor) {
          const usedColors = new Set(layers.map(l => l.color));
          layerColor = DEFAULT_LAYER_COLORS.find(c => !usedColors.has(c)) || DEFAULT_LAYER_COLORS[0] || '#808080';
        }
        
        const newLayer: Layer = {
          id: newId,
          name: name || `Layer ${layers.length}`,
          color: layerColor,
          visible: true,
          locked: false,
          order: maxOrder + 1,
          opacity: 1.0,
        };

        set((state) => ({
          layers: [...state.layers, newLayer],
        }));

        return newId;
      },

      deleteLayer: (layerId) => {
        if (layerId === DEFAULT_LAYER_ID) {
          console.warn('Cannot delete default layer');
          return;
        }
        if (layerId === ANNOTATIONS_LAYER_ID) {
          console.warn('Cannot delete annotations layer');
          return;
        }

        set((state) => {
          const newLayers = state.layers.filter(l => l.id !== layerId);
          
          // If deleting active layer, switch to default
          const newActiveLayerId = state.activeLayerId === layerId 
            ? DEFAULT_LAYER_ID 
            : state.activeLayerId;

          return {
            layers: newLayers,
            activeLayerId: newActiveLayerId,
          };
        });
      },

      updateLayer: (layerId, updates) => {
        if ((layerId === DEFAULT_LAYER_ID || layerId === ANNOTATIONS_LAYER_ID) && updates.name !== undefined) {
          // Prevent renaming default and annotations layers
          console.warn('Cannot rename system layers');
          return;
        }

        set((state) => ({
          layers: state.layers.map(layer =>
            layer.id === layerId ? { ...layer, ...updates } : layer
          ),
        }));
      },

      setActiveLayer: (layerId) => {
        const layer = get().getLayer(layerId);
        if (layer) {
          set({ activeLayerId: layerId });
        }
      },

      toggleLayerVisibility: (layerId) => {
        set((state) => ({
          layers: state.layers.map(layer =>
            layer.id === layerId ? { ...layer, visible: !layer.visible } : layer
          ),
        }));
      },

      toggleLayerLock: (layerId) => {
        set((state) => ({
          layers: state.layers.map(layer =>
            layer.id === layerId ? { ...layer, locked: !layer.locked } : layer
          ),
        }));
      },

      reorderLayers: (layerId, newOrder) => {
        set((state) => {
          const layers = [...state.layers];
          const layerIndex = layers.findIndex(l => l.id === layerId);
          if (layerIndex === -1) {
            return state;
          }

          const layer = layers[layerIndex];
          if (!layer) {
            return state;
          }
          layers.splice(layerIndex, 1);
          
          // Insert at new position
          const sortedLayers = [...layers].sort((a, b) => a.order - b.order);
          sortedLayers.splice(newOrder, 0, { ...layer, order: newOrder });
          
          // Reassign orders to ensure consistency
          const reorderedLayers = sortedLayers.map((l, idx) => ({
            ...l,
            order: idx,
          }));

          return { layers: reorderedLayers };
        });
      },

      getLayer: (layerId) => {
        return get().layers.find(l => l.id === layerId);
      },

      getVisibleLayers: () => {
        return get().layers.filter(l => l.visible);
      },

      isLayerLocked: (layerId) => {
        const layer = get().getLayer(layerId);
        return layer?.locked ?? false;
      },

      ensureSystemLayers: () => {
        set((state) => {
          const layers = [...state.layers];
          let modified = false;

          // Ensure Default layer exists
          if (!layers.find(l => l.id === DEFAULT_LAYER_ID)) {
            layers.push(createDefaultLayer());
            modified = true;
          }

          // Ensure Annotations layer exists
          if (!layers.find(l => l.id === ANNOTATIONS_LAYER_ID)) {
            layers.push(createAnnotationsLayer());
            modified = true;
          }

          return modified ? { layers } : state;
        });
      },
    }),
    {
      name: 'floorplan-layer-store',
      partialize: (state) => ({
        layers: state.layers,
        activeLayerId: state.activeLayerId,
      }),
    }
  )
);

