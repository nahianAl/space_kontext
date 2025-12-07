/**
 * DXF exporter for floor plan export
 * Exports walls, openings, shapes, furniture, and annotations to DXF format
 */

import Drawing from 'dxf-writer';
import type { getWallGraphStore } from '../store/wallGraphStore';
import { useLayerStore } from '../store/layerStore';
import { useShapesStore } from '../store/shapesStore';
import { useDXFBlocksStore } from '../store/dxfBlocksStore';
import { useAnnotationsStore } from '../store/annotationsStore';
import { calculateContentBounds, createDXFTransform, type ExportTransform } from '../utils/exportUtils';
import { metersToMillimeters, metersToPixels } from '@/lib/units/unitsSystem';
import type { ExportOptions } from '../types/export';
import type { Point, WallEdge, WallNode } from '../types/wallGraph';
import type { Shape, LineShape, CircleShape, SquareShape, PolylineShape, ZoneShape, TriangleShape, CurveShape } from '../types/shapes';
import type { Annotation, DimensionAnnotation, TextAnnotation, LeaderAnnotation } from '../types/annotations';
import type { DXFBlockInstance } from '../store/dxfBlocksStore';

type WallGraphStoreInstance = ReturnType<typeof getWallGraphStore>;

/**
 * Main DXF export function
 * Exports complete floor plan to DXF format
 */
export async function exportToDXF(
  options: ExportOptions,
  wallGraphStore: WallGraphStoreInstance
): Promise<Blob> {
  // 1. Calculate content bounds
  const bounds = calculateContentBounds(options, wallGraphStore);
  if (!bounds) {
    throw new Error('No content to export');
  }

  // 2. Create DXF drawing
  const dxf = new Drawing();
  dxf.setUnits('Millimeters');

  // 3. Create coordinate transform
  const transform = createDXFTransform(bounds);

  // 4. Export layers
  exportLayers(dxf);

  // 5. Create opening block definitions
  createOpeningBlocks(dxf);

  // 6. Export walls
  if (options.includeWalls) {
    exportWalls(dxf, transform, wallGraphStore);
  }

  // 7. Export openings
  if (options.includeOpenings) {
    exportOpenings(dxf, transform, wallGraphStore);
  }

  // 8. Export shapes
  if (options.includeShapes) {
    exportShapes(dxf, transform);
  }

  // 9. Export DXF blocks (furniture)
  if (options.includeFurniture) {
    exportDXFBlocks(dxf, transform);
  }

  // 10. Export annotations
  if (options.includeAnnotations) {
    exportAnnotations(dxf, transform);
  }

  // 11. Generate DXF string
  const dxfString = dxf.toDxfString();

  // 12. Create and return blob
  return new Blob([dxfString], { type: 'application/dxf' });
}

/**
 * Export layer definitions to DXF LAYER table
 */
function exportLayers(dxf: Drawing): void {
  const layers = useLayerStore.getState().layers;

  layers.forEach(layer => {
    // Convert hex color to AutoCAD Color Index (ACI)
    const colorIndex = hexToACI(layer.color);

    // Add layer to DXF
    dxf.addLayer(layer.name, colorIndex, 'CONTINUOUS');
  });
}

/**
 * Convert hex color to AutoCAD Color Index (ACI)
 * Maps common colors to standard ACI values
 */
function hexToACI(hexColor: string): number {
  const colorMap: Record<string, number> = {
    '#FF0000': Drawing.ACI.RED,      // 1 - Red
    '#FFFF00': Drawing.ACI.YELLOW,   // 2 - Yellow
    '#00FF00': Drawing.ACI.GREEN,    // 3 - Green
    '#00FFFF': Drawing.ACI.CYAN,     // 4 - Cyan
    '#0000FF': Drawing.ACI.BLUE,     // 5 - Blue
    '#FF00FF': Drawing.ACI.MAGENTA,  // 6 - Magenta
    '#FFFFFF': Drawing.ACI.WHITE,    // 7 - White/Black
    '#808080': 8,                     // 8 - Gray (ACI doesn't have GRAY constant)
    '#000000': Drawing.ACI.WHITE,     // Black (treated as white in AutoCAD)
  };

  return colorMap[hexColor.toUpperCase()] || Drawing.ACI.WHITE; // Default to white
}

/**
 * Export walls as LINE entities (centerlines)
 */
function exportWalls(
  dxf: Drawing,
  transform: ExportTransform,
  wallGraphStore: WallGraphStoreInstance
): void {
  const graph = wallGraphStore.getState().graph;

  Object.values(graph.edges).forEach(wall => {
    const startNode = graph.nodes[wall.startNodeId];
    const endNode = graph.nodes[wall.endNodeId];

    if (!startNode || !endNode) {
      return;
    }

    // Transform points to DXF coordinates
    const p1 = transform.transformPoint(startNode.position);
    const p2 = transform.transformPoint(endNode.position);

    // Get layer name
    const layerName = wall.layer || 'Default';

    // Set active layer
    dxf.setActiveLayer(layerName);

    // Draw centerline
    dxf.drawLine(p1[0], p1[1], p2[0], p2[1]);

    // OPTIONAL: Also export wall polygons for filled representation
    exportWallPolygon(dxf, wall, startNode, endNode, transform);
  });
}

/**
 * Export wall as filled polygon (LWPOLYLINE)
 * This provides visual representation of wall thickness
 */
function exportWallPolygon(
  dxf: Drawing,
  wall: WallEdge,
  startNode: WallNode,
  endNode: WallNode,
  transform: ExportTransform
): void {
  // Calculate wall polygon vertices
  const thicknessPixels = metersToPixels(wall.thickness);
  const halfThickness = thicknessPixels / 2;

  // Get perpendicular vector
  const dx = endNode.position[0] - startNode.position[0];
  const dy = endNode.position[1] - startNode.position[1];
  const length = Math.sqrt(dx * dx + dy * dy);
  const perpX = -dy / length;
  const perpY = dx / length;

  // Calculate 4 corners
  const corners: Point[] = [
    [
      startNode.position[0] + perpX * halfThickness,
      startNode.position[1] + perpY * halfThickness
    ],
    [
      endNode.position[0] + perpX * halfThickness,
      endNode.position[1] + perpY * halfThickness
    ],
    [
      endNode.position[0] - perpX * halfThickness,
      endNode.position[1] - perpY * halfThickness
    ],
    [
      startNode.position[0] - perpX * halfThickness,
      startNode.position[1] - perpY * halfThickness
    ]
  ];

  // Transform corners to DXF coordinates
  const dxfCorners = corners.map(corner => transform.transformPoint(corner));

  // Draw LWPOLYLINE (closed) - dxf-writer uses drawPolyline
  // dxfCorners is already Point2D[] format, no need to flatten
  dxf.drawPolyline(dxfCorners, true); // true = closed
}

/**
 * Create standard opening block definitions
 * These are reusable symbols for doors and windows
 */
function createOpeningBlocks(dxf: Drawing): void {
  // Door block (1000mm base width, 90-degree swing)
  // @ts-expect-error - addBlock exists at runtime but not in type definitions
  dxf.addBlock('DOOR_SWING');

  // Door frame (vertical lines at edges)
  dxf.drawLine(0, 0, 0, 100);       // Left jamb
  dxf.drawLine(1000, 0, 1000, 100); // Right jamb

  // Door panel (arc for swing) - 90-degree arc from 0 to 90
  dxf.drawArc(0, 0, 1000, 0, 90);   // Center at (0,0), radius 1000, from 0 to 90 degrees

  // Door thickness line
  dxf.drawLine(0, 0, 1000, 0);      // Bottom edge

  // @ts-expect-error - endBlock exists at runtime but not in type definitions
  dxf.endBlock();

  // Window block (1000mm base width, double-line representation)
  // @ts-expect-error - addBlock exists at runtime but not in type definitions
  dxf.addBlock('WINDOW');

  // Window frame (rectangles)
  dxf.drawLine(0, -50, 0, 50);        // Left jamb
  dxf.drawLine(1000, -50, 1000, 50);  // Right jamb
  dxf.drawLine(0, -50, 1000, -50);    // Top
  dxf.drawLine(0, 50, 1000, 50);      // Bottom

  // Glass lines
  dxf.drawLine(0, -25, 1000, -25);
  dxf.drawLine(0, 25, 1000, 25);

  // @ts-expect-error - endBlock exists at runtime but not in type definitions
  dxf.endBlock();
}

/**
 * Export opening instances as INSERT entities
 */
function exportOpenings(
  dxf: Drawing,
  transform: ExportTransform,
  wallGraphStore: WallGraphStoreInstance
): void {
  const graph = wallGraphStore.getState().graph;

  Object.values(graph.edges).forEach(wall => {
    const startNode = graph.nodes[wall.startNodeId];
    const endNode = graph.nodes[wall.endNodeId];

    if (!startNode || !endNode) {
      return;
    }

    wall.openings.forEach(opening => {
      // Calculate opening center position
      const t = opening.position / wall.length; // Normalized position (0-1)
      const centerX = startNode.position[0] + (endNode.position[0] - startNode.position[0]) * t;
      const centerY = startNode.position[1] + (endNode.position[1] - startNode.position[1]) * t;

      // Transform to DXF coordinates
      const insertPoint = transform.transformPoint([centerX, centerY]);

      // Calculate rotation angle (in degrees for DXF)
      const angleDeg = wall.angle * (180 / Math.PI);

      // Calculate scale factor (opening width / block base width)
      const openingWidthMM = metersToMillimeters(opening.width);
      const scaleX = openingWidthMM / 1000; // Block base is 1000mm
      const scaleY = 1; // Keep Y scale uniform

      // Get layer name
      const layerName = opening.layerId || wall.layer || 'Default';
      dxf.setActiveLayer(layerName);

      // Insert block
      const blockName = opening.type === 'door' ? 'DOOR_SWING' : 'WINDOW';
      // @ts-expect-error - drawInsert exists at runtime but not in type definitions
      dxf.drawInsert(
        blockName,
        insertPoint[0],
        insertPoint[1],
        scaleX,
        scaleY,
        angleDeg
      );
    });
  });
}

/**
 * Export shapes to DXF entities
 */
function exportShapes(dxf: Drawing, transform: ExportTransform): void {
  const shapes = useShapesStore.getState().shapes;

  shapes.forEach(shape => {
    const layerName = shape.layerId || 'Default';
    dxf.setActiveLayer(layerName);

    switch (shape.type) {
      case 'line':
      case 'arrow':
      case 'guide-line': {
        const s = shape as LineShape;
        const p1 = transform.transformPoint(s.start);
        const p2 = transform.transformPoint(s.end);
        dxf.drawLine(p1[0], p1[1], p2[0], p2[1]);

        // For arrows, add arrowhead (optional enhancement - could be added later)
        break;
      }

      case 'circle': {
        const s = shape as CircleShape;
        const center = transform.transformPoint(s.center);
        const radiusMM = transform.toExportUnits(s.radius);
        dxf.drawCircle(center[0], center[1], radiusMM);
        break;
      }

      case 'square': {
        const s = shape as SquareShape;
        const center = transform.transformPoint(s.center);
        const widthMM = transform.toExportUnits(s.width);
        const heightMM = transform.toExportUnits(s.height);

        // Calculate rectangle corners
        const halfW = widthMM / 2;
        const halfH = heightMM / 2;
        let corners: number[] = [
          center[0] - halfW, center[1] - halfH,
          center[0] + halfW, center[1] - halfH,
          center[0] + halfW, center[1] + halfH,
          center[0] - halfW, center[1] + halfH
        ];

        // Apply rotation if present
        if (s.rotation) {
          const cos = Math.cos(s.rotation);
          const sin = Math.sin(s.rotation);
          const rotatedCorners: number[] = [];
          for (let i = 0; i < corners.length; i += 2) {
            const dx = corners[i]! - center[0];
            const dy = corners[i + 1]! - center[1];
            rotatedCorners.push(center[0] + dx * cos - dy * sin);
            rotatedCorners.push(center[1] + dx * sin + dy * cos);
          }
          corners = rotatedCorners;
        }

        // Convert flat array to Point2D[] format
        const point2DCorners: [number, number][] = [];
        for (let i = 0; i < corners.length; i += 2) {
          point2DCorners.push([corners[i]!, corners[i + 1]!]);
        }

        dxf.drawPolyline(point2DCorners, true); // true = closed
        break;
      }

      case 'polyline':
      case 'zone': {
        const s = shape as PolylineShape | ZoneShape;
        const points = s.points.map(p => transform.transformPoint(p));
        // points is already Point2D[] format, no need to flatten
        const closed = shape.type === 'zone';
        dxf.drawPolyline(points, closed);
        break;
      }

      case 'triangle': {
        const s = shape as TriangleShape;
        const points = [s.point1, s.point2, s.point3].map(p => transform.transformPoint(p));
        // points is already Point2D[] format, no need to flatten
        dxf.drawPolyline(points, true); // true = closed
        break;
      }

      case 'curve': {
        const s = shape as CurveShape;
        // Sample quadratic bezier curve into line segments
        const segments = 16;
        const curvePoints: [number, number][] = [];

        for (let i = 0; i <= segments; i++) {
          const t = i / segments;
          const x = (1-t)*(1-t)*s.start[0] + 2*(1-t)*t*s.control[0] + t*t*s.end[0];
          const y = (1-t)*(1-t)*s.start[1] + 2*(1-t)*t*s.control[1] + t*t*s.end[1];
          const transformed = transform.transformPoint([x, y]);
          curvePoints.push([transformed[0], transformed[1]]);
        }

        // Draw as polyline
        dxf.drawPolyline(curvePoints, false); // false = open
        break;
      }

      // Images are skipped in vector exports (no raster support in DXF)
      case 'image':
        console.warn('Image shapes cannot be exported to DXF (vector format)');
        break;
    }
  });
}

/**
 * Re-export imported furniture as DXF blocks
 * Preserves original block definitions and creates instances
 */
function exportDXFBlocks(dxf: Drawing, transform: ExportTransform): void {
  const blocks = useDXFBlocksStore.getState().blocks;

  // Group blocks by name to create unique definitions
  const blockDefinitions = new Map<string, DXFBlockInstance>();

  blocks.forEach(block => {
    // Create block definition once per unique name
    if (!blockDefinitions.has(block.blockName)) {
      // @ts-expect-error - addBlock exists at runtime but not in type definitions
      dxf.addBlock(block.blockName);

      // Draw shapes within block (relative to block origin)
      // Note: This is simplified - in reality, we'd need to traverse konvaGroupData.shapes
      // and convert each shape to DXF entities
      // For now, we'll create a placeholder or skip block content
      // TODO: Implement full block shape export

      // @ts-expect-error - endBlock exists at runtime but not in type definitions
  dxf.endBlock();
      blockDefinitions.set(block.blockName, block);
    }
  });

  // Insert block instances
  blocks.forEach(block => {
    const insertPoint = transform.transformPoint([block.x, block.y]);

    const layerName = 'Default'; // Or get layer from block if stored
    dxf.setActiveLayer(layerName);

    // @ts-expect-error - drawInsert exists at runtime but not in type definitions
    dxf.drawInsert(
      block.blockName,
      insertPoint[0],
      insertPoint[1],
      block.scaleX,
      block.scaleY,
      block.rotation
    );
  });
}

/**
 * Export annotations to DXF
 */
function exportAnnotations(dxf: Drawing, transform: ExportTransform): void {
  const annotations = Array.from(useAnnotationsStore.getState().annotations.values());

  annotations.forEach(annotation => {
    const layerName = annotation.layer || 'Annotations';
    dxf.setActiveLayer(layerName);

    switch (annotation.type) {
      case 'dimension': {
        const dim = annotation as DimensionAnnotation;
        const p1 = transform.transformPoint(dim.startPoint);
        const p2 = transform.transformPoint(dim.endPoint);

        // Draw dimension lines and text
        // Note: dxf-writer may not have a direct drawDimension method
        // We'll draw as lines + text for now
        dxf.drawLine(p1[0], p1[1], p2[0], p2[1]);
        
        // Draw dimension text (simplified)
        const midX = (p1[0] + p2[0]) / 2;
        const midY = (p1[1] + p2[1]) / 2;
        const distance = Math.sqrt(Math.pow(p2[0] - p1[0], 2) + Math.pow(p2[1] - p1[1], 2));
        dxf.drawText(midX, midY, 10, 0, distance.toFixed(2));
        break;
      }

      case 'text': {
        const txt = annotation as TextAnnotation;
        const pos = transform.transformPoint(txt.position);

        // Use drawText for both single and multiline (dxf-writer may support multiline)
        dxf.drawText(
          pos[0],
          pos[1],
          txt.fontSize || 10,
          0, // rotation
          txt.content
        );
        break;
      }

      case 'leader': {
        const leader = annotation as LeaderAnnotation;
        const elemPt = transform.transformPoint(leader.elementPoint);
        const textPt = transform.transformPoint(leader.textPoint);

        // Draw leader line
        dxf.drawLine(elemPt[0], elemPt[1], textPt[0], textPt[1]);

        // Draw text at text point
        dxf.drawText(textPt[0], textPt[1], 12, 0, leader.text || '');
        break;
      }

      // Other annotation types can be added as needed
    }
  });
}

