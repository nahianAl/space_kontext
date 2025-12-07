/**
 * Hook to get project-scoped wall graph store instance
 * Ensures 2D editor and 3D viewer share the same store for the same project
 * Memoizes store instance based on projectId
 */
import { useMemo } from 'react';
import { getWallGraphStore } from '../store/wallGraphStore';

export const useProjectWallGraphStore = (projectId: string) => {
  return useMemo(() => getWallGraphStore(projectId), [projectId]);
};

