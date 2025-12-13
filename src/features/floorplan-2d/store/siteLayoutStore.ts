/**
 * Store for managing site layout visibility in the 2D floorplan
 * Controls whether the captured site map image is displayed as a background layer
 */
'use client';

import { create } from 'zustand';

export interface SiteLayoutStore {
  isSiteLayoutVisible: boolean;
  setSiteLayoutVisible: (visible: boolean) => void;
  toggleSiteLayout: () => void;
}

export const useSiteLayoutStore = create<SiteLayoutStore>((set) => ({
  isSiteLayoutVisible: false,
  setSiteLayoutVisible: (visible) => set({ isSiteLayoutVisible: visible }),
  toggleSiteLayout: () => set((state) => ({ isSiteLayoutVisible: !state.isSiteLayoutVisible })),
}));
















