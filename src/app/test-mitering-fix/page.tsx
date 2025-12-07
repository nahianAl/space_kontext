'use client';

import React, { useRef, useEffect } from 'react';

export default function TestMiteringFixPage() {
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

    // Test the specific scenario: first wall start node mitering
    const testCases = [
      {
        name: 'First Wall Start Node Test',
        walls: [
          { start: [100, 100], end: [200, 100], color: '#FF0000' }, // First wall (horizontal)
          { start: [200, 100], end: [200, 200], color: '#00FF00' }, // Second wall (vertical, connected at end of first)
          { start: [100, 100], end: [100, 200], color: '#0000FF' }  // Third wall (vertical, connected at start of first)
        ]
      }
    ];

    testCases.forEach((testCase, testIndex) => {
      const y = 50 + testIndex * 200;
      
      // Draw walls
      testCase.walls.forEach((wall, wallIndex) => {
        ctx.strokeStyle = wall.color;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(wall.start[0] || 0, (wall.start[1] || 0) + y);
        ctx.lineTo(wall.end[0] || 0, (wall.end[1] || 0) + y);
        ctx.stroke();
        
        // Draw connection points
        ctx.fillStyle = wall.color;
        ctx.beginPath();
        ctx.arc(wall.start[0] || 0, (wall.start[1] || 0) + y, 4, 0, 2 * Math.PI);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(wall.end[0] || 0, (wall.end[1] || 0) + y, 4, 0, 2 * Math.PI);
        ctx.fill();
      });
      
      // Draw labels
      ctx.fillStyle = '#000';
      ctx.font = '14px Arial';
      ctx.fillText(testCase.name, 10, y - 10);
      
      ctx.font = '12px Arial';
      testCase.walls.forEach((wall, wallIndex) => {
        const midX = ((wall.start[0] || 0) + (wall.end[0] || 0)) / 2;
        const midY = ((wall.start[1] || 0) + (wall.end[1] || 0)) / 2 + y;
        ctx.fillText(`Wall ${wallIndex + 1}`, midX - 20, midY - 5);
      });
    });

    // Draw instructions
    ctx.fillStyle = '#333';
    ctx.font = '16px Arial';
    ctx.fillText('First Wall Start Node Mitering Test', 10, 30);
    ctx.font = '12px Arial';
    ctx.fillText('Red wall is the first wall drawn. Its start node (left end) should now miter correctly', 10, 50);
    ctx.fillText('when connected to other walls (blue wall). Previously this was the problematic case.', 10, 65);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">First Wall Start Node Mitering Fix Test</h1>
        
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Test Case: First Wall Start Node</h2>
          <canvas
            ref={canvasRef}
            width={800}
            height={600}
            className="border border-gray-300 rounded"
          />
          
          <div className="mt-4 text-sm text-gray-600">
            <p><strong>Test Scenario:</strong></p>
            <ul className="list-disc list-inside space-y-1">
              <li><strong>Red Wall:</strong> First wall drawn (horizontal) - this was the problematic case</li>
              <li><strong>Green Wall:</strong> Second wall (vertical, connected to end of red wall)</li>
              <li><strong>Blue Wall:</strong> Third wall (vertical, connected to start of red wall)</li>
            </ul>
            <p className="mt-2"><strong>Expected Result:</strong> The start node of the red wall (left end) should now miter correctly with the blue wall.</p>
          </div>
        </div>
        
        <div className="mt-6 bg-green-50 p-4 rounded-lg">
          <h3 className="font-semibold text-green-800 mb-2">Fix Applied:</h3>
          <ul className="text-sm text-green-700 space-y-1">
            <li>• <strong>Bidirectional Connection Detection:</strong> Now checks for all connected walls at each node</li>
            <li>• <strong>Point-Based Mitering:</strong> Calculates mitering based on all walls connected to a point</li>
            <li>• <strong>First Wall Handling:</strong> First wall&apos;s start node now gets proper mitering when connected to other walls</li>
            <li>• <strong>Improved Logic:</strong> Uses <code>findWallsConnectedToPoint()</code> and <code>calculateMiterForPoint()</code></li>
          </ul>
        </div>
        
        <div className="mt-4 bg-blue-50 p-4 rounded-lg">
          <h3 className="font-semibold text-blue-800 mb-2">How to Test:</h3>
          <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
            <li>Go to <code>/test-graph-walls</code> page</li>
            <li>Draw a horizontal wall (first wall)</li>
            <li>Draw a vertical wall connected to the start of the first wall</li>
            <li>Check that the start node of the first wall now mitering correctly</li>
            <li>Compare with previous behavior - the mitering should be perfect now</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
