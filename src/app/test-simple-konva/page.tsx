'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import Konva components to avoid SSR issues
const Stage = dynamic(() => import('react-konva').then(mod => mod.Stage), {
  ssr: false,
  loading: () => <div>Loading Stage...</div>,
});
const Layer = dynamic(() => import('react-konva').then(mod => mod.Layer), {
  ssr: false,
  loading: () => <div>Loading Layer...</div>,
});
const Rect = dynamic(() => import('react-konva').then(mod => mod.Rect), {
  ssr: false,
  loading: () => <div>Loading Rect...</div>,
});

export default function SimpleKonvaTest() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    console.log("SimpleKonvaTest useEffect running");
    setMounted(true);
  }, []);

  console.log("SimpleKonvaTest rendering, mounted:", mounted);

  if (!mounted) {
    return <div className="p-4">Loading Konva...</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Simple Konva Test</h1>
      <div className="border border-gray-300 rounded-lg p-4">
        <Stage width={400} height={300} style={{ border: '1px solid black' }}>
          <Layer>
            <Rect x={50} y={50} width={100} height={100} fill="red" />
            <Rect x={200} y={100} width={80} height={80} fill="blue" />
          </Layer>
        </Stage>
      </div>
    </div>
  );
}
