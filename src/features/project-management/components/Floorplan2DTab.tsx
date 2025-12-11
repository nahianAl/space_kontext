/**
 * Floorplan 2D tab component for the project view
 * Renders the 2D floorplan editor with canvas, settings panel, toolbar, and sidebar
 * Provides the main interface for editing floorplans within a project
 */
'use client';

import React, { useRef, useState, useEffect } from 'react';
import { FloorplanCanvas } from '@/features/floorplan-2d';
import { SettingsPanel } from '@/features/floorplan-2d/components/SettingsPanel';
import { PrimarySidebar } from '@/shared/components/layout/PrimarySidebar';
import { TopToolbar } from '@/features/floorplan-2d/components/TopToolbar';
import { WallGraphStoreProvider } from '@/features/floorplan-2d/context/WallGraphStoreContext';
import { FloorStoreProvider } from '@/features/floorplan-2d/context/FloorStoreContext';
import { StageRefProvider } from '@/features/floorplan-2d/context/StageRefContext';

export default function Floorplan2DTab({ projectId }: { projectId: string }) {
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateSize = () => {
      if (canvasContainerRef.current) {
        setCanvasSize({
          width: canvasContainerRef.current.offsetWidth,
          height: canvasContainerRef.current.offsetHeight,
        });
      }
    };
    
    const resizeObserver = new ResizeObserver(updateSize);
    const container = canvasContainerRef.current;
    if (container) {
      resizeObserver.observe(container);
    }
    
    updateSize();

    return () => {
      if (container) {
        resizeObserver.unobserve(container);
      }
    };
  }, []);

  return (
    <WallGraphStoreProvider projectId={projectId}>
      <FloorStoreProvider projectId={projectId}>
        <StageRefProvider>
          <div className="h-full w-full flex">
            <PrimarySidebar />
          <div className="flex-1 flex flex-col min-w-0 relative">
            <main className="flex-1 flex min-h-0">
              <div ref={canvasContainerRef} className="flex-1 relative bg-white min-w-0">
                {/* Toolbar positioned relative to canvas */}
                <div className="absolute top-4 left-0 right-0 z-10 px-4">
                  <TopToolbar />
                </div>
                {canvasSize.width > 0 && (
                  <FloorplanCanvas width={canvasSize.width} height={canvasSize.height} className="w-full h-full" />
                )}
              </div>
              <div className="flex-shrink-0 bg-black h-full flex flex-col">
                <SettingsPanel />
              </div>
            </main>
          </div>
        </div>
        </StageRefProvider>
      </FloorStoreProvider>
    </WallGraphStoreProvider>
  );
}

