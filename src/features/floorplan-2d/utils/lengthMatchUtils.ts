/**
 * Length matching utilities for showing inference guidelines
 * Detects when a drawing wall matches the length of existing walls
 * Returns guideline data for visual feedback
 */

import { Point, WallGraph } from '../types/wallGraph';

export interface LengthMatch {
  matchedWallId: string;
  matchedLength: number;
  guidelineStart: Point;
  guidelineEnd: Point;
}

/**
 * Find walls that match the current drawing length
 * Returns guideline data for rendering
 */
export function findLengthMatches(
  startPoint: Point | null,
  currentPoint: Point | null,
  graph: WallGraph,
  tolerance: number = 0.5 // pixels tolerance for exact match
): LengthMatch[] {
  if (!startPoint || !currentPoint) {
    return [];
  }

  const [x1, y1] = startPoint;
  const [x2, y2] = currentPoint;
  const currentLength = Math.sqrt(
    Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)
  );

  const matches: LengthMatch[] = [];

  // Check all walls for length matches
  for (const wallId in graph.edges) {
    const wall = graph.edges[wallId];
    if (!wall) {
      continue;
    }

    const wallLength = wall.length;

    // Check if lengths match within tolerance
    if (Math.abs(currentLength - wallLength) <= tolerance) {
      // Calculate perpendicular guideline
      // The guideline extends perpendicular to the current drawing direction
      const dx = x2 - x1;
      const dy = y2 - y1;
      const length = Math.max(currentLength, 0.0001);

      // Perpendicular vector (rotate 90 degrees)
      const perpX = -dy / length;
      const perpY = dx / length;

      // Guideline extends from the end point
      const guidelineLength = 5000; // Long guideline
      const guidelineStart: Point = [
        x2 - perpX * guidelineLength,
        y2 - perpY * guidelineLength
      ];
      const guidelineEnd: Point = [
        x2 + perpX * guidelineLength,
        y2 + perpY * guidelineLength
      ];

      matches.push({
        matchedWallId: wallId,
        matchedLength: wallLength,
        guidelineStart,
        guidelineEnd
      });
    }
  }

  return matches;
}
