'use client';

import React, { useRef, useEffect } from 'react';

export default function TestHtml5CanvasPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return;
    }

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw some shapes
    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.arc(100, 100, 50, 0, 2 * Math.PI);
    ctx.fill();

    ctx.fillStyle = 'blue';
    ctx.beginPath();
    ctx.arc(200, 150, 30, 0, 2 * Math.PI);
    ctx.fill();

    // Draw a rectangle
    ctx.fillStyle = 'green';
    ctx.fillRect(300, 50, 100, 80);

    // Draw some text
    ctx.fillStyle = 'black';
    ctx.font = '16px Arial';
    ctx.fillText('HTML5 Canvas Test', 50, 250);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">HTML5 Canvas Test</h1>
        <div className="border border-gray-300 rounded-lg bg-red-100 p-4">
          <p className="text-sm text-gray-600 mb-2">HTML5 Canvas Test (500x300)</p>
          <canvas
            ref={canvasRef}
            width={500}
            height={300}
            className="border border-blue-500 bg-white"
          />
        </div>
      </div>
    </div>
  );
}
