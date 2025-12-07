/**
 * Rendering Zustand store for managing wall polygon rendering state
 * Caches computed wall polygons with mitered corners for efficient rendering
 * Updates when the wall graph changes
 */
'use client';

import { create } from 'zustand';
import { WallGraph } from '../types/wallGraph';
import { WallPolygonShape, createMiteredWallsFromGraphMaker } from '../utils/wallGeometryMaker';

interface RenderingState {
  wallPolygons: WallPolygonShape[];
}

interface RenderingActions {
  recomputeWallPolygons: (graph: WallGraph) => void;
}

export const useRenderingStore = create<RenderingState & RenderingActions>((set, get) => ({
  wallPolygons: [],

  recomputeWallPolygons: (graph: WallGraph) => {
    const newPolygons = createMiteredWallsFromGraphMaker(graph);
    
    // Use a simple length check as a proxy for deep comparison to improve performance
    if (newPolygons.length !== get().wallPolygons.length || JSON.stringify(newPolygons) !== JSON.stringify(get().wallPolygons)) {
      set({ wallPolygons: newPolygons });
    }
  },
}));
