/**
 * Zustand store for Sketchfab search state
 */

import { create } from 'zustand';
import type { SketchfabModel, SketchfabSearchParams } from '../types';

interface SketchfabStore {
  // Search state
  searchResults: SketchfabModel[];
  isLoading: boolean;
  error: string | null;
  currentQuery: string;
  currentPage: number;
  totalResults: number;
  perPage: number;

  // Selected model for preview
  selectedModel: SketchfabModel | null;

  // Actions
  searchModels: (params: SketchfabSearchParams) => Promise<void>;
  clearResults: () => void;
  setPage: (page: number) => void;
  setQuery: (query: string) => void;
  setSelectedModel: (model: SketchfabModel | null) => void;
}

export const useSketchfabStore = create<SketchfabStore>((set, get) => ({
  // Initial state
  searchResults: [],
  isLoading: false,
  error: null,
  currentQuery: '',
  currentPage: 1,
  totalResults: 0,
  perPage: 24,
  selectedModel: null,

  // Actions
  searchModels: async (params: SketchfabSearchParams) => {
    try {
      set({ isLoading: true, error: null });

      // Call our API route instead of Sketchfab directly
      const searchParams = new URLSearchParams();
      if (params.q) searchParams.append('q', params.q);
      if (params.page) searchParams.append('page', params.page.toString());
      if (params.licenses) searchParams.append('licenses', params.licenses);
      if (params.downloadable !== undefined) searchParams.append('downloadable', params.downloadable.toString());
      if (params.sort) searchParams.append('sort', params.sort);
      if (params.category) searchParams.append('category', params.category);

      const response = await fetch(`/api/sketchfab/search?${searchParams.toString()}`);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Search failed: ${response.status}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Search failed');
      }

      set({
        searchResults: data.results || [],
        totalResults: data.total || 0,
        currentPage: data.page || params.page || 1,
        perPage: data.perPage || 24,
        currentQuery: params.q || '',
        isLoading: false,
        error: null,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to search models';
      console.error('SketchfabStore.searchModels error:', error);
      set({
        error: errorMessage,
        isLoading: false,
        searchResults: [],
      });
    }
  },

  clearResults: () => {
    set({
      searchResults: [],
      currentQuery: '',
      currentPage: 1,
      totalResults: 0,
      error: null,
    });
  },

  setPage: (page: number) => {
    set({ currentPage: page });
  },

  setQuery: (query: string) => {
    set({ currentQuery: query });
  },

  setSelectedModel: (model: SketchfabModel | null) => {
    set({ selectedModel: model });
  },
}));

