/**
 * Wall centerlines component for debugging/visualization
 * Renders wall centerlines as lines on the canvas
 * Used for visual debugging of wall graph structure
 */

import React from 'react';
import { Line } from 'react-konva';

interface WallCenterlinesProps {
  graph: any;
}

export const WallCenterlines: React.FC<WallCenterlinesProps> = ({ graph }) => {
  if (!graph || !graph.edges) {
    return null;
  }
  
  return (
    <>
      {Object.values(graph.edges).map((edge: any, index) => {
        const [start, end] = edge.centerline;
        return (
          <Line
            key={`centerline-${index}`}
            points={[start[0], start[1], end[0], end[1]]}
            stroke="#0f7787"
            strokeWidth={2}
            dash={[5, 5]}
          />
        );
      })}
    </>
  );
};
