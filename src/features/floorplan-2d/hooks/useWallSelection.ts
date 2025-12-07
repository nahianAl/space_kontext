/**
 * Wall selection hook for canvas operations
 * Handles single click selection, multi-select with Ctrl/Cmd, and drag rectangle selection
 * Provides selection actions and hit testing for walls
 */

import { useCallback, useState } from 'react';
import { Point } from '../types/wallGraph';
import { findWallAtPoint, findWallsInRectangle } from '../utils/selectionUtils';
import { useWallGraphStoreContext } from '../context/WallGraphStoreContext';

interface SelectionState {
  isDragging: boolean;
  dragStart: Point | null;
  dragEnd: Point | null;
}

interface SelectionActions {
  handleSelectionClick: (point: Point, ctrlKey: boolean, graph: any, wallThickness: number) => void;
  handleSelectionDrag: (start: Point, end: Point, graph: any, wallThickness: number) => void;
  startDragSelection: (point: Point) => void;
  updateDragSelection: (point: Point) => void;
  finishDragSelection: () => void;
  cancelDragSelection: () => void;
}

export const useWallSelection = (): SelectionState & SelectionActions => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<Point | null>(null);
  const [dragEnd, setDragEnd] = useState<Point | null>(null);

  // Get selection state and actions from store
  const useWallGraphStore = useWallGraphStoreContext();
  const selectedWallIds = useWallGraphStore((state) => state.selectedWallIds);
  const selectWall = useWallGraphStore((state) => state.selectWall);
  const selectWalls = useWallGraphStore((state) => state.selectWalls);
  const addToSelection = useWallGraphStore((state) => state.addToSelection);
  const removeFromSelection = useWallGraphStore((state) => state.removeFromSelection);
  const clearSelection = useWallGraphStore((state) => state.clearSelection);
  const clearOpeningSelection = useWallGraphStore((state) => state.clearOpeningSelection);

  // Handle single click or ctrl+click selection
  const handleSelectionClick = useCallback((
    point: Point, 
    ctrlKey: boolean, 
    graph: any, 
    wallThickness: number
  ) => {
    const clickedWall = findWallAtPoint(point, graph, wallThickness);

    if (ctrlKey) {
      // Ctrl/Cmd + click: add/remove from selection
      if (clickedWall) {
        if (selectedWallIds.includes(clickedWall.id)) {
          removeFromSelection(clickedWall.id);
        } else {
          addToSelection(clickedWall.id);
        }
      }
    } else if (clickedWall) {
      // Single click: select only this wall
      clearOpeningSelection();
      selectWall(clickedWall.id);
    } else {
      // Click on empty space: start drag selection
      startDragSelection(point);
      clearSelection();
      clearOpeningSelection();
    }
  }, [selectedWallIds, selectWall, addToSelection, removeFromSelection, clearSelection, clearOpeningSelection]);

  // Handle drag selection
  const handleSelectionDrag = useCallback((
    start: Point, 
    end: Point, 
    graph: any, 
    wallThickness: number
  ) => {
    const selectedIds = findWallsInRectangle(start, end, graph, wallThickness);
    clearOpeningSelection();
    selectWalls(selectedIds);
  }, [clearOpeningSelection, selectWalls]);

  // Start drag selection
  const startDragSelection = useCallback((point: Point) => {
    setIsDragging(true);
    setDragStart(point);
    setDragEnd(point);
  }, []);

  // Update drag selection
  const updateDragSelection = useCallback((point: Point) => {
    if (isDragging && dragStart) {
      setDragEnd(point);
    }
  }, [isDragging, dragStart]);

  // Finish drag selection
  const finishDragSelection = useCallback(() => {
    setIsDragging(false);
    setDragStart(null);
    setDragEnd(null);
  }, []);

  // Cancel drag selection
  const cancelDragSelection = useCallback(() => {
    setIsDragging(false);
    setDragStart(null);
    setDragEnd(null);
  }, []);

  return {
    // State
    isDragging,
    dragStart,
    dragEnd,
    
    // Actions
    handleSelectionClick,
    handleSelectionDrag,
    startDragSelection,
    updateDragSelection,
    finishDragSelection,
    cancelDragSelection
  };
};
