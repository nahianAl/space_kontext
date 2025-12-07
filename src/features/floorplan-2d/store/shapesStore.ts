/**
 * Shapes Zustand store for managing drawing shapes (lines, circles, rectangles, etc.)
 * Handles shape creation, selection, updates, deletion, and active tool state
 * Manages shape drawing state and transformation operations
 */
'use client';

import { create } from 'zustand';
import { useLayerStore } from './layerStore';
import { DEFAULT_LAYER_ID } from '../types/layers';
import type { Shape, ShapeType } from '../types/shapes';
import type { Point } from '../types/wallGraph';
import type { Zone } from '../types/floor';

// Generate unique ID for shapes
function generateShapeId(): string {
  return `shape-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export interface ShapesStore {
  // Shape tools state
  activeShapeTool: ShapeType | null;
  shapes: Shape[];
  isShapeDrawing: boolean;
  shapeDrawingData: {
    startPoint?: Point;
    center?: Point;
    corner?: Point;
    points?: Point[];
    trianglePoints?: Point[];
    controlPoint?: Point;
    currentPoint?: Point;
  };
  selectedShapeId: string | null;
  selectedShapeIds: string[];

  // Callback for when a zone is finished (will be set by KonvaCanvas)
  onZoneFinished: ((points: Point[]) => void) | null;

  // Drag selection state
  isDragSelecting: boolean;
  dragSelectStart: Point | null;
  dragSelectEnd: Point | null;

  // Actions
  setActiveShapeTool: (tool: ShapeType | null) => void;
  setOnZoneFinished: (callback: ((points: Point[]) => void) | null) => void;
  addShape: (shape: Shape) => void;
  updateShapeDrawing: (data: Partial<{
    startPoint?: Point;
    center?: Point;
    corner?: Point;
    points?: Point[];
    trianglePoints?: Point[];
    controlPoint?: Point;
    currentPoint?: Point;
  }>) => void;
  startShapeDrawing: (point: Point) => void;
  finishShapeDrawing: () => void;
  cancelShapeDrawing: () => void;
  clearShapes: () => void;
  deleteShape: (id: string) => void;
  deleteSelectedShapes: () => void;
  selectShape: (id: string | null) => void;
  selectShapes: (ids: string[]) => void;
  addToShapeSelection: (id: string) => void;
  removeFromShapeSelection: (id: string) => void;
  clearShapeSelection: () => void;
  startDragSelection: (point: Point) => void;
  updateDragSelection: (point: Point) => void;
  finishDragSelection: () => void;
  cancelDragSelection: () => void;
  updateShape: (id: string, updates: Partial<Shape>) => void;
  assignShapesToLayer: (shapeIds: string[], layerId: string) => void;
}

export const createShapesStore = () => {
  return create<ShapesStore>((set, get) => ({
    // Initial state
    activeShapeTool: null,
    shapes: [],
    isShapeDrawing: false,
    shapeDrawingData: {},
    selectedShapeId: null,
    selectedShapeIds: [],
    onZoneFinished: null,
    isDragSelecting: false,
    dragSelectStart: null,
    dragSelectEnd: null,
    
    setActiveShapeTool: (tool) => {
      set({
        activeShapeTool: tool,
        // Cancel any ongoing drawing when switching tools
        isShapeDrawing: false,
        shapeDrawingData: {},
        // Clear shape selection when switching tools
        selectedShapeId: null,
        selectedShapeIds: []
      });
    },
    
    addShape: (shape) => {
      set(state => ({
        shapes: [...state.shapes, shape]
      }));
    },
    
    updateShapeDrawing: (data) => {
      set(state => ({
        shapeDrawingData: {
          ...state.shapeDrawingData,
          ...data
        }
      }));
    },
    
    startShapeDrawing: (point: Point) => {
      const { activeShapeTool } = get();
      if (!activeShapeTool) {
        return;
      }

      // Check if active layer is locked - prevent drawing on locked layers
      const activeLayerId = useLayerStore.getState().activeLayerId || DEFAULT_LAYER_ID;
      const activeLayer = useLayerStore.getState().getLayer(activeLayerId);
      if (activeLayer?.locked) {
        return;
      }

      set({
        isShapeDrawing: true,
        shapeDrawingData: {
          startPoint: point,
          currentPoint: point,
          // Initialize based on tool type
          ...(activeShapeTool === 'polyline' ? { points: [point] } : {}),
          ...(activeShapeTool === 'zone' ? { points: [point] } : {}),
          ...(activeShapeTool === 'circle' ? { center: point } : {}),
          ...(activeShapeTool === 'square' ? { corner: point } : {}),
          ...(activeShapeTool === 'triangle' ? { trianglePoints: [point] } : {}),
          ...(activeShapeTool === 'curve' ? { startPoint: point } : {}),
        }
      });

      // Clear zone selection when starting to draw (zone selection is handled separately in floorStore via hook)
    },
    
    finishShapeDrawing: () => {
      const { activeShapeTool, shapeDrawingData } = get();
      if (!activeShapeTool || !shapeDrawingData) {
        return;
      }
      
      // Get active layer from layer store, default to 'default' if not set
      const activeLayerId = useLayerStore.getState().activeLayerId || DEFAULT_LAYER_ID;
      
      // Create shape based on tool type and current drawing data
      let newShape: Shape | null = null;
      
      switch (activeShapeTool) {
        case 'line':
          if (shapeDrawingData.startPoint && shapeDrawingData.currentPoint) {
            newShape = {
              id: generateShapeId(),
              type: 'line',
              start: shapeDrawingData.startPoint,
              end: shapeDrawingData.currentPoint,
              stroke: '#000000',
              // Don't set strokeWidth - let it use global stroke weight from rendering
              layerId: activeLayerId
            };
          }
          break;
          
        case 'polyline':
          if (shapeDrawingData.points && shapeDrawingData.points.length >= 2) {
            newShape = {
              id: generateShapeId(),
              type: 'polyline',
              points: shapeDrawingData.points,
              stroke: '#000000',
              // Don't set strokeWidth - let it use global stroke weight from rendering
              layerId: activeLayerId
            };
          }
          break;
          
        case 'zone':
          // Zones are now handled by floorStore via callback
          // Don't add to shapes array
          if (shapeDrawingData.points && shapeDrawingData.points.length >= 3) {
            const { onZoneFinished } = get();
            if (onZoneFinished) {
              // Call the callback with zone points - callback will handle adding to floorStore
              onZoneFinished(shapeDrawingData.points);
            }
          }
          break;
          
        case 'circle':
          if (shapeDrawingData.center && shapeDrawingData.currentPoint) {
            const [cx, cy] = shapeDrawingData.center;
            const [px, py] = shapeDrawingData.currentPoint;
            const radius = Math.sqrt(
              Math.pow(px - cx, 2) + Math.pow(py - cy, 2)
            );
            if (radius > 0) {
              newShape = {
                id: generateShapeId(),
                type: 'circle',
                center: shapeDrawingData.center,
                radius,
                stroke: '#000000',
                // Don't set strokeWidth - let it use global stroke weight from rendering
                layerId: activeLayerId
              };
            }
          }
          break;
          
        case 'square':
          if (shapeDrawingData.corner && shapeDrawingData.currentPoint) {
            const [x1, y1] = shapeDrawingData.corner;
            const [x2, y2] = shapeDrawingData.currentPoint;
            const width = Math.abs(x2 - x1);
            const height = Math.abs(y2 - y1);
            const center: Point = [
              x1 + (x2 - x1) / 2,
              y1 + (y2 - y1) / 2
            ];
            newShape = {
              id: generateShapeId(),
              type: 'square',
              center,
              width,
              height,
              rotation: 0,
              stroke: '#000000',
              // Don't set strokeWidth - let it use global stroke weight from rendering
              layerId: activeLayerId
            };
          }
          break;
          
        case 'triangle':
          if (shapeDrawingData.trianglePoints && shapeDrawingData.trianglePoints.length === 3) {
            const [p1, p2, p3] = shapeDrawingData.trianglePoints;
            if (p1 && p2 && p3) {
              newShape = {
                id: generateShapeId(),
                type: 'triangle',
                point1: p1,
                point2: p2,
                point3: p3,
                stroke: '#000000',
                // Don't set strokeWidth - let it use global stroke weight from rendering
                layerId: activeLayerId
              };
            }
          }
          break;
          
        case 'arrow':
          if (shapeDrawingData.startPoint && shapeDrawingData.currentPoint) {
            newShape = {
              id: generateShapeId(),
              type: 'arrow',
              start: shapeDrawingData.startPoint,
              end: shapeDrawingData.currentPoint,
              stroke: '#000000',
              // Don't set strokeWidth - let it use global stroke weight from rendering
              layerId: activeLayerId
            };
          }
          break;
          
        case 'guide-line':
          if (shapeDrawingData.startPoint && shapeDrawingData.currentPoint) {
            newShape = {
              id: generateShapeId(),
              type: 'guide-line',
              start: shapeDrawingData.startPoint,
              end: shapeDrawingData.currentPoint,
              stroke: '#000000',
              // Don't set strokeWidth - let it use global stroke weight from rendering
              layerId: activeLayerId
            };
          }
          break;
          
        case 'curve':
          if (shapeDrawingData.startPoint && shapeDrawingData.controlPoint && shapeDrawingData.currentPoint) {
            newShape = {
              id: generateShapeId(),
              type: 'curve',
              start: shapeDrawingData.startPoint,
              control: shapeDrawingData.controlPoint,
              end: shapeDrawingData.currentPoint,
              stroke: '#000000',
              // Don't set strokeWidth - let it use global stroke weight from rendering
              layerId: activeLayerId
            };
          }
          break;
      }
      
      if (newShape) {
        get().addShape(newShape);
        set({ selectedShapeId: newShape.id });
      }
      
      // Reset drawing state and deactivate tool
      set({
        isShapeDrawing: false,
        shapeDrawingData: {},
        activeShapeTool: null // Auto-deactivate tool after finishing
      });
    },
    
    cancelShapeDrawing: () => {
      set({
        isShapeDrawing: false,
        shapeDrawingData: {}
      });
    },
    
    clearShapes: () => {
      set({
        shapes: [],
        isShapeDrawing: false,
        shapeDrawingData: {}
      });
    },
    
    deleteShape: (id: string) => {
      set(state => ({
        shapes: state.shapes.filter(shape => shape.id !== id),
        selectedShapeId: state.selectedShapeId === id ? null : state.selectedShapeId,
        selectedShapeIds: state.selectedShapeIds.filter(shapeId => shapeId !== id)
      }));
    },
    deleteSelectedShapes: () => {
      const { selectedShapeIds } = get();
      set(state => ({
        shapes: state.shapes.filter(shape => !selectedShapeIds.includes(shape.id)),
        selectedShapeIds: [],
        selectedShapeId: null
      }));
    },
    
    selectShape: (id: string | null) => {
      set({ 
        selectedShapeId: id,
        selectedShapeIds: id ? [id] : []
      });
    },
    selectShapes: (ids: string[]) => {
      set({
        selectedShapeIds: ids,
        selectedShapeId: ids.length === 1 ? (ids[0] ?? null) : null
      });
    },
    addToShapeSelection: (id: string) => {
      const { selectedShapeIds } = get();
      if (selectedShapeIds.includes(id)) {
        return;
      }
      const newSelection = [...selectedShapeIds, id];
      set({
        selectedShapeIds: newSelection,
        selectedShapeId: newSelection.length === 1 ? (newSelection[0] ?? null) : null
      });
    },
    removeFromShapeSelection: (id: string) => {
      const { selectedShapeIds } = get();
      const newSelection = selectedShapeIds.filter((shapeId) => shapeId !== id);
      set({
        selectedShapeIds: newSelection,
        selectedShapeId: newSelection.length === 1 ? (newSelection[0] ?? null) : null
      });
    },
    clearShapeSelection: () => {
      set({ selectedShapeIds: [], selectedShapeId: null });
    },
    startDragSelection: (point: Point) => {
      set({
        isDragSelecting: true,
        dragSelectStart: point,
        dragSelectEnd: point
      });
    },
    updateDragSelection: (point: Point) => {
      const { isDragSelecting } = get();
      if (isDragSelecting) {
        set({ dragSelectEnd: point });
      }
    },
    finishDragSelection: () => {
      set({
        isDragSelecting: false,
        dragSelectStart: null,
        dragSelectEnd: null
      });
    },
    cancelDragSelection: () => {
      set({
        isDragSelecting: false,
        dragSelectStart: null,
        dragSelectEnd: null
      });
    },
    
    updateShape: (id: string, updates: Partial<Shape>) => {
      set(state => ({
        shapes: state.shapes.map(shape => 
          shape.id === id ? { ...shape, ...updates } as Shape : shape
        )
      }));
    },
    
    assignShapesToLayer: (shapeIds, layerId) => {
      if (!shapeIds.length) {
        return;
      }

      set(state => ({
        shapes: state.shapes.map(shape =>
          shapeIds.includes(shape.id) ? { ...shape, layerId } : shape
        )
      }));
    },

    setOnZoneFinished: (callback) => {
      set({ onZoneFinished: callback });
    }
  }));
};

// Create a singleton store instance
export const useShapesStore = createShapesStore();

