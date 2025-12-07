/**
 * Selection utility functions for canvas operations
 * Provides hit testing for walls and openings, rectangle selection, and point-to-feature matching
 * Used for detecting user clicks and drag selections on canvas elements
 */

import { Point, Opening } from '../types/wallGraph';
import { distanceToLineSegment, lineIntersectsRectangle } from './geometryUtils';
import type { Shape } from '../types/shapes';
import { metersToPixels } from '@/lib/units/unitsSystem';

/**
 * Find wall at a specific point
 */
export const findWallAtPoint = (point: Point, graph: any, thickness: number): any => {
  if (!graph || !graph.edges) {
    return null;
  }
  
  const tolerance = thickness / 2 + 5; // Add some tolerance
  
  for (const [id, edge] of Object.entries(graph.edges)) {
    const [start, end] = (edge as any).centerline;
    const distance = distanceToLineSegment(point, start, end);
    if (distance <= tolerance) {
      return { id, edge };
    }
  }

  for (const [id, edge] of Object.entries(graph.edges)) {
    const openings: Opening[] = (edge as any).openings || [];
    if (!openings.length) {
      continue;
    }

    const startNode = graph.nodes[(edge as any).startNodeId];
    const endNode = graph.nodes[(edge as any).endNodeId];
    if (!startNode || !endNode) {
      continue;
    }

    const dx = endNode.position[0] - startNode.position[0];
    const dy = endNode.position[1] - startNode.position[1];
    const length = Math.hypot(dx, dy);
    if (length === 0) {
      continue;
    }

    const dirX = dx / length;
    const dirY = dy / length;
    const normalX = -dirY;
    const normalY = dirX;

    for (const opening of openings) {
      const alignment = opening.alignment ?? 'center';
      // edge.thickness is in METERS, convert to pixels for calculations
      const edgeThicknessPixels = metersToPixels((edge as any).thickness);
      const offset = alignment === 'inner'
        ? edgeThicknessPixels / 2
        : alignment === 'outer'
          ? -edgeThicknessPixels / 2
          : 0;

      // opening.position is in METERS, convert to pixels
      const positionPixels = metersToPixels(opening.position);
      const centerX = startNode.position[0] + dirX * positionPixels + normalX * offset;
      const centerY = startNode.position[1] + dirY * positionPixels + normalY * offset;

      const relX = point[0] - centerX;
      const relY = point[1] - centerY;

      const along = relX * dirX + relY * dirY;
      const perpendicular = relX * normalX + relY * normalY;

      // opening.width is in METERS, convert to pixels
      const openingWidthPixels = metersToPixels(opening.width);
      if (Math.abs(along) <= openingWidthPixels / 2 + tolerance && Math.abs(perpendicular) <= edgeThicknessPixels / 2 + tolerance) {
        return { id, edge, opening };
      }
    }
  }
  return null;
};

/**
 * Find walls within a drag rectangle
 */
export const findWallsInRectangle = (start: Point, end: Point, graph: any, thickness: number): string[] => {
  if (!graph || !graph.edges) {
    return [];
  }
  
  const [x1, y1] = start;
  const [x2, y2] = end;
  
  const minX = Math.min(x1, x2);
  const maxX = Math.max(x1, x2);
  const minY = Math.min(y1, y2);
  const maxY = Math.max(y1, y2);
  
  const selectedIds: string[] = [];
  
  for (const [id, edge] of Object.entries(graph.edges)) {
    const [wallStart, wallEnd] = (edge as any).centerline;
    
    // Check if wall centerline intersects with rectangle
    if (lineIntersectsRectangle(wallStart, wallEnd, minX, minY, maxX, maxY)) {
      selectedIds.push(id);
    }
  }
  
  return selectedIds;
};

export const findOpeningAtPoint = (point: Point, graph: any, tolerance: number = 8): { opening: Opening; wallId: string } | null => {
  if (!graph || !graph.edges) {
    return null;
  }

  for (const [wallId, wall] of Object.entries(graph.edges)) {
    const openings: Opening[] = (wall as any).openings || [];
    if (!openings.length) {
      continue;
    }

    const startNode = graph.nodes[(wall as any).startNodeId];
    const endNode = graph.nodes[(wall as any).endNodeId];
    if (!startNode || !endNode) {
      continue;
    }

    const dx = endNode.position[0] - startNode.position[0];
    const dy = endNode.position[1] - startNode.position[1];
    const length = Math.hypot(dx, dy);
    if (length === 0) {
      continue;
    }

    const dirX = dx / length;
    const dirY = dy / length;
    const normalX = -dirY;
    const normalY = dirX;

    for (const opening of openings) {
      const alignment = opening.alignment ?? 'center';
      // wall.thickness is in METERS, convert to pixels for calculations
      const wallThicknessPixels = metersToPixels((wall as any).thickness);
      const offset = alignment === 'inner'
        ? wallThicknessPixels / 2
        : alignment === 'outer'
          ? -wallThicknessPixels / 2
          : 0;

      // opening.position is in METERS, convert to pixels
      const positionPixels = metersToPixels(opening.position);
      const centerX = startNode.position[0] + dirX * positionPixels + normalX * offset;
      const centerY = startNode.position[1] + dirY * positionPixels + normalY * offset;

      const relativeToCenterX = point[0] - centerX;
      const relativeToCenterY = point[1] - centerY;

      const along = relativeToCenterX * dirX + relativeToCenterY * dirY;
      const perpendicular = relativeToCenterX * normalX + relativeToCenterY * normalY;

      // opening.width is in METERS, convert to pixels
      const openingWidthPixels = metersToPixels(opening.width);
      if (Math.abs(along) <= openingWidthPixels / 2 + tolerance && Math.abs(perpendicular) <= wallThicknessPixels / 2 + tolerance) {
        return { opening, wallId: wallId as string };
      }
    }
  }

  return null;
};

/**
 * Find shapes within a drag rectangle
 */
export const findShapesInRectangle = (start: Point, end: Point, shapes: Shape[]): string[] => {
  const [x1, y1] = start;
  const [x2, y2] = end;
  
  const minX = Math.min(x1, x2);
  const maxX = Math.max(x1, x2);
  const minY = Math.min(y1, y2);
  const maxY = Math.max(y1, y2);
  
  const selectedIds: string[] = [];
  
  for (const shape of shapes) {
    let isInRectangle = false;
    
    switch (shape.type) {
      case 'line':
      case 'arrow':
      case 'guide-line': {
        const s = shape as any;
        // Check if line intersects rectangle
        if (lineIntersectsRectangle(s.start, s.end, minX, minY, maxX, maxY)) {
          isInRectangle = true;
        }
        break;
      }
      case 'polyline':
      case 'zone': {
        const s = shape as any;
        // Check if any point is in rectangle, or if line segments intersect
        if (s.points && s.points.length > 0) {
          // Check if all points are within rectangle (fully contained)
          const allPointsIn = s.points.every((p: Point) => 
            p[0] >= minX && p[0] <= maxX && p[1] >= minY && p[1] <= maxY
          );
          // Or check if any point is in rectangle (partially contained)
          const anyPointIn = s.points.some((p: Point) => 
            p[0] >= minX && p[0] <= maxX && p[1] >= minY && p[1] <= maxY
          );
          // Or check if any line segment intersects rectangle
          let segmentIntersects = false;
          for (let i = 0; i < s.points.length - 1; i++) {
            if (lineIntersectsRectangle(s.points[i], s.points[i + 1], minX, minY, maxX, maxY)) {
              segmentIntersects = true;
              break;
            }
          }
          isInRectangle = allPointsIn || anyPointIn || segmentIntersects;
        }
        break;
      }
      case 'circle': {
        const s = shape as any;
        const [cx, cy] = s.center;
        const radius = s.radius;
        // Check if circle intersects rectangle
        // Find closest point on rectangle to circle center
        const closestX = Math.max(minX, Math.min(cx, maxX));
        const closestY = Math.max(minY, Math.min(cy, maxY));
        const distance = Math.sqrt(
          Math.pow(cx - closestX, 2) + Math.pow(cy - closestY, 2)
        );
        isInRectangle = distance <= radius;
        break;
      }
      case 'square': {
        const s = shape as any;
        const [cx, cy] = s.center;
        const halfWidth = s.width / 2;
        const halfHeight = s.height / 2;
        // Check if square intersects rectangle
        const squareMinX = cx - halfWidth;
        const squareMaxX = cx + halfWidth;
        const squareMinY = cy - halfHeight;
        const squareMaxY = cy + halfHeight;
        // Check for overlap
        isInRectangle = !(squareMaxX < minX || squareMinX > maxX || squareMaxY < minY || squareMinY > maxY);
        break;
      }
      case 'triangle': {
        const s = shape as any;
        // Check if any vertex is in rectangle, or if any edge intersects
        const vertices = [s.point1, s.point2, s.point3];
        const anyVertexIn = vertices.some((p: Point) => 
          p[0] >= minX && p[0] <= maxX && p[1] >= minY && p[1] <= maxY
        );
        let edgeIntersects = false;
        const edges = [
          [s.point1, s.point2],
          [s.point2, s.point3],
          [s.point3, s.point1]
        ];
        for (const [p1, p2] of edges) {
          if (lineIntersectsRectangle(p1, p2, minX, minY, maxX, maxY)) {
            edgeIntersects = true;
            break;
          }
        }
        isInRectangle = anyVertexIn || edgeIntersects;
        break;
      }
      case 'curve': {
        const s = shape as any;
        // Approximate: check if start/end/control points are in rectangle, or if line segments intersect
        const points = [s.start, s.control, s.end];
        const anyPointIn = points.some((p: Point) => 
          p[0] >= minX && p[0] <= maxX && p[1] >= minY && p[1] <= maxY
        );
        // Check if line from start to control or control to end intersects
        const segment1Intersects = lineIntersectsRectangle(s.start, s.control, minX, minY, maxX, maxY);
        const segment2Intersects = lineIntersectsRectangle(s.control, s.end, minX, minY, maxX, maxY);
        isInRectangle = anyPointIn || segment1Intersects || segment2Intersects;
        break;
      }
      case 'image': {
        const s = shape as any;
        const [x, y] = s.position;
        const width = s.width || 100; // Default width if not specified
        const height = s.height || 100; // Default height if not specified
        // Check if image rectangle intersects selection rectangle
        const imageMinX = x;
        const imageMaxX = x + width;
        const imageMinY = y;
        const imageMaxY = y + height;
        isInRectangle = !(imageMaxX < minX || imageMinX > maxX || imageMaxY < minY || imageMinY > maxY);
        break;
      }
    }
    
    if (isInRectangle) {
      selectedIds.push(shape.id);
    }
  }
  
  return selectedIds;
};
