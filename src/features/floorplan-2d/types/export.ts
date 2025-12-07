/**
 * Export system type definitions
 * Defines export formats, options, and content bounds for the floorplan export system
 */

export type ExportFormat = 'dxf' | 'svg' | 'jpg' | 'pdf';

/**
 * Content bounds interface for calculating export area
 */
export interface ContentBounds {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  width: number;
  height: number;
  centerX: number;
  centerY: number;
}

/**
 * Export options for controlling what content is included in exports
 */
export interface ExportOptions {
  includeWalls: boolean;
  includeOpenings: boolean;
  includeFurniture: boolean;
  includeShapes: boolean;
  includeAnnotations: boolean;
  includeImages: boolean;
  padding: number; // in millimeters
}

/**
 * Default export options with sensible defaults
 */
export const DEFAULT_EXPORT_OPTIONS: ExportOptions = {
  includeWalls: true,
  includeOpenings: true,
  includeFurniture: true,
  includeShapes: true,
  includeAnnotations: true,
  includeImages: false, // Exclude by default (not supported in vector formats)
  padding: 500, // 500mm = 0.5m padding
};

