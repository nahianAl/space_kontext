/**
 * Zustand store for managing placed Sketchfab models in the 3D scene
 */

import { create } from 'zustand';
import type { SketchfabModel } from '../types';
import * as THREE from 'three';

export interface PlacedSketchfabModel {
  id: string; // Unique ID for this placed instance
  modelUid: string; // Sketchfab model UID
  fileUrl: string; // Cached GLB file URL
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  attribution: {
    author: string;
    modelUrl: string;
    license: string;
    title: string;
  };
  license: string;
  mesh?: THREE.Group; // The loaded Three.js mesh (optional, for direct access)
  createdAt: number;
}

interface PlacedModelsStore {
  placedModels: PlacedSketchfabModel[];
  isLoading: boolean;
  error: string | null;

  // Actions
  addModel: (model: Omit<PlacedSketchfabModel, 'id' | 'createdAt'>) => string;
  removeModel: (id: string) => void;
  updateModel: (id: string, updates: Partial<PlacedSketchfabModel>) => void;
  clearAll: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const usePlacedModelsStore = create<PlacedModelsStore>((set) => ({
  placedModels: [],
  isLoading: false,
  error: null,

  addModel: (model) => {
    const id = `sketchfab-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newModel: PlacedSketchfabModel = {
      ...model,
      id,
      createdAt: Date.now(),
    };

    set((state) => ({
      placedModels: [...state.placedModels, newModel],
    }));

    return id;
  },

  removeModel: (id) => {
    set((state) => ({
      placedModels: state.placedModels.filter((m) => m.id !== id),
    }));
  },

  updateModel: (id, updates) => {
    set((state) => ({
      placedModels: state.placedModels.map((m) =>
        m.id === id ? { ...m, ...updates } : m
      ),
    }));
  },

  clearAll: () => {
    set({ placedModels: [] });
  },

  setLoading: (loading) => {
    set({ isLoading: loading });
  },

  setError: (error) => {
    set({ error });
  },
}));













