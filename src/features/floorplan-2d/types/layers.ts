/**
 * Layer type definitions for CAD-style layer management
 * Defines the Layer interface and related types for organizing drawing elements
 */

export interface Layer {
  id: string;
  name: string;
  color: string;      // Hex color for visual indicator (e.g., '#ffffff')
  visible: boolean;   // Show/hide toggle
  locked: boolean;   // Prevent editing elements on this layer
  order: number;     // Z-index/stacking order (lower = bottom layer)
  opacity: number;   // Opacity value from 0 to 1 (default: 1.0)
}

export const DEFAULT_LAYER_ID = 'default';
export const DEFAULT_LAYER_NAME = 'Default';

export const ANNOTATIONS_LAYER_ID = 'annotations';
export const ANNOTATIONS_LAYER_NAME = 'Annotations';

