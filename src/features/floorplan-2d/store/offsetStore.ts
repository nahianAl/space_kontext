/**
 * Offset tool Zustand store for creating offset copies of shapes via mouse drag
 * Tracks offset tool state, selected shape, and drag offset distance
 */
'use client';

import { create } from 'zustand';
import type { Point } from '../types/wallGraph';
import type { Shape } from '../types/shapes';

export interface OffsetStore {
  isOffsetToolActive: boolean;
  selectedShapeId: string | null; // Shape to offset
  isDraggingOffset: boolean;
  dragStartPoint: Point | null;
  dragCurrentPoint: Point | null;
  offsetDistance: number; // In pixels, calculated from drag
  offsetSide: 'left' | 'right'; // Determined by drag direction
  previewShape: Shape | null; // Preview of the offset shape

  setOffsetToolActive: (active: boolean) => void;
  selectShapeForOffset: (shapeId: string | null) => void;
  startOffsetDrag: (point: Point) => void;
  updateOffsetDrag: (point: Point, distance: number, side: 'left' | 'right') => void;
  finishOffsetDrag: () => void;
  cancelOffsetDrag: () => void;
  setPreviewShape: (shape: Shape | null) => void;
}

export const useOffsetStore = create<OffsetStore>((set) => ({
  isOffsetToolActive: false,
  selectedShapeId: null,
  isDraggingOffset: false,
  dragStartPoint: null,
  dragCurrentPoint: null,
  offsetDistance: 0,
  offsetSide: 'left',
  previewShape: null,

  setOffsetToolActive: (active) =>
    set({
      isOffsetToolActive: active,
      selectedShapeId: null,
      isDraggingOffset: false,
      dragStartPoint: null,
      dragCurrentPoint: null,
      offsetDistance: 0,
      offsetSide: 'left',
      previewShape: null,
    }),

  selectShapeForOffset: (shapeId) =>
    set({
      selectedShapeId: shapeId,
      isDraggingOffset: false,
      dragStartPoint: null,
      dragCurrentPoint: null,
      offsetDistance: 0,
      previewShape: null,
    }),

  startOffsetDrag: (point) =>
    set({
      isDraggingOffset: true,
      dragStartPoint: point,
      dragCurrentPoint: point,
      offsetDistance: 0,
    }),

  updateOffsetDrag: (point, distance, side) =>
    set({
      dragCurrentPoint: point,
      offsetDistance: distance,
      offsetSide: side,
    }),

  finishOffsetDrag: () =>
    set({
      isDraggingOffset: false,
      dragStartPoint: null,
      dragCurrentPoint: null,
      selectedShapeId: null,
      offsetDistance: 0,
      previewShape: null,
    }),

  cancelOffsetDrag: () =>
    set({
      isDraggingOffset: false,
      dragStartPoint: null,
      dragCurrentPoint: null,
      offsetDistance: 0,
      previewShape: null,
    }),

  setPreviewShape: (shape) =>
    set({
      previewShape: shape,
    }),
}));
