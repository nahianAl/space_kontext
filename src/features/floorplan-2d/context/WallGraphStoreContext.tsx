/**
 * Wall graph store context provider for project-scoped state management
 * Provides a React context that gives components access to the project-specific wall graph store
 * Ensures each project has its own isolated store instance
 */
'use client';

import React, { createContext, useContext, useMemo, ReactNode } from 'react';
import { getWallGraphStore } from '../store/wallGraphStore';

interface WallGraphStoreContextValue {
  useStore: ReturnType<typeof getWallGraphStore>;
  projectId: string;
}

const WallGraphStoreContext = createContext<WallGraphStoreContextValue | null>(null);

export const WallGraphStoreProvider: React.FC<{ projectId: string; children: ReactNode }> = ({ 
  projectId, 
  children 
}) => {
  const useStore = useMemo(() => getWallGraphStore(projectId), [projectId]);
  
  const value = useMemo(() => ({
    useStore,
    projectId
  }), [useStore, projectId]);

  return (
    <WallGraphStoreContext.Provider value={value}>
      {children}
    </WallGraphStoreContext.Provider>
  );
};

export const useWallGraphStoreContext = () => {
  const context = useContext(WallGraphStoreContext);
  if (!context) {
    throw new Error('useWallGraphStoreContext must be used within WallGraphStoreProvider');
  }
  return context.useStore;
};

export const useWallGraphStoreContextValue = () => {
  const context = useContext(WallGraphStoreContext);
  if (!context) {
    throw new Error('useWallGraphStoreContextValue must be used within WallGraphStoreProvider');
  }
  return context;
};

