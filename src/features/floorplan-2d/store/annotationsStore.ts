/**
 * Annotations Zustand store for managing architectural annotations
 * Handles dimensions, text, leaders, reference markers, and level markers
 * Manages annotation creation, selection, updates, deletion, and active tool state
 */
'use client';

import { create } from 'zustand';
import { useLayerStore } from './layerStore';
import { DEFAULT_LAYER_ID } from '../types/layers';
import type {
  Annotation,
  AnnotationType,
  DimensionSettings,
  TextSettings,
  LeaderSettings
} from '../types/annotations';
import type { Point } from '../types/wallGraph';

// Generate unique ID for annotations
function generateAnnotationId(): string {
  return `annotation-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export interface AnnotationsStore {
  // State
  annotations: Map<string, Annotation>;
  isAnnotationModeActive: boolean; // Whether annotation panel is open
  activeAnnotationTool: AnnotationType | null;
  selectedAnnotationId: string | null;
  selectedAnnotationIds: string[];
  isCreatingAnnotation: boolean;
  tempAnnotationData: Partial<Annotation> | null; // for multi-step creation

  // Default settings
  defaultDimensionSettings: DimensionSettings;
  defaultTextSettings: TextSettings;
  defaultLeaderSettings: LeaderSettings;

  // Actions
  setAnnotationModeActive: (active: boolean) => void;
  setActiveAnnotationTool: (tool: AnnotationType | null) => void;
  addAnnotation: (annotation: Annotation) => void;
  updateAnnotation: (id: string, updates: Partial<Annotation>) => void;
  deleteAnnotation: (id: string) => void;
  deleteSelectedAnnotations: () => void;
  selectAnnotation: (id: string | null) => void;
  selectAnnotations: (ids: string[]) => void;
  clearAnnotationSelection: () => void;
  setTempAnnotationData: (data: Partial<Annotation> | null) => void;
  setIsCreatingAnnotation: (value: boolean) => void;

  // Settings actions
  updateDimensionSettings: (settings: Partial<DimensionSettings>) => void;
  updateTextSettings: (settings: Partial<TextSettings>) => void;
  updateLeaderSettings: (settings: Partial<LeaderSettings>) => void;

  // Utility
  getAnnotation: (id: string) => Annotation | undefined;
  getAnnotationsByType: (type: AnnotationType) => Annotation[];
  clearAnnotations: () => void;
}

export const createAnnotationsStore = () => {
  return create<AnnotationsStore>((set, get) => ({
    // Initial state
    annotations: new Map(),
    isAnnotationModeActive: false,
    activeAnnotationTool: null,
    selectedAnnotationId: null,
    selectedAnnotationIds: [],
    isCreatingAnnotation: false,
    tempAnnotationData: null,

    // Default settings
    defaultDimensionSettings: {
      arrowStyle: 'filled-arrow',
      offset: 20,
      precision: 2,
      showUnits: true,
    },
    defaultTextSettings: {
      fontSize: 14,
      fontWeight: 'normal',
      textColor: '#000000',
      showBackground: false,
      backgroundColor: '#FFFFFF',
    },
    defaultLeaderSettings: {
      arrowStyle: 'filled',
      leaderStyle: 'straight',
      landingLength: 30,
      showBackground: false,
    },

    // Actions
    setAnnotationModeActive: (active) => {
      set({ isAnnotationModeActive: active });
      if (!active) {
        // When deactivating annotation mode, clear active tool and creation state
        set({
          activeAnnotationTool: null,
          isCreatingAnnotation: false,
          tempAnnotationData: null,
        });
      }
    },

    setActiveAnnotationTool: (tool) => {
      set({
        activeAnnotationTool: tool,
        // Cancel any ongoing creation when switching tools
        isCreatingAnnotation: false,
        tempAnnotationData: null,
      });
    },

    addAnnotation: (annotation) => {
      set((state) => {
        const newAnnotations = new Map(state.annotations);
        newAnnotations.set(annotation.id, annotation);
        return { annotations: newAnnotations };
      });
    },

    updateAnnotation: (id, updates) => {
      set((state) => {
        const newAnnotations = new Map(state.annotations);
        const existing = newAnnotations.get(id);
        if (existing) {
          newAnnotations.set(id, {
            ...existing,
            ...updates,
            updatedAt: Date.now(),
          } as Annotation);
        }
        return { annotations: newAnnotations };
      });
    },

    deleteAnnotation: (id) => {
      set((state) => {
        const newAnnotations = new Map(state.annotations);
        newAnnotations.delete(id);
        return {
          annotations: newAnnotations,
          selectedAnnotationId: state.selectedAnnotationId === id ? null : state.selectedAnnotationId,
          selectedAnnotationIds: state.selectedAnnotationIds.filter((annId) => annId !== id),
        };
      });
    },

    deleteSelectedAnnotations: () => {
      const { selectedAnnotationIds } = get();
      set((state) => {
        const newAnnotations = new Map(state.annotations);
        selectedAnnotationIds.forEach((id) => {
          newAnnotations.delete(id);
        });
        return {
          annotations: newAnnotations,
          selectedAnnotationIds: [],
          selectedAnnotationId: null,
        };
      });
    },

    selectAnnotation: (id) => {
      set({
        selectedAnnotationId: id,
        selectedAnnotationIds: id ? [id] : [],
      });
    },

    selectAnnotations: (ids) => {
      set({
        selectedAnnotationIds: ids,
        selectedAnnotationId: ids.length === 1 ? (ids[0] ?? null) : null,
      });
    },

    clearAnnotationSelection: () => {
      set({ selectedAnnotationIds: [], selectedAnnotationId: null });
    },

    setTempAnnotationData: (data) => {
      set({ tempAnnotationData: data });
    },

    setIsCreatingAnnotation: (value) => {
      set({ isCreatingAnnotation: value });
    },

    // Settings actions
    updateDimensionSettings: (settings) => {
      set((state) => ({
        defaultDimensionSettings: {
          ...state.defaultDimensionSettings,
          ...settings,
        },
      }));
    },

    updateTextSettings: (settings) => {
      set((state) => ({
        defaultTextSettings: {
          ...state.defaultTextSettings,
          ...settings,
        },
      }));
    },

    updateLeaderSettings: (settings) => {
      set((state) => ({
        defaultLeaderSettings: {
          ...state.defaultLeaderSettings,
          ...settings,
        },
      }));
    },

    // Utility
    getAnnotation: (id) => {
      return get().annotations.get(id);
    },

    getAnnotationsByType: (type) => {
      const { annotations } = get();
      return Array.from(annotations.values()).filter((ann) => ann.type === type);
    },

    clearAnnotations: () => {
      set({
        annotations: new Map(),
        isCreatingAnnotation: false,
        tempAnnotationData: null,
      });
    },
  }));
};

// Create a singleton store instance
export const useAnnotationsStore = createAnnotationsStore();
