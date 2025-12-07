/**
 * Canvas pan and zoom hook for managing viewport transformations
 * Provides pan and zoom functionality with configurable min/max scale and zoom sensitivity
 * Handles mouse wheel zoom, drag pan, and viewport position updates
 */
'use client';

import { useCallback, useState, useRef, useEffect } from 'react';
import { Point } from '../types/wallGraph';

interface PanZoomOptions {
  minScale?: number;
  maxScale?: number;
  zoomSensitivity?: number;
  initialScale?: number;
}

export const useCanvasPanZoom = (
  options: PanZoomOptions = {}
) => {
  const { minScale = 0.01, maxScale = 10, zoomSensitivity = 0.02, initialScale = 0.17 } = options;
  const [scale, setScale] = useState(initialScale);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  
  const lastPointerPosition = useRef({ x: 0, y: 0 });
  const stageRef = useRef<any>(null);

  const screenToWorld = useCallback((screenX: number, screenY: number): Point => {
    return [(screenX - position.x) / scale, (screenY - position.y) / scale];
  }, [scale, position]);

  const worldToScreen = useCallback((worldX: number, worldY: number): Point => {
    return [worldX * scale + position.x, worldY * scale + position.y];
  }, [scale, position]);

  const handleWheel = useCallback((e: any) => {
    e.evt.preventDefault();
    const stage = stageRef.current;
    if (!stage) {
      return;
    }
    const pointer = stage.getPointerPosition();
    if (!pointer) {
      return;
    }

    if (e.evt.ctrlKey) { // Zooming
      const oldScale = scale;
      const mousePointTo = {
        x: (pointer.x - position.x) / oldScale,
        y: (pointer.y - position.y) / oldScale,
      };
      const newScale = Math.max(minScale, Math.min(oldScale - e.evt.deltaY * zoomSensitivity, maxScale));
      setScale(newScale);
      setPosition({
        x: pointer.x - mousePointTo.x * newScale,
        y: pointer.y - mousePointTo.y * newScale,
      });
    } else { // Panning
      setPosition(prevPos => ({
        x: prevPos.x - e.evt.deltaX,
        y: prevPos.y - e.evt.deltaY,
      }));
    }
  }, [scale, position, minScale, maxScale, zoomSensitivity]);

  const handleMouseDown = useCallback((e: any) => {
    if (e.evt.button === 1 || (e.evt.button === 0 && e.evt.spaceKey)) {
      setIsPanning(true);
      lastPointerPosition.current = e.target.getStage().getPointerPosition();
      // Prevent browser swipe gesture
      e.evt.preventDefault();
      e.evt.stopPropagation();
    }
  }, []);

  const handleMouseMove = useCallback((e: any) => {
    if (!isPanning) {
      return;
    }
    const newPointerPosition = e.target.getStage().getPointerPosition();
    if (!newPointerPosition) {
      return;
    }
    setPosition(prevPos => ({
      x: prevPos.x + (newPointerPosition.x - lastPointerPosition.current.x),
      y: prevPos.y + (newPointerPosition.y - lastPointerPosition.current.y),
    }));
    lastPointerPosition.current = newPointerPosition;
    // Prevent browser swipe gesture during pan
    e.evt.preventDefault();
    e.evt.stopPropagation();
  }, [isPanning]);

  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
  }, []);

  return {
    stageRef,
    scale,
    position,
    isPanning,
    handleWheel,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    screenToWorld,
    worldToScreen,
  };
};
