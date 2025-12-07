/**
 * Wall nodes component for debugging/visualization
 * Renders wall graph nodes as circles with ID labels
 * Used for visual debugging of wall graph node structure
 */

import React from 'react';
import { Circle, Text } from 'react-konva';

interface WallNodesProps {
  graph: any;
}

export const WallNodes: React.FC<WallNodesProps> = ({ graph }) => {
  if (!graph || !graph.nodes) {
    return null;
  }
  
  return (
    <>
      {Object.entries(graph.nodes).map(([id, node]: [string, any]) => (
        <Circle
          key={`node-${id}`}
          x={node.x}
          y={node.y}
          radius={5}
          fill="#EF4444"
          stroke="#DC2626"
          strokeWidth={2}
        />
      ))}
    </>
  );
};
