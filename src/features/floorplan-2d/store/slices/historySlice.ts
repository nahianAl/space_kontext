/**
 * History slice for undo/redo functionality
 * Maintains a history stack of wall graph states with a configurable limit
 * Provides undo and redo actions to navigate through graph state changes
 */
import { createWallGraph } from '../../utils/wallGraphUtils';
import type { WallGraphStateCreator, HistorySlice } from '../types';

const HISTORY_LIMIT = 50;

export const createHistorySlice: WallGraphStateCreator<HistorySlice> = (set, get) => ({
  history: [createWallGraph()],
  historyIndex: 0,

  saveToHistory: () => {
    const { graph, history, historyIndex } = get();
    const newGraph = JSON.parse(JSON.stringify(graph));
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newGraph);

    if (newHistory.length > HISTORY_LIMIT) {
      newHistory.shift();
      set({ history: newHistory });
    } else {
      set({ history: newHistory, historyIndex: historyIndex + 1 });
    }
  },

  undo: () => {
    const { history, historyIndex } = get();
    if (historyIndex <= 0) {
      return;
    }
    const newIndex = historyIndex - 1;
    const previousGraph = history[newIndex];
    set({
      graph: JSON.parse(JSON.stringify(previousGraph)),
      historyIndex: newIndex,
      selectedWallId: null,
      selectedWallIds: [],
      selectedOpeningId: null,
      selectedOpeningIds: [],
      isDrawing: false,
      drawingStartPoint: null,
      drawingCurrentPoint: null,
      openingDragState: null,
    });
  },

  redo: () => {
    const { history, historyIndex } = get();
    if (historyIndex >= history.length - 1) {
      return;
    }
    const newIndex = historyIndex + 1;
    const nextGraph = history[newIndex];
    set({
      graph: JSON.parse(JSON.stringify(nextGraph)),
      historyIndex: newIndex,
      selectedWallId: null,
      selectedWallIds: [],
      selectedOpeningId: null,
      selectedOpeningIds: [],
      isDrawing: false,
      drawingStartPoint: null,
      drawingCurrentPoint: null,
      openingDragState: null,
    });
  },
});

