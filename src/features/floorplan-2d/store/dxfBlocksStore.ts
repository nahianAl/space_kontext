/**
 * DXF Blocks Zustand store for managing imported DXF furniture blocks
 * Stores block instances with their transformations (position, rotation, scale)
 */

'use client';

import { create } from 'zustand';
import type { KonvaGroupData } from '../utils/dxfConverter';

export interface DXFBlockInstance {
  id: string;
  blockName: string;
  x: number;
  y: number;
  rotation: number; // in degrees
  scaleX: number;
  scaleY: number;
  konvaGroupData: KonvaGroupData; // The actual shape data
}

export interface DXFBlocksStore {
  blocks: DXFBlockInstance[];
  selectedBlockIds: string[];

  addBlock: (block: DXFBlockInstance) => void;
  updateBlockTransform: (id: string, transform: Partial<Pick<DXFBlockInstance, 'x' | 'y' | 'rotation' | 'scaleX' | 'scaleY'>>) => void;
  removeBlock: (id: string) => void;
  clearAll: () => void;
  selectBlock: (id: string) => void;
  deselectBlock: (id: string) => void;
  selectBlocks: (ids: string[]) => void;
  clearSelection: () => void;
}

export const useDXFBlocksStore = create<DXFBlocksStore>((set, get) => ({
  blocks: [],
  selectedBlockIds: [],

  addBlock: (block) => {
    set((state) => ({
      blocks: [...state.blocks, block],
    }));
  },

  updateBlockTransform: (id, transform) => {
    set((state) => ({
      blocks: state.blocks.map((block) =>
        block.id === id
          ? {
              ...block,
              ...transform,
              // Also update the konvaGroupData to keep it in sync
              konvaGroupData: {
                ...block.konvaGroupData,
                x: transform.x !== undefined ? transform.x : block.konvaGroupData.x,
                y: transform.y !== undefined ? transform.y : block.konvaGroupData.y,
                rotation: transform.rotation !== undefined ? transform.rotation : block.konvaGroupData.rotation,
                scaleX: transform.scaleX !== undefined ? transform.scaleX : block.konvaGroupData.scaleX,
                scaleY: transform.scaleY !== undefined ? transform.scaleY : block.konvaGroupData.scaleY,
              },
            }
          : block
      ),
    }));
  },

  removeBlock: (id) => {
    set((state) => ({
      blocks: state.blocks.filter((block) => block.id !== id),
      selectedBlockIds: state.selectedBlockIds.filter((blockId) => blockId !== id),
    }));
  },

  clearAll: () => {
    set({
      blocks: [],
      selectedBlockIds: [],
    });
  },

  selectBlock: (id) => {
    set((state) => ({
      selectedBlockIds: state.selectedBlockIds.includes(id)
        ? state.selectedBlockIds
        : [...state.selectedBlockIds, id],
    }));
  },

  deselectBlock: (id) => {
    set((state) => ({
      selectedBlockIds: state.selectedBlockIds.filter((blockId) => blockId !== id),
    }));
  },

  selectBlocks: (ids) => {
    set({ selectedBlockIds: ids });
  },

  clearSelection: () => {
    set({ selectedBlockIds: [] });
  },
}));

