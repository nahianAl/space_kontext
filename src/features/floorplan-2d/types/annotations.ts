/**
 * Type definitions for architectural annotations
 * Supports dimensions, text, leaders, reference markers, and level markers
 */

import type { Point } from './wallGraph';

// Base annotation interface
export interface BaseAnnotation {
  id: string;
  layer?: string;
  locked?: boolean;
  visible?: boolean;
  createdAt: number;
  updatedAt: number;
}

// Dimension annotation
export interface DimensionAnnotation extends BaseAnnotation {
  type: 'dimension';
  startPoint: Point;
  endPoint: Point;
  offset: number; // perpendicular offset from measured line
  dimensionType: 'aligned' | 'horizontal' | 'vertical';
  arrowStyle: 'slash' | 'filled-arrow' | 'dot';
  textOverride?: string; // manual override of calculated value
  precision: number;
  showUnits: boolean;
}

// Text annotation
export interface TextAnnotation extends BaseAnnotation {
  type: 'text';
  position: Point;
  content: string;
  multiline: boolean;
  fontSize: number;
  fontWeight: 'normal' | 'bold';
  fontStyle: 'normal' | 'italic';
  alignment: 'left' | 'center' | 'right';
  backgroundColor?: string;
  textColor: string;
  width?: number; // for multiline text box width
  height?: number; // for multiline text box height
}

// Leader annotation
export interface LeaderAnnotation extends BaseAnnotation {
  type: 'leader';
  elementPoint: Point; // where arrow points
  textPoint: Point; // where text is
  text: string;
  arrowStyle: 'filled' | 'open' | 'dot';
  leaderStyle: 'straight' | 'orthogonal' | 'arc';
  landingLength: number;
  showBackground: boolean;
}

// Section marker annotation
export interface SectionMarkerAnnotation extends BaseAnnotation {
  type: 'section-marker';
  startPoint: Point;
  endPoint: Point;
  viewDirection: 'up' | 'down' | 'left' | 'right';
  sheetNumber?: string;
  detailNumber?: string;
}

// Elevation marker annotation
export interface ElevationMarkerAnnotation extends BaseAnnotation {
  type: 'elevation-marker';
  position: Point;
  direction: number; // angle in degrees
  label: string;
  sheetNumber?: string;
}

// Detail marker annotation
export interface DetailMarkerAnnotation extends BaseAnnotation {
  type: 'detail-marker';
  center: Point;
  radius: number;
  detailNumber?: string;
  sheetNumber?: string;
}

// Level marker annotation
export interface LevelMarkerAnnotation extends BaseAnnotation {
  type: 'level-marker';
  position: Point;
  elevation: number;
  lineLength: number;
  relativeToDatum: boolean;
}

// Union type for all annotations
export type Annotation =
  | DimensionAnnotation
  | TextAnnotation
  | LeaderAnnotation
  | SectionMarkerAnnotation
  | ElevationMarkerAnnotation
  | DetailMarkerAnnotation
  | LevelMarkerAnnotation;

export type AnnotationType = Annotation['type'];

// Settings for different annotation types
export interface DimensionSettings {
  arrowStyle: 'slash' | 'filled-arrow' | 'dot';
  offset: number;
  precision: number;
  showUnits: boolean;
}

export interface TextSettings {
  fontSize: number;
  fontWeight: 'normal' | 'bold';
  textColor: string;
  showBackground: boolean;
  backgroundColor: string;
}

export interface LeaderSettings {
  arrowStyle: 'filled' | 'open' | 'dot';
  leaderStyle: 'straight' | 'orthogonal' | 'arc';
  landingLength: number;
  showBackground: boolean;
}
