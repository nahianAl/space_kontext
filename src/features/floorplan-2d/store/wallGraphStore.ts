/**
 * Main wall graph Zustand store orchestrator
 * Composes feature-specific slices (graph, drawing, selection, opening, history, tool) into a unified store
 * Provides project-scoped store instances and factory functions for creating stores
 */
'use client';
import { create } from 'zustand';

import { createWallGraph } from '../utils/wallGraphUtils';
import { createGraphSlice } from './slices/graphSlice';
import { createSelectionSlice } from './slices/selectionSlice';
import { createDrawingSlice } from './slices/drawingSlice';
import { createOpeningSlice } from './slices/openingSlice';
import { createHistorySlice } from './slices/historySlice';
import { createToolSlice } from './slices/toolSlice';
import type { WallGraphStore } from './types';

export type { WallGraphStore } from './types';

const createWallGraphStore = (projectId: string) =>
  create<WallGraphStore>()((set, get, store) => ({
    _storeInstanceId: projectId,
    clearAll: () => {
      set({
        graph: createWallGraph(),
        selectedWallId: null,
        selectedWallIds: [],
        selectedOpeningId: null,
        selectedOpeningIds: [],
        selectedFaces: [],
        hoveredFace: null,
        faceSelectionMode: false,
        isDrawing: false,
        drawingStartPoint: null,
        drawingCurrentPoint: null,
        openingDragState: null,
      });
    },
    ...createGraphSlice(set, get, store),
    ...createSelectionSlice(set, get, store),
    ...createDrawingSlice(set, get, store),
    ...createOpeningSlice(set, get, store),
    ...createHistorySlice(set, get, store),
    ...createToolSlice(set, get, store),
  }));

type WallGraphBoundStore = ReturnType<typeof createWallGraphStore>;
type StoreMap = Map<string, WallGraphBoundStore>;

declare global {
  // eslint-disable-next-line no-var
  var __projectWallStores: StoreMap | undefined;
}

const getProjectStores = (): StoreMap => {
  if (typeof window === 'undefined') {
    return new Map();
  }
  if (!globalThis.__projectWallStores) {
    globalThis.__projectWallStores = new Map();
  }
  return globalThis.__projectWallStores;
};

export const getWallGraphStore = (projectId: string): WallGraphBoundStore => {
  const stores = getProjectStores();

  if (!stores.has(projectId)) {
    const newStore = createWallGraphStore(projectId);
    stores.set(projectId, newStore);
  }

  return stores.get(projectId)!;
};

// Default export for backward compatibility (uses a default project ID)
// NOTE: This should be replaced with project-scoped usage
export const useWallGraphStore = getWallGraphStore('default');