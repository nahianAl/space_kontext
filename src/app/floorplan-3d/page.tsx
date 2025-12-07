'use client';

import React from 'react';
import { ThreeCanvas } from '@/features/model-3d/components/ThreeCanvas';

const Floorplan3DPage = () => {
  // This is a test page - using placeholder projectId
  // In production, this should come from route params or context
  const projectId = 'test-project';
  
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ThreeCanvas projectId={projectId} />
    </div>
  );
};

export default Floorplan3DPage;
