/**
 * Offset tool settings component
 * Shows instructions and current offset status
 * Displayed in the SettingsPanel when offset tool is active
 */
'use client';

import React from 'react';
import { useOffsetStore } from '../store/offsetStore';
import { useShapesStore } from '../store/shapesStore';
import { canOffsetShape } from '../utils/offsetUtils';

export const OffsetSettings: React.FC = () => {
  const selectedShapeId = useOffsetStore((state) => state.selectedShapeId);
  const isDraggingOffset = useOffsetStore((state) => state.isDraggingOffset);
  const offsetDistance = useOffsetStore((state) => state.offsetDistance);
  const offsetSide = useOffsetStore((state) => state.offsetSide);

  const shapes = useShapesStore((state) => state.shapes);
  const selectedShape = selectedShapeId ? shapes.find(s => s.id === selectedShapeId) : null;

  const canOffset = selectedShape ? canOffsetShape(selectedShape) : false;

  return (
    <div className="px-4 py-2 space-y-4">
      {/* Status Display */}
      {selectedShape ? (
        <div className="space-y-3">
          <div>
            <div className="text-xs text-gray-400 mb-2">Selected Shape:</div>
            <div className="text-sm text-white bg-gray-800 p-2 rounded">
              {selectedShape.type.charAt(0).toUpperCase() + selectedShape.type.slice(1)}
              {canOffset ? (
                <span className="ml-2 text-green-400 text-xs">✓ Can offset</span>
              ) : (
                <span className="ml-2 text-red-400 text-xs">✗ Cannot offset</span>
              )}
            </div>
          </div>

          {canOffset && (
            <>
              {isDraggingOffset && (
                <div>
                  <div className="text-xs text-gray-400 mb-2">Offset Distance:</div>
                  <div className="text-sm text-white bg-gray-800 p-2 rounded font-mono">
                    {Math.round(offsetDistance)} px ({offsetSide})
                  </div>
                </div>
              )}

              <div className="text-xs text-gray-300 bg-gray-800 p-3 rounded">
                <div className="font-medium mb-2">Next Step:</div>
                {isDraggingOffset ? (
                  <div>Release to create offset shape</div>
                ) : (
                  <div>Click and drag on the canvas to set offset distance</div>
                )}
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="text-sm text-gray-400 italic py-2">
          No shape selected. Click a shape to offset it.
        </div>
      )}

      {/* Instructions */}
      <div className="pt-2 border-t border-gray-800">
        <div className="text-xs text-gray-400 space-y-1">
          <div className="font-medium mb-2">How to Use:</div>
          <div>1. Click a shape to select it</div>
          <div>2. Click and drag anywhere to create offset</div>
          <div>3. Drag direction determines offset side</div>
          <div>4. Release to finalize offset shape</div>
        </div>
      </div>

      {/* Supported Shapes */}
      <div className="pt-2 border-t border-gray-800">
        <div className="text-xs text-gray-400">
          <div className="font-medium mb-2">Supported Shapes:</div>
          <div className="text-[10px] text-gray-500">
            Lines, Polylines, Circles, Squares, Triangles, Arrows, Guide Lines, Curves, Zones
          </div>
        </div>
      </div>
    </div>
  );
};
