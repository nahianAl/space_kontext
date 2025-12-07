'use client';

import React, { useState, useEffect } from 'react';

export default function TestNoKonvaPage() {
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
          <h1 className="text-3xl font-bold mb-8">No Konva Test</h1>
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
        <h1 className="text-3xl font-bold mb-8">No Konva Test</h1>
        <div className="border border-gray-300 rounded-lg bg-red-100 p-4">
          <p className="text-sm text-gray-600 mb-2">Basic React Test - Mounted: {mounted.toString()}</p>
          <div className="w-[500px] h-[300px] border border-blue-500 bg-white flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-500 rounded-full mx-auto mb-4"></div>
              <div className="w-8 h-8 bg-blue-500 rounded-full mx-auto"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
