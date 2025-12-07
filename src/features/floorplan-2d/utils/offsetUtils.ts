/**
 * Utility functions for offsetting shapes
 * Creates parallel copies of shapes at a specified distance
 * Supports all shape types with intelligent offset calculation
 */

import type { Shape, LineShape, PolylineShape, ZoneShape, CircleShape, SquareShape, TriangleShape, ArrowShape, GuideLineShape, CurveShape } from '../types/shapes';
import type { Point } from '../types/wallGraph';

/**
 * Generate unique ID for shapes
 */
function generateShapeId(): string {
  return `shape-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Calculate perpendicular offset direction for a line segment
 * Returns normalized vector perpendicular to the line (pointing "left")
 */
function getPerpendicularDirection(start: Point, end: Point): Point {
  const dx = end[0] - start[0];
  const dy = end[1] - start[1];
  const length = Math.sqrt(dx * dx + dy * dy);

  if (length === 0) {
    return [0, 0];
  }

  // Perpendicular vector (rotate 90 degrees counterclockwise)
  const perpX = -dy / length;
  const perpY = dx / length;

  return [perpX, perpY];
}

/**
 * Offset a point by a distance in a given direction
 */
function offsetPoint(point: Point, direction: Point, distance: number): Point {
  return [
    point[0] + direction[0] * distance,
    point[1] + direction[1] * distance,
  ];
}

/**
 * Create an offset copy of a line shape (or arrow, guide-line)
 */
function offsetLine(shape: LineShape | ArrowShape | GuideLineShape, distance: number, side: 'left' | 'right'): Shape {
  const direction = getPerpendicularDirection(shape.start, shape.end);
  const actualDistance = side === 'right' ? -distance : distance;

  return {
    ...shape,
    id: generateShapeId(),
    start: offsetPoint(shape.start, direction, actualDistance),
    end: offsetPoint(shape.end, direction, actualDistance),
  };
}

/**
 * Create an offset copy of a polyline or zone shape
 */
function offsetPolyline(shape: PolylineShape | ZoneShape, distance: number, side: 'left' | 'right'): Shape {
  if (!shape.points || shape.points.length < 2) {
    return { ...shape, id: generateShapeId() };
  }

  const offsetPoints: Point[] = [];

  // For each point, calculate average offset direction from adjacent segments
  for (let i = 0; i < shape.points.length; i++) {
    const prevIdx = i === 0 ? shape.points.length - 1 : i - 1;
    const nextIdx = i === shape.points.length - 1 ? 0 : i + 1;

    const currentPoint = shape.points[i];
    const prevPoint = shape.points[prevIdx];
    const nextPoint = shape.points[nextIdx];

    if (!currentPoint || !prevPoint || !nextPoint) {
      continue;
    }

    // Get perpendicular directions for both adjacent segments
    const dir1 = getPerpendicularDirection(prevPoint, currentPoint);
    const dir2 = getPerpendicularDirection(currentPoint, nextPoint);

    // Average the two directions
    const avgDirX = (dir1[0] + dir2[0]) / 2;
    const avgDirY = (dir1[1] + dir2[1]) / 2;
    const avgLength = Math.sqrt(avgDirX * avgDirX + avgDirY * avgDirY);

    const avgDir: Point = avgLength > 0
      ? [avgDirX / avgLength, avgDirY / avgLength]
      : dir1;

    const actualDistance = side === 'right' ? -distance : distance;
    offsetPoints.push(offsetPoint(currentPoint, avgDir, actualDistance));
  }

  return {
    ...shape,
    id: generateShapeId(),
    points: offsetPoints,
  };
}

/**
 * Create an offset copy of a circle shape
 */
function offsetCircle(shape: CircleShape, distance: number, side: 'left' | 'right'): Shape {
  // For circles, offset means changing the radius
  const newRadius = side === 'right'
    ? Math.max(0, shape.radius - distance)
    : shape.radius + distance;

  return {
    ...shape,
    id: generateShapeId(),
    radius: newRadius,
  };
}

/**
 * Create an offset copy of a square/rectangle shape
 */
function offsetSquare(shape: SquareShape, distance: number, side: 'left' | 'right'): Shape {
  // For squares, offset means changing the dimensions
  const offset = side === 'right' ? -distance * 2 : distance * 2;

  return {
    ...shape,
    id: generateShapeId(),
    width: Math.max(0, shape.width + offset),
    height: Math.max(0, shape.height + offset),
  };
}

/**
 * Create an offset copy of a triangle shape
 */
function offsetTriangle(shape: TriangleShape, distance: number, side: 'left' | 'right'): Shape {
  // Offset each edge of the triangle
  const points: Point[] = [shape.point1, shape.point2, shape.point3];
  const offsetPoints: Point[] = [];

  for (let i = 0; i < 3; i++) {
    const prevIdx = i === 0 ? 2 : i - 1;
    const nextIdx = i === 2 ? 0 : i + 1;

    const currentPoint = points[i];
    const prevPoint = points[prevIdx];
    const nextPoint = points[nextIdx];

    if (!currentPoint || !prevPoint || !nextPoint) {
      continue;
    }

    // Get perpendicular directions for both adjacent edges
    const dir1 = getPerpendicularDirection(prevPoint, currentPoint);
    const dir2 = getPerpendicularDirection(currentPoint, nextPoint);

    // Average the two directions
    const avgDirX = (dir1[0] + dir2[0]) / 2;
    const avgDirY = (dir1[1] + dir2[1]) / 2;
    const avgLength = Math.sqrt(avgDirX * avgDirX + avgDirY * avgDirY);

    const avgDir: Point = avgLength > 0
      ? [avgDirX / avgLength, avgDirY / avgLength]
      : dir1;

    const actualDistance = side === 'right' ? -distance : distance;
    offsetPoints.push(offsetPoint(currentPoint, avgDir, actualDistance));
  }

  return {
    ...shape,
    id: generateShapeId(),
    point1: offsetPoints[0]!,
    point2: offsetPoints[1]!,
    point3: offsetPoints[2]!,
  };
}

/**
 * Create an offset copy of a curve shape
 */
function offsetCurve(shape: CurveShape, distance: number, side: 'left' | 'right'): Shape {
  // For curves, offset the start, control, and end points
  // Calculate perpendicular at each point
  const startDir = getPerpendicularDirection(shape.start, shape.control);
  const endDir = getPerpendicularDirection(shape.control, shape.end);

  // For control point, average the two directions
  const controlDirX = (startDir[0] + endDir[0]) / 2;
  const controlDirY = (startDir[1] + endDir[1]) / 2;
  const controlLength = Math.sqrt(controlDirX * controlDirX + controlDirY * controlDirY);
  const controlDir: Point = controlLength > 0
    ? [controlDirX / controlLength, controlDirY / controlLength]
    : startDir;

  const actualDistance = side === 'right' ? -distance : distance;

  return {
    ...shape,
    id: generateShapeId(),
    start: offsetPoint(shape.start, startDir, actualDistance),
    control: offsetPoint(shape.control, controlDir, actualDistance),
    end: offsetPoint(shape.end, endDir, actualDistance),
  };
}

/**
 * Create an offset copy of any supported shape
 */
export function createOffsetShape(
  shape: Shape,
  distance: number,
  side: 'left' | 'right' = 'left'
): Shape | null {
  if (distance <= 0) {
    return null;
  }

  switch (shape.type) {
    case 'line':
    case 'arrow':
    case 'guide-line':
      return offsetLine(shape as LineShape | ArrowShape | GuideLineShape, distance, side);

    case 'polyline':
    case 'zone':
      return offsetPolyline(shape as PolylineShape | ZoneShape, distance, side);

    case 'circle':
      return offsetCircle(shape as CircleShape, distance, side);

    case 'square':
      return offsetSquare(shape as SquareShape, distance, side);

    case 'triangle':
      return offsetTriangle(shape as TriangleShape, distance, side);

    case 'curve':
      return offsetCurve(shape as CurveShape, distance, side);

    // Image shapes cannot be offset in a meaningful way
    case 'image':
      return null;

    default:
      return null;
  }
}

/**
 * Check if a shape can be offset
 */
export function canOffsetShape(shape: Shape): boolean {
  return shape.type !== 'image';
}

/**
 * Determine offset side based on mouse position relative to shape
 * Returns the perpendicular distance from the point to the nearest segment
 */
export function determineOffsetSide(
  shape: Shape,
  mousePoint: Point,
  shapePoint: Point
): { side: 'left' | 'right'; distance: number } {
  // Calculate vector from shape point to mouse point
  const dx = mousePoint[0] - shapePoint[0];
  const dy = mousePoint[1] - shapePoint[1];

  // For line-based shapes, use the line direction
  if (shape.type === 'line' || shape.type === 'arrow' || shape.type === 'guide-line') {
    const { start, end } = shape as LineShape;

    // Line direction vector
    const lineDx = end[0] - start[0];
    const lineDy = end[1] - start[1];

    // Cross product determines side (positive = left, negative = right)
    const cross = dx * lineDy - dy * lineDx;

    // Distance is perpendicular distance
    const lineLength = Math.sqrt(lineDx * lineDx + lineDy * lineDy);
    const distance = Math.abs(cross) / (lineLength || 1);

    return {
      side: cross >= 0 ? 'left' : 'right',
      distance
    };
  }

  // For other shapes, calculate distance from center or reference point
  const distance = Math.sqrt(dx * dx + dy * dy);

  // Default to left for other shapes
  return {
    side: 'left',
    distance
  };
}
