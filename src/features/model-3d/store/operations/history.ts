/**
 * History management utilities for undo/redo functionality
 */
import { serializeCADObject } from '../serialization/serialize';
import { cloneObjectsFromSnapshot } from '../serialization/deserialize';
import { disposeCADObjects } from '../utils/meshUtils';
import type { CADObject, CADHistoryState, SerializedCADObjectState } from '../types';

export const getCurrentSnapshot = (objects: CADObject[]): SerializedCADObjectState[] => {
  return objects.map(serializeCADObject);
};

export const pushHistorySnapshot = (
  objects: CADObject[],
  history: CADHistoryState
): CADHistoryState => {
  const snapshot = objects.map(serializeCADObject);
  return {
    past: [...history.past, snapshot],
    future: [],
  };
};

export const restoreSnapshot = (
  snapshot: SerializedCADObjectState[],
  currentObjects: CADObject[],
  nextPast: SerializedCADObjectState[][],
  nextFuture: SerializedCADObjectState[][]
): {
  objects: CADObject[];
  selectedObjectIds: string[];
  hoveredObjectId: null;
  history: CADHistoryState;
} => {
  disposeCADObjects(currentObjects);
  const restoredObjects = cloneObjectsFromSnapshot(snapshot);

  return {
    objects: restoredObjects,
    selectedObjectIds: [],
    hoveredObjectId: null,
    history: {
      past: nextPast,
      future: nextFuture,
    },
  };
};

export const performUndo = (
  objects: CADObject[],
  history: CADHistoryState
): {
  objects: CADObject[];
  selectedObjectIds: string[];
  hoveredObjectId: null;
  history: CADHistoryState;
} | null => {
  if (!history.past.length) {
    return null;
  }
  const previousSnapshot = history.past[history.past.length - 1];
  if (!previousSnapshot) {
    return null;
  }
  const remainingPast = history.past.slice(0, -1);
  const currentSnapshot = getCurrentSnapshot(objects);
  return restoreSnapshot(previousSnapshot, objects, remainingPast, [currentSnapshot, ...history.future]);
};

export const performRedo = (
  objects: CADObject[],
  history: CADHistoryState
): {
  objects: CADObject[];
  selectedObjectIds: string[];
  hoveredObjectId: null;
  history: CADHistoryState;
} | null => {
  if (!history.future.length) {
    return null;
  }
  const nextSnapshot = history.future[0];
  if (!nextSnapshot) {
    return null;
  }
  const remainingFuture = history.future.slice(1);
  const currentSnapshot = getCurrentSnapshot(objects);
  return restoreSnapshot(nextSnapshot, objects, [...history.past, currentSnapshot], remainingFuture);
};
