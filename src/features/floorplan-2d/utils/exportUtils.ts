/**
 * Export utilities for calculating content bounds and coordinate transformations
 * Handles conversion between canvas coordinates (pixels, Y-down) and export formats
 */

import type { Point } from '../types/wallGraph';
import type { ContentBounds, ExportOptions } from '../types/export';
import type { Shape, LineShape, CircleShape, SquareShape, PolylineShape, ZoneShape, TriangleShape, CurveShape, ImageShape } from '../types/shapes';
import type { Annotation, DimensionAnnotation, TextAnnotation, LeaderAnnotation } from '../types/annotations';
import { useShapesStore } from '../store/shapesStore';
import { useDXFBlocksStore } from '../store/dxfBlocksStore';
import { useAnnotationsStore } from '../store/annotationsStore';
import type { getWallGraphStore } from '../store/wallGraphStore';
import {
  pixelsToMeters,
  metersToPixels,
  metersToMillimeters,
  millimetersToMeters,
} from '@/lib/units/unitsSystem';

type WallGraphStoreInstance = ReturnType<typeof getWallGraphStore>;

/**
 * Export transform interface for coordinate conversion
 */
export interface ExportTransform {
  transformPoint(canvasPoint: Point): Point;
  toExportUnits(pixels: number): number;
  bounds: ContentBounds;
}

/**
 * Calculate tight bounding box around all content
 * Returns bounds in PIXELS (canvas coordinates)
 */
export function calculateContentBounds(
  options: ExportOptions,
  wallGraphStore: WallGraphStoreInstance
): ContentBounds | null {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  // Walls: Include all nodes + thickness buffer
  if (options.includeWalls) {
    const graph = wallGraphStore.getState().graph;
    Object.values(graph.nodes).forEach(node => {
      const [x, y] = node.position;
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
    });

    // Add wall thickness buffer
    const edges = Object.values(graph.edges);
    if (edges.length > 0) {
      const maxThickness = Math.max(...edges.map(e => metersToPixels(e.thickness)));
      const halfThickness = maxThickness / 2;
      minX -= halfThickness;
      minY -= halfThickness;
      maxX += halfThickness;
      maxY += halfThickness;
    }
  }

  // Shapes: Calculate bounds per shape type
  if (options.includeShapes) {
    const shapes = useShapesStore.getState().shapes;
    shapes.forEach(shape => {
      const bounds = calculateShapeBounds(shape);
      if (bounds) {
        minX = Math.min(minX, bounds.minX);
        minY = Math.min(minY, bounds.minY);
        maxX = Math.max(maxX, bounds.maxX);
        maxY = Math.max(maxY, bounds.maxY);
      }
    });
  }

  // DXF Blocks: Account for transformed positions
  if (options.includeFurniture) {
    const blocks = useDXFBlocksStore.getState().blocks;
    blocks.forEach(block => {
      const blockBounds = calculateDXFBlockBounds(block);
      minX = Math.min(minX, blockBounds.minX);
      minY = Math.min(minY, blockBounds.minY);
      maxX = Math.max(maxX, blockBounds.maxX);
      maxY = Math.max(maxY, blockBounds.maxY);
    });
  }

  // Annotations: Text extents, dimension lines
  if (options.includeAnnotations) {
    const annotations = Array.from(useAnnotationsStore.getState().annotations.values());
    annotations.forEach(annotation => {
      const bounds = calculateAnnotationBounds(annotation);
      if (bounds) {
        minX = Math.min(minX, bounds.minX);
        minY = Math.min(minY, bounds.minY);
        maxX = Math.max(maxX, bounds.maxX);
        maxY = Math.max(maxY, bounds.maxY);
      }
    });
  }

  // Check if we found any content
  if (minX === Infinity || minY === Infinity || maxX === -Infinity || maxY === -Infinity) {
    return null;
  }

  // Add padding (convert mm to pixels)
  const paddingPixels = millimetersToPixels(options.padding);
  minX -= paddingPixels;
  minY -= paddingPixels;
  maxX += paddingPixels;
  maxY += paddingPixels;

  const width = maxX - minX;
  const height = maxY - minY;

  return {
    minX,
    minY,
    maxX,
    maxY,
    width,
    height,
    centerX: (minX + maxX) / 2,
    centerY: (minY + maxY) / 2,
  };
}

/**
 * Calculate bounds for a single shape
 */
function calculateShapeBounds(shape: Shape): ContentBounds | null {
  switch (shape.type) {
    case 'line':
    case 'arrow':
    case 'guide-line': {
      const s = shape as LineShape;
      return {
        minX: Math.min(s.start[0], s.end[0]),
        minY: Math.min(s.start[1], s.end[1]),
        maxX: Math.max(s.start[0], s.end[0]),
        maxY: Math.max(s.start[1], s.end[1]),
        width: Math.abs(s.end[0] - s.start[0]),
        height: Math.abs(s.end[1] - s.start[1]),
        centerX: (s.start[0] + s.end[0]) / 2,
        centerY: (s.start[1] + s.end[1]) / 2,
      };
    }

    case 'circle': {
      const s = shape as CircleShape;
      return {
        minX: s.center[0] - s.radius,
        minY: s.center[1] - s.radius,
        maxX: s.center[0] + s.radius,
        maxY: s.center[1] + s.radius,
        width: s.radius * 2,
        height: s.radius * 2,
        centerX: s.center[0],
        centerY: s.center[1],
      };
    }

    case 'square': {
      const s = shape as SquareShape;
      const halfW = s.width / 2;
      const halfH = s.height / 2;
      // For rotated squares, we'd need to calculate all corners, but for bounds we can use a bounding box
      return {
        minX: s.center[0] - halfW,
        minY: s.center[1] - halfH,
        maxX: s.center[0] + halfW,
        maxY: s.center[1] + halfH,
        width: s.width,
        height: s.height,
        centerX: s.center[0],
        centerY: s.center[1],
      };
    }

    case 'polyline':
    case 'zone': {
      const s = shape as PolylineShape | ZoneShape;
      if (s.points.length === 0) {
        return null;
      }
      let minX = s.points[0]![0];
      let minY = s.points[0]![1];
      let maxX = s.points[0]![0];
      let maxY = s.points[0]![1];
      s.points.forEach(point => {
        minX = Math.min(minX, point[0]);
        minY = Math.min(minY, point[1]);
        maxX = Math.max(maxX, point[0]);
        maxY = Math.max(maxY, point[1]);
      });
      return {
        minX,
        minY,
        maxX,
        maxY,
        width: maxX - minX,
        height: maxY - minY,
        centerX: (minX + maxX) / 2,
        centerY: (minY + maxY) / 2,
      };
    }

    case 'triangle': {
      const s = shape as TriangleShape;
      const minX = Math.min(s.point1[0], s.point2[0], s.point3[0]);
      const minY = Math.min(s.point1[1], s.point2[1], s.point3[1]);
      const maxX = Math.max(s.point1[0], s.point2[0], s.point3[0]);
      const maxY = Math.max(s.point1[1], s.point2[1], s.point3[1]);
      return {
        minX,
        minY,
        maxX,
        maxY,
        width: maxX - minX,
        height: maxY - minY,
        centerX: (minX + maxX) / 2,
        centerY: (minY + maxY) / 2,
      };
    }

    case 'curve': {
      const s = shape as CurveShape;
      // Sample curve to get bounds (simplified - could be more accurate)
      const points = [s.start, s.control, s.end];
      let minX = points[0]![0];
      let minY = points[0]![1];
      let maxX = points[0]![0];
      let maxY = points[0]![1];
      points.forEach(point => {
        minX = Math.min(minX, point[0]);
        minY = Math.min(minY, point[1]);
        maxX = Math.max(maxX, point[0]);
        maxY = Math.max(maxY, point[1]);
      });
      return {
        minX,
        minY,
        maxX,
        maxY,
        width: maxX - minX,
        height: maxY - minY,
        centerX: (minX + maxX) / 2,
        centerY: (minY + maxY) / 2,
      };
    }

    case 'image': {
      const s = shape as ImageShape;
      const width = s.width || 100; // Default if not specified
      const height = s.height || 100;
      return {
        minX: s.position[0],
        minY: s.position[1],
        maxX: s.position[0] + width,
        maxY: s.position[1] + height,
        width,
        height,
        centerX: s.position[0] + width / 2,
        centerY: s.position[1] + height / 2,
      };
    }

    default:
      return null;
  }
}

/**
 * Calculate bounds for a DXF block instance
 */
function calculateDXFBlockBounds(block: { x: number; y: number; scaleX: number; scaleY: number; konvaGroupData: { shapes: unknown[] } }): ContentBounds {
  // Simplified bounds calculation - in reality, we'd need to traverse konvaGroupData.shapes
  // For now, use a default size based on scale
  const defaultSize = 100; // pixels
  const width = defaultSize * block.scaleX;
  const height = defaultSize * block.scaleY;
  
  return {
    minX: block.x - width / 2,
    minY: block.y - height / 2,
    maxX: block.x + width / 2,
    maxY: block.y + height / 2,
    width,
    height,
    centerX: block.x,
    centerY: block.y,
  };
}

/**
 * Calculate bounds for an annotation
 */
function calculateAnnotationBounds(annotation: Annotation): ContentBounds | null {
  switch (annotation.type) {
    case 'dimension': {
      const dim = annotation as DimensionAnnotation;
      return {
        minX: Math.min(dim.startPoint[0], dim.endPoint[0]),
        minY: Math.min(dim.startPoint[1], dim.endPoint[1]),
        maxX: Math.max(dim.startPoint[0], dim.endPoint[0]),
        maxY: Math.max(dim.startPoint[1], dim.endPoint[1]),
        width: Math.abs(dim.endPoint[0] - dim.startPoint[0]),
        height: Math.abs(dim.endPoint[1] - dim.startPoint[1]),
        centerX: (dim.startPoint[0] + dim.endPoint[0]) / 2,
        centerY: (dim.startPoint[1] + dim.endPoint[1]) / 2,
      };
    }

    case 'text': {
      const txt = annotation as TextAnnotation;
      // Estimate text bounds (fontSize in pixels, approximate width)
      const fontSize = txt.fontSize || 14;
      const estimatedWidth = txt.content.length * fontSize * 0.6; // Rough estimate
      const estimatedHeight = txt.multiline ? (txt.height || fontSize * 1.5) : fontSize;
      return {
        minX: txt.position[0],
        minY: txt.position[1],
        maxX: txt.position[0] + (txt.width || estimatedWidth),
        maxY: txt.position[1] + estimatedHeight,
        width: txt.width || estimatedWidth,
        height: estimatedHeight,
        centerX: txt.position[0] + (txt.width || estimatedWidth) / 2,
        centerY: txt.position[1] + estimatedHeight / 2,
      };
    }

    case 'leader': {
      const leader = annotation as LeaderAnnotation;
      return {
        minX: Math.min(leader.elementPoint[0], leader.textPoint[0]),
        minY: Math.min(leader.elementPoint[1], leader.textPoint[1]),
        maxX: Math.max(leader.elementPoint[0], leader.textPoint[0]),
        maxY: Math.max(leader.elementPoint[1], leader.textPoint[1]),
        width: Math.abs(leader.textPoint[0] - leader.elementPoint[0]),
        height: Math.abs(leader.textPoint[1] - leader.elementPoint[1]),
        centerX: (leader.elementPoint[0] + leader.textPoint[0]) / 2,
        centerY: (leader.elementPoint[1] + leader.textPoint[1]) / 2,
      };
    }

    default:
      return null;
  }
}

/**
 * Create DXF coordinate transform
 * - Translates origin to bounds.min
 * - Flips Y-axis (Y-up for CAD)
 * - Converts pixels → millimeters
 */
export function createDXFTransform(bounds: ContentBounds): ExportTransform {
  return {
    bounds,
    transformPoint(canvasPoint: Point): Point {
      // 1. Translate to origin
      const x = canvasPoint[0] - bounds.minX;
      const y = canvasPoint[1] - bounds.minY;

      // 2. Flip Y-axis
      const yFlipped = bounds.height - y;

      // 3. Convert to millimeters
      return [
        pixelsToMillimeters(x),
        pixelsToMillimeters(yFlipped),
      ];
    },
    toExportUnits(pixels: number): number {
      return pixelsToMillimeters(pixels);
    },
  };
}

/**
 * Create SVG coordinate transform
 * - Translates origin to bounds.min
 * - Y-down (same as canvas)
 * - Converts pixels → millimeters
 */
export function createSVGTransform(bounds: ContentBounds): ExportTransform {
  return {
    bounds,
    transformPoint(canvasPoint: Point): Point {
      const x = canvasPoint[0] - bounds.minX;
      const y = canvasPoint[1] - bounds.minY;
      return [
        pixelsToMillimeters(x),
        pixelsToMillimeters(y),
      ];
    },
    toExportUnits(pixels: number): number {
      return pixelsToMillimeters(pixels);
    },
  };
}

/**
 * Convert canvas pixels to millimeters
 * Uses: PIXELS_PER_METER = 100, so 1px = 10mm
 */
function pixelsToMillimeters(pixels: number): number {
  const meters = pixelsToMeters(pixels);
  return metersToMillimeters(meters);
}

/**
 * Convert millimeters to canvas pixels
 */
function millimetersToPixels(mm: number): number {
  const meters = millimetersToMeters(mm);
  return metersToPixels(meters);
}

