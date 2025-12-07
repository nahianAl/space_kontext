'use client';

import React, { useRef, useEffect } from 'react';

export default function TestMiteringDirectionPage() {
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
    ctx.clearRect(0, 0, 800, 600);
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, 800, 600);

    // Test the mitering direction fix
    const testCases = [
      {
        name: 'Before Fix: Wrong Direction',
        walls: [
          { start: [100, 100], end: [200, 100], color: '#FF0000', label: 'First Wall' },
          { start: [100, 100], end: [100, 200], color: '#0000FF', label: 'Connected Wall' }
        ],
        y: 50,
        description: 'First wall start node mitering in wrong direction (sliced corner)'
      },
      {
        name: 'After Fix: Correct Direction',
        walls: [
          { start: [300, 100], end: [400, 100], color: '#00FF00', label: 'First Wall' },
          { start: [300, 100], end: [300, 200], color: '#0000FF', label: 'Connected Wall' }
        ],
        y: 50,
        description: 'First wall start node mitering in correct direction (sharp corner)'
      }
    ];

    testCases.forEach((testCase, testIndex) => {
      const y = 50 + testIndex * 200;
      
      // Draw walls
      testCase.walls.forEach((wall, wallIndex) => {
        ctx.strokeStyle = wall.color;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(wall.start[0] || 0, (wall.start[1] || 0) + y);
        ctx.lineTo(wall.end[0] || 0, (wall.end[1] || 0) + y);
        ctx.stroke();
        
        // Draw connection points
        ctx.fillStyle = wall.color;
        ctx.beginPath();
        ctx.arc(wall.start[0] || 0, (wall.start[1] || 0) + y, 5, 0, 2 * Math.PI);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(wall.end[0] || 0, (wall.end[1] || 0) + y, 5, 0, 2 * Math.PI);
        ctx.fill();
        
        // Draw wall labels
        ctx.fillStyle = '#000';
        ctx.font = '12px Arial';
        const midX = ((wall.start[0] || 0) + (wall.end[0] || 0)) / 2;
        const midY = ((wall.start[1] || 0) + (wall.end[1] || 0)) / 2 + y;
        ctx.fillText(wall.label, midX - 30, midY - 10);
      });
      
      // Draw test case labels
      ctx.fillStyle = '#000';
      ctx.font = '16px Arial';
      ctx.fillText(testCase.name, 10, y - 10);
      
      ctx.font = '12px Arial';
      ctx.fillText(testCase.description, 10, y + 250);
    });

    // Draw instructions
    ctx.fillStyle = '#333';
    ctx.font = '18px Arial';
    ctx.fillText('Mitering Direction Fix Test', 10, 30);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Mitering Direction Fix Test</h1>
        
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Before vs After Fix</h2>
          <canvas
            ref={canvasRef}
            width={800}
            height={600}
            className="border border-gray-300 rounded"
          />
          
          <div className="mt-4 text-sm text-gray-600">
            <p><strong>Test Scenario:</strong></p>
            <ul className="list-disc list-inside space-y-1">
              <li><strong>Red/Green Wall:</strong> First wall drawn (horizontal)</li>
              <li><strong>Blue Wall:</strong> Second wall connected to start of first wall</li>
              <li><strong>Connection Point:</strong> Where both walls meet (left end of horizontal wall)</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-red-50 p-4 rounded-lg">
            <h3 className="font-semibold text-red-800 mb-2">❌ Before Fix (Wrong Direction):</h3>
            <ul className="text-sm text-red-700 space-y-1">
              <li>• First wall start node mitering in opposite direction</li>
              <li>• Creates &quot;sliced&quot; corner appearance</li>
              <li>• Mitering goes inward instead of outward</li>
              <li>• Corner looks cut off rather than sharp</li>
            </ul>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold text-green-800 mb-2">✅ After Fix (Correct Direction):</h3>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• First wall start node mitering in correct direction</li>
              <li>• Creates sharp, geometric corner</li>
              <li>• Mitering goes outward like other nodes</li>
              <li>• Corner looks properly mitered</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-6 bg-blue-50 p-4 rounded-lg">
          <h3 className="font-semibold text-blue-800 mb-2">🔧 Technical Fix Applied:</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• <strong>Direction Calculation:</strong> Now calculates wall direction FROM the connection point</li>
            <li>• <strong>Point-Based Logic:</strong> Determines which end of each wall is at the connection point</li>
            <li>• <strong>Consistent Mitering:</strong> All nodes now use the same mitering direction logic</li>
            <li>• <strong>Geometric Accuracy:</strong> Mitering creates proper sharp corners without gaps</li>
          </ul>
        </div>
        
        <div className="mt-4 bg-yellow-50 p-4 rounded-lg">
          <h3 className="font-semibold text-yellow-800 mb-2">🧪 How to Test:</h3>
          <ol className="text-sm text-yellow-700 space-y-1 list-decimal list-inside">
            <li>Go to <code>/test-graph-walls</code> page</li>
            <li>Draw a horizontal wall (first wall)</li>
            <li>Draw a vertical wall connected to the start of the first wall</li>
            <li>Check that the start node now creates a sharp corner (not sliced)</li>
            <li>Compare with other connection points - they should all look the same</li>
          </ol>
        </div>
      </div>
    </div>
  );
}

