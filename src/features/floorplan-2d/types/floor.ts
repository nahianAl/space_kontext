/**
 * Floor-level architectural data types
 * Used for zones, furniture blocks, and other floor elements
 * Designed to be consumed by Three.js for 3D rendering
 */

import type { Point } from './wallGraph';

// Material interface matching 3D material browser
export interface ZoneMaterial {
  id: string;
  name: string;
  category: string;
  basePath: string;
  diffuse: string;  // Color/albedo map
  normal: string;   // Normal map
  rough: string;    // Roughness map
  ao: string;       // Ambient occlusion map
}

export interface BoundingBox {
  min: Point;
  max: Point;
  center: Point;
  width: number;
  depth: number;
}

export interface Zone {
  id: string;
  points: Point[]; // 2D polygon points defining zone boundary
  label?: string;
  fill: string; // Fill color for 2D visualization
  fillOpacity: number; // Opacity for 2D visualization
  material?: ZoneMaterial; // Material for 3D rendering
  boundingBox?: BoundingBox; // Auto-calculated bounding box
  height?: number; // Floor height (for multi-level buildings)
  layerId?: string; // Layer identifier
}

export interface FurnitureBlock {
  id: string;
  position: Point; // 2D position on floor plan
  rotation?: number; // Rotation in radians
  width: number;
  depth: number;
  height: number;
  type: string; // Furniture type: 'chair', 'table', 'bed', etc.
  modelUrl?: string; // URL to 3D model (OBJ/GLTF)
  material?: ZoneMaterial;
  layerId?: string;
  metadata?: Record<string, any>; // Additional custom data
}
