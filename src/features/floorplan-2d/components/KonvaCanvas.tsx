/**
 * Main Konva canvas component for the 2D floorplan editor
 * Handles all user interactions, rendering layers, tool management, and canvas operations
 * Coordinates between drawing tools, selection, snapping, pan/zoom, and all layer components
 */
'use client';

import React, { useCallback, useEffect, useState, useRef } from 'react';
import { Stage, Layer } from 'react-konva';
import { useWallGraphStoreContext } from '../context/WallGraphStoreContext';
import { useRenderingStore } from '../store/renderingStore';
import { Point, Opening } from '../types/wallGraph';
import { useCanvasPanZoom } from '../hooks/useCanvasPanZoom';
import { useWallSelection } from '../hooks/useWallSelection';
import { useWallDrawing } from '../hooks/useWallDrawing';
import { useWallKeyboardShortcuts } from '../hooks/useWallKeyboardShortcuts'; // Import the new hook
import { BackgroundLayer, WallsLayer, WallCutoutsLayer, WallSeamCoverLayer, ReferenceLayer, InteractiveLayer, OpeningPreviewLayer, OffsetPreviewLayer, SiteMapLayer } from './layers';
import { OpeningsLayer } from './layers/OpeningsLayer'; // Direct import
import { ShapesLayer } from './layers/ShapesLayer';
import { DXFBlocksLayer } from './layers/DXFBlocksLayer';
import { MeasureLayer } from './layers/MeasureLayer';
import { LengthMatchLayer } from './layers/LengthMatchLayer';
import { AnnotationsLayer } from './layers/AnnotationsLayer';
import { useSnapping } from '../hooks/useSnapping';
import { snapAngle } from '../utils/snapUtils';
import { findClosestPointOnLine, distanceToLineSegment } from '../utils/geometryUtils';
import { distance } from '../utils/wallGraphUtils';
import { findWallAtPoint, findOpeningAtPoint, findShapesInRectangle } from '../utils/selectionUtils';
import { useShapesStore } from '../store/shapesStore';
import { useMeasureStore } from '../store/measureStore';
import { metersToPixels, inchesToMeters, feetToMeters, centimetersToMeters } from '@/lib/units/unitsSystem';
import type { UnitSystem } from '@/lib/units/unitsSystem';
import { useEraserStore } from '../store/eraserStore';
import { useAnnotationsStore } from '../store/annotationsStore';
import { useOffsetStore } from '../store/offsetStore';
import { useLayerStore } from '../store/layerStore';
import { useDXFBlocksStore } from '../store/dxfBlocksStore';
import { createOffsetShape, determineOffsetSide, canOffsetShape } from '../utils/offsetUtils';
import { DEFAULT_LAYER_ID, ANNOTATIONS_LAYER_ID } from '../types/layers';
import type { LineShape, ArrowShape, GuideLineShape, CircleShape, SquareShape, TriangleShape, PolylineShape, ZoneShape, ImageShape } from '../types/shapes';
import { findSnapPointForDrawing } from '../utils/wallGraphUtils';
import { ContextMenu } from './ContextMenu';
import { EditableTextInput } from './EditableTextInput';
import { useZoneIntegration } from '../hooks/useZoneIntegration';

interface KonvaCanvasProps {
  width: number;
  height: number;
  onStageRefReady?: (ref: React.RefObject<any>) => void;
}

const VIRTUAL_CANVAS_WIDTH = 50000;
const VIRTUAL_CANVAS_HEIGHT = 50000;
const WALL_HANDLE_TOLERANCE = 30;

// Helper function to check if an element can be edited (layer not locked)
const canEditElement = (layerId: string | undefined): boolean => {
  const id = layerId || DEFAULT_LAYER_ID;
  const layer = useLayerStore.getState().getLayer(id);
  return !layer?.locked;
};

/**
 * Calculate dynamic visual grid sizes based on zoom level and unit system
 * Grid scales to maintain readability at different zoom levels
 *
 * IMPERIAL:
 * - Grid units double: 2ft → 4ft → 8ft → 16ft → 32ft
 * - Minor grid is 1/4 of major grid (6" → 1ft → 2ft → 4ft → 8ft)
 *
 * METRIC:
 * - Grid units double: 1m → 2m → 4m → 8m → 16m
 * - Minor grid is 1/4 of major grid (25cm → 50cm → 1m → 2m → 4m)
 *
 * Zoom thresholds halve: 50% → 25% → 12.5% → 6.25%
 */
const getDynamicVisualGridSize = (
  zoomScale: number,
  unitSystem: UnitSystem
): { subGrid: number; majorGrid: number } => {
  if (unitSystem === 'imperial') {
    // Imperial: 2ft major grid, 6" minor grid at base level
    if (zoomScale < 0.0625) {
      // Below 6.25% zoom: 32ft major, 8ft minor
      const minorMeters = feetToMeters(8);
      const majorMeters = feetToMeters(32);
      return {
        subGrid: metersToPixels(minorMeters),
        majorGrid: metersToPixels(majorMeters),
      };
    } else if (zoomScale < 0.125) {
      // Below 12.5% zoom: 16ft major, 4ft minor
      const minorMeters = feetToMeters(4);
      const majorMeters = feetToMeters(16);
      return {
        subGrid: metersToPixels(minorMeters),
        majorGrid: metersToPixels(majorMeters),
      };
    } else if (zoomScale < 0.25) {
      // Below 25% zoom: 8ft major, 2ft minor
      const minorMeters = feetToMeters(2);
      const majorMeters = feetToMeters(8);
      return {
        subGrid: metersToPixels(minorMeters),
        majorGrid: metersToPixels(majorMeters),
      };
    } else if (zoomScale < 0.5) {
      // Below 50% zoom: 4ft major, 1ft minor
      const minorMeters = feetToMeters(1);
      const majorMeters = feetToMeters(4);
      return {
        subGrid: metersToPixels(minorMeters),
        majorGrid: metersToPixels(majorMeters),
      };
    } else {
      // At/above 50% zoom: 2ft major, 6" minor
      const minorMeters = inchesToMeters(6);
      const majorMeters = feetToMeters(2);
      return {
        subGrid: metersToPixels(minorMeters),
        majorGrid: metersToPixels(majorMeters),
      };
    }
  } else {
    // Metric: 1m major grid, 25cm minor grid at base level
    if (zoomScale < 0.0625) {
      // Below 6.25% zoom: 16m major, 4m minor
      const minorMeters = 4;
      const majorMeters = 16;
      return {
        subGrid: metersToPixels(minorMeters),
        majorGrid: metersToPixels(majorMeters),
      };
    } else if (zoomScale < 0.125) {
      // Below 12.5% zoom: 8m major, 2m minor
      const minorMeters = 2;
      const majorMeters = 8;
      return {
        subGrid: metersToPixels(minorMeters),
        majorGrid: metersToPixels(majorMeters),
      };
    } else if (zoomScale < 0.25) {
      // Below 25% zoom: 4m major, 1m minor
      const minorMeters = 1;
      const majorMeters = 4;
      return {
        subGrid: metersToPixels(minorMeters),
        majorGrid: metersToPixels(majorMeters),
      };
    } else if (zoomScale < 0.5) {
      // Below 50% zoom: 2m major, 50cm minor
      const minorMeters = centimetersToMeters(50);
      const majorMeters = 2;
      return {
        subGrid: metersToPixels(minorMeters),
        majorGrid: metersToPixels(majorMeters),
      };
    } else {
      // At/above 50% zoom: 1m major, 25cm minor
      const minorMeters = centimetersToMeters(25);
      const majorMeters = 1;
      return {
        subGrid: metersToPixels(minorMeters),
        majorGrid: metersToPixels(majorMeters),
      };
    }
  }
};

export const KonvaCanvas: React.FC<KonvaCanvasProps> = ({ width, height, onStageRefReady }) => {
  // Set up zone integration with floorStore
  useZoneIntegration();

  const useWallGraphStore = useWallGraphStoreContext();
  const graph = useWallGraphStore((state) => state.graph);
  const unitSystem = useWallGraphStore((state) => state.unitSystem);

  // Debug: Log when 2D canvas reads the store
  useEffect(() => {
    const state = useWallGraphStore.getState();
    console.log('📐 [2D Canvas] Reading store:', {
      storeInstanceId: state._storeInstanceId,
      wallCount: Object.keys(state.graph.edges).length,
      nodeCount: Object.keys(state.graph.nodes).length
    });
  }, [graph, useWallGraphStore]);
  const isDrawing = useWallGraphStore((state) => state.isDrawing);
  const drawingStartPoint = useWallGraphStore((state) => state.drawingStartPoint);
  const wallThickness = useWallGraphStore((state) => state.wallThickness);
  // Convert wallThickness from meters to pixels for hit detection
  const wallThicknessPixels = React.useMemo(() => metersToPixels(wallThickness), [wallThickness]);
  const snapOptions = useWallGraphStore((state) => state.snapOptions);
  const isToolActive = useWallGraphStore((state) => state.isToolActive);
  const isOpeningToolActive = useWallGraphStore((state) => state.isOpeningToolActive);
  const getIsToolActive = () => useWallGraphStore.getState().isToolActive;
  const getIsOpeningToolActive = () => useWallGraphStore.getState().isOpeningToolActive;
  const getActiveOpeningType = () => useWallGraphStore.getState().activeOpeningType;
  const getSillHeight = () => useWallGraphStore.getState().sillHeight; // Getter for sill height
  const addOpening = useWallGraphStore((state) => state.addOpening);
  const setHoveredWallId = useWallGraphStore((state) => state.setHoveredWallId);
  const setOpeningPreview = useWallGraphStore((state) => state.setOpeningPreview);
  const selectOpening = useWallGraphStore((state) => state.selectOpening);
  const clearOpeningSelection = useWallGraphStore((state) => state.clearOpeningSelection);
  const addOpeningToSelection = useWallGraphStore((state) => state.addOpeningToSelection);
  const removeOpeningFromSelection = useWallGraphStore((state) => state.removeOpeningFromSelection);
  const selectedOpeningIds = useWallGraphStore((state) => state.selectedOpeningIds ?? []);
  const clearWallSelection = useWallGraphStore((state) => state.clearSelection);
  const beginOpeningDrag = useWallGraphStore((state) => state.beginOpeningDrag);
  const updateOpeningPositionFromPoint = useWallGraphStore((state) => state.updateOpeningPositionFromPoint);
  const finishOpeningDrag = useWallGraphStore((state) => state.finishOpeningDrag);
  
  // Shape tools state
  const activeShapeTool = useShapesStore((state) => state.activeShapeTool);
  const isShapeDrawing = useShapesStore((state) => state.isShapeDrawing);
  
  // Measure tool state
  const isMeasureActive = useMeasureStore((state) => state.isMeasureActive);
  const isMeasuring = useMeasureStore((state) => state.isMeasuring);
  const startMeasuring = useMeasureStore((state) => state.startMeasuring);
  const updateMeasuring = useMeasureStore((state) => state.updateMeasuring);
  const finishMeasuring = useMeasureStore((state) => state.finishMeasuring);
  const clearMeasure = useMeasureStore((state) => state.clearMeasure);
  const startShapeDrawing = useShapesStore((state) => state.startShapeDrawing);
  const updateShapeDrawing = useShapesStore((state) => state.updateShapeDrawing);
  const finishShapeDrawing = useShapesStore((state) => state.finishShapeDrawing);
  const cancelShapeDrawing = useShapesStore((state) => state.cancelShapeDrawing);
  const shapeDrawingData = useShapesStore((state) => state.shapeDrawingData);
  const deleteShape = useShapesStore((state) => state.deleteShape);
  const deleteSelectedShapes = useShapesStore((state) => state.deleteSelectedShapes);
  const selectedShapeIds = useShapesStore((state) => state.selectedShapeIds);
  const shapes = useShapesStore((state) => state.shapes);
  const selectShape = useShapesStore((state) => state.selectShape);
  const selectShapes = useShapesStore((state) => state.selectShapes);
  const clearShapeSelection = useShapesStore((state) => state.clearShapeSelection);
  const isDragSelecting = useShapesStore((state) => state.isDragSelecting);
  const dragSelectStart = useShapesStore((state) => state.dragSelectStart);
  const dragSelectEnd = useShapesStore((state) => state.dragSelectEnd);
  const startDragSelection = useShapesStore((state) => state.startDragSelection);
  const updateDragSelection = useShapesStore((state) => state.updateDragSelection);
  const finishDragSelection = useShapesStore((state) => state.finishDragSelection);
  const cancelDragSelection = useShapesStore((state) => state.cancelDragSelection);
  
  // Eraser tool state
  const isEraserActive = useEraserStore((state) => state.isEraserActive);

  // Offset tool state
  const isOffsetToolActive = useOffsetStore((state) => state.isOffsetToolActive);
  const offsetSelectedShapeId = useOffsetStore((state) => state.selectedShapeId);
  const isDraggingOffset = useOffsetStore((state) => state.isDraggingOffset);
  const offsetDragStartPoint = useOffsetStore((state) => state.dragStartPoint);
  const offsetPreviewShape = useOffsetStore((state) => state.previewShape);
  const selectShapeForOffset = useOffsetStore((state) => state.selectShapeForOffset);
  const startOffsetDrag = useOffsetStore((state) => state.startOffsetDrag);
  const updateOffsetDrag = useOffsetStore((state) => state.updateOffsetDrag);
  const finishOffsetDrag = useOffsetStore((state) => state.finishOffsetDrag);
  const cancelOffsetDrag = useOffsetStore((state) => state.cancelOffsetDrag);
  const setPreviewShape = useOffsetStore((state) => state.setPreviewShape);

  // Annotation tool state
  const activeAnnotationTool = useAnnotationsStore((state) => state.activeAnnotationTool);
  const isCreatingAnnotation = useAnnotationsStore((state) => state.isCreatingAnnotation);
  const tempAnnotationData = useAnnotationsStore((state) => state.tempAnnotationData);
  const setTempAnnotationData = useAnnotationsStore((state) => state.setTempAnnotationData);
  const setIsCreatingAnnotation = useAnnotationsStore((state) => state.setIsCreatingAnnotation);
  const addAnnotation = useAnnotationsStore((state) => state.addAnnotation);
  const selectedAnnotationId = useAnnotationsStore((state) => state.selectedAnnotationId);
  const selectAnnotation = useAnnotationsStore((state) => state.selectAnnotation);
  const clearAnnotationSelection = useAnnotationsStore((state) => state.clearAnnotationSelection);
  const defaultDimensionSettings = useAnnotationsStore((state) => state.defaultDimensionSettings);
  const defaultTextSettings = useAnnotationsStore((state) => state.defaultTextSettings);
  const defaultLeaderSettings = useAnnotationsStore((state) => state.defaultLeaderSettings);

  // Delete functions
  const deleteWall = useWallGraphStore((state) => state.deleteWall);
  const deleteSelectedOpenings = useWallGraphStore((state) => state.deleteSelectedOpenings);
  const beginWallGeometryDrag = useWallGraphStore((state) => state.beginWallGeometryDrag);
  const updateWallGeometryDrag = useWallGraphStore((state) => state.updateWallGeometryDrag);
  const finishWallGeometryDrag = useWallGraphStore((state) => state.finishWallGeometryDrag);
  const cancelWallGeometryDrag = useWallGraphStore((state) => state.cancelWallGeometryDrag);

  const wallPolygons = useRenderingStore((state) => state.wallPolygons);
  const recomputeWallPolygons = useRenderingStore((state) => state.recomputeWallPolygons);

  const [mounted, setMounted] = useState(false);
  const mousePositionRef = useRef<Point | null>(null);
  const [snapResult, setSnapResult] = useState<any>(null);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  const [contextMenuWorldPoint, setContextMenuWorldPoint] = useState<Point | null>(null);

  // Editable text input state for annotations
  const [editableTextInput, setEditableTextInput] = useState<{
    visible: boolean;
    position: Point;
    initialValue: string;
    placeholder: string;
    multiline?: boolean; // Optional: defaults to true for text, false for leaders
    onConfirm: (value: string) => void;
    onCancel: () => void;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dxfFileInputRef = useRef<HTMLInputElement>(null);

  const wallSelection = useWallSelection();
  const wallDrawing = useWallDrawing();
  const snapping = useSnapping();
  useWallKeyboardShortcuts(); // Activate the keyboard shortcuts

  const {
    stageRef,
    scale,
    position,
    isPanning,
    handleWheel,
    handleMouseDown: handlePanMouseDown,
    handleMouseMove: handlePanMouseMove,
    handleMouseUp: handlePanMouseUp,
    screenToWorld
  } = useCanvasPanZoom({
    minScale: 0.0025, // Allow zooming out to 0.25% (was 0.01 / 1%)
    maxScale: 10,
    zoomSensitivity: 0.02,
  });


  useEffect(() => {
    setMounted(true);
    if (mounted) {
      recomputeWallPolygons(graph);
    }
  }, [graph, mounted, recomputeWallPolygons]);

  // Notify parent when stageRef is ready
  useEffect(() => {
    if (onStageRefReady) {
      // Call immediately and also set up a check for when stage mounts
      onStageRefReady(stageRef);
      
      // Also check after a short delay in case stage isn't mounted yet
      const timer = setTimeout(() => {
        if (stageRef.current) {
          onStageRefReady(stageRef);
        }
      }, 500);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [onStageRefReady]);

  // Ensure system layers (Default, Annotations) exist on mount
  useEffect(() => {
    useLayerStore.getState().ensureSystemLayers();
  }, []);

  // Block browser swipe gestures - prevent wheel events with large deltaX (trackpad swipe)
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const handleWheel = (e: WheelEvent) => {
      // Detect large sideways trackpad swipe (the "go back" gesture)
      // When deltaX is much larger than deltaY, it's a horizontal swipe gesture
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, [mounted]);

  const handleMouseDown = useCallback((e: any) => {
    handlePanMouseDown(e);
    if (e.evt.button === 1 || e.evt.spaceKey) {
      // Prevent browser navigation gestures when panning
      e.evt.preventDefault();
      return;
    }
    const stage = e.target.getStage();
    const pointerPosition = stage.getPointerPosition();
    if (!pointerPosition) {
      return;
    }
    const worldPoint = screenToWorld(pointerPosition.x, pointerPosition.y);
    const isToolActive = getIsToolActive();
    const isOpeningToolActive = getIsOpeningToolActive();

    // Handle eraser tool - delete elements at click point
    if (isEraserActive) {
      // Check if clicking directly on a shape by checking all shapes
      // This is more reliable than checking selected shapes
      for (const shape of shapes) {
        let isPointOnShape = false;
        
        switch (shape.type) {
          case 'line':
          case 'arrow':
          case 'guide-line': {
            const s = shape as LineShape | ArrowShape | GuideLineShape;
            const distance = distanceToLineSegment(worldPoint, s.start, s.end);
            isPointOnShape = distance <= 10; // 10px tolerance
            break;
          }
          case 'polyline':
          case 'zone': {
            const s = shape as PolylineShape | ZoneShape;
            if (s.points && s.points.length > 0) {
              // Check if point is near any line segment
              for (let i = 0; i < s.points.length - 1; i++) {
                const p1 = s.points[i];
                const p2 = s.points[i + 1];
                if (p1 && p2) {
                  const distance = distanceToLineSegment(worldPoint, p1, p2);
                  if (distance <= 10) {
                    isPointOnShape = true;
                    break;
                  }
                }
              }
              // Also check if point is inside the polygon (for zones)
              if (!isPointOnShape && shape.type === 'zone') {
                // Simple point-in-polygon check
                let inside = false;
                for (let i = 0, j = s.points.length - 1; i < s.points.length; j = i++) {
                  const p1 = s.points[i];
                  const p2 = s.points[j];
                  if (p1 && p2) {
                    const [xi, yi] = p1;
                    const [xj, yj] = p2;
                    if (((yi > worldPoint[1]) !== (yj > worldPoint[1])) &&
                        (worldPoint[0] < (xj - xi) * (worldPoint[1] - yi) / (yj - yi) + xi)) {
                      inside = !inside;
                    }
                  }
                }
                isPointOnShape = inside;
              }
            }
            break;
          }
          case 'circle': {
            const s = shape as CircleShape;
            const distance = Math.sqrt(
              Math.pow(worldPoint[0] - s.center[0], 2) + 
              Math.pow(worldPoint[1] - s.center[1], 2)
            );
            isPointOnShape = Math.abs(distance - s.radius) <= 10; // 10px tolerance
            break;
          }
          case 'square': {
            const s = shape as SquareShape;
            const halfWidth = s.width / 2;
            const halfHeight = s.height / 2;
            const dx = worldPoint[0] - s.center[0];
            const dy = worldPoint[1] - s.center[1];
            // Simple bounding box check (ignoring rotation for now)
            isPointOnShape = Math.abs(dx) <= halfWidth + 10 && Math.abs(dy) <= halfHeight + 10;
            break;
          }
          case 'triangle': {
            const s = shape as TriangleShape;
            // Check if point is near any edge
            const edges: Array<[Point, Point]> = [
              [s.point1, s.point2],
              [s.point2, s.point3],
              [s.point3, s.point1]
            ];
            for (const [p1, p2] of edges) {
              if (p1 && p2) {
                const distance = distanceToLineSegment(worldPoint, p1, p2);
                if (distance <= 10) {
                  isPointOnShape = true;
                  break;
                }
              }
            }
            break;
          }
          case 'image': {
            const s = shape as ImageShape;
            const [x, y] = s.position;
            const width = s.width || 100;
            const height = s.height || 100;
            isPointOnShape = worldPoint[0] >= x && worldPoint[0] <= x + width &&
                            worldPoint[1] >= y && worldPoint[1] <= y + height;
            break;
          }
          // Add more shape types as needed
        }
        
        if (isPointOnShape) {
          // Check if shape's layer is locked before deleting
          if (canEditElement(shape.layerId)) {
            deleteShape(shape.id);
          }
          return;
        }
      }
      
      // Check for openings (before walls, since openings are on walls)
      let openingHitResult: { opening: Opening; wallId: string } | null = null;
      const wallHit = findWallAtPoint(worldPoint, graph, wallThicknessPixels);
      if (wallHit?.opening) {
        openingHitResult = { opening: wallHit.opening, wallId: wallHit.id };
      } else {
        const matchedOpening = findOpeningAtPoint(worldPoint, graph, wallThicknessPixels / 2);
        if (matchedOpening) {
          openingHitResult = matchedOpening;
        }
      }
      
      if (openingHitResult?.opening && openingHitResult?.wallId) {
        // Check if opening's layer is locked before deleting
        const wall = graph.edges[openingHitResult.wallId];
        const openingLayerId = openingHitResult.opening.layerId || wall?.layer || DEFAULT_LAYER_ID;
        if (canEditElement(openingLayerId)) {
        // Delete the opening by selecting it and using deleteSelectedOpenings
        selectOpening(openingHitResult.opening.id);
        deleteSelectedOpenings();
        }
        return;
      }
      
      // Check for walls
      if (wallHit) {
        // Check if wall's layer is locked before deleting
        const wall = graph.edges[wallHit.id];
        const wallLayerId = wall?.layer || DEFAULT_LAYER_ID;
        if (canEditElement(wallLayerId)) {
        deleteWall(wallHit.id);
        }
        return;
      }
      
      // Clear measurement if active
      const measureStartPoint = useMeasureStore.getState().startPoint;
      const measureEndPoint = useMeasureStore.getState().endPoint;
      if (isMeasureActive && (measureStartPoint || measureEndPoint)) {
        clearMeasure();
        return;
      }
      
      return;
    }

    // Handle offset tool - click shape to select, then drag to create offset
    if (isOffsetToolActive) {
      // If no shape is selected for offset yet, try to select one
      if (!offsetSelectedShapeId && !isDraggingOffset) {
        // Find if user clicked on a shape
        let clickedShapeId: string | null = null;
        for (const shape of shapes) {
          // Simple hit test - check if click is near the shape
          // This is a basic implementation; more sophisticated hit testing could be added
          if (shape.type === 'line' || shape.type === 'arrow' || shape.type === 'guide-line') {
            const s = shape as LineShape | ArrowShape | GuideLineShape;
            const dist = distanceToLineSegment(worldPoint, s.start, s.end);
            if (dist <= 15) {
              clickedShapeId = shape.id;
              break;
            }
          } else if (shape.type === 'circle') {
            const s = shape as CircleShape;
            const dist = Math.sqrt(
              Math.pow(worldPoint[0] - s.center[0], 2) +
              Math.pow(worldPoint[1] - s.center[1], 2)
            );
            if (Math.abs(dist - s.radius) <= 15) {
              clickedShapeId = shape.id;
              break;
            }
          }
          // Add more shape types as needed
        }

        if (clickedShapeId) {
          const clickedShape = shapes.find(s => s.id === clickedShapeId);
          if (clickedShape && canOffsetShape(clickedShape)) {
            selectShapeForOffset(clickedShapeId);
          }
        }
      } else if (offsetSelectedShapeId && !isDraggingOffset) {
        // Shape is selected, start offset drag
        startOffsetDrag(worldPoint);
      }
      return;
    }

    // Handle measure tool - two-click system: first click starts, second click finishes
    if (isMeasureActive) {
      if (!isMeasuring) {
        // First click: Start new measurement - clear previous and start new
        const snappedResult = snapping.snapPointToFeatures(worldPoint);
        const finalPoint = snappedResult.snapped ? snappedResult.point : worldPoint;
        setSnapResult(snappedResult);
        startMeasuring(finalPoint);
      } else {
        // Second click: Finish measurement
        const snappedResult = snapping.snapPointToFeatures(worldPoint);
        const finalPoint = snappedResult.snapped ? snappedResult.point : worldPoint;
        setSnapResult(snappedResult);
        finishMeasuring(finalPoint);
      }
      return;
    }

    // Handle dimension annotation tool - two-click system for dimensions
    if (activeAnnotationTool === 'dimension') {
      if (!isCreatingAnnotation) {
        // First click: Start dimension
        const snappedResult = snapping.snapPointToFeatures(worldPoint);
        const finalPoint = snappedResult.snapped ? snappedResult.point : worldPoint;
        setSnapResult(snappedResult);
        setIsCreatingAnnotation(true);
        setTempAnnotationData({
          type: 'dimension',
          startPoint: finalPoint,
        });
      } else {
        // Second click: Finish dimension
        const snappedResult = snapping.snapPointToFeatures(worldPoint);
        const finalPoint = snappedResult.snapped ? snappedResult.point : worldPoint;
        setSnapResult(snappedResult);

        if (tempAnnotationData && 'startPoint' in tempAnnotationData && tempAnnotationData.startPoint) {
          // Create the dimension annotation on the Annotations layer
          const now = Date.now();
          const newDimension: import('../types/annotations').DimensionAnnotation = {
            id: `dimension-${now}-${Math.random().toString(36).substr(2, 9)}`,
            type: 'dimension',
            startPoint: tempAnnotationData.startPoint as Point,
            endPoint: finalPoint,
            offset: defaultDimensionSettings.offset,
            dimensionType: 'aligned', // Default to aligned
            arrowStyle: defaultDimensionSettings.arrowStyle,
            precision: defaultDimensionSettings.precision,
            showUnits: defaultDimensionSettings.showUnits,
            layer: ANNOTATIONS_LAYER_ID, // Place on Annotations layer
            visible: true,
            locked: false,
            createdAt: now,
            updatedAt: now,
          };

          addAnnotation(newDimension);
          console.log('✏️ [Annotation] Created dimension:', newDimension);
        }

        setIsCreatingAnnotation(false);
        setTempAnnotationData(null);
      }
      return;
    }

    // Handle text annotation tool - single-click to place, prompt for content
    if (activeAnnotationTool === 'text') {
      const snappedResult = snapping.snapPointToFeatures(worldPoint);
      const finalPoint = snappedResult.snapped ? snappedResult.point : worldPoint;
      setSnapResult(snappedResult);

      // Show editable text input with multiline support
      console.log('📝 [KonvaCanvas] Showing text input at:', finalPoint);
      setEditableTextInput({
        visible: true,
        position: finalPoint,
        initialValue: '',
        placeholder: 'Enter text... (Press Enter for new line, Ctrl+Enter to finish)',
        multiline: true, // Text annotations support multiline
        onConfirm: (textContent: string) => {
          console.log('📝 [KonvaCanvas] Text input confirmed with content:', textContent);
          // Only create annotation if there's actual content
          if (!textContent.trim()) {
            setEditableTextInput(null);
            return;
          }

          // Create the text annotation on the Annotations layer
          const now = Date.now();
          const isMultiline = textContent.includes('\n');
          const lines = isMultiline ? textContent.split('\n') : [textContent];
          const maxLineLength = Math.max(...lines.map(l => l.length));
          const charWidth = defaultTextSettings.fontSize * 0.6;
          const lineHeight = defaultTextSettings.fontSize * 1.2;
          
          const newText: import('../types/annotations').TextAnnotation = {
            id: `text-${now}-${Math.random().toString(36).substr(2, 9)}`,
            type: 'text',
            position: finalPoint,
            content: textContent,
            multiline: isMultiline,
            fontSize: defaultTextSettings.fontSize,
            fontWeight: defaultTextSettings.fontWeight,
            fontStyle: 'normal',
            alignment: 'left',
            ...(defaultTextSettings.showBackground && defaultTextSettings.backgroundColor && { backgroundColor: defaultTextSettings.backgroundColor }),
            textColor: defaultTextSettings.textColor,
            ...(isMultiline && { width: Math.max(maxLineLength * charWidth, 200), height: Math.max(lines.length * lineHeight, defaultTextSettings.fontSize * 1.2) }),
            layer: ANNOTATIONS_LAYER_ID,
            visible: true,
            locked: false,
            createdAt: now,
            updatedAt: now,
          };

          addAnnotation(newText);
          console.log('✏️ [Annotation] Created text:', newText);
          setEditableTextInput(null);
        },
        onCancel: () => {
          setEditableTextInput(null);
        },
      });
      return;
    }

    // Handle leader annotation tool - two-click system for leaders
    if (activeAnnotationTool === 'leader') {
      if (!isCreatingAnnotation) {
        // First click: Set element point (where arrow points)
        const snappedResult = snapping.snapPointToFeatures(worldPoint);
        const finalPoint = snappedResult.snapped ? snappedResult.point : worldPoint;
        setSnapResult(snappedResult);
        setIsCreatingAnnotation(true);
        setTempAnnotationData({
          type: 'leader',
          elementPoint: finalPoint,
        });
      } else {
        // Second click: Set text point and prompt for text
        const snappedResult = snapping.snapPointToFeatures(worldPoint);
        const finalPoint = snappedResult.snapped ? snappedResult.point : worldPoint;
        setSnapResult(snappedResult);

        if (tempAnnotationData && 'elementPoint' in tempAnnotationData && tempAnnotationData.elementPoint) {
          const elementPoint = tempAnnotationData.elementPoint as Point;

          // Show editable text input (multiline for leaders)
          setEditableTextInput({
            visible: true,
            position: finalPoint,
            initialValue: '',
            placeholder: 'Enter callout text... (Press Enter for new line, Ctrl+Enter to finish)',
            multiline: true, // Leaders support multiline text
            onConfirm: (leaderText: string) => {
              // Create the leader annotation on the Annotations layer
              const now = Date.now();
              const newLeader: import('../types/annotations').LeaderAnnotation = {
                id: `leader-${now}-${Math.random().toString(36).substr(2, 9)}`,
                type: 'leader',
                elementPoint: elementPoint,
                textPoint: finalPoint,
                text: leaderText,
                arrowStyle: defaultLeaderSettings.arrowStyle,
                leaderStyle: defaultLeaderSettings.leaderStyle,
                landingLength: defaultLeaderSettings.landingLength,
                showBackground: defaultLeaderSettings.showBackground,
                layer: ANNOTATIONS_LAYER_ID,
                visible: true,
                locked: false,
                createdAt: now,
                updatedAt: now,
              };

              addAnnotation(newLeader);
              console.log('✏️ [Annotation] Created leader:', newLeader);
              setEditableTextInput(null);
              setIsCreatingAnnotation(false);
              setTempAnnotationData(null);
            },
            onCancel: () => {
              setEditableTextInput(null);
              setIsCreatingAnnotation(false);
              setTempAnnotationData(null);
            },
          });
          return;
        }

        setIsCreatingAnnotation(false);
        setTempAnnotationData(null);
      }
      return;
    }

    // Handle shape tool drawing
    if (activeShapeTool) {
      // Check if clicking on an existing shape first - if so, select it instead of drawing
      const shapes = useShapesStore.getState().shapes;
      const selectShape = useShapesStore.getState().selectShape;
      
      // Simple check: if click target is part of a shape Group, don't start drawing
      const clickedOnShape = e.target.getParent?.()?.getParent?.()?.className === 'Group' || 
                            e.target.className === 'Group' ||
                            e.target.getParent?.()?.attrs?.name === 'shapes';
      
      if (clickedOnShape && !isShapeDrawing) {
        // Let the shape component handle the click for selection
        // Don't start drawing
        return;
      }
      
      if (!isShapeDrawing) {
        // Start drawing - snap the point
        const snappedResult = snapping.snapPointToFeatures(worldPoint);
        const finalPoint = snappedResult.snapped ? snappedResult.point : worldPoint;
        setSnapResult(snappedResult);
        startShapeDrawing(finalPoint);
      } else {
        // Continue drawing (for polyline and triangle)
        const snappedResult = snapping.snapPointToFeatures(worldPoint);
        const finalPoint = snappedResult.snapped ? snappedResult.point : worldPoint;
        setSnapResult(snappedResult);
        
        if (activeShapeTool === 'polyline') {
          // Add point to polyline - right-click to finish
          const currentPoints = shapeDrawingData.points || [];
          if (currentPoints.length >= 2) {
            // Check if right-click to finish
            if (e.evt.button === 2) {
              finishShapeDrawing();
            } else {
              updateShapeDrawing({
                points: [...currentPoints, finalPoint],
                currentPoint: finalPoint
              });
            }
          } else {
            updateShapeDrawing({
              points: [...currentPoints, finalPoint],
              currentPoint: finalPoint
            });
          }
        } else if (activeShapeTool === 'zone') {
          // Add point to zone - right-click to finish
          const currentPoints = shapeDrawingData.points || [];
          if (currentPoints.length >= 2) {
            // Check if right-click to finish
            if (e.evt.button === 2) {
              finishShapeDrawing();
            } else {
              updateShapeDrawing({
                points: [...currentPoints, finalPoint],
                currentPoint: finalPoint
              });
            }
          } else {
            updateShapeDrawing({
              points: [...currentPoints, finalPoint],
              currentPoint: finalPoint
            });
          }
        } else if (activeShapeTool === 'triangle') {
          // Add point to triangle (max 3 points)
          const currentPoints = shapeDrawingData.trianglePoints || [];
          if (currentPoints.length < 3) {
            const newPoints = [...currentPoints, finalPoint];
            updateShapeDrawing({
              trianglePoints: newPoints,
              currentPoint: finalPoint
            });
            // Finish when we have 3 points
            if (newPoints.length === 3) {
              finishShapeDrawing();
            }
          }
        } else if (activeShapeTool === 'curve') {
          // Curve needs 3 points: start, control, end
          if (!shapeDrawingData.controlPoint) {
            // First click set start, second click sets control
            updateShapeDrawing({
              controlPoint: finalPoint,
              currentPoint: finalPoint
            });
          } else {
            // Third click sets end and finishes
            updateShapeDrawing({
              currentPoint: finalPoint
            });
            finishShapeDrawing();
          }
        } else {
          // For other tools (line, circle, square, arrow, guide-line), finish on second click
          finishShapeDrawing();
        }
      }
      return;
    }

    if (isOpeningToolActive) {
      // Only allow adding openings if an opening type is selected
      const openingType = getActiveOpeningType();
      if (!openingType) {
        // No opening type selected, don't do anything
        return;
      }
      
      const closestWallInfo = { wallId: '', distance: Infinity, position: 0 };
      // Find the wall that was clicked
      const clickedWall = findWallAtPoint(worldPoint, graph, wallThicknessPixels);
      
      if (clickedWall) {
        const wall = clickedWall.edge;
        const wallId = clickedWall.id;
        
        // Check if wall's layer is locked before placing opening
        const wallLayerId = wall?.layer || DEFAULT_LAYER_ID;
        if (!canEditElement(wallLayerId)) {
          // Wall is on a locked layer, cannot place opening
          return;
        }
        
        // Get the wall's start and end nodes
        const startNode = graph.nodes[wall.startNodeId];
        const endNode = graph.nodes[wall.endNodeId];
        
        if (startNode && endNode) {
          // Find the closest point on the wall's centerline to the click position
          const closestPointResult = findClosestPointOnLine(
            startNode.position,
            endNode.position,
            worldPoint
          );
          
          // Calculate the position along the wall (distance from start node)
          // The 't' parameter is 0-1, multiply by wall length to get distance in meters
          // wall.length is stored in meters
          const positionAlongWall = closestPointResult.t * wall.length;
          
          // Get user-defined dimensions from store (will be converted inside addOpening)
          const userWidth = useWallGraphStore.getState().openingWidth;
          const userHeight = useWallGraphStore.getState().openingHeight;

          // Determine sill height based on type
          const sillHeight = openingType === 'door' ? 0 : getSillHeight();

          // Add the opening to the wall
          // Pass 0 as width (will be calculated from userWidth inside addOpening)
          addOpening(wallId, positionAlongWall, openingType, 0, sillHeight, userWidth, userHeight);
        }
      }
    } else if (isToolActive) {
      const snappedResult = snapping.snapPointToFeatures(worldPoint);
      const finalPoint = snappedResult.snapped ? snappedResult.point : worldPoint;
      setSnapResult(snappedResult);
      wallDrawing.handleDrawingClick(finalPoint);
    } else {
      // Check for shape selection
      const selectedShapeId = useShapesStore.getState().selectedShapeId;
      const selectShape = useShapesStore.getState().selectShape;
      
      // Check if clicking on Transformer (selection box/handles)
      const isTransformer = e.target.getParent?.()?.className === 'Transformer' ||
                            e.target.className === 'Transformer' ||
                            e.target.getParent?.()?.getParent?.()?.className === 'Transformer';
      
      // If clicking on Transformer, don't deselect - let Transformer handle the interaction
      if (isTransformer) {
        return;
      }
      
      // Check if clicking on a shape or annotation (components handle their own clicks)
      // If clicking on empty space, deselect shapes and annotations
      const clickedOnShape = e.target.getParent?.()?.getParent?.()?.className === 'Group' || 
                            e.target.className === 'Group' ||
                            e.target.getParent?.()?.attrs?.name === 'shapes' ||
                            e.target.getParent?.()?.getParent?.()?.getParent?.()?.className === 'Group';
      
      // Check if clicking on text annotation (text annotations are in Groups)
      const clickedOnAnnotation = e.target.getParent?.()?.className === 'Group' ||
                                  e.target.className === 'Text' ||
                                  e.target.getParent?.()?.className === 'Text';
      
      if (!clickedOnShape && !clickedOnAnnotation && selectedShapeId) {
        selectShape(null);
      }
      
      // Deselect annotations if clicking on empty space (not on annotation and not using annotation tool)
      if (!clickedOnAnnotation && !activeAnnotationTool && selectedAnnotationId) {
        clearAnnotationSelection();
      }
      
      const ctrlKey = e.evt.ctrlKey || e.evt.metaKey;
      const wallHit = findWallAtPoint(worldPoint, graph, wallThicknessPixels);
      let openingHitResult: { opening: Opening; wallId: string } | null = null;
      if (wallHit?.opening) {
        openingHitResult = { opening: wallHit.opening, wallId: wallHit.id };
      } else {
        const matchedOpening = findOpeningAtPoint(worldPoint, graph, wallThicknessPixels / 2);
        if (matchedOpening) {
          openingHitResult = matchedOpening;
        }
      }

      const openingHit = openingHitResult?.opening;
      const openingWallId = openingHitResult?.wallId;

      if (openingHit && openingWallId) {
        // Check if opening's layer is locked before allowing selection/drag
        const wall = graph.edges[openingWallId];
        const openingLayerId = openingHit.layerId || wall?.layer || DEFAULT_LAYER_ID;
        const canEdit = canEditElement(openingLayerId);
        
        if (canEdit) {
        if (ctrlKey) {
          if (selectedOpeningIds.includes(openingHit.id)) {
            removeOpeningFromSelection(openingHit.id);
          } else {
            addOpeningToSelection(openingHit.id);
          }
        } else {
          selectOpening(openingHit.id);
          if (e.evt.button === 0) {
            beginOpeningDrag(openingWallId, openingHit.id);
            }
          }
        }
        clearWallSelection();
        if (selectedShapeId) {
          selectShape(null);
        }
        return;
      }
      if (!ctrlKey) {
        clearOpeningSelection();
      }
      if (
        !ctrlKey &&
        !isMeasureActive &&
        wallHit &&
        wallHit.edge
      ) {
        const wall = wallHit.edge;
        // Check if wall's layer is locked before allowing geometry drag
        const wallLayerId = wall?.layer || DEFAULT_LAYER_ID;
        if (!canEditElement(wallLayerId)) {
          return;
        }
        
        const startNode = graph.nodes[wall.startNodeId];
        const endNode = graph.nodes[wall.endNodeId];
        if (startNode && endNode) {
          const distanceToStart = distance(worldPoint, startNode.position);
          const distanceToEnd = distance(worldPoint, endNode.position);
          const shouldDragStart = distanceToStart <= WALL_HANDLE_TOLERANCE;
          const shouldDragEnd = distanceToEnd <= WALL_HANDLE_TOLERANCE;
          if (shouldDragStart || shouldDragEnd) {
            wallSelection.handleSelectionClick(worldPoint, false, graph, wallThicknessPixels);
            beginWallGeometryDrag(
              wallHit.id,
              shouldDragStart ? 'end' : 'start'
            );
            return;
          }
        }
      }
      wallSelection.handleSelectionClick(worldPoint, ctrlKey, graph, wallThicknessPixels);
    }

    // Handle shape drag selection - start when clicking on empty space (not drawing, not using tools)
    // Allow drag selection even if clicking on a shape - the drag will override the single selection
    if (!isToolActive && !isOpeningToolActive && !activeShapeTool && !isMeasureActive && !isEraserActive && !isShapeDrawing) {
      // Check if clicking on a shape
      const clickedOnShape = e.target.getParent?.()?.getParent?.()?.className === 'Group' || 
                            e.target.className === 'Group' ||
                            e.target.getParent?.()?.attrs?.name === 'shapes';
      
      // Always start drag selection - if user drags, it will select multiple shapes
      // If user just clicks (no drag), the shape's onClick will handle single selection
      const ctrlKey = e.evt.ctrlKey || e.evt.metaKey;
      if (!ctrlKey && !clickedOnShape) {
        // Only clear selection if clicking on empty space (not on a shape)
        clearShapeSelection();
      }
      // Start drag selection regardless - if user drags, it will work
      startDragSelection(worldPoint);
    }
  }, [activeShapeTool, addOpening, addOpeningToSelection, beginOpeningDrag, beginWallGeometryDrag, cancelShapeDrawing, clearMeasure, clearOpeningSelection, clearShapeSelection, clearWallSelection, deleteSelectedOpenings, deleteShape, deleteWall, finishMeasuring, finishShapeDrawing, graph, handlePanMouseDown, isEraserActive, isMeasureActive, isMeasuring, isOpeningToolActive, isShapeDrawing, removeOpeningFromSelection, screenToWorld, selectOpening, selectedOpeningIds, shapeDrawingData, shapes, snapping, startDragSelection, startMeasuring, startShapeDrawing, updateShapeDrawing, wallDrawing, wallSelection, wallThicknessPixels]);

  const handleMouseMove = useCallback((e: any) => {
    handlePanMouseMove(e);
    if(isPanning) {
      return;
    }
    const stage = e.target.getStage();
    const pointerPosition = stage.getPointerPosition();
    if (!pointerPosition) {
      return;
    }
    const worldPoint = screenToWorld(pointerPosition.x, pointerPosition.y);
    const isToolActive = getIsToolActive();
    const isDrawing = useWallGraphStore.getState().isDrawing;
    const isOpeningToolActive = getIsOpeningToolActive();

    // Handle offset tool move
    if (isOffsetToolActive && isDraggingOffset && offsetDragStartPoint) {
      mousePositionRef.current = worldPoint;

      // Calculate offset distance and side
      const selectedShape = shapes.find(s => s.id === offsetSelectedShapeId);
      if (selectedShape) {
        const { side, distance } = determineOffsetSide(selectedShape, worldPoint, offsetDragStartPoint);

        // Create preview shape
        const previewShape = createOffsetShape(selectedShape, distance, side);

        // Update offset store with current drag state
        updateOffsetDrag(worldPoint, distance, side);
        setPreviewShape(previewShape);
      }
      return;
    }

    // Handle measure tool move
    if (isMeasureActive && isMeasuring) {
      const snappedResult = snapping.snapPointToFeatures(worldPoint);
      const finalPoint = snappedResult.snapped ? snappedResult.point : worldPoint;
      setSnapResult(snappedResult);
      mousePositionRef.current = finalPoint;
      updateMeasuring(finalPoint);
      return;
    }

    // Handle dimension annotation tool move (while creating)
    if (activeAnnotationTool === 'dimension' && isCreatingAnnotation && tempAnnotationData) {
      const snappedResult = snapping.snapPointToFeatures(worldPoint);
      const finalPoint = snappedResult.snapped ? snappedResult.point : worldPoint;
      setSnapResult(snappedResult);
      mousePositionRef.current = finalPoint;
      // Update temp data to show preview (use endPoint for dimension annotations)
      setTempAnnotationData({
        ...tempAnnotationData,
        endPoint: finalPoint,
      });
      return;
    }

    // Handle shape tool drawing move
    if (activeShapeTool && isShapeDrawing) {
      const snappedResult = snapping.snapPointToFeatures(worldPoint);
      let finalPoint = snappedResult.snapped ? snappedResult.point : worldPoint;

      // Apply angle snapping for linear shapes (line, arrow, guide-line)
      if (snapOptions.snapToAngles && shapeDrawingData.startPoint) {
        const linearShapeTypes = ['line', 'arrow', 'guide-line'];
        if (linearShapeTypes.includes(activeShapeTool)) {
          finalPoint = snapAngle(shapeDrawingData.startPoint, finalPoint);
        }
      }

      setSnapResult(snappedResult);
      mousePositionRef.current = finalPoint;
      updateShapeDrawing({ currentPoint: finalPoint });
      return;
    }

    const wallGeometryDragState = useWallGraphStore.getState().wallGeometryDragState;
    if (wallGeometryDragState) {
      const snappedResult = snapping.snapPointToFeatures(worldPoint);
      const finalPoint = snappedResult.snapped ? snappedResult.point : worldPoint;
      setSnapResult(snappedResult);
      mousePositionRef.current = finalPoint;
      updateWallGeometryDrag(finalPoint, { skipSnap: snappedResult.snapped });
      return;
    }

    if (isToolActive && isDrawing) {
      const snappedResult = snapping.snapPointToFeatures(worldPoint);
      const finalPoint = snappedResult.snapped ? snappedResult.point : worldPoint;
      setSnapResult(snappedResult);
      mousePositionRef.current = finalPoint;
      wallDrawing.handleDrawingMove(finalPoint);
      setOpeningPreview(null, null, null);
    } else {
      setSnapResult(null);
      mousePositionRef.current = worldPoint;

      const draggingOpening = useWallGraphStore.getState().openingDragState;
      if (draggingOpening) {
        updateOpeningPositionFromPoint(draggingOpening.wallId, draggingOpening.openingId, worldPoint);
        setOpeningPreview(null, null, null);
        return;
      }

      // --- This is the new logic for handling drag selection ---
      if (wallSelection.isDragging && wallSelection.dragStart) {
        wallSelection.updateDragSelection(worldPoint);
        // Continuously update the selection as the user drags
        wallSelection.handleSelectionDrag(wallSelection.dragStart, worldPoint, graph, wallThicknessPixels);
      }

      // Handle shape drag selection
      if (isDragSelecting && dragSelectStart) {
        updateDragSelection(worldPoint);
        // Continuously update the selection as the user drags
        const selectedIds = findShapesInRectangle(dragSelectStart, worldPoint, shapes);
        selectShapes(selectedIds);
      }

      if (isOpeningToolActive) {
        let previewPoint = worldPoint as Point;
        let direction: [number, number] = [1, 0];
        let closestDistance = Infinity;
        let closestPoint: Point | null = null;
        let closestDirection: [number, number] | null = null;
        let closestWallId: string | null = null;

        const MAX_SNAP_DISTANCE = 80;

        Object.entries(graph.edges).forEach(([wallId, edge]) => {
          const startNode = graph.nodes[edge.startNodeId];
          const endNode = graph.nodes[edge.endNodeId];
          if (!startNode || !endNode) {
            return;
          }

          const closest = findClosestPointOnLine(startNode.position, endNode.position, worldPoint);
          if (closest.distance < closestDistance) {
            closestDistance = closest.distance;
            closestPoint = closest.point;
            closestWallId = wallId;

            const dx = endNode.position[0] - startNode.position[0];
            const dy = endNode.position[1] - startNode.position[1];
            const length = Math.hypot(dx, dy);
            if (length > 0.0001) {
              closestDirection = [dx / length, dy / length];
            } else {
              closestDirection = null;
            }
          }
        });

        if (closestPoint && closestDirection && closestDistance <= MAX_SNAP_DISTANCE) {
          previewPoint = closestPoint;
          direction = closestDirection;
          setOpeningPreview(previewPoint, direction, closestWallId);
        } else {
          setOpeningPreview(null, null, null);
        }
      } else {
        setOpeningPreview(null, null, null);
      }
    }
  }, [graph.edges, graph.nodes, handlePanMouseMove, isMeasureActive, isMeasuring, isPanning, isOffsetToolActive, isDraggingOffset, offsetDragStartPoint, offsetSelectedShapeId, shapes, updateOffsetDrag, screenToWorld, setOpeningPreview, snapping, updateMeasuring, updateOpeningPositionFromPoint, updateWallGeometryDrag, wallDrawing, wallSelection, wallThicknessPixels]);

  const handleMouseUp = useCallback((e: any) => {
    handlePanMouseUp();
    wallSelection.finishDragSelection();
    
    // Finish shape drag selection
    if (isDragSelecting && dragSelectStart && dragSelectEnd) {
      // Check if user actually dragged (not just clicked)
      const dragDistance = Math.sqrt(
        Math.pow(dragSelectEnd[0] - dragSelectStart[0], 2) + 
        Math.pow(dragSelectEnd[1] - dragSelectStart[1], 2)
      );
      
      if (dragDistance > 5) {
        // User dragged - select all shapes in rectangle
        const selectedIds = findShapesInRectangle(dragSelectStart, dragSelectEnd, shapes);
        selectShapes(selectedIds);
        finishDragSelection();
      } else {
        // User just clicked - cancel drag selection and let shape onClick handle it
        cancelDragSelection();
      }
    }

    const wallGeometryDragState = useWallGraphStore.getState().wallGeometryDragState;
    if (wallGeometryDragState) {
      finishWallGeometryDrag();
    }

    const draggingOpening = useWallGraphStore.getState().openingDragState;
    if (draggingOpening) {
      finishOpeningDrag();
    }

    // Handle offset tool finish
    if (isOffsetToolActive && isDraggingOffset && offsetPreviewShape) {
      // Add the offset shape to the shapes store
      useShapesStore.getState().addShape(offsetPreviewShape);
      // Reset offset tool state
      finishOffsetDrag();
    }

    // Measure tool now finishes on second click, not on mouse up
    // (No action needed here for measure tool)
    
    // Finish shape drawing for drag-based tools (circle, square, arrow, guide-line, line)
    if (activeShapeTool && isShapeDrawing) {
      const dragBasedTools = ['line', 'circle', 'square', 'arrow', 'guide-line'];
      if (dragBasedTools.includes(activeShapeTool)) {
        finishShapeDrawing();
      }
    }
  }, [activeShapeTool, finishOffsetDrag, finishOpeningDrag, finishShapeDrawing, finishMeasuring, finishWallGeometryDrag, handlePanMouseUp, isMeasureActive, isMeasuring, isOffsetToolActive, isDraggingOffset, isShapeDrawing, offsetPreviewShape, screenToWorld, snapping, wallSelection]);

  const handleMouseLeave = useCallback(() => {
    wallDrawing.handleDrawingLeave();
    wallSelection.cancelDragSelection();
    finishOpeningDrag();
    setHoveredWallId(null);
    setOpeningPreview(null, null, null);
    const wallGeometryDragState = useWallGraphStore.getState().wallGeometryDragState;
    if (wallGeometryDragState) {
      cancelWallGeometryDrag();
    }
    setSnapResult(null);

    // Cancel shape drawing if leaving canvas
    if (isShapeDrawing) {
      cancelShapeDrawing();
    }
  }, [cancelShapeDrawing, cancelWallGeometryDrag, finishOpeningDrag, isShapeDrawing, setHoveredWallId, setOpeningPreview, wallDrawing, wallSelection]);

  // Handle right-click context menu
  const handleContextMenu = useCallback((e: any) => {
    e.evt.preventDefault();
    const stage = e.target.getStage();
    const pointerPosition = stage.getPointerPosition();
    if (!pointerPosition) {
      return;
    }
    
    const worldPoint = screenToWorld(pointerPosition.x, pointerPosition.y);
    
    // Set context menu position (screen coordinates)
    setContextMenu({ x: pointerPosition.x, y: pointerPosition.y });
    setContextMenuWorldPoint(worldPoint);
  }, [screenToWorld]);

  // Handle image import
  const handleImportImage = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  // Handle DXF import
  const handleImportDXF = useCallback(() => {
    dxfFileInputRef.current?.click();
  }, []);

  const addShape = useShapesStore((state) => state.addShape);
  const activeLayerId = useLayerStore((state) => state.activeLayerId);
  const addDXFBlock = useDXFBlocksStore((state) => state.addBlock);

  const handleDXFFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !contextMenuWorldPoint) {return;}

    // Check if it's a DXF file
    if (!file.name.toLowerCase().endsWith('.dxf') && !file.type.includes('dxf')) {
      console.error('Selected file is not a DXF file');
      return;
    }

    try {
      // Dynamically import DXF converter to avoid SSR issues
      const { parseDXFFile, convertDXFToKonvaGroups } = await import('../utils/dxfConverter');

      const dxfData = await parseDXFFile(file);
      const konvaGroups = convertDXFToKonvaGroups(
        dxfData,
        contextMenuWorldPoint,
        1, // scale
        0, // rotation
        true // yFlip - convert DXF Y-up to Canvas Y-down
      );

      // Add each group as a block instance
      konvaGroups.forEach((group) => {
        addDXFBlock({
          id: group.id,
          blockName: group.name,
          x: group.x,
          y: group.y,
          rotation: group.rotation,
          scaleX: group.scaleX,
          scaleY: group.scaleY,
          konvaGroupData: group,
        });
      });

      console.log(`✅ [DXF Import] Successfully imported ${konvaGroups.length} block(s) from DXF file`);
      setContextMenu(null);
      setContextMenuWorldPoint(null);
    } catch (error) {
      console.error('Failed to import DXF file:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error(`❌ [DXF Import] Error: ${errorMessage}`);
      setContextMenu(null);
      setContextMenuWorldPoint(null);
    }

    // Reset file input
    e.target.value = '';
  }, [contextMenuWorldPoint, addDXFBlock]);

  // Handle drag over canvas - allow dropping CAD blocks
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  }, []);

  // Handle dropping CAD blocks onto canvas
  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();

    try {
      // Parse the dropped data
      const jsonData = e.dataTransfer.getData('application/json');
      if (!jsonData) {
        console.log('No JSON data found in drop event');
        return;
      }

      const dropData = JSON.parse(jsonData);

      // Check if it's a CAD block
      if (dropData.type !== 'cad-block' || !dropData.dxfUrl) {
        console.log('Not a CAD block or missing DXF URL');
        return;
      }

      // Get drop position relative to the container
      const container = containerRef.current;
      if (!container) {
        console.error('Container ref not available');
        return;
      }

      // Get mouse position relative to the container element
      const containerRect = container.getBoundingClientRect();
      const screenX = e.clientX - containerRect.left;
      const screenY = e.clientY - containerRect.top;

      // Convert screen coordinates to world coordinates
      const worldPoint = screenToWorld(screenX, screenY);

      console.log(`[CAD Block Drop] Dropping "${dropData.name}" at world position:`, worldPoint);

      // Dynamically import DXF converter functions
      const { parseDXFFromURL, convertDXFToKonvaGroups } = await import('../utils/dxfConverter');

      // Fetch and parse the DXF file from URL
      const dxfData = await parseDXFFromURL(dropData.dxfUrl);

      // Convert DXF data to Konva groups
      const konvaGroups = convertDXFToKonvaGroups(
        dxfData,
        worldPoint,
        1, // scale
        0, // rotation
        true // yFlip - convert DXF Y-up to Canvas Y-down
      );

      // Add each group as a block instance
      konvaGroups.forEach((group) => {
        addDXFBlock({
          id: group.id,
          blockName: dropData.name,
          x: group.x,
          y: group.y,
          rotation: group.rotation,
          scaleX: group.scaleX,
          scaleY: group.scaleY,
          konvaGroupData: group,
        });
      });

      console.log(`✅ [CAD Block Drop] Successfully placed ${konvaGroups.length} block(s) from "${dropData.name}"`);
    } catch (error) {
      console.error('Failed to drop CAD block:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error(`❌ [CAD Block Drop] Error: ${errorMessage}`);
    }
  }, [containerRef, screenToWorld, addDXFBlock]);

  const handleImageFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !contextMenuWorldPoint) {return;}

    // Check if it's an image
    if (!file.type.startsWith('image/')) {
      console.error('Selected file is not an image');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const imageUrl = event.target?.result as string;
      if (!imageUrl) {
        return;
      }

      // Create an image element
      const img = new Image();
      img.onload = () => {
        // Generate unique ID for the image shape
        const imageId = `image-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        
        // Add image to shapes store
        const imageShape: import('../types/shapes').ImageShape = {
          id: imageId,
          type: 'image',
          position: contextMenuWorldPoint,
          imageUrl: imageUrl,
          width: img.width,
          height: img.height,
          scale: 1,
          rotation: 0,
          layerId: activeLayerId || DEFAULT_LAYER_ID,
        } as import('../types/shapes').ImageShape;
        
        addShape(imageShape);
        setContextMenu(null);
        setContextMenuWorldPoint(null);
      };
      img.onerror = () => {
        console.error('Failed to load image');
      };
      img.src = imageUrl;
    };
    reader.onerror = () => {
      console.error('Failed to read file');
    };
    reader.readAsDataURL(file);

    // Reset file input
    e.target.value = '';
  }, [contextMenuWorldPoint, addShape, activeLayerId]);

  useEffect(() => {
    if (!isOpeningToolActive) {
      setOpeningPreview(null, null, null);
    }
  }, [isOpeningToolActive, setOpeningPreview]);

  const cursorStyle = isPanning
    ? 'grabbing'
    : isEraserActive
      ? 'url("/eraser.svg") 12 12, pointer'
      : isOpeningToolActive
        ? 'default'
        : (isToolActive || isMeasureActive || activeShapeTool)
          ? 'url("/drawing.svg") 30 29, crosshair'
          : 'default';

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) {
      return;
    }
    stage.container().style.cursor = cursorStyle;
  }, [cursorStyle, stageRef]);

  if (!mounted) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <div className="text-gray-500">Loading Canvas...</div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="w-full h-full canvas-container"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      style={{
        touchAction: 'none',
        overscrollBehavior: 'none',
        WebkitUserSelect: 'none',
        userSelect: 'none'
      }}
    >
      <Stage
        ref={stageRef}
        width={width}
        height={height}
        scaleX={scale}
        scaleY={scale}
        x={position.x}
        y={position.y}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onWheel={handleWheel}
        onContextMenu={handleContextMenu}
        style={{
          cursor: cursorStyle,
          pointerEvents: 'auto'
        }}
        draggable={false}
      >
        {(() => {
          const { subGrid, majorGrid } = getDynamicVisualGridSize(scale, unitSystem);
          return (
        <BackgroundLayer
          width={VIRTUAL_CANVAS_WIDTH}
          height={VIRTUAL_CANVAS_HEIGHT}
              gridSize={subGrid}
              majorGridSize={majorGrid}
          gridVisible={snapOptions.snapToGrid}
          scale={scale}
          position={position}
          viewWidth={width}
          viewHeight={height}
        />
          );
        })()}
        {/* Site Map Layer - displays captured site analysis map as background reference */}
        <Layer listening={false}>
          <SiteMapLayer />
        </Layer>
        <Layer>
          <WallsLayer wallPolygons={wallPolygons} graph={graph} />
          <WallCutoutsLayer graph={graph} />
          <WallSeamCoverLayer graph={graph} />
        </Layer>
        <OpeningPreviewLayer scale={scale} />
        <OffsetPreviewLayer />
        <ReferenceLayer graph={graph} />
        
        {/* Re-add the OpeningsLayer */}
        <Layer>
          <OpeningsLayer graph={graph} />
        </Layer>
        
        {/* Shapes Layer - renders all shape tools */}
        <ShapesLayer scale={scale} />
        
        {/* DXF Blocks Layer - renders imported DXF furniture blocks */}
        <DXFBlocksLayer />
        
        {/* Measure Layer - renders measurement overlay */}
        <Layer name="measure">
          <MeasureLayer scale={scale} />
          <LengthMatchLayer scale={scale} />
        </Layer>

        {/* Annotations Layer - renders dimension, text, and leader annotations */}
        <AnnotationsLayer
          onEditText={(annotation, position) => {
            const content = annotation.type === 'text' ? annotation.content : annotation.type === 'leader' ? annotation.text : '';
            const isTextAnnotation = annotation.type === 'text';
            setEditableTextInput({
              visible: true,
              position: position,
              initialValue: content,
              placeholder: isTextAnnotation
                ? 'Edit text... (Press Enter for new line, Ctrl+Enter to finish)' 
                : 'Edit callout text... (Press Enter for new line, Ctrl+Enter to finish)',
              multiline: true, // Both text and leader annotations support multiline
              onConfirm: (newContent: string) => {
                const updateAnnotations = useAnnotationsStore.getState().updateAnnotation;
                if (isTextAnnotation) {
                  const isMultiline = newContent.includes('\n');
                  const lines = isMultiline ? newContent.split('\n') : [newContent];
                  const maxLineLength = Math.max(...lines.map(l => l.length));
                  const charWidth = annotation.fontSize * 0.6;
                  const lineHeight = annotation.fontSize * 1.2;
                  
                  const newWidth = isMultiline ? Math.max(maxLineLength * charWidth, 200) : annotation.width;
                  const newHeight = isMultiline ? Math.max(lines.length * lineHeight, annotation.fontSize * 1.2) : annotation.height;
                  
                  updateAnnotations(annotation.id, { 
                    content: newContent,
                    multiline: isMultiline,
                    ...(newWidth !== undefined && { width: newWidth }),
                    ...(newHeight !== undefined && { height: newHeight }),
                  });
                } else if (annotation.type === 'leader') {
                  updateAnnotations(annotation.id, { text: newContent });
                }
                setEditableTextInput(null);
              },
              onCancel: () => {
                setEditableTextInput(null);
              },
            });
          }}
        />

        <InteractiveLayer
          drawingStartPoint={drawingStartPoint}
          drawingCurrentPoint={useWallGraphStore.getState().drawingCurrentPoint}
          snapResult={snapResult}
          isSnappingEnabled={snapping.isSnappingEnabled}
          scale={scale}
          dragSelection={{
            isDragging: wallSelection.isDragging,
            dragStart: wallSelection.dragStart,
            dragEnd: wallSelection.dragEnd
          }}
          shapeDragSelection={{
            isDragging: isDragSelecting,
            dragStart: dragSelectStart,
            dragEnd: dragSelectEnd
          }}
          dimensionPreview={{
            isCreating: activeAnnotationTool === 'dimension' && isCreatingAnnotation,
            startPoint: (tempAnnotationData && 'startPoint' in tempAnnotationData) ? tempAnnotationData.startPoint as Point : null,
            currentPoint: (tempAnnotationData && 'currentPoint' in tempAnnotationData) ? tempAnnotationData.currentPoint as Point : null,
          }}
        />
      </Stage>
      
      {/* Hidden file input for image import */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleImageFileSelect}
      />
      
      {/* Hidden file input for DXF import */}
      <input
        ref={dxfFileInputRef}
        type="file"
        accept=".dxf"
        style={{ display: 'none' }}
        onChange={handleDXFFileSelect}
      />
      
      {/* Context menu */}
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={() => setContextMenu(null)}
          onImportImage={handleImportImage}
          onImportDXF={handleImportDXF}
        />
      )}

      {/* Editable text input for annotations */}
      {editableTextInput && (
        <EditableTextInput
          key={`text-input-${editableTextInput.position[0]}-${editableTextInput.position[1]}`}
          position={editableTextInput.position}
          initialValue={editableTextInput.initialValue}
          placeholder={editableTextInput.placeholder}
          onConfirm={editableTextInput.onConfirm}
          onCancel={editableTextInput.onCancel}
          stageRef={stageRef}
          multiline={editableTextInput.multiline ?? editableTextInput.placeholder?.includes('Enter for new line') ?? true}
        />
      )}

    </div>
  );
};