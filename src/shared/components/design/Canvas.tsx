/**
 * Canvas component for the architectural design platform
 * Provides a drawing surface with grid, rulers, and zoom controls
 */

'use client';

import { useRef, useEffect, useState, ReactNode } from 'react';
import { cn } from '@/shared/lib/utils';

interface CanvasProps {
  children?: ReactNode;
  className?: string;
  width?: number;
  height?: number;
  zoom?: number;
  showGrid?: boolean;
  showRuler?: boolean;
  gridSize?: number;
  snapToGrid?: boolean;
  onZoomChange?: (zoom: number) => void;
  onPanChange?: (x: number, y: number) => void;
  onSelectionChange?: (selection: any[]) => void;
  backgroundColor?: string;
  backgroundImage?: string;
}

export function Canvas({
  children,
  className,
  width = 1200,
  height = 800,
  zoom = 100,
  showGrid = true,
  showRuler = true,
  gridSize = 20,
  snapToGrid = true,
  onZoomChange,
  onPanChange,
  onSelectionChange,
  backgroundColor = '#ffffff',
  backgroundImage
}: CanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [selection, setSelection] = useState<any[]>([]);

  // Handle canvas panning
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 1 || (e.button === 0 && e.ctrlKey)) { // Middle mouse or Ctrl+Left
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
      e.preventDefault();
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      const newPan = {
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      };
      setPan(newPan);
      onPanChange?.(newPan.x, newPan.y);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Handle zoom with mouse wheel
  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -10 : 10;
      const newZoom = Math.max(25, Math.min(400, zoom + delta));
      onZoomChange?.(newZoom);
    }
  };

  // Generate grid pattern
  const generateGridPattern = () => {
    const scaledGridSize = (gridSize * zoom) / 100;
    return {
      backgroundImage: `
        linear-gradient(to right, #e5e7eb 1px, transparent 1px),
        linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)
      `,
      backgroundSize: `${scaledGridSize}px ${scaledGridSize}px`,
      backgroundPosition: `${pan.x % scaledGridSize}px ${pan.y % scaledGridSize}px`
    };
  };

  // Generate ruler markings
  const generateRulerMarkings = (isHorizontal: boolean) => {
    const scaledGridSize = (gridSize * zoom) / 100;
    const markings = [];
    const start = isHorizontal ? pan.x : pan.y;
    const end = start + (isHorizontal ? width : height);
    
    for (let i = Math.floor(start / scaledGridSize) * scaledGridSize; i <= end; i += scaledGridSize) {
      const position = i - start;
      const isMajor = (i / scaledGridSize) % 5 === 0;
      
      markings.push(
        <div
          key={i}
          className={cn(
            'absolute bg-foreground/60',
            isHorizontal 
              ? `w-px h-${isMajor ? '4' : '2'} top-0`
              : `h-px w-${isMajor ? '4' : '2'} left-0`
          )}
          style={{
            [isHorizontal ? 'left' : 'top']: `${position}px`
          }}
        />
      );
    }
    
    return markings;
  };

  return (
    <div className={cn('relative overflow-hidden bg-background', className)}>
      {/* Rulers */}
      {showRuler && (
        <>
          {/* Horizontal Ruler */}
          <div className="absolute top-0 left-0 right-0 h-6 bg-muted border-b border-border z-10">
            <div className="relative h-full">
              {generateRulerMarkings(true)}
            </div>
          </div>
          
          {/* Vertical Ruler */}
          <div className="absolute top-0 left-0 bottom-0 w-6 bg-muted border-r border-border z-10">
            <div className="relative w-full">
              {generateRulerMarkings(false)}
            </div>
          </div>
        </>
      )}

      {/* Canvas Area */}
      <div
        ref={canvasRef}
        className={cn(
          'relative cursor-grab active:cursor-grabbing',
          showRuler && 'mt-6 ml-6'
        )}
        style={{
          width: `${width}px`,
          height: `${height}px`,
          backgroundColor,
          backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
          ...(showGrid ? generateGridPattern() : {}),
          transform: `scale(${zoom / 100}) translate(${pan.x / (zoom / 100)}px, ${pan.y / (zoom / 100)}px)`,
          transformOrigin: '0 0'
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      >
        {/* Canvas Content */}
        <div className="absolute inset-0">
          {children}
        </div>

        {/* Selection Overlay */}
        {selection.length > 0 && (
          <div className="absolute inset-0 pointer-events-none">
            {/* Selection rectangles would be rendered here */}
          </div>
        )}
      </div>

      {/* Canvas Info */}
      <div className="absolute bottom-4 right-4 bg-background/90 backdrop-blur-sm border border-border rounded-lg px-3 py-2 text-xs text-muted-foreground">
        <div>Zoom: {zoom}%</div>
        <div>Grid: {gridSize}px</div>
        <div>Pan: {Math.round(pan.x)}, {Math.round(pan.y)}</div>
      </div>
    </div>
  );
}

/**
 * Canvas Viewport component for managing canvas view state
 */
interface CanvasViewportProps {
  children: ReactNode;
  className?: string;
  initialZoom?: number;
  initialPan?: { x: number; y: number };
  onViewChange?: (view: { zoom: number; pan: { x: number; y: number } }) => void;
}

export function CanvasViewport({
  children,
  className,
  initialZoom = 100,
  initialPan = { x: 0, y: 0 },
  onViewChange
}: CanvasViewportProps) {
  const [zoom, setZoom] = useState(initialZoom);
  const [pan, setPan] = useState(initialPan);

  const handleZoomChange = (newZoom: number) => {
    setZoom(newZoom);
    onViewChange?.({ zoom: newZoom, pan });
  };

  const handlePanChange = (x: number, y: number) => {
    setPan({ x, y });
    onViewChange?.({ zoom, pan: { x, y } });
  };

  return (
    <div className={cn('relative w-full h-full', className)}>
      <Canvas
        zoom={zoom}
        onZoomChange={handleZoomChange}
        onPanChange={handlePanChange}
      >
        {children}
      </Canvas>
    </div>
  );
}
