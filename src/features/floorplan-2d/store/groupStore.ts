/**
 * Group tool Zustand store for managing shape groups
 * Allows selecting and grouping multiple shapes to move/transform as a unit
 * Groups are persistent and saved with the shape data
 */
'use client';

import { create } from 'zustand';

export interface ShapeGroup {
  id: string;
  name?: string;
  shapeIds: string[];
  createdAt: number;
}

export interface GroupStore {
  isGroupToolActive: boolean;
  groups: ShapeGroup[];
  selectedGroupId: string | null;

  setGroupToolActive: (active: boolean) => void;
  createGroup: (shapeIds: string[], name?: string) => ShapeGroup;
  deleteGroup: (groupId: string) => void;
  addShapesToGroup: (groupId: string, shapeIds: string[]) => void;
  removeShapesFromGroup: (groupId: string, shapeIds: string[]) => void;
  getGroupByShapeId: (shapeId: string) => ShapeGroup | null;
  getAllShapeIdsInGroup: (groupId: string) => string[];
  selectGroup: (groupId: string | null) => void;
  ungroupAll: () => void;
}

export const useGroupStore = create<GroupStore>((set, get) => ({
  isGroupToolActive: false,
  groups: [],
  selectedGroupId: null,

  setGroupToolActive: (active) => set({ isGroupToolActive: active }),

  createGroup: (shapeIds, name) => {
    const newGroup: ShapeGroup = {
      id: `group-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      ...(name && { name }),
      shapeIds,
      createdAt: Date.now(),
    };

    set(state => ({
      groups: [...state.groups, newGroup],
      selectedGroupId: newGroup.id,
    }));

    return newGroup;
  },

  deleteGroup: (groupId) => {
    set(state => ({
      groups: state.groups.filter(g => g.id !== groupId),
      selectedGroupId: state.selectedGroupId === groupId ? null : state.selectedGroupId,
    }));
  },

  addShapesToGroup: (groupId, shapeIds) => {
    set(state => ({
      groups: state.groups.map(group => {
        if (group.id === groupId) {
          const existingIds = new Set(group.shapeIds);
          const newIds = shapeIds.filter(id => !existingIds.has(id));
          return {
            ...group,
            shapeIds: [...group.shapeIds, ...newIds],
          };
        }
        return group;
      }),
    }));
  },

  removeShapesFromGroup: (groupId, shapeIds) => {
    set(state => ({
      groups: state.groups.map(group => {
        if (group.id === groupId) {
          const idsToRemove = new Set(shapeIds);
          return {
            ...group,
            shapeIds: group.shapeIds.filter(id => !idsToRemove.has(id)),
          };
        }
        return group;
      }).filter(group => group.shapeIds.length > 0), // Remove empty groups
    }));
  },

  getGroupByShapeId: (shapeId) => {
    const { groups } = get();
    return groups.find(group => group.shapeIds.includes(shapeId)) ?? null;
  },

  getAllShapeIdsInGroup: (groupId) => {
    const { groups } = get();
    const group = groups.find(g => g.id === groupId);
    return group ? group.shapeIds : [];
  },

  selectGroup: (groupId) => set({ selectedGroupId: groupId }),

  ungroupAll: () => set({ groups: [], selectedGroupId: null }),
}));
