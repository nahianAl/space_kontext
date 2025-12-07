/**
 * Annotations layer component rendering all architectural annotations
 * Handles dimensions, text, leaders, reference markers, and level markers
 * Provides interactive editing and selection
 */
'use client';

import React, { useMemo } from 'react';
import { Layer, Line, Text, Group, Circle } from 'react-konva';
import { useAnnotationsStore } from '../../store/annotationsStore';
import { useLayerStore } from '../../store/layerStore';
import { useWallGraphStoreContext } from '../../context/WallGraphStoreContext';
import { ANNOTATIONS_LAYER_ID } from '../../types/layers';
import { getStrokeWidths } from '../../utils/strokeWeights';
import type { Annotation } from '../../types/annotations';
import { DimensionRenderer } from '../annotations/DimensionRenderer';
import { TextRenderer } from '../annotations/TextRenderer';
import { LeaderRenderer } from '../annotations/LeaderRenderer';
import type { Point } from '../../types/wallGraph';

interface AnnotationsLayerProps {
  onEditText?: (annotation: Annotation, position: Point) => void;
}

export const AnnotationsLayer: React.FC<AnnotationsLayerProps> = ({ onEditText }) => {
  const useWallGraphStore = useWallGraphStoreContext();
  const strokeWeight = useWallGraphStore((state) => state.strokeWeight);
  const strokeWidths = useMemo(() => getStrokeWidths(strokeWeight), [strokeWeight]);

  const annotations = useAnnotationsStore((state) => state.annotations);
  const selectedAnnotationId = useAnnotationsStore((state) => state.selectedAnnotationId);
  const selectAnnotation = useAnnotationsStore((state) => state.selectAnnotation);
  const updateAnnotation = useAnnotationsStore((state) => state.updateAnnotation);

  // Get visible layer IDs for filtering
  const layers = useLayerStore((state) => state.layers);
  const visibleLayerIds = useMemo(() => {
    return layers.filter(l => l.visible).map(l => l.id);
  }, [layers]);

  // Filter annotations by visible layers
  const visibleAnnotations = useMemo(() => {
    const filtered = Array.from(annotations.values()).filter((annotation) => {
      const layerId = annotation.layer || ANNOTATIONS_LAYER_ID;
      return visibleLayerIds.includes(layerId) && annotation.visible !== false;
    });
    console.log('📐 [AnnotationsLayer] Rendering:', {
      totalAnnotations: annotations.size,
      visibleAnnotations: filtered.length,
      visibleLayerIds,
    });
    return filtered;
  }, [annotations, visibleLayerIds]);

  // Handler for editing text annotations
  const handleEditText = (annotation: Annotation) => {
    if (annotation.type !== 'text' && annotation.type !== 'leader') {
      return;
    }

    // Get the position for the text input
    const position: Point = annotation.type === 'text'
      ? annotation.position
      : annotation.textPoint;

    // Use custom edit handler if provided, otherwise fall back to window.prompt
    if (onEditText) {
      onEditText(annotation, position);
    } else {
      const content = annotation.type === 'text' ? annotation.content : annotation.text;
      const newContent = window.prompt('Edit text:', content);
      if (newContent !== null && newContent !== content) {
        if (annotation.type === 'text') {
          updateAnnotation(annotation.id, { content: newContent });
        } else {
          updateAnnotation(annotation.id, { text: newContent });
        }
      }
    }
  };

  // Render individual annotation types
  const renderAnnotation = (annotation: Annotation) => {
    const isSelected = selectedAnnotationId === annotation.id;

    switch (annotation.type) {
      case 'dimension':
        return (
          <DimensionRenderer
            key={annotation.id}
            dimension={annotation}
            isSelected={isSelected}
            onSelect={() => selectAnnotation(annotation.id)}
          />
        );

      case 'text':
        return (
          <TextRenderer
            key={annotation.id}
            text={annotation}
            isSelected={isSelected}
            onSelect={() => selectAnnotation(annotation.id)}
            onEdit={() => handleEditText(annotation)}
          />
        );

      case 'leader':
        return (
          <LeaderRenderer
            key={annotation.id}
            leader={annotation}
            isSelected={isSelected}
            onSelect={() => selectAnnotation(annotation.id)}
            onEdit={() => handleEditText(annotation)}
          />
        );

      case 'section-marker':
      case 'elevation-marker':
      case 'detail-marker':
      case 'level-marker':
        // Placeholder for future implementation
        return (
          <Group key={annotation.id}>
            <Text
              text={`[${annotation.type}]`}
              x={'position' in annotation ? annotation.position[0] : 'center' in annotation ? annotation.center[0] : annotation.startPoint[0]}
              y={'position' in annotation ? annotation.position[1] : 'center' in annotation ? annotation.center[1] : annotation.startPoint[1]}
              fontSize={10}
              fill="#888888"
              onClick={() => selectAnnotation(annotation.id)}
            />
          </Group>
        );

      default:
        return null;
    }
  };

  return (
    <Layer>
      {visibleAnnotations.map((annotation) => renderAnnotation(annotation))}
    </Layer>
  );
};
