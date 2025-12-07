/**
 * Basic TypeScript interfaces for Konva.js canvas state
 * Legacy type definitions for canvas zoom, pan, dimensions, and wall/opening structures
 */

export interface CanvasState {
  zoom: number;
  pan: {
    x: number;
    y: number;
  };
  dimensions: {
    width: number;
    height: number;
  };
}

export interface CanvasActions {
  setZoom: (zoom: number) => void;
  setPan: (x: number, y: number) => void;
  setDimensions: (width: number, height: number) => void;
  resetView: () => void;
}

export type CanvasStore = CanvasState & CanvasActions;

export interface Wall {
  id: string;
  startPoint: { x: number; y: number; z: number };
  endPoint: { x: number; y: number; z: number };
  height: number; // Wall height in meters
  thickness: number; // Wall thickness in meters
  openings: Opening[]; // Empty for now, will be used later
}

export interface Opening {
  id: string;
  type: 'door' | 'window';
  position: number; // Position along wall (0-1)
  width: number;
  height: number;
  // Will be implemented in future feature
}
