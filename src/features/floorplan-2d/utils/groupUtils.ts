/**
 * Utility functions for group operations
 * Handles group creation, selection, and transformation
 */

import type { Shape } from '../types/shapes';
import type { Point } from '../types/wallGraph';

/**
 * Move all shapes in a group by a delta
 */
export function moveShapesInGroup(shapes: Shape[], shapeIds: string[], delta: Point): Shape[] {
  const idsSet = new Set(shapeIds);

  return shapes.map(shape => {
    if (!idsSet.has(shape.id)) {
      return shape;
    }

    // Apply delta based on shape type
    switch (shape.type) {
      case 'line':
      case 'arrow':
      case 'guide-line':
        return {
          ...shape,
          start: [shape.start[0] + delta[0], shape.start[1] + delta[1]] as Point,
          end: [shape.end[0] + delta[0], shape.end[1] + delta[1]] as Point,
        };

      case 'polyline':
      case 'zone':
        return {
          ...shape,
          points: shape.points.map(p => [p[0] + delta[0], p[1] + delta[1]] as Point),
        };

      case 'circle':
        return {
          ...shape,
          center: [shape.center[0] + delta[0], shape.center[1] + delta[1]] as Point,
        };

      case 'square':
        return {
          ...shape,
          center: [shape.center[0] + delta[0], shape.center[1] + delta[1]] as Point,
        };

      case 'triangle':
        return {
          ...shape,
          point1: [shape.point1[0] + delta[0], shape.point1[1] + delta[1]] as Point,
          point2: [shape.point2[0] + delta[0], shape.point2[1] + delta[1]] as Point,
          point3: [shape.point3[0] + delta[0], shape.point3[1] + delta[1]] as Point,
        };

      case 'curve':
        return {
          ...shape,
          start: [shape.start[0] + delta[0], shape.start[1] + delta[1]] as Point,
          control: [shape.control[0] + delta[0], shape.control[1] + delta[1]] as Point,
          end: [shape.end[0] + delta[0], shape.end[1] + delta[1]] as Point,
        };

      case 'image':
        return {
          ...shape,
          position: [shape.position[0] + delta[0], shape.position[1] + delta[1]] as Point,
        };

      default:
        return shape;
    }
  });
}

/**
 * Get bounding box for a group of shapes
 */
export function getGroupBounds(shapes: Shape[], shapeIds: string[]): {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  centerX: number;
  centerY: number;
} | null {
  const groupShapes = shapes.filter(s => shapeIds.includes(s.id));

  if (groupShapes.length === 0) {
    return null;
  }

  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;

  groupShapes.forEach(shape => {
    const points = getShapePoints(shape);
    points.forEach(([x, y]) => {
      minX = Math.min(minX, x);
      maxX = Math.max(maxX, x);
      minY = Math.min(minY, y);
      maxY = Math.max(maxY, y);
    });
  });

  return {
    minX,
    maxX,
    minY,
    maxY,
    centerX: (minX + maxX) / 2,
    centerY: (minY + maxY) / 2,
  };
}

/**
 * Get all points that define a shape
 */
function getShapePoints(shape: Shape): Point[] {
  switch (shape.type) {
    case 'line':
    case 'arrow':
    case 'guide-line':
      return [shape.start, shape.end];

    case 'polyline':
    case 'zone':
      return shape.points;

    case 'circle': {
      // Return 4 points at cardinal directions of the circle
      const { center, radius } = shape;
      return [
        [center[0] - radius, center[1]],
        [center[0] + radius, center[1]],
        [center[0], center[1] - radius],
        [center[0], center[1] + radius],
      ];
    }

    case 'square': {
      const { center, width, height } = shape;
      const halfW = width / 2;
      const halfH = height / 2;
      return [
        [center[0] - halfW, center[1] - halfH],
        [center[0] + halfW, center[1] - halfH],
        [center[0] + halfW, center[1] + halfH],
        [center[0] - halfW, center[1] + halfH],
      ];
    }

    case 'triangle':
      return [shape.point1, shape.point2, shape.point3];

    case 'curve':
      return [shape.start, shape.control, shape.end];

    case 'image':
      return [shape.position];

    default:
      return [];
  }
}
