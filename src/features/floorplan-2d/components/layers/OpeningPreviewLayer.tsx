/**
 * Opening preview layer component showing a preview of where an opening will be placed
 * Displays a dashed pink line indicating the opening position while hovering over walls
 * Shows dimension lines for wall segments on either side of the opening
 * Only visible when the opening tool is active
 */
import React, { useMemo } from 'react';
import { Layer, Line, Text, Group } from 'react-konva';
import { useWallGraphStoreContext } from '../../context/WallGraphStoreContext';
import type { WallGraphStore } from '../../store/wallGraphStore';
import { inchesToMeters, centimetersToMeters, metersToPixels, pixelsToMeters, formatMetersAsImperial, formatMetersAsMetric } from '@/lib/units/unitsSystem';

// Format meters as imperial (wrapper)
const formatImperial = (meters: number): string => {
  return formatMetersAsImperial(meters);
};

// Format meters as metric (wrapper)
const formatMetric = (meters: number): string => {
  return formatMetersAsMetric(meters);
};

interface OpeningPreviewLayerProps {
  scale: number;
}

export const OpeningPreviewLayer: React.FC<OpeningPreviewLayerProps> = React.memo(({ scale }) => {
  const wallGraphStore = useWallGraphStoreContext();
  const isOpeningToolActive = wallGraphStore((state: WallGraphStore) => state.isOpeningToolActive);
  const previewPoint = wallGraphStore((state: WallGraphStore) => state.openingPreviewPoint);
  const previewDirection = wallGraphStore((state: WallGraphStore) => state.openingPreviewDirection);
  const previewWallId = wallGraphStore((state: WallGraphStore) => state.openingPreviewWallId);
  const openingWidth = wallGraphStore((state: WallGraphStore) => state.openingWidth);
  const unitSystem = wallGraphStore((state: WallGraphStore) => state.unitSystem);
  const doorAlignment = wallGraphStore((state: WallGraphStore) => state.doorAlignment);
  const wallThickness = wallGraphStore((state: WallGraphStore) => state.wallThickness);
  const activeOpeningType = wallGraphStore((state: WallGraphStore) => state.activeOpeningType);
  const graph = wallGraphStore((state: WallGraphStore) => state.graph);

  const previewData = useMemo(() => {
    if (!isOpeningToolActive || !previewPoint || !activeOpeningType) {
      return null;
    }

    // Convert openingWidth from user units (inches/cm) to meters, then to pixels
    const widthInMeters = unitSystem === 'imperial'
      ? inchesToMeters(openingWidth)
      : centimetersToMeters(openingWidth);
    const widthInPixels = metersToPixels(widthInMeters);

    if (!Number.isFinite(widthInPixels) || widthInPixels <= 0) {
      return null;
    }

    const direction = previewDirection ?? [1, 0];
    const normal: [number, number] = [-direction[1], direction[0]];
    // Convert wallThickness from meters to pixels for rendering
    const wallThicknessPixels = metersToPixels(wallThickness);
    const alignmentOffset = activeOpeningType === 'door'
      ? doorAlignment === 'inner'
        ? wallThicknessPixels / 2
        : doorAlignment === 'outer'
          ? -wallThicknessPixels / 2
          : 0
      : 0;

    const half = widthInPixels / 2;
    const offsetX = normal[0] * alignmentOffset;
    const offsetY = normal[1] * alignmentOffset;

    const start = [
      previewPoint[0] - direction[0] * half + offsetX,
      previewPoint[1] - direction[1] * half + offsetY
    ] as [number, number];
    const end = [
      previewPoint[0] + direction[0] * half + offsetX,
      previewPoint[1] + direction[1] * half + offsetY
    ] as [number, number];

    // Small perpendicular marker to help show the center point
    const perpendicular: [number, number] = [-direction[1], direction[0]];
    const markerHalfLength = 6;
    const markerStart: [number, number] = [
      previewPoint[0] + offsetX - perpendicular[0] * markerHalfLength,
      previewPoint[1] + offsetY - perpendicular[1] * markerHalfLength
    ];
    const markerEnd: [number, number] = [
      previewPoint[0] + offsetX + perpendicular[0] * markerHalfLength,
      previewPoint[1] + offsetY + perpendicular[1] * markerHalfLength
    ];

    return {
      start,
      end,
      markerStart,
      markerEnd
    };
  }, [activeOpeningType, doorAlignment, isOpeningToolActive, openingWidth, previewDirection, previewPoint, unitSystem, wallThickness]);

  // Calculate wall segment dimensions (must be before early return)
  const dimensionSegments = useMemo(() => {
    if (!previewWallId || !previewPoint || !graph) {
      return null;
    }

    const wall = graph.edges[previewWallId];
    if (!wall) {
      return null;
    }

    const startNode = graph.nodes[wall.startNodeId];
    const endNode = graph.nodes[wall.endNodeId];
    if (!startNode || !endNode) {
      return null;
    }

    const wallStart = startNode.position;
    const wallEnd = endNode.position;

    // Opening width in pixels
    // Convert openingWidth from user units (inches/cm) to meters, then to pixels
    const widthInMeters = unitSystem === 'imperial'
      ? inchesToMeters(openingWidth)
      : centimetersToMeters(openingWidth);
    const widthInPixels = metersToPixels(widthInMeters);

    // Calculate opening start and end points
    const openingHalfWidth = widthInPixels / 2;
    const direction = previewDirection ?? [1, 0];
    const openingStart: [number, number] = [
      previewPoint[0] - direction[0] * openingHalfWidth,
      previewPoint[1] - direction[1] * openingHalfWidth
    ];
    const openingEnd: [number, number] = [
      previewPoint[0] + direction[0] * openingHalfWidth,
      previewPoint[1] + direction[1] * openingHalfWidth
    ];

    // Calculate segment lengths
    const dx1 = openingStart[0] - wallStart[0];
    const dy1 = openingStart[1] - wallStart[1];
    const segment1Length = Math.sqrt(dx1 * dx1 + dy1 * dy1);

    const dx2 = wallEnd[0] - openingEnd[0];
    const dy2 = wallEnd[1] - openingEnd[1];
    const segment2Length = Math.sqrt(dx2 * dx2 + dy2 * dy2);

    // Format dimensions
    const formatDistance = (distPixels: number) => {
      // Convert pixels to meters, then format
      const distMeters = pixelsToMeters(distPixels);
      return unitSystem === 'imperial'
        ? formatImperial(distMeters)
        : formatMetric(distMeters);
    };

    const segment1Text = formatDistance(segment1Length);
    const segment2Text = formatDistance(segment2Length);

    // Calculate perpendicular offset for dimension lines
    const wallDx = wallEnd[0] - wallStart[0];
    const wallDy = wallEnd[1] - wallStart[1];
    const wallLength = Math.sqrt(wallDx * wallDx + wallDy * wallDy);
    const normalX = (-wallDy) / wallLength;
    const normalY = (wallDx) / wallLength;
    const dimensionOffset = 40; // Pixels away from wall

    // Segment 1: Wall start to opening start
    const seg1Mid: [number, number] = [
      (wallStart[0] + openingStart[0]) / 2,
      (wallStart[1] + openingStart[1]) / 2
    ];
    const seg1DimLineStart: [number, number] = [
      wallStart[0] + normalX * dimensionOffset,
      wallStart[1] + normalY * dimensionOffset
    ];
    const seg1DimLineEnd: [number, number] = [
      openingStart[0] + normalX * dimensionOffset,
      openingStart[1] + normalY * dimensionOffset
    ];
    const seg1TextPos: [number, number] = [
      seg1Mid[0] + normalX * dimensionOffset,
      seg1Mid[1] + normalY * dimensionOffset
    ];

    // Segment 2: Opening end to wall end
    const seg2Mid: [number, number] = [
      (openingEnd[0] + wallEnd[0]) / 2,
      (openingEnd[1] + wallEnd[1]) / 2
    ];
    const seg2DimLineStart: [number, number] = [
      openingEnd[0] + normalX * dimensionOffset,
      openingEnd[1] + normalY * dimensionOffset
    ];
    const seg2DimLineEnd: [number, number] = [
      wallEnd[0] + normalX * dimensionOffset,
      wallEnd[1] + normalY * dimensionOffset
    ];
    const seg2TextPos: [number, number] = [
      seg2Mid[0] + normalX * dimensionOffset,
      seg2Mid[1] + normalY * dimensionOffset
    ];

    // Calculate rotation angle
    const angle = Math.atan2(wallDy, wallDx) * (180 / Math.PI);
    const normalizedAngle = angle > 90 ? angle - 180 : angle < -90 ? angle + 180 : angle;

    return {
      segment1: {
        lineStart: seg1DimLineStart,
        lineEnd: seg1DimLineEnd,
        textPos: seg1TextPos,
        text: segment1Text,
        length: segment1Length
      },
      segment2: {
        lineStart: seg2DimLineStart,
        lineEnd: seg2DimLineEnd,
        textPos: seg2TextPos,
        text: segment2Text,
        length: segment2Length
      },
      angle: normalizedAngle
    };
  }, [previewWallId, previewPoint, previewDirection, graph, unitSystem, openingWidth]);

  if (!previewData) {
    return null;
  }

  const { start, end, markerStart, markerEnd } = previewData;

  // Calculate dynamic stroke widths
  const dynamicStrokeWidth = 2.5 / scale;
  const markerStrokeWidth = (2.5 / scale) * 0.67;
  const dimensionStrokeWidth = 1 / scale;
  const dimensionFontSize = 14 / scale;

  const renderDimensionLine = (
    lineStart: [number, number],
    lineEnd: [number, number],
    textPos: [number, number],
    text: string,
    angle: number
  ) => {
    return (
      <Group key={`${lineStart[0]}-${lineStart[1]}`}>
        <Line
          points={[lineStart[0], lineStart[1], lineEnd[0], lineEnd[1]]}
          stroke="#0f7787"
          strokeWidth={dimensionStrokeWidth}
          listening={false}
        />
        <Text
          x={textPos[0]}
          y={textPos[1]}
          text={text}
          fontSize={dimensionFontSize}
          fontFamily="Arial, sans-serif"
          fill="#0f7787"
          align="center"
          verticalAlign="middle"
          rotation={angle}
          offsetX={0}
          offsetY={0}
          listening={false}
        />
      </Group>
    );
  };

  return (
    <Layer listening={false}>
      {/* Opening preview line */}
      <Line
        points={[start[0], start[1], end[0], end[1]]}
        stroke="#fc3aa2"
        strokeWidth={dynamicStrokeWidth}
        dash={[10, 6]}
        lineCap="round"
        listening={false}
      />
      <Line
        points={[markerStart[0], markerStart[1], markerEnd[0], markerEnd[1]]}
        stroke="#fc3aa2"
        strokeWidth={markerStrokeWidth}
        listening={false}
      />

      {/* Dimension lines for wall segments */}
      {dimensionSegments && (
        <>
          {dimensionSegments.segment1.length > 5 && renderDimensionLine(
            dimensionSegments.segment1.lineStart,
            dimensionSegments.segment1.lineEnd,
            dimensionSegments.segment1.textPos,
            dimensionSegments.segment1.text,
            dimensionSegments.angle
          )}
          {dimensionSegments.segment2.length > 5 && renderDimensionLine(
            dimensionSegments.segment2.lineStart,
            dimensionSegments.segment2.lineEnd,
            dimensionSegments.segment2.textPos,
            dimensionSegments.segment2.text,
            dimensionSegments.angle
          )}
        </>
      )}
    </Layer>
  );
});

OpeningPreviewLayer.displayName = 'OpeningPreviewLayer';

