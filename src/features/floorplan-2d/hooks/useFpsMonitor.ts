/**
 * FPS monitoring hook that tracks animation frame rate
 * Updates the performance store with current FPS for performance debugging
 * Uses requestAnimationFrame to measure frame timing
 */
'use client';
import { useRef, useEffect } from 'react';
import { usePerformanceStore } from '../store/performanceStore';

export const useFpsMonitor = () => {
  const requestRef = useRef<number>();
  const lastUpdateTimeRef = useRef<number>(0);
  const frameCountRef = useRef<number>(0);
  const { setFps } = usePerformanceStore();

  const animate = (time: number) => {
    frameCountRef.current++;
    
    // Update FPS counter every second
    if (time - lastUpdateTimeRef.current > 1000) {
      const currentFps = (frameCountRef.current * 1000) / (time - lastUpdateTimeRef.current);
      setFps(Math.round(currentFps));
      
      // Reset counters
      lastUpdateTimeRef.current = time;
      frameCountRef.current = 0;
    }
    
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, []); // Empty dependency array ensures this runs once on mount
};
