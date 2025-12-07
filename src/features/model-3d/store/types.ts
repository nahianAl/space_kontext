/**
 * Type definitions for CAD Tools Store
 */
import * as THREE from 'three';
import type { FaceData, MaterialProperties } from '../types/cadObjects';
import type { SerializedGeometryData } from '../utils/geometry';

export type PushPullController = 'face';

export type ShapeType = 'plane' | 'box' | 'sphere' | 'cylinder' | 'cone' | 'torus';

export type ActiveTool =
  | 'select'
  | 'rectangle'
  | 'push-pull'
  | 'boolean'
  | 'erase'
  | 'line'
  | 'polygon'
  | 'arc'
  | 'circle'
  | 'offset'
  | 'tape'
  | null;

export type TransformMode = 'translate' | 'rotate' | 'scale';

export interface CADObject {
  id: string;
  type: ShapeType;
  mesh: THREE.Mesh;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  material?: {
    color?: number;
    opacity?: number;
  };
  createdAt: number;
  updatedAt: number;
}

export interface SerializedCADObjectState {
  id: string;
  type: ShapeType;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  material?: MaterialProperties;
  geometry: SerializedGeometryData;
  userData?: Record<string, unknown>;
  createdAt: number;
  updatedAt: number;
}

export interface CADHistoryState {
  past: SerializedCADObjectState[][];
  future: SerializedCADObjectState[][];
}

export interface PushPullState {
  active: boolean;
  selectedFace: FaceData | null;
  distance: number;
  basePositions: Float32Array | null;
  originalGeometryData: SerializedGeometryData | null;
  initialCenter: THREE.Vector3 | null;
  initialWorldCenter: THREE.Vector3 | null;
  initialPlaneOffset: number | null;
  isApplying: boolean;
  affectedVertexIndices: number[] | null;
  normal: THREE.Vector3 | null;
  controller: PushPullController | null;
  targetMesh: THREE.Mesh | null;
  targetObjectId: string | null;
}

export interface BooleanOperation {
  id: string;
  baseId: string;
  toolId: string;
  operation: 'union' | 'subtract' | 'intersect';
  resultId: string;
  timestamp: number;
}

export interface RectanglePreviewState {
  active: boolean;
  width: number;
  height: number;
}

export interface CirclePreviewState {
  active: boolean;
  radius: number;
}

export interface OffsetState {
  active: boolean;
  selectedFace: FaceData | null;
  distance: number;
  targetObjectId: string | null;
}

export interface TapeState {
  active: boolean; // Is a measurement in progress
  startPoint: THREE.Vector3 | null; // First click point
  endPoint: THREE.Vector3 | null; // Second click point (null if still measuring)
  distance: number; // Current measurement distance
  createGuideline: boolean; // User wants to create a guideline after measurement
}

export interface CADFaceSelection {
  objectId: string;
  faceIndex: number;
}

export interface DragSelectState {
  active: boolean;
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
}

export interface CADObjectGroup {
  id: string;
  name: string;
  objectIds: string[];
  createdAt: number;
  updatedAt: number;
}

export interface CADTag {
  id: string;
  name: string;
  color: string; // Hex color for visual identification
  visible: boolean; // Toggle visibility of all objects with this tag
  objectIds: string[]; // Objects assigned to this tag
  createdAt: number;
  updatedAt: number;
}
