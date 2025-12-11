/**
 * DXF file parsing and conversion utility
 * Converts DXF entities to Konva-compatible data structures
 * Handles coordinate system transformation (DXF Y-up to Canvas Y-down)
 */

import type { Point } from '../types/wallGraph';

// DXF entity types
interface DXFEntity {
  type: string;
  handle?: string;
  colorIndex?: number;
  colorNumber?: number; // Alternative color property from parser
  layer?: string;
  // LINE
  start?: { x: number; y: number; z?: number };
  end?: { x: number; y: number; z?: number };
  // CIRCLE
  center?: { x: number; y: number; z?: number };
  radius?: number;
  // ARC - properties from parser
  x?: number; // ARC center X
  y?: number; // ARC center Y
  z?: number; // ARC center Z
  r?: number; // ARC radius
  startAngle?: number; // in radians (not degrees!)
  endAngle?: number; // in radians (not degrees!)
  // POLYLINE / LWPOLYLINE
  vertices?: Array<{ x: number; y: number; z?: number; bulge?: number }>;
  closed?: boolean;
  // SPLINE
  controlPoints?: Array<{ x: number; y: number; z?: number }>;
  fitPoints?: Array<{ x: number; y: number; z?: number }>;
  degree?: number;
  knots?: number[];
  // ELLIPSE
  majorAxisEndPoint?: { x: number; y: number; z?: number };
  axisRatio?: number;
  startParameter?: number;
  endParameter?: number;
  // INSERT (block reference)
  name?: string;
  position?: { x: number; y: number; z?: number };
  rotation?: number; // in degrees
  xScale?: number;
  yScale?: number;
}

interface DXFBlock {
  name: string;
  basePoint?: { x: number; y: number; z?: number };
  entities: DXFEntity[];
}

interface DXFData {
  entities: DXFEntity[];
  blocks?: DXFBlock[];
  header?: any;
}

// Konva shape data structures
export interface KonvaLineData {
  type: 'line';
  points: number[];
  stroke?: string;
  strokeWidth?: number;
  closed?: boolean;
}

export interface KonvaCircleData {
  type: 'circle';
  x: number;
  y: number;
  radius: number;
  stroke?: string;
  strokeWidth?: number;
  fill?: string;
}

export interface KonvaPathData {
  type: 'path';
  data: string; // SVG path data
  stroke?: string;
  strokeWidth?: number;
  fill?: string;
}

export type KonvaShapeData = KonvaLineData | KonvaCircleData | KonvaPathData;

export interface KonvaGroupData {
  id: string;
  name: string;
  shapes: KonvaShapeData[];
  x: number;
  y: number;
  rotation: number;
  scaleX: number;
  scaleY: number;
}

/**
 * Flip Y coordinate from DXF (Y-up) to Canvas (Y-down)
 */
function flipY(dxfY: number): number {
  return -dxfY;
}

/**
 * Transform a point from DXF coordinates to canvas coordinates
 */
function transformPoint(
  point: { x: number; y: number; z?: number },
  insertionPoint: Point,
  scale: number = 1,
  rotationDeg: number = 0,
  yFlip: boolean = true
): Point {
  let x = point.x * scale;
  let y = point.y * scale;

  // Apply Y-flip if needed
  if (yFlip) {
    y = flipY(y);
  }

  // Apply rotation
  if (rotationDeg !== 0) {
    const rad = (rotationDeg * Math.PI) / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);
    const newX = x * cos - y * sin;
    const newY = x * sin + y * cos;
    x = newX;
    y = newY;
  }

  // Translate to insertion point
  return [x + insertionPoint[0], y + insertionPoint[1]];
}

/**
 * Convert DXF color index to HTML color string
 * For architectural furniture blocks, always return black for consistency
 */
function getColor(colorIndex?: number): string {
  // Always return black for furniture blocks
  return '#000000';
}

/**
 * Convert ARC entity to SVG path data
 * Uses sampling approach for more reliable rendering
 */
function arcToPath(
  center: { x: number; y: number },
  radius: number,
  startAngleDeg: number,
  endAngleDeg: number,
  insertionPoint: Point,
  scale: number,
  rotationDeg: number,
  yFlip: boolean
): string {
  // Convert angles to radians
  const startRad = (startAngleDeg * Math.PI) / 180;
  let endRad = (endAngleDeg * Math.PI) / 180;

  // Normalize angles
  if (endRad < startRad) {
    endRad += 2 * Math.PI;
  }

  // Sample the arc with enough points for smooth rendering
  const segments = Math.max(16, Math.ceil((endRad - startRad) / (Math.PI / 8))); // At least 16 segments, more for larger arcs
  const pathPoints: string[] = [];

  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const angle = startRad + (endRad - startRad) * t;
    const x = center.x + radius * Math.cos(angle);
    const y = center.y + radius * Math.sin(angle);
    const point = transformPoint({ x, y }, insertionPoint, scale, rotationDeg, yFlip);
    
    if (i === 0) {
      pathPoints.push(`M ${point[0]} ${point[1]}`);
    } else {
      pathPoints.push(`L ${point[0]} ${point[1]}`);
    }
  }

  return pathPoints.join(' ');
}

/**
 * Convert polyline bulge to arc points
 * Bulge = tan(included_angle / 4)
 * Positive bulge = arc curves to the left (CCW)
 * Negative bulge = arc curves to the right (CW)
 */
function bulgeToArcPoints(
  p1: Point,
  p2: Point,
  bulge: number,
  segments: number = 8
): Point[] {
  if (bulge === 0 || Math.abs(bulge) < 0.0001) {
    return [p1, p2];
  }

  const points: Point[] = [p1];

  // Calculate chord length
  const dx = p2[0] - p1[0];
  const dy = p2[1] - p1[1];
  const chordLength = Math.sqrt(dx * dx + dy * dy);

  if (chordLength < 0.0001) {
    return [p1, p2];
  }

  // Calculate arc parameters from bulge
  // Formula: radius = (chordLength / 4) * (1 + bulge²) / |bulge|
  const radius = Math.abs((chordLength / 4) * (1 + bulge * bulge) / bulge);

  // Calculate sagitta (height of arc from chord midpoint)
  const sagitta = Math.abs(bulge * chordLength / 2);

  // Calculate center point
  // The center is perpendicular to the chord, at distance from midpoint
  const midX = (p1[0] + p2[0]) / 2;
  const midY = (p1[1] + p2[1]) / 2;

  // Perpendicular unit vector (rotate chord direction by 90 degrees)
  const perpX = -dy / chordLength;
  const perpY = dx / chordLength;

  // Distance from midpoint to center along perpendicular
  const distToCenter = Math.sqrt(radius * radius - (chordLength / 2) * (chordLength / 2));

  // Apply direction based on bulge sign (positive = left/CCW, negative = right/CW)
  const centerX = midX + perpX * distToCenter * Math.sign(bulge);
  const centerY = midY + perpY * distToCenter * Math.sign(bulge);

  // Calculate start and end angles
  const startAngle = Math.atan2(p1[1] - centerY, p1[0] - centerX);
  let endAngle = Math.atan2(p2[1] - centerY, p2[0] - centerX);

  // Ensure we sweep in the correct direction
  if (bulge > 0) {
    // Counter-clockwise
    if (endAngle < startAngle) {
      endAngle += 2 * Math.PI;
    }
  } else {
    // Clockwise
    if (endAngle > startAngle) {
      endAngle -= 2 * Math.PI;
    }
  }

  // Generate arc points
  for (let i = 1; i < segments; i++) {
    const t = i / segments;
    const angle = startAngle + (endAngle - startAngle) * t;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    points.push([x, y]);
  }

  points.push(p2);
  return points;
}

/**
 * Convert a single DXF entity to Konva shape data
 */
function convertDXFEntityToKonvaData(
  entity: DXFEntity,
  insertionPoint: Point,
  scale: number,
  rotationDeg: number,
  yFlip: boolean
): KonvaShapeData | null {
  // Handle both colorIndex and colorNumber properties
  const color = getColor(entity.colorIndex ?? entity.colorNumber);

  switch (entity.type) {
    case 'LINE': {
      if (!entity.start || !entity.end) {
        return null;
      }

      const start = transformPoint(entity.start, insertionPoint, scale, rotationDeg, yFlip);
      const end = transformPoint(entity.end, insertionPoint, scale, rotationDeg, yFlip);

      return {
        type: 'line',
        points: [start[0], start[1], end[0], end[1]],
        stroke: color,
        strokeWidth: 1,
      };
    }

    case 'CIRCLE': {
      // CIRCLE entities may use either center/radius OR x/y/r properties
      let centerX: number, centerY: number, centerZ: number | undefined, radius: number;

      if (entity.center && entity.radius !== undefined) {
        // Traditional format
        centerX = entity.center.x;
        centerY = entity.center.y;
        centerZ = entity.center.z;
        radius = entity.radius;
      } else if (entity.x !== undefined && entity.y !== undefined && entity.r !== undefined) {
        // Parser format (same as ARC)
        centerX = entity.x;
        centerY = entity.y;
        centerZ = entity.z;
        radius = entity.r;
      } else {
        console.warn('[DXF] CIRCLE missing required properties:', entity);
        return null;
      }

      const center = transformPoint(
        { x: centerX, y: centerY, ...(centerZ !== undefined && { z: centerZ }) },
        insertionPoint,
        scale,
        rotationDeg,
        yFlip
      );

      return {
        type: 'circle',
        x: center[0],
        y: center[1],
        radius: radius * scale,
        stroke: color,
        strokeWidth: 1,
      };
    }

    case 'ARC': {
      // ARC entities from the parser use x, y, r instead of center, radius
      if (
        entity.x === undefined ||
        entity.y === undefined ||
        entity.r === undefined ||
        entity.startAngle === undefined ||
        entity.endAngle === undefined
      ) {
        console.warn('[DXF] ARC missing required properties:', entity);
        return null;
      }

      // Create center object from x, y coordinates
      const center = { x: entity.x, y: entity.y, ...(entity.z !== undefined && { z: entity.z }) };

      // Angles from parser are already in radians, convert to degrees for arcToPath
      const startAngleDeg = (entity.startAngle * 180) / Math.PI;
      const endAngleDeg = (entity.endAngle * 180) / Math.PI;

      const pathData = arcToPath(
        center,
        entity.r,
        startAngleDeg,
        endAngleDeg,
        insertionPoint,
        scale,
        rotationDeg,
        yFlip
      );

      return {
        type: 'path',
        data: pathData,
        stroke: color,
        strokeWidth: 1,
      };
    }

    case 'POLYLINE':
    case 'LWPOLYLINE': {
      if (!entity.vertices || entity.vertices.length < 2) {
        return null;
      }

      const points: number[] = [];
      let hasBulge = false;

      // Check if any vertex has a bulge
      for (const vertex of entity.vertices) {
        if (vertex.bulge !== undefined && vertex.bulge !== 0 && Math.abs(vertex.bulge) > 0.0001) {
          hasBulge = true;
          break;
        }
      }

      if (hasBulge) {
        // Handle bulged polylines by converting to arc segments
        const pathPoints: Point[] = [];

        // Add the first vertex as the starting point
        const firstVertex = entity.vertices[0];
        if (firstVertex) {
          const firstPoint = transformPoint(firstVertex, insertionPoint, scale, rotationDeg, yFlip);
          pathPoints.push(firstPoint);
        }

        // Process each segment
        for (let i = 0; i < entity.vertices.length - 1; i++) {
          const v1 = entity.vertices[i];
          const v2 = entity.vertices[i + 1];
          if (!v1 || !v2) {
            continue;
          }

          const p1 = transformPoint(v1, insertionPoint, scale, rotationDeg, yFlip);
          const p2 = transformPoint(v2, insertionPoint, scale, rotationDeg, yFlip);

          if (v1.bulge && Math.abs(v1.bulge) > 0.0001) {
            const arcPoints = bulgeToArcPoints(p1, p2, v1.bulge, 16); // More segments for smoother curves
            pathPoints.push(...arcPoints.slice(1)); // Skip first point to avoid duplicates (already in pathPoints)
          } else {
            pathPoints.push(p2);
          }
        }

        // Handle closed polylines - need to process the segment from last vertex back to first
        if (entity.closed && entity.vertices.length > 2) {
          const lastVertex = entity.vertices[entity.vertices.length - 1];
          const firstVertex = entity.vertices[0];
          if (lastVertex && firstVertex) {
            const pLast = transformPoint(lastVertex, insertionPoint, scale, rotationDeg, yFlip);
            const pFirst = transformPoint(firstVertex, insertionPoint, scale, rotationDeg, yFlip);

            if (lastVertex.bulge && Math.abs(lastVertex.bulge) > 0.0001) {
              const arcPoints = bulgeToArcPoints(pLast, pFirst, lastVertex.bulge, 16);
              // Don't add the last point (pFirst) as it's the same as the first point
              pathPoints.push(...arcPoints.slice(1, -1));
            }
          }
        }

        // Flatten points array
        const flatPoints = pathPoints.flat();
        return {
          type: 'line',
          points: flatPoints,
          stroke: color,
          strokeWidth: 1,
          closed: entity.closed || false,
        };
      } else {
        // Simple polyline without bulges
        for (const vertex of entity.vertices) {
          const point = transformPoint(vertex, insertionPoint, scale, rotationDeg, yFlip);
          points.push(point[0], point[1]);
        }

        return {
          type: 'line',
          points: points,
          stroke: color,
          strokeWidth: 1,
          closed: entity.closed || false,
        };
      }
    }

    case 'SPLINE': {
      // Convert SPLINE to a smooth curve using control points or fit points
      const controlPoints = entity.controlPoints || entity.fitPoints;
      if (!controlPoints || controlPoints.length < 2) {
        return null;
      }

      // For simple splines, use control points to create a smooth path
      // Convert to SVG path with quadratic/cubic bezier curves
      if (controlPoints.length === 2) {
        // Simple line
        const p0 = controlPoints[0];
        const p1 = controlPoints[1];
        if (!p0 || !p1) {
          return null;
        }
        const p1Transformed = transformPoint(p0, insertionPoint, scale, rotationDeg, yFlip);
        const p2Transformed = transformPoint(p1, insertionPoint, scale, rotationDeg, yFlip);
        return {
          type: 'line',
          points: [p1Transformed[0], p1Transformed[1], p2Transformed[0], p2Transformed[1]],
          stroke: color,
          strokeWidth: 1,
        };
      } else if (controlPoints.length === 3) {
        // Quadratic bezier
        const p0 = controlPoints[0];
        const p1 = controlPoints[1];
        const p2 = controlPoints[2];
        if (!p0 || !p1 || !p2) {
          return null;
        }
        const p1Transformed = transformPoint(p0, insertionPoint, scale, rotationDeg, yFlip);
        const p2Transformed = transformPoint(p1, insertionPoint, scale, rotationDeg, yFlip);
        const p3Transformed = transformPoint(p2, insertionPoint, scale, rotationDeg, yFlip);
        const pathData = `M ${p1Transformed[0]} ${p1Transformed[1]} Q ${p2Transformed[0]} ${p2Transformed[1]} ${p3Transformed[0]} ${p3Transformed[1]}`;
        return {
          type: 'path',
          data: pathData,
          stroke: color,
          strokeWidth: 1,
        };
      } else {
        // Multiple control points - create smooth path using cubic bezier
        const pathPoints: string[] = [];
        for (let i = 0; i < controlPoints.length; i++) {
          const point = controlPoints[i];
          if (!point) {
            continue;
          }
          const transformedPoint = transformPoint(point, insertionPoint, scale, rotationDeg, yFlip);
          if (i === 0) {
            pathPoints.push(`M ${transformedPoint[0]} ${transformedPoint[1]}`);
          } else if (i === 1 && controlPoints[i + 1]) {
            // First control point
            const nextPoint = controlPoints[i + 1];
            if (nextPoint) {
              const nextTransformed = transformPoint(nextPoint, insertionPoint, scale, rotationDeg, yFlip);
              pathPoints.push(`Q ${transformedPoint[0]} ${transformedPoint[1]} ${nextTransformed[0]} ${nextTransformed[1]}`);
              i++; // Skip next point as it's the end of this curve
            }
          } else if (i < controlPoints.length - 1) {
            // Middle points - use cubic bezier
            const nextPoint = controlPoints[i + 1];
            const endPoint = controlPoints[Math.min(i + 2, controlPoints.length - 1)];
            if (nextPoint && endPoint) {
              const nextTransformed = transformPoint(nextPoint, insertionPoint, scale, rotationDeg, yFlip);
              const endTransformed = transformPoint(endPoint, insertionPoint, scale, rotationDeg, yFlip);
              pathPoints.push(`C ${transformedPoint[0]} ${transformedPoint[1]} ${nextTransformed[0]} ${nextTransformed[1]} ${endTransformed[0]} ${endTransformed[1]}`);
              i += 2; // Skip processed points
            }
          }
        }
        return {
          type: 'path',
          data: pathPoints.join(' '),
          stroke: color,
          strokeWidth: 1,
        };
      }
    }

    case 'ELLIPSE': {
      if (!entity.center || !entity.majorAxisEndPoint || entity.axisRatio === undefined) {
        return null;
      }

      const center = transformPoint(entity.center, insertionPoint, scale, rotationDeg, yFlip);
      const majorEnd = transformPoint(entity.majorAxisEndPoint, insertionPoint, scale, rotationDeg, yFlip);

      // Calculate major and minor radii (before transformation)
      const majorRadius = Math.sqrt(
        Math.pow(entity.majorAxisEndPoint.x - entity.center.x, 2) +
        Math.pow(entity.majorAxisEndPoint.y - entity.center.y, 2)
      ) * scale;
      const minorRadius = majorRadius * entity.axisRatio;

      // Calculate rotation angle of ellipse (in canvas coordinates)
      const angle = Math.atan2(majorEnd[1] - center[1], majorEnd[0] - center[0]);

      // Create ellipse as SVG path
      const startParam = entity.startParameter !== undefined ? entity.startParameter : 0;
      const endParam = entity.endParameter !== undefined ? entity.endParameter : Math.PI * 2;

      // Sample ellipse points
      const segments = 64;
      const pathPoints: string[] = [];
      for (let i = 0; i <= segments; i++) {
        const t = startParam + (endParam - startParam) * (i / segments);
        const x = center[0] + majorRadius * Math.cos(t) * Math.cos(angle) - minorRadius * Math.sin(t) * Math.sin(angle);
        const y = center[1] + majorRadius * Math.cos(t) * Math.sin(angle) + minorRadius * Math.sin(t) * Math.cos(angle);
        if (i === 0) {
          pathPoints.push(`M ${x} ${y}`);
        } else {
          pathPoints.push(`L ${x} ${y}`);
        }
      }

      return {
        type: 'path',
        data: pathPoints.join(' '),
        stroke: color,
        strokeWidth: 1,
      };
    }

    case 'SOLID':
    case '3DFACE': {
      // SOLID and 3DFACE entities define filled shapes with corner points
      // They typically have points defined as 'vertices' or individual point properties
      const vertices = (entity as any).vertices || [];

      // Try to extract vertices from individual point properties if vertices array is empty
      if (vertices.length === 0 && (entity as any).points) {
        const points = (entity as any).points;
        if (Array.isArray(points)) {
          vertices.push(...points);
        }
      }

      if (vertices.length < 3) {
        // SOLID/3DFACE entities must have at least 3 corners
        return null;
      }

      const points: number[] = [];
      for (const vertex of vertices) {
        if (vertex && typeof vertex === 'object' && 'x' in vertex && 'y' in vertex) {
          const point = transformPoint(vertex, insertionPoint, scale, rotationDeg, yFlip);
          points.push(point[0], point[1]);
        }
      }

      if (points.length >= 6) {
        return {
          type: 'line',
          points: points,
          stroke: color,
          strokeWidth: 1,
          closed: true,
        };
      }
      return null;
    }

    case 'HATCH': {
      // HATCH entities define filled/hatched regions
      // For now, we'll render the boundary as a closed polyline
      const boundary = (entity as any).boundary || (entity as any).boundaries?.[0];
      if (!boundary || !boundary.vertices || boundary.vertices.length < 3) {
        return null;
      }

      const points: number[] = [];
      for (const vertex of boundary.vertices) {
        if (vertex && typeof vertex === 'object' && 'x' in vertex && 'y' in vertex) {
          const point = transformPoint(vertex, insertionPoint, scale, rotationDeg, yFlip);
          points.push(point[0], point[1]);
        }
      }

      if (points.length >= 6) {
        return {
          type: 'line',
          points: points,
          stroke: color,
          strokeWidth: 1,
          closed: true,
        };
      }
      return null;
    }

    case 'POINT': {
      // POINT entities - render as small circles
      const position = (entity as any).position || { x: (entity as any).x, y: (entity as any).y };
      if (!position || position.x === undefined || position.y === undefined) {
        return null;
      }

      const center = transformPoint(position, insertionPoint, scale, rotationDeg, yFlip);
      return {
        type: 'circle',
        x: center[0],
        y: center[1],
        radius: 2 * scale, // Small fixed size
        stroke: color,
        strokeWidth: 1,
        fill: color,
      };
    }

    case 'TEXT':
    case 'MTEXT': {
      // TEXT entities - we'll skip these for now as rendering text accurately is complex
      // Would need font loading, text measurement, etc.
      // Just log that we're skipping them
      return null;
    }

    case 'DIMENSION':
    case 'LEADER':
    case 'MLINE': {
      // Complex annotation entities - skip for now
      return null;
    }

    case 'INSERT': {
      // INSERT entities should be handled at a higher level
      // Don't try to convert them directly
      return null;
    }

    default:
      // Unsupported entity type - log for debugging
      if (entity.type) {
        console.warn(`[DXF] Unsupported entity type: ${entity.type}`);
      }
      return null;
  }
}

/**
 * Process DXF block definitions into reusable Konva group data
 */
function processDXFBlocks(
  dxfData: DXFData,
  yFlip: boolean
): Map<string, KonvaGroupData> {
  const blockMap = new Map<string, KonvaGroupData>();

  if (!dxfData.blocks || dxfData.blocks.length === 0) {
    return blockMap;
  }

  console.log('[DXF Blocks] Processing', dxfData.blocks.length, 'block definitions');

  for (const block of dxfData.blocks) {
    const shapes: KonvaShapeData[] = [];
    // Use [0,0] as base point - blocks are defined relative to their own origin
    // The INSERT entity will position the block correctly
    const basePoint: Point = [0, 0];

    let successCount = 0;
    let failCount = 0;

    for (const entity of block.entities) {
      // IMPORTANT: Pass yFlip=true to properly handle coordinate system
      // Blocks need Y-flipping just like regular entities
      const shape = convertDXFEntityToKonvaData(entity, basePoint, 1, 0, yFlip);
      if (shape) {
        shapes.push(shape);
        successCount++;
      } else {
        failCount++;
      }
    }

    if (shapes.length > 0) {
      blockMap.set(block.name, {
        id: `block-${block.name}`,
        name: block.name,
        shapes,
        x: 0,
        y: 0,
        rotation: 0,
        scaleX: 1,
        scaleY: 1,
      });
      console.log(`[DXF Blocks] Processed block "${block.name}": ${successCount} shapes created, ${failCount} entities skipped`);
    } else {
      console.warn(`[DXF Blocks] Block "${block.name}" has no renderable shapes (${failCount} entities failed)`);
    }
  }

  console.log('[DXF Blocks] Total blocks processed:', blockMap.size);
  return blockMap;
}

/**
 * Generate unique ID for shapes/blocks
 */
function generateId(prefix: string = 'dxf'): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * Bounding box interface
 */
interface BoundingBox {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

/**
 * Calculate bounding box for a single DXF entity
 */
function getEntityBounds(entity: DXFEntity): BoundingBox | null {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  const updateBounds = (x: number, y: number) => {
    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x);
    maxY = Math.max(maxY, y);
  };

  switch (entity.type) {
    case 'LINE': {
      if (!entity.start || !entity.end) {
        return null;
      }
      updateBounds(entity.start.x, entity.start.y);
      updateBounds(entity.end.x, entity.end.y);
      break;
    }

    case 'CIRCLE': {
      let centerX: number, centerY: number, radius: number;
      if (entity.center && entity.radius !== undefined) {
        centerX = entity.center.x;
        centerY = entity.center.y;
        radius = entity.radius;
      } else if (entity.x !== undefined && entity.y !== undefined && entity.r !== undefined) {
        centerX = entity.x;
        centerY = entity.y;
        radius = entity.r;
      } else {
        return null;
      }
      updateBounds(centerX - radius, centerY - radius);
      updateBounds(centerX + radius, centerY + radius);
      break;
    }

    case 'ARC': {
      if (
        entity.x === undefined ||
        entity.y === undefined ||
        entity.r === undefined ||
        entity.startAngle === undefined ||
        entity.endAngle === undefined
      ) {
        return null;
      }

      // Sample arc points to get accurate bounds
      const segments = 16;
      const startRad = entity.startAngle;
      let endRad = entity.endAngle;
      if (endRad < startRad) {
        endRad += 2 * Math.PI;
      }

      for (let i = 0; i <= segments; i++) {
        const t = i / segments;
        const angle = startRad + (endRad - startRad) * t;
        const x = entity.x + entity.r * Math.cos(angle);
        const y = entity.y + entity.r * Math.sin(angle);
        updateBounds(x, y);
      }
      break;
    }

    case 'POLYLINE':
    case 'LWPOLYLINE': {
      if (!entity.vertices || entity.vertices.length < 1) {
        return null;
      }
      for (const vertex of entity.vertices) {
        updateBounds(vertex.x, vertex.y);
        // For bulges, we approximate by including the vertices
        // A more accurate calculation would trace the arc, but this is sufficient for bounds
      }
      break;
    }

    case 'SPLINE': {
      const controlPoints = entity.controlPoints || entity.fitPoints;
      if (!controlPoints || controlPoints.length < 1) {
        return null;
      }
      for (const point of controlPoints) {
        updateBounds(point.x, point.y);
      }
      break;
    }

    case 'ELLIPSE': {
      if (!entity.center || !entity.majorAxisEndPoint || entity.axisRatio === undefined) {
        return null;
      }

      const majorRadius = Math.sqrt(
        Math.pow(entity.majorAxisEndPoint.x - entity.center.x, 2) +
        Math.pow(entity.majorAxisEndPoint.y - entity.center.y, 2)
      );
      const minorRadius = majorRadius * entity.axisRatio;
      const maxRadius = Math.max(majorRadius, minorRadius);

      // Approximate bounds using max radius
      updateBounds(entity.center.x - maxRadius, entity.center.y - maxRadius);
      updateBounds(entity.center.x + maxRadius, entity.center.y + maxRadius);
      break;
    }

    case 'SOLID':
    case '3DFACE': {
      const vertices = (entity as any).vertices || [];
      if (vertices.length > 0) {
        for (const vertex of vertices) {
          if (vertex && typeof vertex === 'object' && 'x' in vertex && 'y' in vertex) {
            updateBounds(vertex.x, vertex.y);
          }
        }
      }
      break;
    }

    case 'HATCH': {
      const boundary = (entity as any).boundary || (entity as any).boundaries?.[0];
      if (boundary && boundary.vertices) {
        for (const vertex of boundary.vertices) {
          if (vertex && typeof vertex === 'object' && 'x' in vertex && 'y' in vertex) {
            updateBounds(vertex.x, vertex.y);
          }
        }
      }
      break;
    }

    case 'POINT': {
      const position = (entity as any).position || { x: (entity as any).x, y: (entity as any).y };
      if (position && position.x !== undefined && position.y !== undefined) {
        updateBounds(position.x, position.y);
      }
      break;
    }

    case 'INSERT': {
      // Skip INSERT entities for bounds calculation
      // They will be handled separately if needed
      return null;
    }

    case 'TEXT':
    case 'MTEXT':
    case 'DIMENSION':
    case 'LEADER':
    case 'MLINE': {
      // Skip annotation entities for bounds calculation
      return null;
    }

    default:
      return null;
  }

  if (minX === Infinity || minY === Infinity || maxX === -Infinity || maxY === -Infinity) {
    return null;
  }

  return { minX, minY, maxX, maxY };
}

/**
 * Calculate bounding box for all entities in DXF data
 */
function calculateDXFBounds(dxfData: DXFData): BoundingBox | null {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  if (!dxfData.entities || dxfData.entities.length === 0) {
    return null;
  }

  for (const entity of dxfData.entities) {
    const bounds = getEntityBounds(entity);
    if (bounds) {
      minX = Math.min(minX, bounds.minX);
      minY = Math.min(minY, bounds.minY);
      maxX = Math.max(maxX, bounds.maxX);
      maxY = Math.max(maxY, bounds.maxY);
    }
  }

  if (minX === Infinity || minY === Infinity || maxX === -Infinity || maxY === -Infinity) {
    return null;
  }

  return { minX, minY, maxX, maxY };
}

/**
 * Parse DXF file content
 */
export async function parseDXFFile(file: File): Promise<DXFData> {
  // Ensure we're in the browser environment
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('DXF parsing is only available in the browser'));
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const dxfContent = event.target?.result as string;
        if (!dxfContent) {
          reject(new Error('Failed to read DXF file'));
          return;
        }

        // Dynamically import dxf package to avoid SSR issues
        // Only import in browser environment
        if (typeof window === 'undefined') {
          reject(new Error('DXF parsing is only available in the browser'));
          return;
        }

        const dxfModule = await import('dxf');
        const Helper = (dxfModule as any).Helper || (dxfModule as any).default?.Helper;
        
        if (!Helper) {
          reject(new Error('Failed to import DXF Helper class'));
          return;
        }

        const helper = new Helper(dxfContent);
        const parsed = helper.parsed; // This triggers parse() if needed
        const denormalised = helper.denormalised; // This triggers denormalise() if needed

        if (!parsed) {
          reject(new Error('Failed to parse DXF file - file may be invalid or empty'));
          return;
        }

        // Debug: Log the structure to understand what we're working with
        console.log('[DXF Debug] Parsed structure:', {
          hasEntities: !!parsed.entities,
          entityCount: parsed.entities?.length || 0,
          hasBlocks: !!parsed.blocks,
          blockCount: parsed.blocks?.length || 0,
          denormalisedKeys: denormalised ? Object.keys(denormalised) : [],
        });

        // The dxf package structure: parsed contains entities and blocks directly
        // denormalised might have a different structure
        const entities = parsed.entities || [];
        const blocks = parsed.blocks || [];

        // If denormalised exists and has entities/blocks, use those
        let finalEntities = entities;
        let finalBlocks = blocks;

        if (denormalised) {
          // Check if denormalised has entities/blocks in a different structure
          if (denormalised.entities && Array.isArray(denormalised.entities)) {
            finalEntities = denormalised.entities;
          }
          if (denormalised.blocks && Array.isArray(denormalised.blocks)) {
            finalBlocks = denormalised.blocks;
          }
        }

        console.log('[DXF Debug] Final counts:', {
          entities: finalEntities.length,
          blocks: finalBlocks.length,
          entityTypes: finalEntities.map((e: any) => e.type).filter((v: any, i: number, a: any[]) => a.indexOf(v) === i),
        });

        const dxfData: DXFData = {
          entities: finalEntities,
          blocks: finalBlocks,
          header: parsed.header,
        };

        resolve(dxfData);
      } catch (error) {
        reject(error instanceof Error ? error : new Error('Unknown error parsing DXF file'));
      }
    };
    reader.onerror = () => {
      reject(new Error('Failed to read DXF file'));
    };
    reader.readAsText(file);
  });
}

/**
 * Fetch and parse DXF file from URL
 */
export async function parseDXFFromURL(url: string): Promise<DXFData> {
  // Ensure we're in the browser environment
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('DXF parsing is only available in the browser'));
  }

  try {
    // Use proxy API to fetch DXF file (bypasses CORS issues)
    const proxyUrl = `/api/cad-blocks/dxf?url=${encodeURIComponent(url)}`;
    const response = await fetch(proxyUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch DXF file: ${response.statusText}`);
    }

    const dxfContent = await response.text();
    if (!dxfContent) {
      throw new Error('Failed to read DXF file content');
    }

    // Dynamically import dxf package to avoid SSR issues
    const dxfModule = await import('dxf');
    const Helper = (dxfModule as any).Helper || (dxfModule as any).default?.Helper;

    if (!Helper) {
      throw new Error('Failed to import DXF Helper class');
    }

    const helper = new Helper(dxfContent);
    const parsed = helper.parsed;
    const denormalised = helper.denormalised;

    if (!parsed) {
      throw new Error('Failed to parse DXF file - file may be invalid or empty');
    }

    console.log('[DXF Debug] Parsed structure from URL:', {
      hasEntities: !!parsed.entities,
      entityCount: parsed.entities?.length || 0,
      hasBlocks: !!parsed.blocks,
      blockCount: parsed.blocks?.length || 0,
      denormalisedKeys: denormalised ? Object.keys(denormalised) : [],
    });

    const entities = parsed.entities || [];
    const blocks = parsed.blocks || [];

    let finalEntities = entities;
    let finalBlocks = blocks;

    if (denormalised) {
      if (denormalised.entities && Array.isArray(denormalised.entities)) {
        finalEntities = denormalised.entities;
      }
      if (denormalised.blocks && Array.isArray(denormalised.blocks)) {
        finalBlocks = denormalised.blocks;
      }
    }

    console.log('[DXF Debug] Final counts from URL:', {
      entities: finalEntities.length,
      blocks: finalBlocks.length,
      entityTypes: finalEntities.map((e: any) => e.type).filter((v: any, i: number, a: any[]) => a.indexOf(v) === i),
    });

    const dxfData: DXFData = {
      entities: finalEntities,
      blocks: finalBlocks,
      header: parsed.header,
    };

    return dxfData;
  } catch (error) {
    throw error instanceof Error ? error : new Error('Unknown error parsing DXF file from URL');
  }
}

/**
 * Convert DXF data to Konva Groups
 * Main conversion function that processes entities and blocks
 * Automatically scales furniture to fit within 6000mm x 6000mm (6m x 6m)
 * Centers the DXF content at the insertion point (mouse click position)
 */
export function convertDXFToKonvaGroups(
  dxfData: DXFData,
  insertionPoint: Point,
  scale: number = 1,
  rotationDeg: number = 0,
  yFlip: boolean = true
): KonvaGroupData[] {
  const groups: KonvaGroupData[] = [];

  console.log('[DXF Convert] Starting conversion:', {
    entityCount: dxfData.entities?.length || 0,
    blockCount: dxfData.blocks?.length || 0,
    insertionPoint,
  });

  // STEP 1: Calculate bounding box of all DXF entities
  const bounds = calculateDXFBounds(dxfData);

  let autoScale = scale;
  let centerOffset: Point = [0, 0];

  if (bounds) {
    const width = bounds.maxX - bounds.minX;
    const height = bounds.maxY - bounds.minY;

    console.log('[DXF Convert] Original bounds:', {
      width: width.toFixed(2),
      height: height.toFixed(2),
      bounds,
    });

    // STEP 2: Calculate auto-scale to fit within 6000mm x 6000mm (6 meters)
    const maxDimension = Math.max(width, height);
    const maxAllowedSize = 6000; // 6 meters in mm

    if (maxDimension > maxAllowedSize) {
      autoScale = maxAllowedSize / maxDimension;
      console.log('[DXF Convert] Auto-scaling:', {
        originalMax: maxDimension.toFixed(2),
        scaleFactor: autoScale.toFixed(4),
        newMax: (maxDimension * autoScale).toFixed(2),
      });
    } else {
      // Even if smaller, we might want to normalize the scale
      // For now, keep original scale if smaller than max
      autoScale = scale;
    }

    // STEP 3: Calculate center of bounds in DXF coordinates
    const centerX = (bounds.minX + bounds.maxX) / 2;
    const centerY = (bounds.minY + bounds.maxY) / 2;

    // Apply Y-flip to center if needed
    const flippedCenterY = yFlip ? flipY(centerY) : centerY;

    // STEP 4: Calculate offset to center the DXF at insertion point
    // We need to subtract the scaled center from the insertion point
    centerOffset = [
      -(centerX * autoScale),
      -(flippedCenterY * autoScale)
    ];

    console.log('[DXF Convert] Centering:', {
      dxfCenter: { x: centerX.toFixed(2), y: centerY.toFixed(2) },
      centerOffset: centerOffset.map(v => v.toFixed(2)),
      finalInsertionPoint: [
        (insertionPoint[0] + centerOffset[0]).toFixed(2),
        (insertionPoint[1] + centerOffset[1]).toFixed(2)
      ],
    });
  }

  // Apply the auto-scale to the scale parameter
  const finalScale = autoScale;

  // Adjust insertion point to center the content
  const adjustedInsertionPoint: Point = [
    insertionPoint[0] + centerOffset[0],
    insertionPoint[1] + centerOffset[1]
  ];

  // First, process block definitions
  const blockMap = processDXFBlocks(dxfData, yFlip);
  console.log('[DXF Convert] Processed blocks:', blockMap.size);

  // Process INSERT entities (block references)
  let insertCount = 0;
  if (dxfData.entities) {
    for (const entity of dxfData.entities) {
      if (entity.type === 'INSERT' && entity.name) {
        insertCount++;
        const blockDefinition = blockMap.get(entity.name);
        if (blockDefinition) {
          // Create a new instance of the block
          const insertPoint: Point = entity.position
            ? transformPoint(entity.position, adjustedInsertionPoint, 1, 0, yFlip)
            : adjustedInsertionPoint;

          const instance: KonvaGroupData = {
            id: generateId('dxf-block'),
            name: entity.name,
            shapes: blockDefinition.shapes.map((shape) => ({ ...shape })), // Clone shapes
            x: insertPoint[0],
            y: insertPoint[1],
            rotation: entity.rotation || 0,
            scaleX: entity.xScale || 1,
            scaleY: entity.yScale || 1,
          };

          // Apply global scale and rotation to the instance
          instance.scaleX *= finalScale;
          instance.scaleY *= finalScale;
          instance.rotation += rotationDeg;

          groups.push(instance);
          console.log('[DXF Convert] Created block instance:', entity.name, 'with', blockDefinition.shapes.length, 'shapes');
        } else {
          console.warn(`[DXF Convert] Block definition not found: ${entity.name}`);
        }
      }
    }
  }

  console.log('[DXF Convert] Found', insertCount, 'INSERT entities');

  // If no INSERT entities found, create a single group from all entities
  if (groups.length === 0 && dxfData.entities) {
    console.log('[DXF Convert] No INSERT entities found, processing all entities directly');
    const shapes: KonvaShapeData[] = [];
    const entityStats: { [key: string]: { success: number; failed: number } } = {};

    for (const entity of dxfData.entities) {
      // Skip INSERT entities (already processed or should be handled by blocks)
      if (entity.type === 'INSERT') {
        continue;
      }

      // Initialize stats for this entity type
      if (!entityStats[entity.type]) {
        entityStats[entity.type] = { success: 0, failed: 0 };
      }

      const shape = convertDXFEntityToKonvaData(
        entity,
        adjustedInsertionPoint,
        finalScale,
        rotationDeg,
        yFlip
      );

      const stats = entityStats[entity.type];
      if (stats) { // Type guard
        if (shape) {
          shapes.push(shape);
          stats.success++;
        } else {
          stats.failed++;
        }
      }
    }

    // Log detailed statistics
    console.log('[DXF Convert] Entity conversion statistics:');
    const sortedTypes = Object.keys(entityStats).sort();
    for (const type of sortedTypes) {
      const stats = entityStats[type];
      if (!stats) continue; // Type guard for safety
      const total = stats.success + stats.failed;
      const successRate = total > 0 ? ((stats.success / total) * 100).toFixed(1) : '0.0';
      console.log(`  ${type}: ${stats.success}/${total} converted (${successRate}%), ${stats.failed} failed`);
    }

    const totalEntities = dxfData.entities.length;
    const totalConverted = shapes.length;
    const conversionRate = totalEntities > 0 ? ((totalConverted / totalEntities) * 100).toFixed(1) : '0.0';
    console.log(`[DXF Convert] Overall: ${totalConverted}/${totalEntities} entities converted (${conversionRate}%)`);

    if (shapes.length > 0) {
      groups.push({
        id: generateId('dxf-group'),
        name: 'DXF Import',
        shapes,
        x: adjustedInsertionPoint[0],
        y: adjustedInsertionPoint[1],
        rotation: rotationDeg,
        scaleX: finalScale,
        scaleY: finalScale,
      });
      console.log('[DXF Convert] ✅ Created group with', shapes.length, 'shapes');
    } else {
      console.warn('[DXF Convert] ⚠️  No shapes created - all entities failed conversion!');
    }
  }

  console.log('[DXF Convert] ✅ Final result:', groups.length, 'group(s) created');
  return groups;
}

