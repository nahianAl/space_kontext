/**
 * TypeScript types for CAD objects and tools
 * Defines interfaces for shapes, transforms, materials, and tool states
 */

import * as THREE from 'three';

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
  | null;
export type TransformMode = 'translate' | 'rotate' | 'scale';
export type BooleanOperation = 'union' | 'subtract' | 'intersect';

export interface TransformState {
  position: [number, number, number];
  rotation: [number, number, number]; // Euler angles in radians
  scale: [number, number, number];
}

export interface MaterialProperties {
  color?: number;
  opacity?: number;
  transparent?: boolean;
  metalness?: number;
  roughness?: number;
}

export interface CADObject {
  id: string;
  type: ShapeType;
  mesh: THREE.Mesh;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  material?: MaterialProperties;
  createdAt: number;
  updatedAt: number;
}

export interface FaceData {
  objectId: string;
  faceIndex: number;
  normal: THREE.Vector3;
  worldNormal: THREE.Vector3;
  vertices: number[]; // Vertex indices
  center: THREE.Vector3;
  worldCenter: THREE.Vector3;
  hitPoint?: THREE.Vector3;
  mesh: THREE.Mesh;
  planeOffset: number;
  triangleIndices: number[];
}

export interface BooleanOperationData {
  id: string;
  baseId: string;
  toolId: string;
  operation: BooleanOperation;
  resultId: string;
  timestamp: number;
}

export interface OperationHistoryEntry {
  type: string;
  timestamp: number;
  beforeState: any;
  afterState: any;
}

export interface SnapResult {
  point: THREE.Vector3;
  snapped: boolean;
  type?: 'grid' | 'endpoint' | 'midpoint' | 'center' | 'edge' | 'intersection' | 'constraint';
  targetId?: string;
}

export interface Constraint {
  id: string;
  type: 'perpendicular' | 'parallel' | 'distance' | 'aligned';
  objectIds: string[];
  parameters: Record<string, number>;
}

