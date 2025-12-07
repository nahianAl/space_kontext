/**
 * DXF Blocks Layer component
 * Renders imported DXF furniture blocks as draggable Konva Groups
 * Handles selection and transformation of blocks
 */

'use client';

import React, { useRef, useEffect } from 'react';
import { Layer, Group, Line, Circle, Path, Transformer } from 'react-konva';
import { useDXFBlocksStore } from '../../store/dxfBlocksStore';
import type { KonvaShapeData, KonvaLineData, KonvaCircleData, KonvaPathData } from '../../utils/dxfConverter';

interface DXFBlocksLayerProps {
  // Future props can be added here if needed
}

/**
 * Render a single Konva shape from shape data
 */
const renderKonvaShape = (shape: KonvaShapeData, key: string) => {
  switch (shape.type) {
    case 'line': {
      const lineData = shape as KonvaLineData;
      return (
        <Line
          key={key}
          points={lineData.points}
          stroke={lineData.stroke || '#000000'}
          strokeWidth={1}
          strokeScaleEnabled={false}
          closed={lineData.closed || false}
          listening={true}
          hitStrokeWidth={20}
        />
      );
    }

    case 'circle': {
      const circleData = shape as KonvaCircleData;
      return (
        <Circle
          key={key}
          x={circleData.x}
          y={circleData.y}
          radius={circleData.radius}
          stroke={circleData.stroke || '#000000'}
          strokeWidth={1}
          strokeScaleEnabled={false}
          fill={circleData.fill || 'transparent'}
          listening={true}
          hitStrokeWidth={20}
        />
      );
    }

    case 'path': {
      const pathData = shape as KonvaPathData;
      return (
        <Path
          key={key}
          data={pathData.data}
          stroke={pathData.stroke || '#000000'}
          strokeWidth={1}
          strokeScaleEnabled={false}
          fill={pathData.fill || 'transparent'}
          listening={true}
          hitStrokeWidth={20}
        />
      );
    }

    default:
      return null;
  }
};

/**
 * Render a single DXF block instance
 */
const BlockInstance: React.FC<{
  blockId: string;
  blockName: string;
  x: number;
  y: number;
  rotation: number;
  scaleX: number;
  scaleY: number;
  shapes: KonvaShapeData[];
  isSelected: boolean;
  onSelect: () => void;
}> = ({ blockId, blockName, x, y, rotation, scaleX, scaleY, shapes, isSelected, onSelect }) => {
  const groupRef = useRef<any>(null);

  return (
    <Group
      ref={groupRef}
      x={x}
      y={y}
      rotation={rotation}
      scaleX={scaleX}
      scaleY={scaleY}
      draggable={true}
      name={blockName}
      id={blockId}
      onClick={onSelect}
      onTap={onSelect}
      onDragEnd={(e) => {
        const node = e.target;
        const { updateBlockTransform } = useDXFBlocksStore.getState();
        updateBlockTransform(blockId, {
          x: node.x(),
          y: node.y(),
        });
      }}
      onTransformEnd={(e) => {
        const node = e.target;
        const { updateBlockTransform } = useDXFBlocksStore.getState();
        updateBlockTransform(blockId, {
          x: node.x(),
          y: node.y(),
          rotation: node.rotation(),
          scaleX: node.scaleX(),
          scaleY: node.scaleY(),
        });
      }}
    >
      {shapes.map((shape, index) => renderKonvaShape(shape, `${blockId}-shape-${index}`))}
    </Group>
  );
};

export const DXFBlocksLayer: React.FC<DXFBlocksLayerProps> = () => {
  const blocks = useDXFBlocksStore((state) => state.blocks);
  const selectedBlockIds = useDXFBlocksStore((state) => state.selectedBlockIds);
  const selectBlocks = useDXFBlocksStore((state) => state.selectBlocks);
  const clearSelection = useDXFBlocksStore((state) => state.clearSelection);

  const transformerRef = useRef<any>(null);
  const layerRef = useRef<any>(null);

  // Update transformer when selection changes
  useEffect(() => {
    if (!transformerRef.current || !layerRef.current) {
      return;
    }

    const transformer = transformerRef.current;
    const layer = layerRef.current;

    if (selectedBlockIds.length === 0) {
      transformer.nodes([]);
      layer.draw();
      return;
    }

    // Find selected block nodes
    const selectedNodes = selectedBlockIds
      .map((id) => {
        const node = layer.findOne(`#${id}`);
        return node;
      })
      .filter((node) => node !== undefined);

    if (selectedNodes.length > 0) {
      transformer.nodes(selectedNodes);
      layer.draw();
    } else {
      transformer.nodes([]);
      layer.draw();
    }
  }, [selectedBlockIds]);

  // Handle stage clicks to deselect
  useEffect(() => {
    const handleStageClick = (e: any) => {
      // Check if click was on the stage or layer (not on a block)
      const clickedOnEmpty = e.target === e.target.getStage() || e.target === layerRef.current;
      if (clickedOnEmpty) {
        clearSelection();
      }
    };

    const stage = layerRef.current?.getStage();
    if (stage) {
      stage.on('click', handleStageClick);
      stage.on('tap', handleStageClick);

      return () => {
        stage.off('click', handleStageClick);
        stage.off('tap', handleStageClick);
      };
    }
    return undefined;
  }, [clearSelection]);

  const handleBlockSelect = (blockId: string) => {
    const isSelected = selectedBlockIds.includes(blockId);
    if (isSelected) {
      // Deselect if already selected
      selectBlocks(selectedBlockIds.filter((id) => id !== blockId));
    } else {
      // Add to selection
      selectBlocks([...selectedBlockIds, blockId]);
    }
  };

  if (blocks.length === 0) {
    return null;
  }

  return (
    <Layer ref={layerRef} listening={true}>
      {blocks.map((block) => (
        <BlockInstance
          key={block.id}
          blockId={block.id}
          blockName={block.blockName}
          x={block.x}
          y={block.y}
          rotation={block.rotation}
          scaleX={block.scaleX}
          scaleY={block.scaleY}
          shapes={block.konvaGroupData.shapes}
          isSelected={selectedBlockIds.includes(block.id)}
          onSelect={() => handleBlockSelect(block.id)}
        />
      ))}
      <Transformer
        ref={transformerRef}
        boundBoxFunc={(oldBox, newBox) => {
          // Limit minimum size
          if (Math.abs(newBox.width) < 5 || Math.abs(newBox.height) < 5) {
            return oldBox;
          }
          return newBox;
        }}
        rotateEnabled={true}
        enabledAnchors={[
          'top-left',
          'top-right',
          'bottom-left',
          'bottom-right',
          'top-center',
          'bottom-center',
          'middle-left',
          'middle-right',
        ]}
      />
    </Layer>
  );
};

