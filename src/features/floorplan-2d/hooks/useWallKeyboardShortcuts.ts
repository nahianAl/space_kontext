/**
 * Keyboard shortcuts hook for wall operations
 * Handles Delete key for deleting selected walls and Escape key for canceling drawing
 * Sets up global keyboard event listeners
 */
'use client';

import { useEffect } from 'react';
import { useWallGraphStoreContext } from '../context/WallGraphStoreContext';
import { useShapesStore } from '../store/shapesStore';

export const useWallKeyboardShortcuts = () => {
  const useWallGraphStore = useWallGraphStoreContext();
  const deleteSelectedWalls = useWallGraphStore((state) => state.deleteSelectedWalls);
  const deleteSelectedOpenings = useWallGraphStore((state) => state.deleteSelectedOpenings);
  const cancelDrawing = useWallGraphStore((state) => state.cancelDrawing);
  const isDrawing = useWallGraphStore((state) => state.isDrawing);
  
  // Shape tools shortcuts
  const isShapeDrawing = useShapesStore((state) => state.isShapeDrawing);
  const activeShapeTool = useShapesStore((state) => state.activeShapeTool);
  const finishShapeDrawing = useShapesStore((state) => state.finishShapeDrawing);
  const selectedShapeId = useShapesStore((state) => state.selectedShapeId);
  const selectedShapeIds = useShapesStore((state) => state.selectedShapeIds);
  const deleteShape = useShapesStore((state) => state.deleteShape);
  const deleteSelectedShapes = useShapesStore((state) => state.deleteSelectedShapes);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check if the focus is on an input field to avoid unwanted actions
      const activeElement = document.activeElement?.tagName;
      if (activeElement === 'INPUT' || activeElement === 'TEXTAREA' || activeElement === 'SELECT') {
        return;
      }

      const isDeleteKey = event.key === 'Delete' || event.key === 'Backspace';

      // Handle "Delete" for selected shapes first
      if (isDeleteKey && selectedShapeIds.length > 0) {
        event.preventDefault();
        deleteSelectedShapes();
        return;
      }

      // Handle "Delete" for selected openings before walls
      if (isDeleteKey) {
        const { selectedOpeningIds, selectedWallIds } = useWallGraphStore.getState();
        if (selectedOpeningIds.length > 0) {
          event.preventDefault();
          deleteSelectedOpenings();
          return;
        }

        if (selectedWallIds.length > 0) {
          event.preventDefault();
          deleteSelectedWalls();
          return;
        }
      }

      // Handle "Enter" to finish polyline or zone drawing
      if (isShapeDrawing && (activeShapeTool === 'polyline' || activeShapeTool === 'zone') && event.key === 'Enter') {
        event.preventDefault();
        finishShapeDrawing();
        return;
      }

      // Handle "Enter" or "Escape" to finish a drawing chain
      if (isDrawing && (event.key === 'Enter' || event.key === 'Escape')) {
        event.preventDefault();
        cancelDrawing(); // This action now finalizes the chain
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [
    deleteSelectedWalls,
    deleteSelectedOpenings,
    cancelDrawing,
    isDrawing,
    isShapeDrawing,
    activeShapeTool,
    finishShapeDrawing,
    selectedShapeId,
    selectedShapeIds,
    deleteShape,
    deleteSelectedShapes,
    useWallGraphStore,
  ]);
};
