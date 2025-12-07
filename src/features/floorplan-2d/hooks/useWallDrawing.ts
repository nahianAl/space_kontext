/**
 * Wall drawing hook for canvas operations
 * Handles drawing mode logic and state management for wall creation
 * Provides actions for starting, updating, finishing, and canceling wall drawing
 */

import { useCallback } from 'react';
import { Point } from '../types/wallGraph';
import { useWallGraphStoreContext } from '../context/WallGraphStoreContext';

interface WallDrawingActions {
  handleDrawingClick: (point: Point) => void;
  handleDrawingMove: (point: Point) => void;
  handleDrawingLeave: () => void;
}

export const useWallDrawing = (): WallDrawingActions => {
  // Get drawing state and actions from store
  const useWallGraphStore = useWallGraphStoreContext();
  const isDrawing = useWallGraphStore((state) => state.isDrawing);
  const startDrawing = useWallGraphStore((state) => state.startDrawing);
  const updateDrawing = useWallGraphStore((state) => state.updateDrawing);
  const finishDrawing = useWallGraphStore((state) => state.finishDrawing);
  const cancelDrawing = useWallGraphStore((state) => state.cancelDrawing);

  // Handle drawing click (start or finish drawing)
  const handleDrawingClick = useCallback((point: Point) => {
    if (!isDrawing) {
      startDrawing(point);
    } else {
      finishDrawing(point);
    }
  }, [isDrawing, startDrawing, finishDrawing]);

  // Handle drawing move (update current drawing)
  const handleDrawingMove = useCallback((point: Point) => {
    if (isDrawing) {
      updateDrawing(point);
    }
  }, [isDrawing, updateDrawing]);

  // Handle drawing leave (cancel current drawing)
  const handleDrawingLeave = useCallback(() => {
    if (isDrawing) {
      cancelDrawing();
    }
  }, [isDrawing, cancelDrawing]);

  return {
    handleDrawingClick,
    handleDrawingMove,
    handleDrawingLeave
  };
};
