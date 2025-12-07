/**
 * B-rep Kernel Migration Test Page
 * Test page for the migrated sketchup-model-3d copy feature with B-rep kernel
 */

'use client';

import { Floorplan3DView } from '@/features/model-3d/components/Floorplan3DView';
import { SettingsSidebar } from '@/features/model-3d/components/SettingsSidebar';
import { ThreeToolbar } from '@/features/model-3d/components/ThreeToolbar';
import { PrimarySidebar } from '@/shared/components/layout/PrimarySidebar';
import dynamic from 'next/dynamic';
import { WallGraphStoreProvider } from '@/features/floorplan-2d/context/WallGraphStoreContext';

const BREPKernelTestPage = () => {
  // Use a test project ID - you can change this to an actual project ID
  const testProjectId = 'test-project';

  return (
    <WallGraphStoreProvider projectId={testProjectId}>
      <div className="h-screen w-full flex">
        <PrimarySidebar />
        <div className="flex-1 flex flex-col min-w-0 relative">
          <main className="flex-1 flex min-h-0">
            <div className="flex-1 relative bg-white min-w-0">
              {/* Toolbar positioned relative to canvas */}
              <div className="absolute top-4 left-0 right-0 z-10 px-4">
                <ThreeToolbar />
              </div>
              <Floorplan3DView projectId={testProjectId} />
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

export default dynamic(() => Promise.resolve(BREPKernelTestPage), {
  ssr: false,
  loading: () => (
    <div className="h-screen w-full flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Loading B-rep Kernel Test...</h1>
        <p className="text-gray-600">Initializing 3D viewer with kernel-based geometry</p>
      </div>
    </div>
  ),
});

