/**
 * Shared type definitions for the composed wall graph Zustand store slices
 * Defines interfaces for GraphSlice, DrawingSlice, SelectionSlice, OpeningSlice, HistorySlice, and ToolSlice
 * Used for type-safe store composition
 */
import type { StateCreator } from 'zustand';
import type { Opening, Point, SnapOptions, WallGraph, WallEdge } from '../types/wallGraph';

export type UnitSystem = 'imperial' | 'metric';

export interface WallIntersection {
  wallId: string;
  intersectionPoint: Point;
  distanceFromStart: number;
  isNearEndpoint: boolean;
}

export interface SplitWallResult {
  newNodeId: string;
  wall1: WallEdge;
  wall2: WallEdge;
  originalWallId: string;
}

export interface BaseSlice {
  _storeInstanceId: string;
  clearAll: () => void;
}

export type WallGeometryAnchor = 'start' | 'end';

export interface WallGeometryUpdateOptions {
  lengthPixels?: number;
  angleRadians?: number;
  thickness?: number;
  anchor?: WallGeometryAnchor;
  commit?: boolean;
}

export interface WallGeometryDragState {
  wallId: string;
  anchor: WallGeometryAnchor;
  initialGraphSnapshot: WallGraph;
}

export type StrokeWeight = 'fine' | 'medium' | 'bold';

export interface GraphSlice {
  graph: WallGraph;
  wallThickness: number;
  wallHeight: number;
  wallFill: string;
  wallLayer: string;
  wallHatchPattern: string | null;
  strokeWeight: StrokeWeight;
  hatchPatternImages: Map<string, HTMLImageElement>;
  snapOptions: SnapOptions;
  unitSystem: UnitSystem;
  setWallThickness: (thickness: number) => void;
  setWallHeight: (height: number) => void;
  setWallFill: (fill: string) => void;
  setWallLayer: (layer: string) => void;
  setWallHatchPattern: (pattern: string | null) => void;
  setStrokeWeight: (weight: StrokeWeight) => void;
  loadHatchPatternImage: (patternName: string) => Promise<HTMLImageElement | null>;
  updateWallThickness: (wallId: string, thickness: number) => void;
  updateWallFill: (wallId: string, fill: string) => void;
  updateWallHatchPattern: (wallId: string, pattern: string | null) => void;
  updateWallGeometry: (wallId: string, options: WallGeometryUpdateOptions) => void;
  translateWalls: (wallIds: string[], delta: Point) => void;
  rotateWalls: (wallIds: string[], deltaRadians: number) => void;
  setWallLength: (wallId: string, lengthPixels: number) => void;
  setWallAngle: (wallId: string, angleRadians: number) => void;
  wallGeometryDragState: WallGeometryDragState | null;
  beginWallGeometryDrag: (wallId: string, anchor: WallGeometryAnchor) => void;
  updateWallGeometryDrag: (point: Point, options?: { skipSnap?: boolean }) => void;
  finishWallGeometryDrag: () => void;
  cancelWallGeometryDrag: () => void;
  deleteWall: (id: string) => void;
  setSnapOptions: (options: Partial<SnapOptions>) => void;
  setUnitSystem: (system: UnitSystem) => void;
  snapPoint: (point: Point) => Point;
  assignWallsToLayer: (wallIds: string[], layerId: string) => void;
  splitWallAtPoint: (wallId: string, point: Point) => SplitWallResult | null;
  splitWallsAtIntersections: (newWallStartPoint: Point, newWallEndPoint: Point) => void;
}

export interface DrawingSlice {
  isDrawing: boolean;
  drawingStartPoint: Point | null;
  drawingCurrentPoint: Point | null;
  drawingStartEdgeInfo: { wallId: string; edgeFacePoint: Point; edge: 'left' | 'right' } | null;
  startDrawing: (point: Point) => void;
  updateDrawing: (point: Point) => void;
  finishDrawing: (point: Point) => void;
  cancelDrawing: () => void;
}

export interface WallFaceSelection {
  wallId: string;
  faceIndex: number;
}

export interface SelectionSlice {
  selectedWallId: string | null;
  selectedWallIds: string[];
  hoveredWallId: string | null;
  // Face-level selection
  selectedFaces: WallFaceSelection[];
  hoveredFace: WallFaceSelection | null;
  faceSelectionMode: boolean; // Toggle between wall and face selection
  selectWall: (id: string | null) => void;
  selectWalls: (ids: string[]) => void;
  addToSelection: (id: string) => void;
  removeFromSelection: (id: string) => void;
  clearSelection: () => void;
  setHoveredWallId: (id: string | null) => void;
  deleteSelectedWalls: () => void;
  // Face selection actions
  setFaceSelectionMode: (enabled: boolean) => void;
  selectFace: (selection: WallFaceSelection | null) => void;
  selectFaces: (selections: WallFaceSelection[]) => void;
  addFaceToSelection: (selection: WallFaceSelection) => void;
  removeFaceFromSelection: (selection: WallFaceSelection) => void;
  clearFaceSelection: () => void;
  setHoveredFace: (selection: WallFaceSelection | null) => void;
}

export interface OpeningSelectionState {
  openingPreviewPoint: Point | null;
  openingPreviewDirection: [number, number] | null;
  openingPreviewWallId: string | null;
  doorOrientation: 'left-in' | 'left-out' | 'right-in' | 'right-out';
  doorAlignment: 'center' | 'inner' | 'outer';
  windowAlignment: 'center' | 'inner' | 'outer';
  selectedOpeningId: string | null;
  selectedOpeningIds: string[];
}

export interface OpeningSlice extends OpeningSelectionState {
  isOpeningToolActive: boolean;
  activeOpeningType: 'door' | 'window' | null;
  sillHeight: number;
  openingWidth: number;
  openingHeight: number;
  openingDragState: {
    openingId: string;
    wallId: string;
    initialPosition: number;
    hasMoved: boolean;
  } | null;
  setOpeningToolActive: (active: boolean) => void;
  setActiveOpeningType: (type: 'door' | 'window' | null) => void;
  setOpeningPreview: (point: Point | null, direction: [number, number] | null, wallId?: string | null) => void;
  setDoorOrientation: (orientation: 'left-in' | 'left-out' | 'right-in' | 'right-out') => void;
  setDoorAlignment: (alignment: 'center' | 'inner' | 'outer') => void;
  setWindowAlignment: (alignment: 'center' | 'inner' | 'outer') => void;
  selectOpening: (id: string | null) => void;
  selectOpenings: (ids: string[]) => void;
  addOpeningToSelection: (id: string) => void;
  removeOpeningFromSelection: (id: string) => void;
  clearOpeningSelection: () => void;
  updateSelectedOpeningsDimensions: (width?: number, height?: number) => void;
  updateSelectedOpeningSillHeight: (sillHeight: number) => void;
  deleteSelectedOpenings: () => void;
  setSillHeight: (height: number) => void;
  setOpeningWidth: (width: number) => void;
  setOpeningHeight: (height: number) => void;
  addOpening: (
    wallId: string,
    position: number,
    type: 'door' | 'window',
    width: number,
    sillHeight: number,
    userWidth?: number,
    userHeight?: number
  ) => void;
  beginOpeningDrag: (wallId: string, openingId: string) => void;
  updateOpeningPositionFromPoint: (wallId: string, openingId: string, point: Point) => void;
  finishOpeningDrag: () => void;
  assignOpeningsToLayer: (openingIds: string[], layerId: string) => void;
}

export interface HistorySlice {
  history: WallGraph[];
  historyIndex: number;
  saveToHistory: () => void;
  undo: () => void;
  redo: () => void;
}

export interface ToolSlice {
  isToolActive: boolean;
  setToolActive: (active: boolean) => void;
}

export type WallGraphStore = BaseSlice &
  GraphSlice &
  DrawingSlice &
  SelectionSlice &
  OpeningSlice &
  HistorySlice &
  ToolSlice;

export type WallGraphStateCreator<T> = StateCreator<WallGraphStore, [], [], T>;

export type OpeningWithMeta = Opening & {
  userWidth?: number;
  userHeight?: number;
  userSillHeight?: number;
  unitSystem?: UnitSystem;
};

