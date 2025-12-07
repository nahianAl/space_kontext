'use client';

import React from 'react';
import dynamic from 'next/dynamic';

// Dynamically import KonvaCanvas to avoid SSR issues and ensure provider context is available
const KonvaCanvas = dynamic(() => import('@/features/floorplan-2d/components/KonvaCanvas').then(mod => mod.KonvaCanvas), {
  ssr: false,
  loading: () => <div className="p-4">Loading Konva Canvas...</div>,
});

export const dynamic = 'force-dynamic';

export default function TestExistingKonvaPage() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Test Existing KonvaCanvas</h1>
        <div className="border border-gray-300 rounded-lg p-4">
          <KonvaCanvas width={800} height={600} />
        </div>
      </div>
    </div>
  );
}
