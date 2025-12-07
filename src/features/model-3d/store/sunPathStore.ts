/**
 * Sun path store for managing sun lighting settings
 * Controls month (1-12) and time of day (0-1, sunrise to sunset)
 */

'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SunPathStore {
  month: number; // 1-12 (January = 1, December = 12)
  timeOfDay: number; // 0-1 (0 = sunrise, 1 = sunset)
  setMonth: (month: number) => void;
  setTimeOfDay: (time: number) => void;
  reset: () => void;
}

const DEFAULT_MONTH = new Date().getMonth() + 1; // Current month (1-12)
const DEFAULT_TIME_OF_DAY = 0.5; // Noon (midway between sunrise and sunset)

export const useSunPathStore = create<SunPathStore>()(
  persist(
    (set) => ({
      month: DEFAULT_MONTH,
      timeOfDay: DEFAULT_TIME_OF_DAY,
      setMonth: (month) => set({ month: Math.max(1, Math.min(12, month)) }),
      setTimeOfDay: (time) => set({ timeOfDay: Math.max(0, Math.min(1, time)) }),
      reset: () => set({ month: DEFAULT_MONTH, timeOfDay: DEFAULT_TIME_OF_DAY }),
    }),
    { name: 'sun-path-settings' }
  )
);

