/**
 * Project Zustand store for managing project state
 * Handles project CRUD operations, current project selection, and persistence
 * Provides project management state and actions
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Project {
  id: string;
  name: string;
  userId: string | null; // null for demo user
  createdAt: Date;
  updatedAt: Date;
  // Site data will be stored in separate SiteAnalysis table
}

interface ProjectState {
  currentProject: Project | null;
  projects: Project[];
  isLoading: boolean;
  error: string | null;
}

interface ProjectActions {
  setCurrentProject: (project: Project | null) => void;
  setProjects: (projects: Project[]) => void;
  addProject: (project: Project) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useProjectStore = create<ProjectState & ProjectActions>()(
  persist(
    (set) => ({
      currentProject: null,
      projects: [],
      isLoading: false,
      error: null,

      setCurrentProject: (project) => set({ currentProject: project }),
      setProjects: (projects) => set({ projects }),
      addProject: (project) => set((state) => ({ 
        projects: [project, ...state.projects] 
      })),
      updateProject: (id, updates) => set((state) => ({
        projects: state.projects.map(p => 
          p.id === id ? { ...p, ...updates } : p
        ),
        currentProject: state.currentProject?.id === id 
          ? { ...state.currentProject, ...updates }
          : state.currentProject
      })),
      deleteProject: (id) => set((state) => ({
        projects: state.projects.filter(p => p.id !== id),
        currentProject: state.currentProject?.id === id 
          ? null 
          : state.currentProject
      })),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
    }),
    {
      name: 'project-store',
      partialize: (state) => ({
        currentProject: state.currentProject,
      }),
    }
  )
);
