/**
 * Shape types for the shape tools
 * These shapes are not stored in the wall graph, they're separate drawing elements
 * Includes line, polyline, circle, square, triangle, arrow, guide-line, and curve shapes
 */

import type { Point } from './wallGraph';

export type ShapeType = 'line' | 'polyline' | 'circle' | 'square' | 'triangle' | 'arrow' | 'guide-line' | 'curve' | 'image' | 'zone';

export interface BaseShape {
  id: string;
  type: ShapeType;
  layerId?: string; // Layer identifier for filtering and locking
}

export interface LineShape extends BaseShape {
  type: 'line';
  start: Point;
  end: Point;
  stroke?: string;
  strokeWidth?: number;
}

export interface PolylineShape extends BaseShape {
  type: 'polyline';
  points: Point[];
  stroke?: string;
  strokeWidth?: number;
}

export interface ZoneShape extends BaseShape {
  type: 'zone';
  points: Point[];
  stroke?: string;
  strokeWidth?: number;
  fill?: string;
  fillOpacity?: number;
  label?: string; // Optional label for the zone
}

export interface CircleShape extends BaseShape {
  type: 'circle';
  center: Point;
  radius: number;
  stroke?: string;
  strokeWidth?: number;
  fill?: string;
}

export interface SquareShape extends BaseShape {
  type: 'square';
  center: Point;
  width: number;
  height: number;
  rotation?: number;
  stroke?: string;
  strokeWidth?: number;
  fill?: string;
}

export interface TriangleShape extends BaseShape {
  type: 'triangle';
  point1: Point;
  point2: Point;
  point3: Point;
  stroke?: string;
  strokeWidth?: number;
  fill?: string;
}

export interface ArrowShape extends BaseShape {
  type: 'arrow';
  start: Point;
  end: Point;
  stroke?: string;
  strokeWidth?: number;
}

export interface GuideLineShape extends BaseShape {
  type: 'guide-line';
  start: Point;
  end: Point;
  stroke?: string;
  strokeWidth?: number;
}

export interface CurveShape extends BaseShape {
  type: 'curve';
  start: Point;
  control: Point; // Control point for quadratic bezier curve
  end: Point;
  stroke?: string;
  strokeWidth?: number;
}

export interface ImageShape extends BaseShape {
  type: 'image';
  position: Point;
  imageUrl: string;
  width?: number; // Optional: if not provided, use natural image width
  height?: number; // Optional: if not provided, use natural image height
  scale?: number; // Optional: scale factor (default: 1)
  rotation?: number; // Optional: rotation in radians
}

export type Shape = 
  | LineShape 
  | PolylineShape 
  | CircleShape 
  | SquareShape 
  | TriangleShape 
  | ArrowShape 
  | GuideLineShape
  | CurveShape
  | ImageShape
  | ZoneShape;

// Removed ShapesState interface - now using ShapesStore from shapesStore.ts

