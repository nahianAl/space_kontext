/**
 * Text annotation renderer component
 * Renders text annotations with optional background and alignment
 * Supports single-line and multi-line text, dragging, and resizing
 */
'use client';

import React, { useMemo, useRef, useEffect } from 'react';
import { Group, Text as KonvaText, Rect, Transformer } from 'react-konva';
import type { TextAnnotation } from '../../types/annotations';
import { useAnnotationsStore } from '../../store/annotationsStore';
import { useLayerStore } from '../../store/layerStore';
import { DEFAULT_LAYER_ID } from '../../types/layers';
import type { Point } from '../../types/wallGraph';

interface TextRendererProps {
  text: TextAnnotation;
  isSelected: boolean;
  onSelect: () => void;
  onEdit?: () => void;
}

export const TextRenderer: React.FC<TextRendererProps> = ({
  text,
  isSelected,
  onSelect,
  onEdit,
}) => {
  const groupRef = useRef<any>(null);
  const transformerRef = useRef<any>(null);
  const updateAnnotation = useAnnotationsStore((state) => state.updateAnnotation);
  
  // Check if text's layer is locked
  const layerId = text.layer || DEFAULT_LAYER_ID;
  const layers = useLayerStore((state) => state.layers);
  const layer = layers.find(l => l.id === layerId);
  const isLocked = layer?.locked ?? false;

  // Sync Group position with text.position from store
  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.position({ x: text.position[0], y: text.position[1] });
      groupRef.current.getLayer()?.batchDraw();
    }
  }, [text.position]);

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
  }, [isSelected, text.id, isLocked]);

  // Force re-attach after text updates
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
  }, [text, isSelected, isLocked]);

  // Calculate text metrics for background and sizing
  const textMetrics = useMemo(() => {
    // Approximate text width/height based on font size and content
    const lines = text.multiline && text.content.includes('\n')
      ? text.content.split('\n')
      : [text.content];

    const maxLineLength = Math.max(...lines.map(l => l.length));
    const charWidth = text.fontSize * 0.6; // Approximate character width
    const lineHeight = text.fontSize * 1.2; // Line height

    // Use stored width/height if available, otherwise calculate
    const width = text.width || maxLineLength * charWidth;
    const height = text.height || lines.length * lineHeight;

    return {
      width: Math.max(width, 50), // Minimum width
      height: Math.max(height, text.fontSize * 1.2), // Minimum height
      lineCount: lines.length,
    };
  }, [text.content, text.fontSize, text.multiline, text.width, text.height]);

  const strokeColor = isSelected ? '#0f7787' : undefined;
  const strokeWidth = isSelected ? 2 : 0;

  // Calculate background position based on alignment
  const backgroundX = useMemo(() => {
    if (text.alignment === 'center') {
      return -textMetrics.width / 2;
    } else if (text.alignment === 'right') {
      return -textMetrics.width;
    }
    return 0;
  }, [text.alignment, textMetrics.width]);

  const backgroundY = -4; // Small padding above text

  // Handle drag end - update position
  const handleDragEnd = (e: any) => {
    const node = e.target;
    // When Group is positioned at absolute coordinates, node.x() and node.y() 
    // represent the new absolute position after dragging
    const newX = node.x();
    const newY = node.y();
    
    // Update annotation position with the new absolute position
    updateAnnotation(text.id, {
      position: [newX, newY] as Point,
    });

    // Reset node position to the new position to keep it in sync
    // The useEffect will also sync it, but this ensures immediate consistency
    node.position({ x: newX, y: newY });
  };

  // Handle transform end - update width and height
  const handleTransformEnd = (e: any) => {
    const node = e.target;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();

    // Calculate new dimensions
    const newWidth = Math.max(textMetrics.width * scaleX, 50);
    const newHeight = Math.max(textMetrics.height * scaleY, text.fontSize * 1.2);

    // Update annotation
    updateAnnotation(text.id, {
      width: newWidth,
      height: newHeight,
    });

    // Reset scale
    node.scaleX(1);
    node.scaleY(1);
  };

  return (
    <>
      <Group
        ref={groupRef}
        x={text.position[0]}
        y={text.position[1]}
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
          x={backgroundX}
          y={backgroundY}
          width={textMetrics.width + 8}
          height={textMetrics.height + 8}
          fill="transparent"
          listening={false}
        />

        {/* Background rectangle */}
        {text.backgroundColor && (
          <Rect
            x={backgroundX}
            y={backgroundY}
            width={textMetrics.width + 8}
            height={textMetrics.height + 8}
            fill={text.backgroundColor}
            {...(strokeColor && { stroke: strokeColor, strokeWidth })}
            cornerRadius={4}
          />
        )}

        {/* Text */}
        <KonvaText
          text={text.content}
          x={0}
          y={0}
          fontSize={text.fontSize}
          fontFamily="Arial"
          fontStyle={`${text.fontWeight === 'bold' ? 'bold' : ''} ${text.fontStyle === 'italic' ? 'italic' : ''}`}
          fill={isSelected && !text.backgroundColor ? '#0f7787' : text.textColor}
          align={text.alignment}
          width={textMetrics.width}
          wrap={text.multiline ? 'word' : 'none'}
          {...(!text.backgroundColor && strokeColor && { stroke: strokeColor, strokeWidth: strokeWidth * 0.5 })}
        />

        {/* Selection box (when selected and no background) */}
        {isSelected && !text.backgroundColor && strokeColor && (
          <Rect
            x={backgroundX}
            y={backgroundY}
            width={textMetrics.width + 8}
            height={textMetrics.height + 8}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            dash={[5, 5]}
            listening={false}
          />
        )}
      </Group>
      
      {/* Transformer for resizing */}
      {isSelected && !isLocked && (
        <Transformer
          ref={transformerRef}
          boundBoxFunc={(oldBox, newBox) => {
            // Limit minimum size
            if (Math.abs(newBox.width) < 50 || Math.abs(newBox.height) < text.fontSize * 1.2) {
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
          rotateEnabled={false} // Don't allow rotation for text
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
