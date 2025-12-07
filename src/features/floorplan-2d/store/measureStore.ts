/**
 * Measure tool Zustand store for managing measurement state
 * Tracks active measurement, start/end points, guideline rendering and editing
 */
'use client';

import { create } from 'zustand';
import type { Point } from '../types/wallGraph';

interface Guideline {
  id: string;
  start: Point;
  end: Point;
}

const GUIDELINE_LENGTH = 5000;

const createGuideline = (point: Point, normalX: number, normalY: number): Guideline => {
  const id = `guideline-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  return {
    id,
    start: [
      point[0] - normalX * GUIDELINE_LENGTH,
      point[1] - normalY * GUIDELINE_LENGTH,
    ],
    end: [
      point[0] + normalX * GUIDELINE_LENGTH,
      point[1] + normalY * GUIDELINE_LENGTH,
    ],
  };
};

export interface MeasureStore {
  isMeasureActive: boolean;
  isMeasuring: boolean;
  startPoint: Point | null;
  endPoint: Point | null;
  currentPoint: Point | null; // For preview while dragging
  guidelinesEnabled: boolean;
  guidelines: Guideline[];
  lastGuidelineId: string | null;
  
  setMeasureActive: (active: boolean) => void;
  setGuidelinesEnabled: (enabled: boolean) => void;
  startMeasuring: (point: Point) => void;
  updateMeasuring: (point: Point) => void;
  finishMeasuring: (point: Point) => void;
  clearMeasure: () => void;
  setMeasureLength: (lengthPixels: number) => void;
  removeGuideline: (id: string) => void;
  clearGuidelines: () => void;
}

export const useMeasureStore = create<MeasureStore>((set) => ({
  isMeasureActive: false,
  isMeasuring: false,
  startPoint: null,
  endPoint: null,
  currentPoint: null,
  guidelinesEnabled: false,
  guidelines: [],
  lastGuidelineId: null,
  
  setMeasureActive: (active) => set({ 
    isMeasureActive: active, 
    isMeasuring: false, 
    startPoint: null, 
    endPoint: null,
    currentPoint: null,
    lastGuidelineId: null,
  }),

  setGuidelinesEnabled: (enabled) => set({ guidelinesEnabled: enabled }),
  
  startMeasuring: (point) => set({ 
    isMeasuring: true, 
    startPoint: point, 
    endPoint: null, // Clear previous measurement when starting new one
    currentPoint: point,
    lastGuidelineId: null,
  }),
  
  updateMeasuring: (point) => set((state) => {
    if (state.isMeasuring) {
      return { currentPoint: point };
    }
    return {};
  }),
  
  finishMeasuring: (point) => set((state) => {
    const updates: Partial<MeasureStore> = {
      isMeasuring: false,
      endPoint: point,
      currentPoint: null,
      lastGuidelineId: null,
    };

    if (!state.startPoint) {
      return updates;
    }

    const dx = point[0] - state.startPoint[0];
    const dy = point[1] - state.startPoint[1];
    const length = Math.hypot(dx, dy);

    if (state.guidelinesEnabled && length > 0) {
      const normalX = -dy / length;
      const normalY = dx / length;
      const guideline = createGuideline(point, normalX, normalY);
      updates.guidelines = [...state.guidelines, guideline];
      updates.lastGuidelineId = guideline.id;
    }

    return updates;
  }),
  
  clearMeasure: () => set({ 
    isMeasuring: false, 
    startPoint: null, 
    endPoint: null,
    currentPoint: null,
    lastGuidelineId: null,
  }),
  
  clearGuidelines: () => set({ guidelines: [], lastGuidelineId: null }),

  removeGuideline: (id) => set((state) => ({
    guidelines: state.guidelines.filter((guideline) => guideline.id !== id),
    lastGuidelineId: state.lastGuidelineId === id ? null : state.lastGuidelineId,
  })),

  setMeasureLength: (lengthPixels) => {
    set((state) => {
      if (!state.startPoint) {
        return {};
      }

      const referencePoint = state.isMeasuring && state.currentPoint
        ? state.currentPoint
        : state.endPoint ?? state.currentPoint;

      if (!referencePoint) {
        return {};
      }

      const dx = referencePoint[0] - state.startPoint[0];
      const dy = referencePoint[1] - state.startPoint[1];
      const currentLength = Math.hypot(dx, dy);

      let newPoint: Point;
      if (currentLength === 0) {
        newPoint = [state.startPoint[0] + lengthPixels, state.startPoint[1]];
      } else {
        const scale = lengthPixels / currentLength;
        newPoint = [
          state.startPoint[0] + dx * scale,
          state.startPoint[1] + dy * scale,
        ];
      }

      const updates: Partial<MeasureStore> = {};

      if (state.isMeasuring) {
        updates.currentPoint = newPoint;
      } else {
        updates.endPoint = newPoint;

        if (state.lastGuidelineId && state.startPoint) {
          const dxNew = newPoint[0] - state.startPoint[0];
          const dyNew = newPoint[1] - state.startPoint[1];
          const lengthNew = Math.hypot(dxNew, dyNew);

          if (lengthNew > 0) {
            const normalX = -dyNew / lengthNew;
            const normalY = dxNew / lengthNew;
            const updatedGuidelines = state.guidelines.map((guideline) => {
              if (guideline.id !== state.lastGuidelineId) {
                return guideline;
              }
              return {
                ...guideline,
                start: [
                  newPoint[0] - normalX * GUIDELINE_LENGTH,
                  newPoint[1] - normalY * GUIDELINE_LENGTH,
                ] as Point,
                end: [
                  newPoint[0] + normalX * GUIDELINE_LENGTH,
                  newPoint[1] + normalY * GUIDELINE_LENGTH,
                ] as Point,
              };
            });
            updates.guidelines = updatedGuidelines;
          }
        }
      }

      return updates;
    });
  },
}));

