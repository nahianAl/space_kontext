/**
 * Selection slice for managing wall and face selection state
 * Handles single and multi-wall selection, face-level selection, hover states, and selection clearing
 * Provides actions for adding/removing walls/faces from selection and deleting selected walls
 */
import { deepCopyGraph } from '../../utils/graphUtils';
import { removeWallFromGraph } from '../../utils/wallGraphUtils';
import type { WallGraphStateCreator, SelectionSlice, WallFaceSelection } from '../types';

/**
 * Helper to check if two face selections are equal
 */
const areFaceSelectionsEqual = (a: WallFaceSelection, b: WallFaceSelection): boolean => {
  return a.wallId === b.wallId && a.faceIndex === b.faceIndex;
};

export const createSelectionSlice: WallGraphStateCreator<SelectionSlice> = (set, get) => ({
  selectedWallId: null,
  selectedWallIds: [],
  hoveredWallId: null,
  // Face selection state
  selectedFaces: [],
  hoveredFace: null,
  faceSelectionMode: false,

  selectWall: (id) => {
    set({
      selectedWallId: id,
      selectedWallIds: id ? [id] : [],
      selectedOpeningId: null,
      selectedOpeningIds: [],
      selectedFaces: [], // Clear face selection when selecting walls
    });
  },
  selectWalls: (ids) => {
    set({
      selectedWallIds: ids,
      selectedWallId: ids.length === 1 ? ids[0] ?? null : null,
      selectedOpeningId: null,
      selectedOpeningIds: [],
      selectedFaces: [], // Clear face selection when selecting walls
    });
  },
  addToSelection: (id) => {
    const { selectedWallIds } = get();
    if (selectedWallIds.includes(id)) {
      return;
    }
    const newSelection = [...selectedWallIds, id];
    set({
      selectedWallIds: newSelection,
      selectedWallId: newSelection.length === 1 ? newSelection[0] ?? null : null,
    });
  },
  removeFromSelection: (id) => {
    const { selectedWallIds } = get();
    const newSelection = selectedWallIds.filter((wallId) => wallId !== id);
    set({
      selectedWallIds: newSelection,
      selectedWallId: newSelection.length === 1 ? newSelection[0] ?? null : null,
    });
  },
  clearSelection: () => {
    set({
      selectedWallIds: [],
      selectedWallId: null,
      selectedFaces: [], // Also clear face selection
    });
  },
  setHoveredWallId: (id) => {
    set({ hoveredWallId: id });
  },
  deleteSelectedWalls: () => {
    const { selectedWallIds } = get();
    if (!selectedWallIds.length) {
      return;
    }

    set((state) => {
      const newGraph = deepCopyGraph(state.graph);
      selectedWallIds.forEach((wallId) => {
        removeWallFromGraph(newGraph, wallId);
      });
      return {
        graph: newGraph,
        selectedWallIds: [],
        selectedWallId: null,
      };
    });

    get().saveToHistory();
  },

  // Face selection actions
  setFaceSelectionMode: (enabled) => {
    set({
      faceSelectionMode: enabled,
      // Clear appropriate selections when switching modes
      selectedFaces: enabled ? [] : get().selectedFaces,
      selectedWallIds: enabled ? [] : get().selectedWallIds,
      selectedWallId: enabled ? null : get().selectedWallId,
    });
  },

  selectFace: (selection) => {
    set({
      selectedFaces: selection ? [selection] : [],
      selectedWallIds: [], // Clear wall selection when selecting faces
      selectedWallId: null,
      selectedOpeningId: null,
      selectedOpeningIds: [],
    });
  },

  selectFaces: (selections) => {
    set({
      selectedFaces: selections,
      selectedWallIds: [], // Clear wall selection when selecting faces
      selectedWallId: null,
      selectedOpeningId: null,
      selectedOpeningIds: [],
    });
  },

  addFaceToSelection: (selection) => {
    const { selectedFaces } = get();
    // Check if already selected
    if (selectedFaces.some(s => areFaceSelectionsEqual(s, selection))) {
      return;
    }
    set({
      selectedFaces: [...selectedFaces, selection],
      selectedWallIds: [], // Clear wall selection
      selectedWallId: null,
    });
  },

  removeFaceFromSelection: (selection) => {
    const { selectedFaces } = get();
    const newSelection = selectedFaces.filter(s => !areFaceSelectionsEqual(s, selection));
    set({
      selectedFaces: newSelection,
    });
  },

  clearFaceSelection: () => {
    set({ selectedFaces: [], hoveredFace: null });
  },

  setHoveredFace: (selection) => {
    set({ hoveredFace: selection });
  },
});

