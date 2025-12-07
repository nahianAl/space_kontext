/**
 * Wrapper component for the floorplan canvas with Suspense boundary
 * Provides loading state while the KonvaCanvas component initializes
 */
'use client';

import React, { Suspense, useEffect } from 'react';
import { KonvaCanvas } from './KonvaCanvas';
import { useWallGraphStoreContext } from '../context/WallGraphStoreContext';
import { useStageRefContext } from '../context/StageRefContext';
import { RotateCcw, RotateCw } from 'lucide-react';

const UndoRedoControls = () => {
  const useWallGraphStore = useWallGraphStoreContext();
  const undo = useWallGraphStore((state) => state.undo);
  const redo = useWallGraphStore((state) => state.redo);
  const canUndo = useWallGraphStore((state) => state.historyIndex > 0);
  const canRedo = useWallGraphStore((state) => state.historyIndex < state.history.length - 1);

  const buttonClass = 'flex items-center justify-center w-10 h-10 rounded-full bg-black/40 text-white transition-opacity disabled:opacity-30 opacity-80';

  return (
    <div className="absolute bottom-6 right-6 z-20 flex gap-3">
      <button
        type="button"
        onClick={undo}
        disabled={!canUndo}
        className={buttonClass}
        aria-label="Undo"
      >
        <RotateCcw size={18} />
      </button>
      <button
        type="button"
        onClick={redo}
        disabled={!canRedo}
        className={buttonClass}
        aria-label="Redo"
      >
        <RotateCw size={18} />
      </button>
    </div>
  );
};

interface FloorplanCanvasProps {
  className?: string;
  width: number;
  height: number;
}

export const FloorplanCanvas: React.FC<FloorplanCanvasProps> = ({
  className = '',
  width,
  height,
}) => {
  const stageRefContext = useStageRefContext();

  return (
    <div className={`relative ${className}`}>
      <Suspense
        fallback={
          <div className="w-full h-full flex items-center justify-center bg-gray-50">
            <p className="text-sm text-gray-600">Initializing Canvas...</p>
          </div>
        }
      >
        {width > 0 && height > 0 && (
          <KonvaCanvas 
            width={width} 
            height={height} 
            {...(stageRefContext?.setStageRef && { onStageRefReady: stageRefContext.setStageRef })} 
          />
        )}
      </Suspense>
      <UndoRedoControls />
    </div>
  );
};
