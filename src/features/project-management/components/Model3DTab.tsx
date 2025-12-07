/**
 * Model 3D tab component for the project view
 * Renders the 3D floorplan visualization with wall graph store context
 * Provides the 3D view interface within a project
 * Matches the layout structure of Floorplan2DTab with left sidebar and right settings panel
 */
'use client';

import { Floorplan3DView } from '@/features/model-3d';
import { SettingsSidebar } from '@/features/model-3d/components/SettingsSidebar';
import { ThreeToolbar } from '@/features/model-3d/components/ThreeToolbar';
import { PrimarySidebar } from '@/shared/components/layout/PrimarySidebar';
import dynamic from 'next/dynamic';
import { WallGraphStoreProvider } from '@/features/floorplan-2d/context/WallGraphStoreContext';

const Model3DTab = ({ projectId }: { projectId: string }) => {
  return (
    <WallGraphStoreProvider projectId={projectId}>
      <div className="h-full w-full flex">
        <PrimarySidebar />
        <div className="flex-1 flex flex-col min-w-0 relative">
          <main className="flex-1 flex min-h-0">
            <div className="flex-1 relative bg-white min-w-0">
              {/* Toolbar positioned relative to canvas */}
              <div className="absolute top-4 left-0 right-0 z-10 px-4">
                <ThreeToolbar />
              </div>
              <Floorplan3DView projectId={projectId} />
            </div>
            <div className="flex-shrink-0 bg-black h-full flex flex-col">
              <SettingsSidebar />
            </div>
          </main>
        </div>
      </div>
    </WallGraphStoreProvider>
  );
};

export default dynamic(() => Promise.resolve(Model3DTab), {
  ssr: false,
  loading: () => <div className="p-8 text-center">Loading 3D Viewer...</div>,
});

