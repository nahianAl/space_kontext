'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Test dynamic import of Konva
const Stage = dynamic(() => import('react-konva').then(mod => ({ default: mod.Stage })), { 
  ssr: false,
  loading: () => <div>Loading Stage...</div>
});

const Layer = dynamic(() => import('react-konva').then(mod => ({ default: mod.Layer })), { 
  ssr: false,
  loading: () => <div>Loading Layer...</div>
});

const Circle = dynamic(() => import('react-konva').then(mod => ({ default: mod.Circle })), { 
  ssr: false,
  loading: () => <div>Loading Circle...</div>
});

export default function TestKonvaDynamicPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Konva Dynamic Import Test</h1>
          <div className="border border-gray-300 rounded-lg bg-red-100 p-4">
            <p className="text-sm text-gray-600 mb-2">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Konva Dynamic Import Test</h1>
        <div className="border border-gray-300 rounded-lg bg-red-100 p-4">
          <p className="text-sm text-gray-600 mb-2">Dynamic Konva Test (500x300)</p>
          <Stage width={500} height={300} className="border border-blue-500 bg-white">
            <Layer>
              <Circle x={100} y={100} radius={50} fill="red" />
              <Circle x={200} y={150} radius={30} fill="blue" />
            </Layer>
          </Stage>
        </div>
      </div>
    </div>
  );
}
