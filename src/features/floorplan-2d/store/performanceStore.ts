/**
 * Performance monitoring Zustand store
 * Tracks FPS, last action name, and action duration for performance debugging
 */
'use client';

import { create } from 'zustand';

interface PerformanceState {
  fps: number;
  lastAction: string | null;
  lastActionDuration: number | null;
}

interface PerformanceActions {
  setFps: (fps: number) => void;
  logAction: (name: string, duration: number) => void;
}

export const usePerformanceStore = create<PerformanceState & PerformanceActions>((set) => ({
  fps: 0,
  lastAction: null,
  lastActionDuration: null,
  setFps: (fps) => set({ fps }),
  logAction: (name, duration) => set({ lastAction: name, lastActionDuration: duration }),
}));
