/**
 * Shapes layer component rendering all drawing shapes (lines, circles, rectangles, etc.)
 * Handles shape creation, editing, selection, and transformation
 * Provides interactive editing with Konva Transformer for selected shapes
 */
'use client';

import React, { useRef, useEffect, useMemo, useState } from 'react';
import { Layer, Line, Circle, Rect, Transformer, Group, Image as KonvaImage, Text } from 'react-konva';
import { useShapesStore } from '../../store/shapesStore';
import { useLayerStore } from '../../store/layerStore';
import { useGroupStore } from '../../store/groupStore';
import { useFloorStoreContext } from '../../context/FloorStoreContext';
import { moveShapesInGroup } from '../../utils/groupUtils';
import { useWallGraphStoreContext } from '../../context/WallGraphStoreContext';
import { DEFAULT_LAYER_ID } from '../../types/layers';
import type { Shape, LineShape, PolylineShape, CircleShape, SquareShape, TriangleShape, ArrowShape, GuideLineShape, CurveShape, ImageShape, ZoneShape } from '../../types/shapes';
import type { Zone } from '../../types/floor';
import type { Point } from '../../types/wallGraph';
import { calculatePolygonArea, calculatePolygonCentroid, formatArea } from '../../utils/dimensions';
import { getStrokeWidths } from '../../utils/strokeWeights';

interface ShapesLayerProps {
  scale: number;
}

const HIT_STROKE_WIDTH = 20;
const getHitWidth = (strokeWidth?: number, globalStrokeWidth?: number) => Math.max(HIT_STROKE_WIDTH, strokeWidth ?? globalStrokeWidth ?? 1);

// Helper function to draw arrow head on one end - returns two line segments (left and right)
const drawArrowHead = (start: Point, end: Point, isStart: boolean): { left: number[], right: number[] } | null => {
  const [x1, y1] = start;
  const [x2, y2] = end;
  
  // Calculate arrow direction
  const dx = x2 - x1;
  const dy = y2 - y1;
  const length = Math.sqrt(dx * dx + dy * dy);
  
  if (length === 0) {
    return null;
  }
  
  const unitX = dx / length;
  const unitY = dy / length;
  
  // Arrow head size - made smaller
  const arrowLength = 12;
  const arrowWidth = 6;
  
  // Determine tip position (start or end)
  const tipX = isStart ? x1 : x2;
  const tipY = isStart ? y1 : y2;
  
  // Arrow head base position
  const arrowX = isStart 
    ? x1 + unitX * arrowLength 
    : x2 - unitX * arrowLength;
  const arrowY = isStart 
    ? y1 + unitY * arrowLength 
    : y2 - unitY * arrowLength;
  
  // Perpendicular vector for arrow head width
  const perpX = -unitY * arrowWidth;
  const perpY = unitX * arrowWidth;
  
  // Return two line segments (left and right sides of the V)
  return {
    left: [tipX, tipY, arrowX + perpX, arrowY + perpY], // Left line: tip to left base
    right: [tipX, tipY, arrowX - perpX, arrowY - perpY] // Right line: tip to right base
  };
};

const degToRad = (degrees: number): number => (degrees * Math.PI) / 180;
const radToDeg = (radians: number): number => (radians * 180) / Math.PI;
const normalizeAngle = (angle: number): number => {
  let normalized = angle % 360;
  if (normalized > 180) {
    normalized -= 360;
  } else if (normalized <= -180) {
    normalized += 360;
  }
  return normalized;
};

// Calculate points for a quadratic bezier curve
// B(t) = (1-t)²P₀ + 2(1-t)tP₁ + t²P₂
const calculateBezierPoints = (start: Point, control: Point, end: Point, segments: number = 50): number[] => {
  const points: number[] = [];
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const x = (1 - t) * (1 - t) * start[0] + 2 * (1 - t) * t * control[0] + t * t * end[0];
    const y = (1 - t) * (1 - t) * start[1] + 2 * (1 - t) * t * control[1] + t * t * end[1];
    points.push(x, y);
  }
  return points;
};

const getSquareCorners = (square: SquareShape): [Point, Point, Point, Point] => {
  const rotation = degToRad(square.rotation ?? 0);
  const cos = Math.cos(rotation);
  const sin = Math.sin(rotation);
  const halfWidth = square.width / 2;
  const halfHeight = square.height / 2;

  const offsets: Point[] = [
    [-halfWidth, -halfHeight],
    [halfWidth, -halfHeight],
    [-halfWidth, halfHeight],
    [halfWidth, halfHeight]
  ];

  const corners = offsets.map(([dx, dy]) => {
    const rotatedX = cos * dx - sin * dy;
    const rotatedY = sin * dx + cos * dy;
    return [square.center[0] + rotatedX, square.center[1] + rotatedY] as Point;
  }) as [Point, Point, Point, Point];

  return corners;
};

// Image component that loads and renders images
const ImageShapeComponent: React.FC<{ shape: ImageShape; isSelected: boolean; onSelect: () => void }> = ({
  shape,
  isSelected,
  onSelect
}) => {
  // Check if shape's layer is locked
  const layerId = shape.layerId || DEFAULT_LAYER_ID;
  const layers = useLayerStore((state) => state.layers);
  const layer = layers.find(l => l.id === layerId);
  const isLocked = layer?.locked ?? false;

  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const imageRef = useRef<any>(null);
  const groupRef = useRef<any>(null);
  const transformerRef = useRef<any>(null);
  const updateShape = useShapesStore((state) => state.updateShape);

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => setImage(img);
    img.onerror = () => console.error('Failed to load image:', shape.imageUrl);
    img.src = shape.imageUrl;
  }, [shape.imageUrl]);

  useEffect(() => {
    if (isSelected && transformerRef.current && imageRef.current) {
      const layer = transformerRef.current.getLayer();
      if (layer) {
        transformerRef.current.nodes([imageRef.current]);
        transformerRef.current.getLayer()?.batchDraw();
      }
    } else if (transformerRef.current && !isSelected) {
      transformerRef.current.nodes([]);
    }
  }, [isSelected, shape.id]);

  const handleDragEnd = (e: any) => {
    const node = e.target;
    const newX = node.x();
    const newY = node.y();

    // Check if this shape is part of a group
    const getGroupByShapeId = useGroupStore.getState().getGroupByShapeId;
    const group = getGroupByShapeId(shape.id);

    if (group) {
      // Move all shapes in the group
      const shapes = useShapesStore.getState().shapes;
      const updatedShapes = moveShapesInGroup(shapes, group.shapeIds, [newX, newY]);

      // Update all shapes at once
      updatedShapes.forEach(updatedShape => {
        if (group.shapeIds.includes(updatedShape.id)) {
          updateShape(updatedShape.id, updatedShape);
        }
      });
    } else {
      // Update individual image shape
      updateShape(shape.id, {
        position: [shape.position[0] + newX, shape.position[1] + newY]
      } as Partial<Shape>);
    }

    node.position({ x: 0, y: 0 });
  };

  const handleTransformEnd = () => {
    const node = imageRef.current;
    if (!node) {
      return;
    }

    const groupNode = groupRef.current;
    // Get transform values directly from the node
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();
    const rotation = node.rotation();
    const x = node.x();
    const y = node.y();

    const newPosition: Point = [
      shape.position[0] + x,
      shape.position[1] + y
    ];
    const newScale = (shape.scale ?? 1) * Math.max(scaleX, scaleY);
    const newRotation = (shape.rotation ?? 0) + (rotation * Math.PI) / 180;

    updateShape(shape.id, {
      position: newPosition,
      scale: newScale,
      rotation: newRotation
    } as Partial<Shape>);

    node.position({ x: 0, y: 0 });
    node.scaleX(1);
    node.scaleY(1);
    node.rotation(0);
    if (groupNode) {
      groupNode.position({ x: 0, y: 0 });
    }
  };

  if (!image) {
    return null;
  }

  const width = shape.width ?? image.width;
  const height = shape.height ?? image.height;
  const scale = shape.scale ?? 1;

  // Note: Opacity is handled at the parent Group level in ShapesLayer
  return (
    <Group
      ref={groupRef}
      x={0}
      y={0}
      draggable={!isLocked}
      listening={!isLocked}
      onDragStart={(e) => {
        if (isLocked) {
          e.cancelBubble = true;
          return;
        }
        onSelect();
        e.cancelBubble = true;
      }}
      onDragEnd={handleDragEnd}
      onClick={(e) => {
        if (isLocked) {
          e.cancelBubble = true;
          return;
        }
        onSelect();
      }}
      onTap={(e) => {
        if (isLocked) {
          e.cancelBubble = true;
          return;
        }
        onSelect();
      }}
    >
      <KonvaImage
        ref={imageRef}
        image={image}
        x={shape.position[0]}
        y={shape.position[1]}
        width={width * scale}
        height={height * scale}
        rotation={shape.rotation ? (shape.rotation * 180) / Math.PI : 0}
        draggable={false}
        listening={!isLocked}
        onClick={(e) => {
          if (isLocked) {
            e.cancelBubble = true;
            return;
          }
          e.cancelBubble = true;
          onSelect();
        }}
        onTap={(e) => {
          if (isLocked) {
            e.cancelBubble = true;
            return;
          }
          e.cancelBubble = true;
          onSelect();
        }}
      />
      {isSelected && !isLocked && (
        <Transformer
          ref={transformerRef}
          boundBoxFunc={(oldBox, newBox) => {
            if (Math.abs(newBox.width) < 5 || Math.abs(newBox.height) < 5) {
              return oldBox;
            }
            return newBox;
          }}
          borderEnabled={true}
          borderStroke="#0f7787"
          borderStrokeWidth={2}
          anchorFill="#0f7787"
          anchorStroke="#0f7787"
          anchorSize={8}
          rotateEnabled={true}
          enabledAnchors={[
            'top-left', 'top-right', 'bottom-left', 'bottom-right',
            'top-center', 'bottom-center', 'middle-left', 'middle-right'
          ]}
          onTransformEnd={handleTransformEnd}
          onClick={(e) => {
            e.cancelBubble = true;
          }}
          onTap={(e) => {
            e.cancelBubble = true;
          }}
        />
      )}
    </Group>
  );
};

// Render a single zone from floorStore
const ZoneComponent: React.FC<{
  zone: Zone;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updates: Partial<Zone>) => void;
  unitSystem: 'imperial' | 'metric';
  strokeWidths: { shape: number };
  scale: number;
}> = ({ zone, isSelected, onSelect, onUpdate, unitSystem, strokeWidths, scale }) => {
  const points = zone.points.flat();
  const fillColor = zone.fill || '#808080';
  const fillOpacity = zone.fillOpacity ?? 0.5;

  // Load material texture if available
  const [materialImage, setMaterialImage] = React.useState<HTMLImageElement | null>(null);

  React.useEffect(() => {
    if (zone.material?.diffuse) {
      const img = new window.Image();
      img.src = zone.material.diffuse;
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        setMaterialImage(img);
      };
      img.onerror = () => {
        console.error('Failed to load material texture:', zone.material?.diffuse);
        setMaterialImage(null);
      };
    } else {
      setMaterialImage(null);
    }
  }, [zone.material?.diffuse]);

  // Calculate area and centroid for display
  const area = calculatePolygonArea(zone.points);
  const centroid = calculatePolygonCentroid(zone.points);

  // Format area using the unit system
  const areaText = area > 0 ? formatArea(area, unitSystem) : '';

  // Determine fill properties based on material or color
  const fillProps = materialImage
    ? {
        fillPatternImage: materialImage,
        fillPatternScale: { x: 0.5, y: 0.5 }, // Scale texture to reasonable size
        fillPatternRepeat: 'repeat' as const,
        opacity: fillOpacity
      }
    : {
        fill: fillColor,
        opacity: fillOpacity
      };

  return (
    <Group onClick={onSelect} onTap={onSelect}>
      <Line
        points={points}
        {...fillProps}
        closed
        stroke="#000000"
        strokeWidth={strokeWidths.shape}
        hitStrokeWidth={Math.max(20, strokeWidths.shape)}
      />
      {/* Label background box */}
      <Rect
        x={centroid[0]}
        y={centroid[1]}
        width={120 / scale}
        height={24 / scale}
        offsetX={60 / scale}
        offsetY={area > 0 ? (47 / scale) : (22 / scale)}
        fill="rgba(0, 0, 0, 0.7)"
        stroke={isSelected ? "#0f7787" : "#444444"}
        strokeWidth={(isSelected ? 2 : 1) / scale}
        cornerRadius={4 / scale}
        listening={false}
      />
      {/* Editable label text */}
      <Text
        x={centroid[0]}
        y={centroid[1]}
        text={zone.label || 'Click to edit'}
        fontSize={14 / scale}
        fill={zone.label ? "#ffffff" : "#888888"}
        align="center"
        verticalAlign="middle"
        width={120 / scale}
        offsetX={60 / scale}
        offsetY={area > 0 ? (42 / scale) : (17 / scale)}
        listening={true}
        onClick={(e) => {
          e.cancelBubble = true;
          // Create a temporary input for editing
          const stage = e.target.getStage();
          if (!stage) {
            return;
          }

          const textNode = e.target;
          const areaPosition = textNode.getAbsolutePosition();

          // Create textarea with dynamic scaling and updated styling
          const scaledFontSize = 14 / scale;
          const textarea = document.createElement('input');
          textarea.type = 'text';
          textarea.value = zone.label || '';
          textarea.style.position = 'absolute';
          textarea.style.top = `${areaPosition.y - 8 / scale}px`;
          textarea.style.left = `${areaPosition.x}px`;
          textarea.style.width = `${200 / scale}px`;
          textarea.style.fontSize = `${scaledFontSize}px`;
          textarea.style.border = 'none';
          textarea.style.padding = `${4 / scale}px ${8 / scale}px`;
          textarea.style.margin = '0px';
          textarea.style.overflow = 'hidden';
          textarea.style.background = 'transparent';
          textarea.style.color = 'white';
          textarea.style.outline = 'none';
          textarea.style.resize = 'none';
          textarea.style.transformOrigin = 'left top';
          textarea.style.textAlign = 'center';
          textarea.style.transform = `translateX(-50%)`;
          textarea.style.zIndex = '1000';
          textarea.style.borderRadius = '0px';

          const container = stage.container();
          container.appendChild(textarea);
          textarea.focus();
          textarea.select();

          let isRemoved = false;
          const removeTextarea = () => {
            if (isRemoved) {
              return;
            }
            isRemoved = true;
            try {
              if (textarea.parentNode) {
                textarea.parentNode.removeChild(textarea);
              }
            } catch (err) {
              // Ignore errors if already removed
            }
          };

          const handleKeydown = (e: KeyboardEvent) => {
            if (e.key === 'Enter') {
              onUpdate({ label: textarea.value });
              removeTextarea();
            } else if (e.key === 'Escape') {
              removeTextarea();
            }
          };

          const handleBlur = () => {
            onUpdate({ label: textarea.value });
            setTimeout(removeTextarea, 0);
          };

          textarea.addEventListener('keydown', handleKeydown);
          textarea.addEventListener('blur', handleBlur);
        }}
        onTap={(e) => {
          e.cancelBubble = true;
        }}
      />
      {/* Area text */}
      {area > 0 && (
        <Text
          x={centroid[0]}
          y={centroid[1]}
          text={areaText}
          fontSize={20 / scale}
          fill="#fc037b"
          align="center"
          verticalAlign="middle"
          offsetX={0}
          offsetY={10 / scale}
          listening={false}
        />
      )}
    </Group>
  );
};

// Render a single shape with selection support
const ShapeComponent: React.FC<{ 
  shape: Shape; 
  isSelected: boolean; 
  onSelect: () => void; 
  onTransform: (updates: Partial<Shape>) => void;
  unitSystem: 'imperial' | 'metric';
  strokeWidths: { shape: number };
}> = ({
  shape,
  isSelected,
  onSelect,
  onTransform,
  unitSystem,
  strokeWidths
}) => {
  // Hooks must be called unconditionally before any early returns
  const shapeRef = useRef<any>(null);
  const groupRef = useRef<any>(null);
  const transformerRef = useRef<any>(null);
  const updateShape = useShapesStore((state) => state.updateShape);

  // Check if shape's layer is locked
  const layerId = shape.layerId || DEFAULT_LAYER_ID;
  const layers = useLayerStore((state) => state.layers);
  const layer = layers.find(l => l.id === layerId);
  const isLocked = layer?.locked ?? false;

  // Handle image shapes separately (after hooks)
  if (shape.type === 'image') {
    return <ImageShapeComponent shape={shape as ImageShape} isSelected={isSelected} onSelect={onSelect} />;
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (isSelected && transformerRef.current && shapeRef.current) {
      // Attach transformer to the shape node
      const layer = transformerRef.current.getLayer();
      if (layer) {
        transformerRef.current.nodes([shapeRef.current]);
        transformerRef.current.getLayer()?.batchDraw();
      }
    } else if (transformerRef.current && !isSelected) {
      // Detach transformer when not selected
      transformerRef.current.nodes([]);
    }
  }, [isSelected, shape.id]); // Re-attach when shape changes (use shape.id to avoid unnecessary re-renders)
  
  // Force re-attach after shape updates to ensure Transformer stays connected
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (isSelected && transformerRef.current && shapeRef.current) {
      // Use requestAnimationFrame to ensure shape has fully re-rendered
      const rafId = requestAnimationFrame(() => {
        if (transformerRef.current && shapeRef.current) {
          transformerRef.current.nodes([shapeRef.current]);
          transformerRef.current.getLayer()?.batchDraw();
        }
      });
      return () => cancelAnimationFrame(rafId);
    }
    return undefined;
  }, [shape, isSelected]); // Re-attach when shape data changes

  const handleDragEnd = (e: any) => {
    const node = e.target;
    const newX = node.x();
    const newY = node.y();

    // The Group is positioned at 0,0, so the offset is just the new position
    const offsetX = newX;
    const offsetY = newY;

    // Check if this shape is part of a group
    const getGroupByShapeId = useGroupStore.getState().getGroupByShapeId;
    const group = getGroupByShapeId(shape.id);

    if (group) {
      // Move all shapes in the group
      const shapes = useShapesStore.getState().shapes;
      const updatedShapes = moveShapesInGroup(shapes, group.shapeIds, [offsetX, offsetY]);

      // Update all shapes at once
      updatedShapes.forEach(updatedShape => {
        if (group.shapeIds.includes(updatedShape.id)) {
          updateShape(updatedShape.id, updatedShape);
        }
      });
    } else {
      // Update individual shape based on type
      switch (shape.type) {
        case 'line': {
          const s = shape as LineShape;
          updateShape(shape.id, {
            start: [s.start[0] + offsetX, s.start[1] + offsetY],
            end: [s.end[0] + offsetX, s.end[1] + offsetY]
          } as Partial<Shape>);
          break;
        }
        case 'polyline': {
          const s = shape as PolylineShape;
          updateShape(shape.id, {
            points: s.points.map(p => [p[0] + offsetX, p[1] + offsetY] as Point)
          } as Partial<Shape>);
          break;
        }
        case 'zone': {
          // Zones are handled by floorStore
          break;
        }
        case 'circle': {
          const s = shape as CircleShape;
          updateShape(shape.id, {
            center: [s.center[0] + offsetX, s.center[1] + offsetY]
          } as Partial<Shape>);
          break;
        }
        case 'square': {
          const s = shape as SquareShape;
          updateShape(shape.id, {
            center: [s.center[0] + offsetX, s.center[1] + offsetY]
          } as Partial<Shape>);
          break;
        }
        case 'triangle': {
          const s = shape as TriangleShape;
          updateShape(shape.id, {
            point1: [s.point1[0] + offsetX, s.point1[1] + offsetY],
            point2: [s.point2[0] + offsetX, s.point2[1] + offsetY],
            point3: [s.point3[0] + offsetX, s.point3[1] + offsetY]
          } as Partial<Shape>);
          break;
        }
        case 'arrow':
        case 'guide-line': {
          const s = shape as ArrowShape | GuideLineShape;
          updateShape(shape.id, {
            start: [s.start[0] + offsetX, s.start[1] + offsetY],
            end: [s.end[0] + offsetX, s.end[1] + offsetY]
          } as Partial<Shape>);
          break;
        }
        case 'curve': {
          const s = shape as CurveShape;
          updateShape(shape.id, {
            start: [s.start[0] + offsetX, s.start[1] + offsetY],
            control: [s.control[0] + offsetX, s.control[1] + offsetY],
            end: [s.end[0] + offsetX, s.end[1] + offsetY]
          } as Partial<Shape>);
          break;
        }
      }
    }

    // Reset position
    node.position({ x: 0, y: 0 });
  };

  const handleTransformEnd = () => {
    const node = shapeRef.current;
    if (!node) {
      return;
    }

    const groupNode = groupRef.current;
    const transform = node.getTransform().copy();
    const transformPoint = (point: Point): Point => {
      const { x, y } = transform.point({ x: point[0], y: point[1] });
      return [x, y];
    };

    if (shape.type === 'circle') {
      const s = shape as CircleShape;
      const newCenter = transformPoint(s.center);
      const radiusSampleX = transformPoint([s.center[0] + s.radius, s.center[1]]);
      const radiusSampleY = transformPoint([s.center[0], s.center[1] + s.radius]);
      const radiusX = Math.hypot(radiusSampleX[0] - newCenter[0], radiusSampleX[1] - newCenter[1]);
      const radiusY = Math.hypot(radiusSampleY[0] - newCenter[0], radiusSampleY[1] - newCenter[1]);
      const newRadius = Math.max(0, (radiusX + radiusY) / 2);

      updateShape(shape.id, {
        center: newCenter,
        radius: newRadius
      } as Partial<Shape>);
    } else if (shape.type === 'square') {
      const s = shape as SquareShape;
      const [topLeft, topRight, bottomLeft, bottomRight] = getSquareCorners(s);
      const transformedTopLeft = transformPoint(topLeft);
      const transformedTopRight = transformPoint(topRight);
      const transformedBottomLeft = transformPoint(bottomLeft);
      const transformedBottomRight = transformPoint(bottomRight);

      const newCenter: Point = [
        (transformedTopLeft[0] + transformedTopRight[0] + transformedBottomLeft[0] + transformedBottomRight[0]) / 4,
        (transformedTopLeft[1] + transformedTopRight[1] + transformedBottomLeft[1] + transformedBottomRight[1]) / 4
      ];

      const widthVector: Point = [
        transformedTopRight[0] - transformedTopLeft[0],
        transformedTopRight[1] - transformedTopLeft[1]
      ];
      const heightVector: Point = [
        transformedBottomLeft[0] - transformedTopLeft[0],
        transformedBottomLeft[1] - transformedTopLeft[1]
      ];

      const newWidth = Math.max(0, Math.hypot(widthVector[0], widthVector[1]));
      const newHeight = Math.max(0, Math.hypot(heightVector[0], heightVector[1]));
      const angleDegrees = normalizeAngle(radToDeg(Math.atan2(widthVector[1], widthVector[0])));

      updateShape(shape.id, {
        center: newCenter,
        width: newWidth,
        height: newHeight,
        rotation: angleDegrees
      } as Partial<Shape>);
    } else if (shape.type === 'line') {
      const s = shape as LineShape;
      updateShape(shape.id, {
        start: transformPoint(s.start),
        end: transformPoint(s.end)
      } as Partial<Shape>);
    } else if (shape.type === 'triangle') {
      const s = shape as TriangleShape;
      updateShape(shape.id, {
        point1: transformPoint(s.point1),
        point2: transformPoint(s.point2),
        point3: transformPoint(s.point3)
      } as Partial<Shape>);
    } else if (shape.type === 'arrow' || shape.type === 'guide-line') {
      const s = shape as ArrowShape | GuideLineShape;
      updateShape(shape.id, {
        start: transformPoint(s.start),
        end: transformPoint(s.end)
      } as Partial<Shape>);
    } else if (shape.type === 'curve') {
      const s = shape as CurveShape;
      updateShape(shape.id, {
        start: transformPoint(s.start),
        control: transformPoint(s.control),
        end: transformPoint(s.end)
      } as Partial<Shape>);
    } else if (shape.type === 'polyline') {
      const s = shape as PolylineShape;
      updateShape(shape.id, {
        points: s.points.map((point) => transformPoint(point))
      } as Partial<Shape>);
    } else if (shape.type === 'zone') {
      // Zones are handled by floorStore, no need to update here
      return;
    }

    node.position({ x: 0, y: 0 });
    node.scaleX(1);
    node.scaleY(1);
    node.rotation(0);
    if (typeof node.skewX === 'function') {
      node.skewX(0);
      node.skewY(0);
    }
    if (groupNode) {
      groupNode.position({ x: 0, y: 0 });
    }
  };

  // Render the actual shape at absolute coordinates (no Group offset)
  const renderShapeContent = () => {
    switch (shape.type) {
      case 'line': {
        const s = shape as LineShape;
        return (
          <Line
            points={[s.start[0], s.start[1], s.end[0], s.end[1]]}
            stroke={s.stroke || '#000000'}
            strokeWidth={strokeWidths.shape}
            hitStrokeWidth={getHitWidth(undefined, strokeWidths.shape)}
          />
        );
      }
      case 'polyline': {
        const s = shape as PolylineShape;
        const points = s.points.flat();
        return (
          <Line
            points={points}
            stroke={s.stroke || '#000000'}
            strokeWidth={strokeWidths.shape}
            hitStrokeWidth={getHitWidth(undefined, strokeWidths.shape)}
          />
        );
      }
      case 'zone': {
        // Zones are now rendered separately from floorStore
        return null;
      }
      case 'circle': {
        const s = shape as CircleShape;
        return (
          <Circle
            x={s.center[0]}
            y={s.center[1]}
            radius={s.radius}
            stroke={s.stroke || '#000000'}
            strokeWidth={strokeWidths.shape}
            hitStrokeWidth={getHitWidth(undefined, strokeWidths.shape)}
            {...(s.fill ? { fill: s.fill } : {})}
          />
        );
      }
      case 'square': {
        const s = shape as SquareShape;
        return (
          <Rect
            x={s.center[0]}
            y={s.center[1]}
            width={s.width}
            height={s.height}
            offsetX={s.width / 2}
            offsetY={s.height / 2}
            rotation={s.rotation ?? 0}
            stroke={s.stroke || '#000000'}
            strokeWidth={strokeWidths.shape}
            hitStrokeWidth={getHitWidth(undefined, strokeWidths.shape)}
            {...(s.fill ? { fill: s.fill } : {})}
          />
        );
      }
      case 'triangle': {
        const s = shape as TriangleShape;
        return (
          <Line
            points={[
              s.point1[0], s.point1[1],
              s.point2[0], s.point2[1],
              s.point3[0], s.point3[1],
              s.point1[0], s.point1[1]
            ]}
            stroke={s.stroke || '#000000'}
            strokeWidth={strokeWidths.shape}
            hitStrokeWidth={getHitWidth(undefined, strokeWidths.shape)}
            {...(s.fill ? { fill: s.fill } : {})}
            closed={true}
          />
        );
      }
      case 'arrow': {
        const s = shape as ArrowShape;
        const arrowHeadStart = drawArrowHead(s.start, s.end, true);
        const arrowHeadEnd = drawArrowHead(s.start, s.end, false);
        if (!arrowHeadStart || !arrowHeadEnd) {
          return null;
        }
        
        return (
          <Group>
            <Line
              points={[s.start[0], s.start[1], s.end[0], s.end[1]]}
              stroke={s.stroke || '#000000'}
              strokeWidth={strokeWidths.shape}
              hitStrokeWidth={getHitWidth(undefined, strokeWidths.shape)}
            />
            {/* Start arrowhead - two lines */}
            <Line
              points={arrowHeadStart.left}
              stroke={s.stroke || '#000000'}
              strokeWidth={strokeWidths.shape}
              hitStrokeWidth={getHitWidth(undefined, strokeWidths.shape)}
            />
            <Line
              points={arrowHeadStart.right}
              stroke={s.stroke || '#000000'}
              strokeWidth={strokeWidths.shape}
              hitStrokeWidth={getHitWidth(undefined, strokeWidths.shape)}
            />
            {/* End arrowhead - two lines */}
            <Line
              points={arrowHeadEnd.left}
              stroke={s.stroke || '#000000'}
              strokeWidth={strokeWidths.shape}
              hitStrokeWidth={getHitWidth(undefined, strokeWidths.shape)}
            />
            <Line
              points={arrowHeadEnd.right}
              stroke={s.stroke || '#000000'}
              strokeWidth={strokeWidths.shape}
              hitStrokeWidth={getHitWidth(undefined, strokeWidths.shape)}
            />
          </Group>
        );
      }
      case 'guide-line': {
        const s = shape as GuideLineShape;
        return (
          <Line
            points={[s.start[0], s.start[1], s.end[0], s.end[1]]}
            stroke={s.stroke || '#000000'}
            strokeWidth={strokeWidths.shape}
            dash={[5, 5]}
            hitStrokeWidth={getHitWidth(undefined, strokeWidths.shape)}
          />
        );
      }
      case 'curve': {
        const s = shape as CurveShape;
        const bezierPoints = calculateBezierPoints(s.start, s.control, s.end);
        return (
          <Line
            points={bezierPoints}
            stroke={s.stroke || '#000000'}
            strokeWidth={strokeWidths.shape}
            hitStrokeWidth={getHitWidth(undefined, strokeWidths.shape)}
            tension={0} // Disable Konva's tension since we're calculating bezier manually
          />
        );
      }
      default:
        return null;
    }
  };

  // Note: Opacity is handled at the parent Group level in ShapesLayer
  return (
    <Group
      ref={groupRef}
      x={0}
      y={0}
      draggable
      onDragStart={(e) => {
        onSelect();
        e.cancelBubble = true;
      }}
      onDragEnd={handleDragEnd}
      onClick={onSelect}
      onTap={onSelect}
    >
      <Group 
        ref={shapeRef}
        x={0}
        y={0}
        draggable={false}
        listening={!isLocked}
        onClick={(e) => {
          if (isLocked) {
            e.cancelBubble = true;
            return;
          }
          e.cancelBubble = true; // Prevent event bubbling
          onSelect();
        }}
        onTap={(e) => {
          if (isLocked) {
            e.cancelBubble = true;
            return;
          }
          e.cancelBubble = true; // Prevent event bubbling
          onSelect();
        }}
      >
        {renderShapeContent()}
      </Group>
      {isSelected && !isLocked && (
        <Transformer
          ref={transformerRef}
          boundBoxFunc={(oldBox, newBox) => {
            // Limit minimum size
            if (Math.abs(newBox.width) < 5 || Math.abs(newBox.height) < 5) {
              return oldBox;
            }
            // Return newBox as-is - no snapping
            return newBox;
          }}
          borderEnabled={true}
          borderStroke="#0f7787"
          borderStrokeWidth={2}
          anchorFill="#0f7787"
          anchorStroke="#0f7787"
          anchorSize={8}
          rotateEnabled={true}
          enabledAnchors={[
            'top-left', 'top-right', 'bottom-left', 'bottom-right',
            'top-center', 'bottom-center', 'middle-left', 'middle-right'
          ]}
          onTransformEnd={handleTransformEnd}
          onClick={(e) => {
            e.cancelBubble = true; // Prevent event from bubbling to canvas
          }}
          onTap={(e) => {
            e.cancelBubble = true; // Prevent event from bubbling to canvas
          }}
          // Disable any snapping behavior
          ignoreStroke={false}
        />
      )}
    </Group>
  );
};

// Render preview shape while drawing
const renderShapePreview = (
  tool: string | null,
  drawingData: any,
  currentPoint: [number, number] | undefined,
  scale: number
) => {
  if (!tool || !drawingData || !currentPoint) {
    return null;
  }

  // Calculate dynamic stroke width - thicker when zoomed out
  const dynamicStrokeWidth = 2 / scale;
  
  switch (tool) {
    case 'line':
      if (drawingData.startPoint) {
        return (
          <Line
            points={[drawingData.startPoint[0], drawingData.startPoint[1], currentPoint[0], currentPoint[1]]}
            stroke="#0f7787"
            strokeWidth={dynamicStrokeWidth}
            dash={[5, 5]}
          />
        );
      }
      break;
      
    case 'polyline':
      if (drawingData.points && drawingData.points.length > 0) {
        const points = [...drawingData.points, currentPoint].flat();
        return (
          <Line
            points={points}
            stroke="#0f7787"
            strokeWidth={dynamicStrokeWidth}
            dash={[5, 5]}
          />
        );
      }
      break;
      
    case 'zone':
      if (drawingData.points && drawingData.points.length > 0) {
        const points = [...drawingData.points, currentPoint].flat();
        return (
          <Line
            points={points}
            stroke="#0f7787"
            strokeWidth={dynamicStrokeWidth * 2}
            dash={[5, 5]}
            fill="#808080"
            opacity={0.5}
            closed
          />
        );
      }
      break;
      
    case 'circle':
      if (drawingData.center) {
        const [cx, cy] = drawingData.center;
        const radius = Math.sqrt(
          Math.pow(currentPoint[0] - cx, 2) + Math.pow(currentPoint[1] - cy, 2)
        );
        return (
          <Circle
            x={cx}
            y={cy}
            radius={radius}
            stroke="#0f7787"
            strokeWidth={dynamicStrokeWidth}
            dash={[5, 5]}
          />
        );
      }
      break;
      
    case 'square':
      if (drawingData.corner) {
        const [x1, y1] = drawingData.corner;
        const [x2, y2] = currentPoint;
        return (
          <Rect
            x={Math.min(x1, x2)}
            y={Math.min(y1, y2)}
            width={Math.abs(x2 - x1)}
            height={Math.abs(y2 - y1)}
            stroke="#0f7787"
            strokeWidth={dynamicStrokeWidth}
            dash={[5, 5]}
          />
        );
      }
      break;
      
    case 'triangle':
      if (drawingData.trianglePoints) {
        const points = drawingData.trianglePoints;
        if (points.length === 1) {
          return (
            <Line
              points={[points[0][0], points[0][1], currentPoint[0], currentPoint[1]]}
              stroke="#0f7787"
              strokeWidth={dynamicStrokeWidth}
              dash={[5, 5]}
            />
          );
        } else if (points.length === 2) {
          return (
            <Line
              points={[
                points[0][0], points[0][1],
                points[1][0], points[1][1],
                currentPoint[0], currentPoint[1]
              ]}
              stroke="#0f7787"
              strokeWidth={dynamicStrokeWidth}
              dash={[5, 5]}
            />
          );
        }
      }
      break;
      
    case 'arrow':
      if (drawingData.startPoint) {
        const arrowHeadStart = drawArrowHead(drawingData.startPoint, currentPoint, true);
        const arrowHeadEnd = drawArrowHead(drawingData.startPoint, currentPoint, false);

        return (
          <Group>
            <Line
              points={[drawingData.startPoint[0], drawingData.startPoint[1], currentPoint[0], currentPoint[1]]}
              stroke="#0f7787"
              strokeWidth={dynamicStrokeWidth}
              dash={[5, 5]}
            />
            {arrowHeadStart && (
              <>
                <Line
                  points={arrowHeadStart.left}
                  stroke="#0f7787"
                  strokeWidth={dynamicStrokeWidth}
                  dash={[5, 5]}
                />
                <Line
                  points={arrowHeadStart.right}
                  stroke="#0f7787"
                  strokeWidth={dynamicStrokeWidth}
                  dash={[5, 5]}
                />
              </>
            )}
            {arrowHeadEnd && (
              <>
                <Line
                  points={arrowHeadEnd.left}
                  stroke="#0f7787"
                  strokeWidth={dynamicStrokeWidth}
                  dash={[5, 5]}
                />
                <Line
                  points={arrowHeadEnd.right}
                  stroke="#0f7787"
                  strokeWidth={dynamicStrokeWidth}
                  dash={[5, 5]}
                />
              </>
            )}
          </Group>
        );
      }
      break;
      
    case 'guide-line':
      if (drawingData.startPoint) {
        return (
          <Line
            points={[drawingData.startPoint[0], drawingData.startPoint[1], currentPoint[0], currentPoint[1]]}
            stroke="#0f7787"
            strokeWidth={dynamicStrokeWidth}
            dash={[5, 5]}
          />
        );
      }
      break;
      
    case 'curve':
      if (drawingData.startPoint) {
        if (drawingData.controlPoint) {
          // We have start and control, show curve to current point (end)
          const bezierPoints = calculateBezierPoints(
            drawingData.startPoint,
            drawingData.controlPoint,
            currentPoint
          );
          return (
            <Line
              points={bezierPoints}
              stroke="#0f7787"
              strokeWidth={dynamicStrokeWidth}
              dash={[5, 5]}
              tension={0}
            />
          );
        } else {
          // Only have start point, show line from start to current (which will become control)
          return (
            <Line
              points={[drawingData.startPoint[0], drawingData.startPoint[1], currentPoint[0], currentPoint[1]]}
              stroke="#0f7787"
              strokeWidth={dynamicStrokeWidth}
              dash={[5, 5]}
            />
          );
        }
      }
      break;
  }
  
  return null;
};

export const ShapesLayer: React.FC<ShapesLayerProps> = ({ scale }) => {
  const shapes = useShapesStore((state) => state.shapes);
  const activeShapeTool = useShapesStore((state) => state.activeShapeTool);
  const isShapeDrawing = useShapesStore((state) => state.isShapeDrawing);
  const shapeDrawingData = useShapesStore((state) => state.shapeDrawingData);
  const selectedShapeId = useShapesStore((state) => state.selectedShapeId);
  const selectedShapeIds = useShapesStore((state) => state.selectedShapeIds);
  const isDragSelecting = useShapesStore((state) => state.isDragSelecting);
  const selectShape = useShapesStore((state) => state.selectShape);

  // Get zones from floorStore
  const useFloorStore = useFloorStoreContext();
  const zones = useFloorStore((state) => state.zones);
  const selectedZoneIds = useFloorStore((state) => state.selectedZoneIds);
  const selectZone = useFloorStore((state) => state.selectZone);
  const updateZone = useFloorStore((state) => state.updateZone);

  // Get unit system for area formatting and stroke weight
  const useWallGraphStore = useWallGraphStoreContext();
  const unitSystem = useWallGraphStore((state) => state.unitSystem);
  const strokeWeight = useWallGraphStore((state) => state.strokeWeight);

  const strokeWidths = useMemo(() => getStrokeWidths(strokeWeight), [strokeWeight]);
  
  // Get visible layer IDs and layer opacity map for filtering and opacity
  const layers = useLayerStore((state) => state.layers);
  const visibleLayerIds = useMemo(() => {
    return layers.filter(l => l.visible).map(l => l.id);
  }, [layers]);
  const layerOpacityMap = useMemo(() => {
    const map = new Map<string, number>();
    layers.forEach(layer => {
      map.set(layer.id, layer.opacity ?? 1.0);
    });
    return map;
  }, [layers]);
  
  // Filter shapes by visible layers
  const visibleShapes = useMemo(() => {
    return shapes.filter(shape => {
      const layerId = shape.layerId || DEFAULT_LAYER_ID;
      return visibleLayerIds.includes(layerId);
    });
  }, [shapes, visibleLayerIds]);

  // Filter zones by visible layers
  const visibleZones = useMemo(() => {
    return zones.filter(zone => {
      const layerId = zone.layerId || DEFAULT_LAYER_ID;
      return visibleLayerIds.includes(layerId);
    });
  }, [zones, visibleLayerIds]);

  return (
    <Layer name="shapes">
      {/* Render all zones from floorStore */}
      {visibleZones.map((zone) => {
        const layerId = zone.layerId || DEFAULT_LAYER_ID;
        const opacity = layerOpacityMap.get(layerId) ?? 1.0;
        return (
          <Group key={zone.id} opacity={opacity}>
            <ZoneComponent
              zone={zone}
              isSelected={selectedZoneIds.includes(zone.id)}
              onSelect={() => selectZone(zone.id)}
              onUpdate={(updates) => updateZone(zone.id, updates)}
              unitSystem={unitSystem}
              strokeWidths={strokeWidths}
              scale={scale}
            />
          </Group>
        );
      })}

      {/* Render all completed shapes */}
      {visibleShapes.map((shape) => {
        const layerId = shape.layerId || DEFAULT_LAYER_ID;
        const opacity = layerOpacityMap.get(layerId) ?? 1.0;
        return (
          <Group key={shape.id} opacity={opacity}>
            <ShapeComponent
              shape={shape}
              isSelected={selectedShapeIds.includes(shape.id)}
              onSelect={() => {
                // Don't select if drag selection is active - let drag selection handle it
                if (!isDragSelecting) {
                  selectShape(shape.id);
                }
              }}
              onTransform={(updates) => {
                // This will be handled by the transform end handler
              }}
              unitSystem={unitSystem}
              strokeWidths={strokeWidths}
            />
          </Group>
        );
      })}
      
      {/* Render preview while drawing */}
      {isShapeDrawing && renderShapePreview(
        activeShapeTool,
        shapeDrawingData,
        shapeDrawingData.currentPoint,
        scale
      )}
    </Layer>
  );
};

