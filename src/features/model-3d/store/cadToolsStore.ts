/**
 * CAD Tools Zustand store for managing user-created 3D objects
 * Separate from threeSceneStore which handles auto-generated walls/openings
 * Manages CAD objects, selection, active tools, and operation history
 */
'use client';

import { create } from 'zustand';
import * as THREE from 'three';
import {
  snapPoint,
  type SnapCandidate,
  type SnapPointOptions,
  type SnapResult,
  type SnapSettings,
} from '../utils/snapping';
import type { FaceData } from '../types/cadObjects';

// Import and re-export types
import type {
  CADObject,
  ActiveTool,
  TransformMode,
  BooleanOperation,
  CADHistoryState,
  PushPullState,
  RectanglePreviewState,
  CirclePreviewState,
  OffsetState,
  TapeState,
  ShapeType,
  SerializedCADObjectState,
  CADFaceSelection,
  DragSelectState,
  CADObjectGroup,
  CADTag,
} from './types';

// Re-export types for consumers
export type {
  CADObject,
  ActiveTool,
  TransformMode,
  ShapeType,
  BooleanOperation,
  CADHistoryState,
  PushPullState,
  RectanglePreviewState,
  CirclePreviewState,
  OffsetState,
  TapeState,
  SerializedCADObjectState,
  CADFaceSelection,
  DragSelectState,
  CADObjectGroup,
  CADTag,
};

// Import utilities
import { serializeCADObject } from './serialization/serialize';
import { disposeMeshResources, disposeCADObjects } from './utils/meshUtils';
import {
  pushHistorySnapshot as createHistorySnapshot,
  getCurrentSnapshot,
  performUndo,
  performRedo,
} from './operations/history';
import {
  createInitialPushPullState,
  cloneFaceData,
  startPushPullOperation,
  updatePushPullGeometry,
  applyPushPullToBackend,
  cancelPushPullOperation,
} from './operations/pushPull';
import {
  attemptRectangleBooleanCut,
  addBooleanOperation,
  undoBooleanOperation,
} from './operations/boolean';
import {
  selectSingleObject,
  selectMultipleObjects,
  deselectObject,
  clearSelection,
  toggleObjectSelection,
} from './operations/selection';

interface CADToolsStore {
  // CAD Objects
  objects: CADObject[];
  groups: import('./types').CADObjectGroup[];
  tags: import('./types').CADTag[];

  // Tool State
  activeTool: ActiveTool;
  transformMode: TransformMode;
  explicitTransformMode: TransformMode | null; // Track explicitly clicked transform mode
  snapSettings: SnapSettings;
  gridSize: number;
  objectSnapDistance: number;
  activeSnap: SnapResult | null;

  // Selection
  selectedObjectIds: string[];
  hoveredObjectId: string | null;
  selectedFaces: import('./types').CADFaceSelection[];
  hoveredFace: import('./types').CADFaceSelection | null;
  dragSelectState: import('./types').DragSelectState;

  // Push-Pull State
  pushPullState: PushPullState;

  // Offset State
  offsetState: OffsetState;

  // Tape Measure State
  tapeState: TapeState;

  // Shape Tool Preview States
  rectanglePreview: RectanglePreviewState;
  circlePreview: CirclePreviewState;

  // Boolean Operations
  booleanOperations: BooleanOperation[];

  // Operation History
  history: CADHistoryState;

  // Actions - Objects
  addObject: (object: CADObject) => void;
  removeObject: (id: string) => void;
  updateObject: (id: string, updates: Partial<CADObject>) => void;
  clearObjects: () => void;
  deleteSelectedObjects: () => void;

  // Actions - Tools
  setActiveTool: (tool: ActiveTool) => void;
  setTransformMode: (mode: TransformMode) => void;
  setExplicitTransformMode: (mode: TransformMode | null) => void;

  // Actions - Selection
  selectObject: (id: string) => void;
  selectObjects: (ids: string[]) => void;
  deselectObject: (id: string) => void;
  clearSelection: () => void;
  toggleSelection: (id: string) => void;
  setHoveredObjectId: (id: string | null) => void;

  // Actions - Face Selection
  selectFace: (selection: import('./types').CADFaceSelection | null) => void;
  selectFaces: (selections: import('./types').CADFaceSelection[]) => void;
  addFaceToSelection: (selection: import('./types').CADFaceSelection) => void;
  removeFaceFromSelection: (selection: import('./types').CADFaceSelection) => void;
  clearFaceSelection: () => void;
  setHoveredFace: (selection: import('./types').CADFaceSelection | null) => void;

  // Actions - Drag Select
  startDragSelect: (x: number, y: number) => void;
  updateDragSelect: (x: number, y: number) => void;
  endDragSelect: () => void;
  cancelDragSelect: () => void;

  // Actions - Groups
  createGroup: (objectIds: string[], name?: string) => string; // Returns group ID
  ungroup: (groupId: string) => void;
  getGroupForObject: (objectId: string) => import('./types').CADObjectGroup | null;
  getGroupObjects: (groupId: string) => CADObject[];
  deleteGroup: (groupId: string) => void;

  // Actions - Tags
  createTag: (name: string, color?: string) => string; // Returns tag ID
  deleteTag: (tagId: string) => void;
  updateTag: (tagId: string, updates: Partial<import('./types').CADTag>) => void;
  toggleTagVisibility: (tagId: string) => void;
  assignObjectsToTag: (objectIds: string[], tagId: string) => void;
  removeObjectsFromTag: (objectIds: string[], tagId: string) => void;
  getTagForObject: (objectId: string) => import('./types').CADTag | null;
  isObjectVisible: (objectId: string) => boolean;

  setSnapSettings: (settings: Partial<SnapSettings>) => void;
  setGridSize: (size: number) => void;
  setObjectSnapDistance: (distance: number) => void;
  resetActiveSnap: () => void;
  computeSnapPoint: (
    rawPoint: THREE.Vector3,
    candidates: SnapCandidate[],
    options?: Partial<Omit<SnapPointOptions, 'settings' | 'gridSize' | 'objectSnapDistance'>>
  ) => SnapResult;

  // Actions - Push-Pull
  setPushPullFace: (face: FaceData | null) => void;
  startPushPull: (face: FaceData) => boolean;
  updatePushPullDistance: (distance: number) => void;
  applyPushPull: () => Promise<void>;
  cancelPushPull: () => void;

  // Actions - Offset
  setOffsetFace: (face: FaceData | null) => void;
  startOffset: (face: FaceData) => boolean;
  updateOffsetDistance: (distance: number) => void;
  applyOffset: () => void;
  cancelOffset: () => void;

  // Actions - Tape Measure
  setTapeStart: (point: THREE.Vector3) => void;
  setTapeEnd: (point: THREE.Vector3 | null) => void;
  updateTapeDistance: (distance: number) => void;
  setTapeDistance: (distance: number) => void; // For editing from dimension display
  cancelTape: () => void;

  // Actions - Shape Tool Previews
  setRectanglePreview: (preview: RectanglePreviewState) => void;
  setCirclePreview: (preview: CirclePreviewState) => void;

  // Actions - Boolean
  applyBoolean: (baseId: string, toolId: string, operation: 'union' | 'subtract' | 'intersect') => void;
  undoBoolean: () => void;

  // Actions - History
  undo: () => void;
  redo: () => void;

  // Actions - Materials
  applyMaterialToSelected: (materialData: {
    id: string;
    diffuse: string;
    normal: string;
    rough: string;
    ao: string;
  }) => Promise<void>;
}

export const useCADToolsStore = create<CADToolsStore>((set, get) => {
  const pushHistorySnapshot = () => {
    const state = get();
    const newHistory = createHistorySnapshot(state.objects, state.history);
    set({ history: newHistory });
  };

  return {
    // Initial State
    objects: [],
    groups: [],
    tags: [],
    activeTool: null,
    transformMode: 'translate', // Internal mode for gizmo
    explicitTransformMode: null, // No transform mode explicitly selected initially
    snapSettings: {
      grid: true,
      object: true,
      constraint: false,
    },
    gridSize: 0.1,
    objectSnapDistance: 0.2,
    activeSnap: null,
    selectedObjectIds: [],
    hoveredObjectId: null,
    selectedFaces: [],
    hoveredFace: null,
    dragSelectState: {
      active: false,
      startX: 0,
      startY: 0,
      currentX: 0,
      currentY: 0,
    },
    pushPullState: createInitialPushPullState(),
    offsetState: {
      active: false,
      selectedFace: null,
      distance: 0,
      targetObjectId: null,
    },
    tapeState: {
      active: false,
      startPoint: null,
      endPoint: null,
      distance: 0,
      createGuideline: false,
    },
    rectanglePreview: { active: false, width: 0, height: 0 },
    circlePreview: { active: false, radius: 0 },
    booleanOperations: [],
    history: {
      past: [],
      future: [],
    },

    // Object Actions
    addObject: (object) => {
      pushHistorySnapshot();
      set((state) => ({
        objects: [...state.objects, object],
      }));
    },

    removeObject: (id) => {
      const state = get();
      const object = state.objects.find(obj => obj.id === id);
      if (!object) {
        return;
      }
      pushHistorySnapshot();
      disposeMeshResources(object.mesh);
      set({
        objects: state.objects.filter(obj => obj.id !== id),
        selectedObjectIds: state.selectedObjectIds.filter(selectedId => selectedId !== id),
      });
    },

    updateObject: (id, updates) => {
      const state = get();
      const existing = state.objects.find(obj => obj.id === id);
      if (!existing) {
        return;
      }

      const hasChanged = (
        (updates.position &&
          (!existing.position ||
            existing.position[0] !== updates.position[0] ||
            existing.position[1] !== updates.position[1] ||
            existing.position[2] !== updates.position[2])) ||
        (updates.rotation &&
          (!existing.rotation ||
            existing.rotation[0] !== updates.rotation[0] ||
            existing.rotation[1] !== updates.rotation[1] ||
            existing.rotation[2] !== updates.rotation[2])) ||
        (updates.scale &&
          (!existing.scale ||
            existing.scale[0] !== updates.scale[0] ||
            existing.scale[1] !== updates.scale[1] ||
            existing.scale[2] !== updates.scale[2])) ||
        !!updates.material
      );

      if (!hasChanged) {
        return;
      }

      pushHistorySnapshot();

      set({
        objects: state.objects.map(obj =>
          obj.id === id
            ? { ...obj, ...updates, updatedAt: Date.now() }
            : obj
        ),
      });
    },

    clearObjects: () => {
      const state = get();
      if (!state.objects.length) {
        return;
      }
      pushHistorySnapshot();
      disposeCADObjects(state.objects);
      set({
        objects: [],
        selectedObjectIds: [],
      });
    },

    deleteSelectedObjects: () => {
      const state = get();
      if (!state.selectedObjectIds.length) {
        return;
      }
      pushHistorySnapshot();
      const idsToRemove = new Set(state.selectedObjectIds);
      const remainingObjects: CADObject[] = [];
      state.objects.forEach((obj) => {
        if (idsToRemove.has(obj.id)) {
          disposeMeshResources(obj.mesh);
        } else {
          remainingObjects.push(obj);
        }
      });
      set({
        objects: remainingObjects,
        selectedObjectIds: [],
      });
    },

    // Tool Actions
    setActiveTool: (tool) => set({ activeTool: tool }),
    setTransformMode: (mode) => set({ transformMode: mode }),
    setExplicitTransformMode: (mode) => set({ explicitTransformMode: mode }),

    // Selection Actions
    selectObject: (id) => set(selectSingleObject(id)),
    selectObjects: (ids) => set(selectMultipleObjects(ids)),
    deselectObject: (id) => set((state) => deselectObject(id, state.selectedObjectIds)),
    clearSelection: () => set(clearSelection()),
    toggleSelection: (id) => set((state) => toggleObjectSelection(id, state.selectedObjectIds)),
    setHoveredObjectId: (id) => set({ hoveredObjectId: id }),

    // Face Selection Actions
    selectFace: (selection) => set({
      selectedFaces: selection ? [selection] : [],
      selectedObjectIds: [], // Clear object selection when selecting faces
    }),
    selectFaces: (selections) => set({
      selectedFaces: selections,
      selectedObjectIds: [], // Clear object selection when selecting faces
    }),
    addFaceToSelection: (selection) => set((state) => {
      // Check if already selected
      const isAlreadySelected = state.selectedFaces.some(
        s => s.objectId === selection.objectId && s.faceIndex === selection.faceIndex
      );
      if (isAlreadySelected) {
        return state;
      }
      return {
        selectedFaces: [...state.selectedFaces, selection],
        selectedObjectIds: [], // Clear object selection
      };
    }),
    removeFaceFromSelection: (selection) => set((state) => ({
      selectedFaces: state.selectedFaces.filter(
        s => !(s.objectId === selection.objectId && s.faceIndex === selection.faceIndex)
      ),
    })),
    clearFaceSelection: () => set({
      selectedFaces: [],
      hoveredFace: null,
    }),
    setHoveredFace: (selection) => set({ hoveredFace: selection }),

    // Drag Select Actions
    startDragSelect: (x, y) => set({
      dragSelectState: {
        active: true,
        startX: x,
        startY: y,
        currentX: x,
        currentY: y,
      },
    }),
    updateDragSelect: (x, y) => set((state) => ({
      dragSelectState: {
        ...state.dragSelectState,
        currentX: x,
        currentY: y,
      },
    })),
    endDragSelect: () => set({
      dragSelectState: {
        active: false,
        startX: 0,
        startY: 0,
        currentX: 0,
        currentY: 0,
      },
    }),
    cancelDragSelect: () => set({
      dragSelectState: {
        active: false,
        startX: 0,
        startY: 0,
        currentX: 0,
        currentY: 0,
      },
    }),

    // Group Actions
    createGroup: (objectIds, name) => {
      const groupId = `group-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const groupName = name || `Group ${get().groups.length + 1}`;

      set((state) => ({
        groups: [
          ...state.groups,
          {
            id: groupId,
            name: groupName,
            objectIds: [...objectIds],
            createdAt: Date.now(),
            updatedAt: Date.now(),
          },
        ],
      }));

      return groupId;
    },

    ungroup: (groupId) => {
      set((state) => ({
        groups: state.groups.filter(g => g.id !== groupId),
      }));
    },

    getGroupForObject: (objectId) => {
      const groups = get().groups;
      return groups.find(g => g.objectIds.includes(objectId)) || null;
    },

    getGroupObjects: (groupId) => {
      const group = get().groups.find(g => g.id === groupId);
      if (!group) {
        return [];
      }

      const objects = get().objects;
      return group.objectIds
        .map(id => objects.find(obj => obj.id === id))
        .filter((obj): obj is CADObject => obj !== undefined);
    },

    deleteGroup: (groupId) => {
      set((state) => ({
        groups: state.groups.filter(g => g.id !== groupId),
      }));
    },

    // Tag Actions
    createTag: (name, color) => {
      const tagId = `tag-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const tagColor = color || `#${Math.floor(Math.random()*16777215).toString(16)}`; // Random color if not provided

      set((state) => ({
        tags: [
          ...state.tags,
          {
            id: tagId,
            name,
            color: tagColor,
            visible: true,
            objectIds: [],
            createdAt: Date.now(),
            updatedAt: Date.now(),
          },
        ],
      }));

      return tagId;
    },

    deleteTag: (tagId) => {
      set((state) => ({
        tags: state.tags.filter(t => t.id !== tagId),
      }));
    },

    updateTag: (tagId, updates) => {
      set((state) => ({
        tags: state.tags.map(tag =>
          tag.id === tagId
            ? { ...tag, ...updates, updatedAt: Date.now() }
            : tag
        ),
      }));
    },

    toggleTagVisibility: (tagId) => {
      set((state) => ({
        tags: state.tags.map(tag =>
          tag.id === tagId
            ? { ...tag, visible: !tag.visible, updatedAt: Date.now() }
            : tag
        ),
      }));
    },

    assignObjectsToTag: (objectIds, tagId) => {
      set((state) => {
        // Remove objects from other tags first
        const tags = state.tags.map(tag => ({
          ...tag,
          objectIds: tag.objectIds.filter(id => !objectIds.includes(id)),
        }));

        // Add objects to the target tag
        const updatedTags = tags.map(tag =>
          tag.id === tagId
            ? {
                ...tag,
                objectIds: Array.from(new Set([...tag.objectIds, ...objectIds])),
                updatedAt: Date.now(),
              }
            : tag
        );

        return { tags: updatedTags };
      });
    },

    removeObjectsFromTag: (objectIds, tagId) => {
      set((state) => ({
        tags: state.tags.map(tag =>
          tag.id === tagId
            ? {
                ...tag,
                objectIds: tag.objectIds.filter(id => !objectIds.includes(id)),
                updatedAt: Date.now(),
              }
            : tag
        ),
      }));
    },

    getTagForObject: (objectId) => {
      const tags = get().tags;
      return tags.find(t => t.objectIds.includes(objectId)) || null;
    },

    isObjectVisible: (objectId) => {
      const tag = get().getTagForObject(objectId);
      // If object has no tag, it's visible by default
      // If object has a tag, check the tag's visibility
      return tag ? tag.visible : true;
    },

    setSnapSettings: (settings) => set((state) => ({
      snapSettings: {
        ...state.snapSettings,
        ...settings,
      },
    })),

    setGridSize: (size) => set({
      gridSize: size,
    }),

    setObjectSnapDistance: (distance) => set({
      objectSnapDistance: distance,
    }),

    resetActiveSnap: () => set({
      activeSnap: null,
    }),

    computeSnapPoint: (rawPoint, candidates, options) => {
      const state = get();
      const snapOptions: SnapPointOptions = {
        settings: state.snapSettings,
        gridSize: state.gridSize,
        objectSnapDistance: state.objectSnapDistance,
        constraints: options?.constraints ?? [],
      };

      const result = snapPoint(rawPoint, candidates, snapOptions);
      const currentSnap = state.activeSnap;

      const hasChanged =
        !currentSnap ||
        currentSnap.type !== result.type ||
        !currentSnap.point.equals(result.point) ||
        currentSnap.candidate?.id !== result.candidate?.id ||
        currentSnap.constraintId !== result.constraintId;

      if (hasChanged) {
        set({ activeSnap: result });
      }

      return result;
    },

    // Push-Pull Actions
    setPushPullFace: (face) => set((state) => {
      if (state.pushPullState.active) {
        return state;
      }

      const previous = state.pushPullState.selectedFace;
      const isSame =
        previous &&
        face &&
        previous.objectId === face.objectId &&
        previous.faceIndex === face.faceIndex;

      if (isSame) {
        return state;
      }

      const nextState = createInitialPushPullState();
      nextState.selectedFace = face ? cloneFaceData(face) : null;

      return {
        pushPullState: nextState,
      };
    }),

    startPushPull: (face) => {
      const state = get();
      const result = startPushPullOperation(face, state);
      if (result.didStart && result.newState) {
        set(result.newState);
      }
      return result.didStart;
    },

    updatePushPullDistance: (distance) => set((state) => {
      const updates = updatePushPullGeometry(distance, state);
      return updates ?? state;
    }),

    applyPushPull: async () => {
      const state = get();

      const result = await applyPushPullToBackend(state, pushHistorySnapshot);

      if (!result.success) {
        // For rectangles with negative extrusion, skip geometry update and go straight to boolean cut
        if (result.shouldAttemptRectangleCut && result.targetObject && result.selectedFace && result.initialWorldCenter) {
          // Clear push-pull state first
          set(() => ({
            pushPullState: createInitialPushPullState(),
          }));

          // Perform boolean cut without modifying the rectangle geometry
          const attemptResult = attemptRectangleBooleanCut(
            result.targetObject.id,
            result.distance,
            result.selectedFace.worldNormal.clone(),
            result.initialWorldCenter.clone(),
            get().objects,
            pushHistorySnapshot,
            (baseId, toolId, operation) => {
              set((s) => ({
                booleanOperations: addBooleanOperation(s.booleanOperations, baseId, toolId, operation),
              }));
            }
          );
          if (attemptResult.performed && attemptResult.updatedObjects) {
            // Clear selection since the tool object was removed
            set({
              objects: attemptResult.updatedObjects,
              selectedObjectIds: [],
            });
          }
          return;
        }

        // Fallback case for non-rectangle objects or positive extrusions
        if (result.targetMesh) {
          const geometry = result.targetMesh.geometry;
          geometry.computeVertexNormals();
          geometry.computeBoundingBox();
          geometry.computeBoundingSphere();
          result.targetMesh.updateMatrixWorld(true);

          set((currentState) => ({
            objects: result.targetObject
              ? currentState.objects.map((obj) =>
                  obj.id === result.targetObject!.id
                    ? {
                        ...obj,
                        mesh: result.targetObject!.mesh,
                        updatedAt: Date.now(),
                      }
                    : obj
                )
              : currentState.objects,
            pushPullState: createInitialPushPullState(),
          }));
        } else {
          set(() => ({
            pushPullState: createInitialPushPullState(),
          }));
        }
        return;
      }

      // Success case (backend succeeded)
      // For rectangles with negative extrusion, skip geometry update and go straight to boolean cut
      if (result.shouldAttemptRectangleCut && result.targetObject && result.selectedFace && result.initialWorldCenter) {
        // Dispose the backend geometry since we won't use it
        if (result.newGeometry) {
          result.newGeometry.dispose();
        }

        // Clear push-pull state first
        set(() => ({
          pushPullState: createInitialPushPullState(),
        }));

        // Perform boolean cut without modifying the rectangle geometry
        const attemptResult = attemptRectangleBooleanCut(
          result.targetObject.id,
          result.distance,
          result.selectedFace.worldNormal.clone(),
          result.initialWorldCenter.clone(),
          get().objects,
          pushHistorySnapshot,
          (baseId, toolId, operation) => {
            set((s) => ({
              booleanOperations: addBooleanOperation(s.booleanOperations, baseId, toolId, operation),
            }));
          }
        );
        if (attemptResult.performed && attemptResult.updatedObjects) {
          // Clear selection since the tool object was removed
          set({
            objects: attemptResult.updatedObjects,
            selectedObjectIds: [],
          });
        }
        return;
      }

      // Normal positive extrusion - update geometry
      const oldGeometry = result.targetMesh!.geometry;
      result.targetMesh!.geometry = result.newGeometry!;
      oldGeometry.dispose();
      result.targetMesh!.updateMatrixWorld(true);

      set((currentState) => ({
        objects: result.targetObject
          ? currentState.objects.map((obj) =>
              obj.id === result.targetObject!.id
                ? {
                    ...obj,
                    mesh: result.targetMesh!,
                    updatedAt: Date.now(),
                  }
                : obj
            )
          : currentState.objects,
        pushPullState: createInitialPushPullState(),
      }));
    },

    cancelPushPull: () => set((state) => {
      return cancelPushPullOperation(state);
    }),

    // Offset Actions
    setOffsetFace: (face) => set((state) => {
      if (state.offsetState.active) {
        return state;
      }

      const previousFace = state.offsetState.selectedFace;
      const isSame =
        previousFace &&
        face &&
        previousFace.objectId === face.objectId &&
        previousFace.faceIndex === face.faceIndex;

      if (isSame) {
        return state;
      }

      return {
        offsetState: {
          active: false,
          selectedFace: face ? cloneFaceData(face) : null,
          distance: 0,
          targetObjectId: face?.objectId ?? null,
        },
      };
    }),

    startOffset: (face) => {
      const state = get();
      const targetObject = state.objects.find((obj) => obj.id === face.objectId);

      if (!targetObject) {
        return false;
      }

      set({
        offsetState: {
          active: true,
          selectedFace: cloneFaceData(face),
          distance: 0,
          targetObjectId: face.objectId,
        },
      });

      return true;
    },

    updateOffsetDistance: (distance) => set((state) => {
      if (!state.offsetState.active) {
        return state;
      }

      return {
        offsetState: {
          ...state.offsetState,
          distance,
        },
      };
    }),

    applyOffset: () => {
      // For now, just reset the state
      // The actual offset logic will be handled in the OffsetTool component
      set({
        offsetState: {
          active: false,
          selectedFace: null,
          distance: 0,
          targetObjectId: null,
        },
      });
    },

    cancelOffset: () => set({
      offsetState: {
        active: false,
        selectedFace: null,
        distance: 0,
        targetObjectId: null,
      },
    }),

    // Tape Measure Actions
    setTapeStart: (point) => {
      set({
        tapeState: {
          active: true,
          startPoint: point.clone(),
          endPoint: null,
          distance: 0,
          createGuideline: false,
        },
      });
    },

    setTapeEnd: (point) => {
      const state = get();
      if (!state.tapeState.startPoint) {
        return;
      }

      if (point) {
        const distance = state.tapeState.startPoint.distanceTo(point);
        set({
          tapeState: {
            ...state.tapeState,
            endPoint: point.clone(),
            distance,
          },
        });
      } else {
        set({
          tapeState: {
            ...state.tapeState,
            endPoint: null,
            distance: 0,
          },
        });
      }
    },

    updateTapeDistance: (distance) => {
      set((state) => ({
        tapeState: {
          ...state.tapeState,
          distance,
        },
      }));
    },

    setTapeDistance: (distance) => {
      // When user edits distance from dimension display, update the end point
      const state = get();
      if (!state.tapeState.startPoint || !state.tapeState.endPoint) {
        return;
      }

      const direction = new THREE.Vector3()
        .subVectors(state.tapeState.endPoint, state.tapeState.startPoint)
        .normalize();

      const newEndPoint = state.tapeState.startPoint.clone().addScaledVector(direction, distance);

      set({
        tapeState: {
          ...state.tapeState,
          endPoint: newEndPoint,
          distance,
        },
      });
    },

    cancelTape: () => {
      set({
        tapeState: {
          active: false,
          startPoint: null,
          endPoint: null,
          distance: 0,
          createGuideline: false,
        },
      });
    },

    // Shape Tool Preview Actions
    setRectanglePreview: (preview) => set({ rectanglePreview: preview }),
    setCirclePreview: (preview) => set({ circlePreview: preview }),

    // Boolean Actions
    applyBoolean: (baseId, toolId, operation) => {
      set((state) => ({
        booleanOperations: addBooleanOperation(state.booleanOperations, baseId, toolId, operation),
      }));
    },

    undoBoolean: () => set((state) => ({
      booleanOperations: undoBooleanOperation(state.booleanOperations),
    })),

    // History Actions
    undo: () => {
      const state = get();
      const result = performUndo(state.objects, state.history);
      if (result) {
        set(result);
      }
    },

    redo: () => {
      const state = get();
      const result = performRedo(state.objects, state.history);
      if (result) {
        set(result);
      }
    },

    // Material Actions
    applyMaterialToSelected: async (materialData) => {
      const { createPBRMaterial, applyMaterialToMesh } = await import('../utils/materialLoader');
      const state = get();

      if (state.selectedObjectIds.length === 0) {
        console.warn('No objects selected to apply material');
        return;
      }

      try {
        // Create the Three.js PBR material
        const material = await createPBRMaterial({
          id: materialData.id,
          name: '',
          category: '',
          basePath: '',
          diffuse: materialData.diffuse,
          normal: materialData.normal,
          rough: materialData.rough,
          ao: materialData.ao,
        });

        // Apply to all selected objects
        state.selectedObjectIds.forEach((objId) => {
          const obj = state.objects.find((o) => o.id === objId);
          if (obj && obj.mesh) {
            applyMaterialToMesh(obj.mesh, material);
          }
        });

        console.log(`Applied material to ${state.selectedObjectIds.length} object(s)`);
      } catch (error) {
        console.error('Failed to apply material:', error);
      }
    },
  };
});
