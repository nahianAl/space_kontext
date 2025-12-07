/**
 * Floorplan 3D view wrapper component
 * Provides the main 3D visualization interface with controls and viewport
 * Integrates ThreeCanvas with project context and wall graph store
 */
'use client';

import React, { useEffect, useState } from 'react';
import { ThreeCanvas } from './ThreeCanvas';
import { TagsPanel } from './TagsPanel';
import { SketchfabSearchPanel } from '@/features/sketchfab';
import { useWallGraphStoreContext } from '@/features/floorplan-2d/context/WallGraphStoreContext';
import { X } from 'lucide-react';

interface Floorplan3DViewProps {
  projectId: string;
}

export const Floorplan3DView = ({ projectId }: Floorplan3DViewProps) => {
  const useWallGraphStore = useWallGraphStoreContext();
  const [showTagsPanel, setShowTagsPanel] = useState(false);
  const [showSketchfabPanel, setShowSketchfabPanel] = useState(false);
  
  // Expose function to open Sketchfab panel (for SettingsSidebar trigger)
  React.useEffect(() => {
    (window as any).__openSketchfabPanel = () => setShowSketchfabPanel(true);
    return () => {
      delete (window as any).__openSketchfabPanel;
    };
  }, []);

  useEffect(() => {
    // Subscribe to store changes
    const unsubscribe = useWallGraphStore.subscribe(() => {
      // Store subscription
    });

    return () => unsubscribe();
  }, [useWallGraphStore]);

  return (
    <div className="w-full h-full relative flex">
      {/* Main 3D canvas */}
      <div className="flex-1">
        <ThreeCanvas projectId={projectId} />
      </div>


      {/* Right sidebar - Tags panel */}
      {showTagsPanel && (
        <div className="w-80 h-full border-l border-gray-700 bg-gray-900 overflow-hidden flex-shrink-0">
          <TagsPanel />
        </div>
      )}

      {/* Right sidebar - Sketchfab panel */}
      {showSketchfabPanel && (
        <div className="w-[500px] h-full border-l border-gray-700 bg-gray-900 overflow-hidden flex-shrink-0 absolute right-0 top-0 z-20 shadow-2xl">
          <div className="h-full flex flex-col">
            {/* Header with close button */}
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400">Powered by</span>
                <img
                  src="/sketchfab-logo-text-black.svg"
                  alt="Sketchfab"
                  className="h-6 w-auto opacity-80 invert"
                />
              </div>
              <button
                onClick={() => setShowSketchfabPanel(false)}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                aria-label="Close Asset Vault panel"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
            {/* Panel content */}
            <div className="flex-1 overflow-hidden">
              <SketchfabSearchPanel projectId={projectId} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
