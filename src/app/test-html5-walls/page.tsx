'use client';

import React, { useRef, useEffect, useState } from 'react';

interface Point {
  x: number;
  y: number;
}

interface Wall {
  id: string;
  start: Point;
  end: Point;
  thickness: number;
}

export default function TestHtml5WallsPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [walls, setWalls] = useState<Wall[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentStart, setCurrentStart] = useState<Point | null>(null);
  const [currentEnd, setCurrentEnd] = useState<Point | null>(null);
  const [wallThickness, setWallThickness] = useState(50);

  const drawWall = (ctx: CanvasRenderingContext2D, wall: Wall) => {
    const { start, end, thickness } = wall;
    
    // Calculate wall direction
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const length = Math.sqrt(dx * dx + dy * dy);
    
    if (length === 0) {
      return;
    }
    
    // Normalize direction
    const dirX = dx / length;
    const dirY = dy / length;
    
    // Perpendicular vector
    const perpX = -dirY;
    const perpY = dirX;
    
    const halfThickness = thickness / 2;
    
    // Calculate wall corners
    const corners = [
      { x: start.x + perpX * halfThickness, y: start.y + perpY * halfThickness },
      { x: end.x + perpX * halfThickness, y: end.y + perpY * halfThickness },
      { x: end.x - perpX * halfThickness, y: end.y - perpY * halfThickness },
      { x: start.x - perpX * halfThickness, y: start.y - perpY * halfThickness }
    ];
    
    // Draw wall polygon
    ctx.fillStyle = '#E6E6E6';
    ctx.strokeStyle = '#CCCCCC';
    ctx.lineWidth = 1;
    
    ctx.beginPath();
    if (corners[0]) {
      ctx.moveTo(corners[0].x, corners[0].y);
      for (let i = 1; i < corners.length; i++) {
        const corner = corners[i];
        if (corner) {
          ctx.lineTo(corner.x, corner.y);
        }
      }
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    // Draw centerline for debugging
    ctx.strokeStyle = '#0066FF';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();
    ctx.setLineDash([]);
  };

  const redrawCanvas = () => {
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
    
    // Draw all walls
    walls.forEach(wall => drawWall(ctx, wall));
    
    // Draw current drawing preview
    if (isDrawing && currentStart && currentEnd) {
      const previewWall: Wall = {
        id: 'preview',
        start: currentStart,
        end: currentEnd,
        thickness: wallThickness
      };
      drawWall(ctx, previewWall);
    }
  };

  useEffect(() => {
    redrawCanvas();
  }, [walls, isDrawing, currentStart, currentEnd, wallThickness]);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    if (!isDrawing) {
      // Start drawing
      setIsDrawing(true);
      setCurrentStart({ x, y });
      setCurrentEnd({ x, y });
    } else {
      // Finish drawing
      const newWall: Wall = {
        id: Math.random().toString(36).substring(2, 15),
        start: currentStart!,
        end: { x, y },
        thickness: wallThickness
      };
      
      setWalls(prev => [...prev, newWall]);
      setIsDrawing(false);
      setCurrentStart(null);
      setCurrentEnd(null);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) {
      return;
    }
    
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setCurrentEnd({ x, y });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape' && isDrawing) {
      setIsDrawing(false);
      setCurrentStart(null);
      setCurrentEnd(null);
    }
  };

  const clearAll = () => {
    setWalls([]);
    setIsDrawing(false);
    setCurrentStart(null);
    setCurrentEnd(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">HTML5 Canvas Wall Drawing</h1>
        
        <div className="relative">
          <div className="absolute top-4 left-4 z-10 bg-white p-4 rounded-lg shadow-lg">
            <h3 className="font-bold mb-2">Wall Drawing System</h3>
            <div className="space-y-2 text-sm">
              <p><strong>Instructions:</strong></p>
              <p>• Click to start drawing a wall</p>
              <p>• Click again to finish the wall</p>
              <p>• Press &apos;Esc&apos; to cancel drawing</p>
              <p>• Gray polygons = wall geometry</p>
              <p>• Blue dashed lines = centerlines</p>
            </div>
            
            <div className="mt-4 space-y-2">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Wall Thickness: {wallThickness}px
                </label>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={wallThickness}
                  onChange={(e) => setWallThickness(Number(e.target.value))}
                  className="w-full"
                />
              </div>
              
              <button
                onClick={clearAll}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Clear All
              </button>
            </div>
            
            <div className="mt-4 text-xs text-gray-600">
              <p>Walls: {walls.length}</p>
              <p>Status: {isDrawing ? 'Drawing...' : 'Ready'}</p>
            </div>
          </div>
          
          <canvas
            ref={canvasRef}
            width={1000}
            height={700}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onKeyDown={handleKeyDown}
            tabIndex={0}
            className="border border-gray-300 rounded-lg bg-white cursor-crosshair"
            style={{ outline: 'none' }}
          />
        </div>
      </div>
    </div>
  );
}
