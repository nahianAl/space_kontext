/**
 * Tool slice tracking draw tool activation state
 * Manages tool active/inactive state and ensures drawing state is reset when tool is deactivated
 */
import type { WallGraphStateCreator, ToolSlice } from '../types';

export const createToolSlice: WallGraphStateCreator<ToolSlice> = (set) => ({
  isToolActive: false,

  setToolActive: (active) => {
    set((state) => ({
      isToolActive: active,
      ...(active
        ? {}
        : {
            isDrawing: false,
            drawingStartPoint: null,
            drawingCurrentPoint: null,
          }),
    }));
  },
});

