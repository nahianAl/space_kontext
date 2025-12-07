/**
 * Public API for floorplan-2d feature
 * Exports all public components, hooks, stores, and types for the 2D floorplan editor
 */

// Main components
export { FloorplanCanvas } from './components/FloorplanCanvas';
export { KonvaCanvas } from './components/KonvaCanvas';
export { SettingsPanel } from './components/SettingsPanel';

// Layer components
export { BackgroundLayer, WallsLayer, ReferenceLayer, InteractiveLayer, OpeningsLayer } from './components/layers';

// Tool components
export { WallDrawingTool, WallPolygons, WallCenterlines, WallNodes } from './tools/wall-tool';

// Store
export { useWallGraphStore } from './store/wallGraphStore';

// Hooks
export { useWallKeyboardShortcuts } from './hooks/useWallKeyboardShortcuts';
export { useCanvasPanZoom } from './hooks/useCanvasPanZoom';
export { useSnapping } from './hooks/useSnapping';

// Types
export type {
  Point,
  WallNode,
  WallEdge,
  WallGraph,
  SnapResult,
  SnapOptions
} from './types/wallGraph';
