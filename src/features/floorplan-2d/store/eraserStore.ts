/**
 * Eraser tool Zustand store for managing eraser state
 * Tracks eraser tool activation for deleting elements from the canvas
 */
'use client';

import { create } from 'zustand';

export interface EraserStore {
  isEraserActive: boolean;
  
  setEraserActive: (active: boolean) => void;
}

export const useEraserStore = create<EraserStore>((set) => ({
  isEraserActive: false,
  
  setEraserActive: (active) => set({ isEraserActive: active }),
}));

