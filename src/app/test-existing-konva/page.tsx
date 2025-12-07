'use client';

import React from 'react';
import { KonvaCanvas } from '@/features/floorplan-2d/components/KonvaCanvas';

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
