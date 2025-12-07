/**
 * Leader annotation renderer component
 * Renders leader lines (callouts) with arrows, lines, and text
 * Supports straight, orthogonal, and arc leader styles
 * Supports dragging and resizing like text annotations
 */
'use client';

import React, { useMemo, useRef, useEffect } from 'react';
import { Group, Line, Text as KonvaText, Circle, Rect, Transformer } from 'react-konva';
import type { LeaderAnnotation } from '../../types/annotations';
import { useAnnotationsStore } from '../../store/annotationsStore';
import { useLayerStore } from '../../store/layerStore';
import { DEFAULT_LAYER_ID } from '../../types/layers';
import type { Point } from '../../types/wallGraph';

interface LeaderRendererProps {
  leader: LeaderAnnotation;
  isSelected: boolean;
  onSelect: () => void;
  onEdit?: () => void;
}

/**
 * Calculate arrow head polygon points
 */
const calculateArrowHead = (
  from: Point,
  to: Point,
  arrowLength: number = 8,
  arrowWidth: number = 4
): Point[] => {
  const [x1, y1] = from;
  const [x2, y2] = to;

  const dx = x2 - x1;
  const dy = y2 - y1;
  const length = Math.sqrt(dx * dx + dy * dy);

  if (length === 0) {
    return [];
  }

  const ux = dx / length;
  const uy = dy / length;

  // Perpendicular vector
  const perpX = -uy;
  const perpY = ux;

  // Arrow base position (back from tip)
  const baseX = x2 - ux * arrowLength;
  const baseY = y2 - uy * arrowLength;

  // Three points of arrow triangle
  return [
    [x2, y2], // Tip
    [baseX + perpX * arrowWidth, baseY + perpY * arrowWidth],
    [baseX - perpX * arrowWidth, baseY - perpY * arrowWidth],
  ];
};

/**
 * Calculate leader line path based on style
 */
const calculateLeaderPath = (
  leader: LeaderAnnotation
): { points: number[]; landingStart?: Point; landingEnd?: Point } => {
  const { elementPoint, textPoint, leaderStyle, landingLength } = leader;

  if (leaderStyle === 'straight') {
    // Direct line from element to text
    const points = [...elementPoint, ...textPoint];

    // Add landing line if specified
    if (landingLength > 0) {
      // Landing extends horizontally from text point
      const landingEnd: Point = [textPoint[0] + landingLength, textPoint[1]];
      return {
        points: [...elementPoint, ...textPoint],
        landingStart: textPoint,
        landingEnd,
      };
    }

    return { points };
  } else if (leaderStyle === 'orthogonal') {
    // 90-degree bend
    const midX = textPoint[0];
    const midY = elementPoint[1];
    const points = [...elementPoint, midX, midY, ...textPoint];

    // Add landing line if specified
    if (landingLength > 0) {
      const landingEnd: Point = [textPoint[0] + landingLength, textPoint[1]];
      return {
        points,
        landingStart: textPoint,
        landingEnd,
      };
    }

    return { points };
  }

  // Default: straight
  return { points: [...elementPoint, ...textPoint] };
};

export const LeaderRenderer: React.FC<LeaderRendererProps> = ({
  leader,
  isSelected,
  onSelect,
  onEdit,
}) => {
  const groupRef = useRef<any>(null);
  const transformerRef = useRef<any>(null);
  const updateAnnotation = useAnnotationsStore((state) => state.updateAnnotation);
  
  // Check if leader's layer is locked
  const layerId = leader.layer || DEFAULT_LAYER_ID;
  const layers = useLayerStore((state) => state.layers);
  const layer = layers.find(l => l.id === layerId);
  const isLocked = layer?.locked ?? false;

  // Calculate bounding box for the leader (encompasses both elementPoint and textPoint)
  const boundingBox = useMemo(() => {
    const minX = Math.min(leader.elementPoint[0], leader.textPoint[0]);
    const maxX = Math.max(leader.elementPoint[0], leader.textPoint[0]);
    const minY = Math.min(leader.elementPoint[1], leader.textPoint[1]);
    const maxY = Math.max(leader.elementPoint[1], leader.textPoint[1]);
    
    // Add padding for text box
    const textWidth = Math.max(leader.text.length * 8, 50);
    const textHeight = 20;
    const padding = 20;
    
    return {
      x: minX - padding,
      y: minY - padding,
      width: maxX - minX + textWidth + padding * 2,
      height: maxY - minY + textHeight + padding * 2,
    };
  }, [leader.elementPoint, leader.textPoint, leader.text]);

  // Calculate center point for Group positioning
  const groupPosition: Point = useMemo(() => {
    return [boundingBox.x + boundingBox.width / 2, boundingBox.y + boundingBox.height / 2];
  }, [boundingBox]);

  // Calculate relative positions from group center
  const relativeElementPoint: Point = useMemo(() => {
    return [
      leader.elementPoint[0] - groupPosition[0],
      leader.elementPoint[1] - groupPosition[1],
    ];
  }, [leader.elementPoint, groupPosition]);

  const relativeTextPoint: Point = useMemo(() => {
    return [
      leader.textPoint[0] - groupPosition[0],
      leader.textPoint[1] - groupPosition[1],
    ];
  }, [leader.textPoint, groupPosition]);

  // Sync Group position
  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.position({ x: groupPosition[0], y: groupPosition[1] });
      groupRef.current.getLayer()?.batchDraw();
    }
  }, [groupPosition]);

  // Attach transformer when selected
  useEffect(() => {
    if (isSelected && transformerRef.current && groupRef.current && !isLocked) {
      const layer = transformerRef.current.getLayer();
      if (layer) {
        transformerRef.current.nodes([groupRef.current]);
        transformerRef.current.getLayer()?.batchDraw();
      }
    } else if (transformerRef.current && !isSelected) {
      transformerRef.current.nodes([]);
    }
  }, [isSelected, leader.id, isLocked]);

  // Force re-attach after leader updates
  useEffect(() => {
    if (isSelected && transformerRef.current && groupRef.current && !isLocked) {
      const rafId = requestAnimationFrame(() => {
        if (transformerRef.current && groupRef.current) {
          transformerRef.current.nodes([groupRef.current]);
          transformerRef.current.getLayer()?.batchDraw();
        }
      });
      return () => cancelAnimationFrame(rafId);
    }
    return undefined;
  }, [leader, isSelected, isLocked]);

  const strokeColor = isSelected ? '#0f7787' : '#000000';
  const strokeWidth = isSelected ? 1.5 : 1;

  // Calculate leader path (using relative points)
  const leaderPath = useMemo(() => {
    const tempLeader = {
      ...leader,
      elementPoint: relativeElementPoint,
      textPoint: relativeTextPoint,
    };
    return calculateLeaderPath(tempLeader);
  }, [leader, relativeElementPoint, relativeTextPoint]);

  // Calculate arrow head
  const arrowHead = useMemo(() => {
    if (leader.arrowStyle === 'filled') {
      return calculateArrowHead(relativeTextPoint, relativeElementPoint);
    }
    return null;
  }, [leader.arrowStyle, relativeElementPoint, relativeTextPoint]);

  // Text position (with landing offset if applicable) - relative to group center
  const textX = leaderPath.landingEnd
    ? leaderPath.landingEnd[0] + 5
    : relativeTextPoint[0] + 5;
  const textY = relativeTextPoint[1] - 6;

  // Text box dimensions
  const textMetrics = useMemo(() => {
    const lines = leader.text.includes('\n') ? leader.text.split('\n') : [leader.text];
    const maxLineLength = Math.max(...lines.map(l => l.length));
    const charWidth = 8;
    const lineHeight = 20;
    
    return {
      width: Math.max(maxLineLength * charWidth, 50),
      height: Math.max(lines.length * lineHeight, 20),
      lineCount: lines.length,
    };
  }, [leader.text]);

  // Handle drag end - update both elementPoint and textPoint
  const handleDragEnd = (e: any) => {
    const node = e.target;
    const newGroupX = node.x();
    const newGroupY = node.y();
    
    // Calculate new absolute positions
    const newElementPoint: Point = [
      newGroupX + relativeElementPoint[0],
      newGroupY + relativeElementPoint[1],
    ];
    const newTextPoint: Point = [
      newGroupX + relativeTextPoint[0],
      newGroupY + relativeTextPoint[1],
    ];
    
    // Update annotation
    updateAnnotation(leader.id, {
      elementPoint: newElementPoint,
      textPoint: newTextPoint,
    });

    // Reset node position
    node.position({ x: newGroupX, y: newGroupY });
  };

  // Handle transform end - resize text box area
  const handleTransformEnd = (e: any) => {
    const node = e.target;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();

    // For leaders, we'll adjust the textPoint position based on scale
    // This effectively resizes the text box area
    const newTextPoint: Point = [
      groupPosition[0] + relativeTextPoint[0] * scaleX,
      groupPosition[1] + relativeTextPoint[1] * scaleY,
    ];

    // Update annotation
    updateAnnotation(leader.id, {
      textPoint: newTextPoint,
    });

    // Reset scale
    node.scaleX(1);
    node.scaleY(1);
  };

  return (
    <>
      <Group
        ref={groupRef}
        x={groupPosition[0]}
        y={groupPosition[1]}
        draggable={!isLocked}
        onClick={(e) => {
          e.cancelBubble = true;
          onSelect();
        }}
        onDblClick={(e) => {
          e.cancelBubble = true;
          if (onEdit && !isLocked) {
            onEdit();
          }
        }}
        onDragEnd={handleDragEnd}
        onDragStart={(e) => {
          e.cancelBubble = true;
        }}
      >
        {/* Invisible rect for Transformer to calculate bounds */}
        <Rect
          x={-boundingBox.width / 2}
          y={-boundingBox.height / 2}
          width={boundingBox.width}
          height={boundingBox.height}
          fill="transparent"
          listening={false}
        />

        {/* Leader line */}
        <Line
          points={leaderPath.points}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          hitStrokeWidth={10} // Make line easier to click
        />

        {/* Landing line (if specified) */}
        {leaderPath.landingStart && leaderPath.landingEnd && (
          <Line
            points={[...leaderPath.landingStart, ...leaderPath.landingEnd]}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            hitStrokeWidth={10} // Make line easier to click
          />
        )}

        {/* Arrow head - filled */}
        {leader.arrowStyle === 'filled' && arrowHead && (
          <Line
            points={arrowHead.flat()}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            fill={strokeColor}
            closed
            listening={false}
          />
        )}

        {/* Arrow head - open */}
        {leader.arrowStyle === 'open' && arrowHead && (
          <Line
            points={arrowHead.flat()}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            closed
            listening={false}
          />
        )}

        {/* Arrow head - dot */}
        {leader.arrowStyle === 'dot' && (
          <Circle
            x={relativeElementPoint[0]}
            y={relativeElementPoint[1]}
            radius={3}
            fill={strokeColor}
            listening={false}
          />
        )}

        {/* Text background (if enabled) */}
        {leader.showBackground && (
          <Rect
            x={textX - 4}
            y={textY - 4}
            width={textMetrics.width + 8}
            height={textMetrics.height + 8}
            fill="#FFFFFF"
            stroke={strokeColor}
            strokeWidth={strokeWidth * 0.5}
            cornerRadius={2}
          />
        )}

        {/* Selection box (when selected and no background) */}
        {isSelected && !leader.showBackground && (
          <Rect
            x={textX - 4}
            y={textY - 4}
            width={textMetrics.width + 8}
            height={textMetrics.height + 8}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            dash={[5, 5]}
            listening={false}
          />
        )}

        {/* Leader text */}
        <KonvaText
          text={leader.text}
          x={textX}
          y={textY}
          fontSize={12}
          fontFamily="Arial"
          fill={strokeColor}
          width={textMetrics.width}
          wrap={leader.text.includes('\n') ? 'word' : 'none'}
          listening={false}
        />
      </Group>
      
      {/* Transformer for resizing */}
      {isSelected && !isLocked && (
        <Transformer
          ref={transformerRef}
          boundBoxFunc={(oldBox, newBox) => {
            // Limit minimum size
            if (Math.abs(newBox.width) < 50 || Math.abs(newBox.height) < 20) {
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
          rotateEnabled={false} // Don't allow rotation for leaders
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
          ignoreStroke={true}
        />
      )}
    </>
  );
};
