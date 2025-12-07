/**
 * Drawing slice for managing interactive wall drawing state and actions
 * Handles drawing start, update, finish, and cancel operations
 * Manages drawing point tracking and snap point integration
 */
import { deepCopyGraph } from '../../utils/graphUtils';
import { addWallToGraph, findSnapPointForDrawing } from '../../utils/wallGraphUtils';
import { snapAngle, snapToWallEdge } from '../../utils/snapUtils';
import { findExtendedCenterlineIntersection } from '../../utils/wallSplitting';
import { useLayerStore } from '../layerStore';
import { DEFAULT_LAYER_ID } from '../../types/layers';
import type { Point } from '../../types/wallGraph';
import type { WallGraphStateCreator, DrawingSlice } from '../types';

export const createDrawingSlice: WallGraphStateCreator<DrawingSlice> = (set, get) => ({
  isDrawing: false,
  drawingStartPoint: null,
  drawingCurrentPoint: null,
  drawingStartEdgeInfo: null,

  startDrawing: (point: Point) => {
    const { snapOptions, graph, isToolActive } = get();
    if (!isToolActive) {
      return;
    }

    // Check if active layer is locked - prevent drawing on locked layers
    const activeLayerId = useLayerStore.getState().activeLayerId || DEFAULT_LAYER_ID;
    const activeLayer = useLayerStore.getState().getLayer(activeLayerId);
    if (activeLayer?.locked) {
      return;
    }

    // Try edge snapping first (for starting from wall edges)
    // Since we don't have drag direction yet, use point itself as "start" to snap to closest edge
    const edgeSnap = snapToWallEdge(point, point, graph, snapOptions.snapTolerance);

    let snappedPoint: Point;
    let startEdgeInfo: { wallId: string; edgeFacePoint: Point; edge: 'left' | 'right' } | null = null;
    
    if (edgeSnap) {
      snappedPoint = edgeSnap.point;
      startEdgeInfo = {
        wallId: edgeSnap.wallId,
        edgeFacePoint: edgeSnap.edgeFacePoint,
        edge: edgeSnap.edge
      };
      console.log(`[DRAW-START] Snapped to ${edgeSnap.edge} edge of wall ${edgeSnap.wallId}`);
    } else {
      // No edge snap - use regular snapping
      const regularSnap = findSnapPointForDrawing(point, graph, snapOptions);
      snappedPoint = regularSnap.point;
    }

    set({
      isDrawing: true,
      drawingStartPoint: snappedPoint,
      drawingCurrentPoint: snappedPoint,
      drawingStartEdgeInfo: startEdgeInfo,
      selectedWallId: null,
      selectedWallIds: [],
    });
  },

  updateDrawing: (point: Point) => {
    const { snapOptions, graph, drawingStartPoint } = get();
    let snappedPoint = findSnapPointForDrawing(point, graph, snapOptions);

    // Apply angle snapping if enabled and we have a start point
    if (snapOptions.snapToAngles && drawingStartPoint) {
      const angleSnappedPoint = snapAngle(drawingStartPoint, snappedPoint.point);
      snappedPoint = { ...snappedPoint, point: angleSnappedPoint };
    }

    set({ drawingCurrentPoint: snappedPoint.point });
  },

  finishDrawing: (point: Point) => {
    const { drawingStartPoint, drawingStartEdgeInfo, wallThickness, wallFill, graph, snapOptions, splitWallsAtIntersections } = get();
    if (!drawingStartPoint) {
      return;
    }

    // First try to snap to wall edge faces
    const edgeSnap = snapToWallEdge(point, drawingStartPoint, graph, snapOptions.snapTolerance);

    let snappedPoint: Point;
    let wallEdgeInfo: { wallId: string; edgeFacePoint: Point; edge: 'left' | 'right' } | undefined;

    if (edgeSnap) {
      // Snapped to wall edge - use the edge face point
      snappedPoint = edgeSnap.point;
      wallEdgeInfo = {
        wallId: edgeSnap.wallId,
        edgeFacePoint: edgeSnap.edgeFacePoint,
        edge: edgeSnap.edge
      };
      console.log(`[DRAW] Snapped to ${edgeSnap.edge} edge of wall ${edgeSnap.wallId}`);
    } else {
      // No edge snap - use regular snapping
      const snappedPointResult = findSnapPointForDrawing(point, graph, snapOptions);
      snappedPoint = snappedPointResult.point;

      // Apply angle snapping if enabled
      if (snapOptions.snapToAngles && drawingStartPoint) {
        snappedPoint = snapAngle(drawingStartPoint, snappedPoint);
      }
    }

    const dx = drawingStartPoint[0] - snappedPoint[0];
    const dy = drawingStartPoint[1] - snappedPoint[1];
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < 5) {
      return;
    }

    // Get active layer from layer store, default to 'default' if not set
    const activeLayerId = useLayerStore.getState().activeLayerId || DEFAULT_LAYER_ID;

    const graphCopy = deepCopyGraph(graph);
    const { wallHatchPattern } = get();
    const wallId = addWallToGraph(
      graphCopy,
      [drawingStartPoint, snappedPoint],
      wallThickness,
      wallFill,
      activeLayerId,
      wallHatchPattern ?? undefined
    );

    set({
      graph: graphCopy,
      drawingStartPoint: snappedPoint,
      drawingCurrentPoint: snappedPoint,
      drawingStartEdgeInfo: null,
      selectedWallId: null,
      selectedWallIds: [],
    });

    get().saveToHistory();

    // Split walls at intersections AFTER the new wall is created
    // First, handle splitting the wall we started from (if we started from an edge)
    if (drawingStartEdgeInfo) {
      console.log(`[DRAW] Started from ${drawingStartEdgeInfo.edge} edge of wall ${drawingStartEdgeInfo.wallId} - finding extended centerline intersection`);
      
      // Find where the new wall's extended centerline (going backwards from end to start) intersects the old wall's centerline
      const intersection = findExtendedCenterlineIntersection(
        snappedPoint,
        drawingStartPoint,
        drawingStartEdgeInfo.wallId,
        get().graph
      );

      if (intersection) {
        console.log(`[DRAW] Found start intersection at [${intersection[0].toFixed(1)}, ${intersection[1].toFixed(1)}] - splitting wall`);
        get().splitWallAtPoint(drawingStartEdgeInfo.wallId, intersection);
      } else {
        console.warn('[DRAW] Could not find extended centerline intersection for start edge - wall not split');
      }
    }

    // Then, handle splitting the wall we ended at (if we ended at an edge)
    if (wallEdgeInfo) {
      // When edge snapping: new wall ends at edge face, but we split the old wall
      // where the new wall's EXTENDED centerline intersects the old wall's centerline
      console.log(`[DRAW] Snapped to ${wallEdgeInfo.edge} edge - finding extended centerline intersection`);

      const intersection = findExtendedCenterlineIntersection(
        drawingStartPoint,
        snappedPoint,
        wallEdgeInfo.wallId,
        get().graph
      );

      if (intersection) {
        console.log(`[DRAW] Found end intersection at [${intersection[0].toFixed(1)}, ${intersection[1].toFixed(1)}] - splitting wall`);
        get().splitWallAtPoint(wallEdgeInfo.wallId, intersection);
      } else {
        console.warn('[DRAW] Could not find extended centerline intersection for end edge - wall not split');
      }
    } else {
      // No edge snapping at end - use regular intersection splitting
      splitWallsAtIntersections(drawingStartPoint, snappedPoint);
    }
  },

  cancelDrawing: () => {
    set({
      isDrawing: false,
      drawingStartPoint: null,
      drawingCurrentPoint: null,
      drawingStartEdgeInfo: null,
      selectedWallId: null,
      selectedWallIds: [],
    });
  },
});

