/**
 * Dimension annotation renderer component
 * Renders dimension lines with extension lines, arrow heads, and dimension text
 * Supports aligned, horizontal, and vertical dimensions
 */
'use client';

import React, { useMemo } from 'react';
import { Group, Line, Text, Circle, Rect } from 'react-konva';
import type { DimensionAnnotation } from '../../types/annotations';
import { useWallGraphStoreContext } from '../../context/WallGraphStoreContext';
import { useAnnotationsStore } from '../../store/annotationsStore';
import {
  calculateAlignedDimensionGeometry,
  calculateHorizontalDimensionGeometry,
  calculateVerticalDimensionGeometry,
  calculateArrowHead,
  calculateSlashMark,
} from '../../utils/dimensionGeometry';
import { pixelsToMeters, formatMetersAsImperial, formatMetersAsMetric } from '@/lib/units/unitsSystem';
import type { Point } from '../../types/wallGraph';

interface DimensionRendererProps {
  dimension: DimensionAnnotation;
  isSelected: boolean;
  onSelect: () => void;
}

export const DimensionRenderer: React.FC<DimensionRendererProps> = ({
  dimension,
  isSelected,
  onSelect,
}) => {
  const useWallGraphStore = useWallGraphStoreContext();
  const unitSystem = useWallGraphStore((state) => state.unitSystem);

  // Calculate dimension geometry
  const geometry = useMemo(() => {
    switch (dimension.dimensionType) {
      case 'horizontal':
        return calculateHorizontalDimensionGeometry(
          dimension.startPoint,
          dimension.endPoint,
          dimension.offset
        );
      case 'vertical':
        return calculateVerticalDimensionGeometry(
          dimension.startPoint,
          dimension.endPoint,
          dimension.offset
        );
      case 'aligned':
      default:
        return calculateAlignedDimensionGeometry(
          dimension.startPoint,
          dimension.endPoint,
          dimension.offset
        );
    }
  }, [dimension.startPoint, dimension.endPoint, dimension.offset, dimension.dimensionType]);

  // Calculate dimension text
  // geometry.distance is in pixels, convert to meters first, then format
  const dimensionText = useMemo(() => {
    if (dimension.textOverride) {
      return dimension.textOverride;
    }

    // Convert pixel distance to meters
    const meters = pixelsToMeters(geometry.distance);

    if (unitSystem === 'imperial') {
      const formatted = formatMetersAsImperial(meters);
      return dimension.showUnits ? formatted : formatted.replace(/['"]/g, '');
    } else {
      return formatMetersAsMetric(meters);
    }
  }, [geometry.distance, dimension.textOverride, dimension.showUnits, unitSystem]);

  // Calculate arrow heads or slash marks
  const startArrow = useMemo(() => {
    if (dimension.arrowStyle === 'slash') {
      return calculateSlashMark(geometry.dimensionLineStart, geometry.dimensionLineEnd, 10, true);
    } else if (dimension.arrowStyle === 'filled-arrow') {
      return calculateArrowHead(geometry.dimensionLineStart, geometry.dimensionLineEnd, 8, 4, true);
    }
    return null;
  }, [dimension.arrowStyle, geometry.dimensionLineStart, geometry.dimensionLineEnd]);

  const endArrow = useMemo(() => {
    if (dimension.arrowStyle === 'slash') {
      return calculateSlashMark(geometry.dimensionLineStart, geometry.dimensionLineEnd, 10, false);
    } else if (dimension.arrowStyle === 'filled-arrow') {
      return calculateArrowHead(geometry.dimensionLineStart, geometry.dimensionLineEnd, 8, 4, false);
    }
    return null;
  }, [dimension.arrowStyle, geometry.dimensionLineStart, geometry.dimensionLineEnd]);

  const strokeColor = isSelected ? '#0f7787' : '#000000';
  const strokeWidth = isSelected ? 1.5 : 1;

  // Calculate approximate text dimensions for background
  const textWidth = useMemo(() => {
    // Approximate character width for Arial 12px
    return dimensionText.length * 7;
  }, [dimensionText]);

  return (
    <Group onClick={onSelect}>
      {/* Extension Line 1 */}
      <Line
        points={[
          geometry.extension1Start[0],
          geometry.extension1Start[1],
          geometry.extension1End[0],
          geometry.extension1End[1],
        ]}
        stroke={strokeColor}
        strokeWidth={strokeWidth * 0.5}
        dash={[4, 4]}
        listening={false}
      />

      {/* Extension Line 2 */}
      <Line
        points={[
          geometry.extension2Start[0],
          geometry.extension2Start[1],
          geometry.extension2End[0],
          geometry.extension2End[1],
        ]}
        stroke={strokeColor}
        strokeWidth={strokeWidth * 0.5}
        dash={[4, 4]}
        listening={false}
      />

      {/* Dimension Line */}
      <Line
        points={[
          geometry.dimensionLineStart[0],
          geometry.dimensionLineStart[1],
          geometry.dimensionLineEnd[0],
          geometry.dimensionLineEnd[1],
        ]}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
      />

      {/* Start Arrow/Slash */}
      {dimension.arrowStyle === 'filled-arrow' && startArrow && (
        <Line
          points={startArrow.flat()}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          fill={strokeColor}
          closed
          listening={false}
        />
      )}
      {dimension.arrowStyle === 'slash' && startArrow && startArrow[0] && startArrow[1] && (
        <Line
          points={[startArrow[0][0], startArrow[0][1], startArrow[1][0], startArrow[1][1]]}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          listening={false}
        />
      )}
      {dimension.arrowStyle === 'dot' && (
        <Circle
          x={geometry.dimensionLineStart[0]}
          y={geometry.dimensionLineStart[1]}
          radius={3}
          fill={strokeColor}
          listening={false}
        />
      )}

      {/* End Arrow/Slash */}
      {dimension.arrowStyle === 'filled-arrow' && endArrow && (
        <Line
          points={endArrow.flat()}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          fill={strokeColor}
          closed
          listening={false}
        />
      )}
      {dimension.arrowStyle === 'slash' && endArrow && endArrow[0] && endArrow[1] && (
        <Line
          points={[endArrow[0][0], endArrow[0][1], endArrow[1][0], endArrow[1][1]]}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          listening={false}
        />
      )}
      {dimension.arrowStyle === 'dot' && (
        <Circle
          x={geometry.dimensionLineEnd[0]}
          y={geometry.dimensionLineEnd[1]}
          radius={3}
          fill={strokeColor}
          listening={false}
        />
      )}

      {/* Dimension Text Background */}
      <Rect
        x={geometry.textPosition[0]}
        y={geometry.textPosition[1]}
        width={textWidth + 8}
        height={16}
        fill="#FFFFFF"
        opacity={0.9}
        offsetX={(textWidth + 8) / 2}
        offsetY={14}
        rotation={geometry.textRotation}
        listening={false}
      />

      {/* Dimension Text */}
      <Text
        text={dimensionText}
        x={geometry.textPosition[0]}
        y={geometry.textPosition[1]}
        fontSize={12}
        fontFamily="Arial"
        fill={strokeColor}
        align="center"
        verticalAlign="middle"
        offsetX={0}
        offsetY={6}
        rotation={geometry.textRotation}
        listening={false}
      />
    </Group>
  );
};
