/**
 * Stroke weight utility functions
 * Provides stroke width values based on the selected stroke weight setting
 */

import type { StrokeWeight } from '../store/types';

export interface StrokeWidths {
  wall: number;
  wallSelected: number;
  opening: number;
  shape: number;
}

/**
 * Get stroke widths based on stroke weight setting
 * Fine: Current default values (1, 1.5, 1)
 * Medium: Thicker than fine (3, 4, 3)
 * Bold: Thickest but not too thick (5, 6, 5)
 */
export const getStrokeWidths = (weight: StrokeWeight): StrokeWidths => {
  switch (weight) {
    case 'fine':
      return {
        wall: 1,
        wallSelected: 2,
        opening: 1.5,
        shape: 1,
      };
    case 'medium':
      return {
        wall: 3,
        wallSelected: 4,
        opening: 3.5,
        shape: 3,
      };
    case 'bold':
      return {
        wall: 5,
        wallSelected: 6,
        opening: 5.5,
        shape: 5,
      };
    default:
      return {
        wall: 1,
        wallSelected: 2,
        opening: 1.5,
        shape: 1,
      };
  }
};

