'use client';

import React, { useState, useEffect } from 'react';
import { Stage, Layer, Circle } from 'react-konva';

export default function TestKonvaBasicPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    console.log('useEffect running, setting mounted to true');
    setMounted(true);
  }, []);

  console.log('Component rendering, mounted:', mounted);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Konva Basic Test</h1>
          <div className="border border-gray-300 rounded-lg bg-red-100 p-4">
            <p className="text-sm text-gray-600 mb-2">Loading... (mounted: {mounted.toString()})</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Konva Basic Test</h1>
        <div className="border border-gray-300 rounded-lg bg-red-100 p-4">
          <p className="text-sm text-gray-600 mb-2">Basic Konva Test (500x300) - Mounted: {mounted.toString()}</p>
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
