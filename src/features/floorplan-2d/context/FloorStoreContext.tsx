/**
 * Floor store context for project-specific floor data
 * Provides access to zones, furniture blocks, and other floor elements
 */
'use client';

import React from 'react';
import { getFloorStore } from '../store/floorStore';
import type { FloorStore } from '../store/floorStore';
import type { UseBoundStore, StoreApi } from 'zustand';

interface FloorStoreContextValue {
  projectId: string;
}

const FloorStoreContext = React.createContext<UseBoundStore<StoreApi<FloorStore>> | null>(null);
const FloorStoreContextValue = React.createContext<FloorStoreContextValue | null>(null);

export const FloorStoreProvider: React.FC<{
  projectId: string;
  children: React.ReactNode;
}> = ({ projectId, children }) => {
  const store = React.useMemo(() => getFloorStore(projectId), [projectId]);

  return (
    <FloorStoreContext.Provider value={store}>
      <FloorStoreContextValue.Provider value={{ projectId }}>
        {children}
      </FloorStoreContextValue.Provider>
    </FloorStoreContext.Provider>
  );
};

export const useFloorStoreContext = () => {
  const context = React.useContext(FloorStoreContext);
  if (!context) {
    throw new Error('useFloorStoreContext must be used within FloorStoreProvider');
  }
  return context;
};

export const useFloorStoreContextValue = () => {
  const context = React.useContext(FloorStoreContextValue);
  if (!context) {
    throw new Error('useFloorStoreContextValue must be used within FloorStoreProvider');
  }
  return context;
};
