'use client';

import React, { useState } from 'react';
import { ProjectMenu } from './ProjectMenu';
import { Menu, Download } from 'lucide-react';
import { ExportDialog } from '@/features/floorplan-2d/components/ExportDialog';
import { useStageRefContext } from '@/features/floorplan-2d/context/StageRefContext';

export const PrimarySidebar = () => {
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const stageRefContext = useStageRefContext();
  const stageRef = stageRefContext?.stageRef;

  return (
    <>
      <div className="w-16 bg-black text-white flex flex-col items-center py-4 space-y-4">
        <button className="p-2 rounded-md hover:bg-gray-800">
          <Menu size={28} />
        </button>
        <ProjectMenu />

        {/* Export Button - Always visible, will be disabled if stageRef not available */}
        <button
          className="p-2 rounded-md hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => {
            if (stageRef) {
              setExportDialogOpen(true);
            } else {
              console.warn('Export button clicked but stageRef is not available');
            }
          }}
          title={stageRef ? "Export Floor Plan" : "Export unavailable - canvas not ready"}
          disabled={!stageRef}
        >
          <Download size={28} />
        </button>
      </div>

      {/* Export Dialog */}
      {stageRef && (
        <ExportDialog
          isOpen={exportDialogOpen}
          onClose={() => setExportDialogOpen(false)}
          stageRef={stageRef}
        />
      )}
    </>
  );
};
