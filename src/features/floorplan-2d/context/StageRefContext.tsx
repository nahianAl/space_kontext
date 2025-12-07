/**
 * Stage ref context for sharing Konva stage reference
 * Allows components like ExportDialog to access the stage for raster exports
 */

'use client';

import React, { createContext, useContext, useRef, ReactNode, useState, useCallback } from 'react';
import type Konva from 'konva';

interface StageRefContextValue {
  stageRef: React.RefObject<Konva.Stage> | null;
  setStageRef: (ref: React.RefObject<Konva.Stage>) => void;
}

const StageRefContext = createContext<StageRefContextValue | null>(null);

export const StageRefProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [stageRef, setStageRefState] = useState<React.RefObject<Konva.Stage> | null>(null);

  const setStageRef = useCallback((ref: React.RefObject<Konva.Stage>) => {
    setStageRefState(ref);
  }, []);

  return (
    <StageRefContext.Provider value={{ stageRef, setStageRef }}>
      {children}
    </StageRefContext.Provider>
  );
};

export const useStageRefContext = () => {
  const context = useContext(StageRefContext);
  if (!context) {
    return null; // Return null if not in provider (for optional usage)
  }
  return context;
};

