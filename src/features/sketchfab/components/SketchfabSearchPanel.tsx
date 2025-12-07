/**
 * Sketchfab search panel component
 * Provides search UI for finding downloadable CC-licensed models
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Search, Loader2, AlertCircle } from 'lucide-react';
import { useSketchfabStore } from '../store/sketchfabStore';
import { usePlacedModelsStore } from '../store/placedModelsStore';
import { ModelCard } from './ModelCard';
import { ModelPreviewModal } from './ModelPreviewModal';
import type { SketchfabModel } from '../types';

// Debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

interface SketchfabSearchPanelProps {
  projectId?: string;
}

export const SketchfabSearchPanel = ({ projectId }: SketchfabSearchPanelProps = {}) => {
  const {
    searchResults,
    isLoading,
    error,
    currentQuery,
    currentPage,
    totalResults,
    perPage,
    selectedModel,
    searchModels,
    setQuery,
    setPage,
    setSelectedModel,
  } = useSketchfabStore();

  const [searchInput, setSearchInput] = useState('');
  const [licenseFilter, setLicenseFilter] = useState('cc-by,cc-by-sa');
  const debouncedQuery = useDebounce(searchInput, 400);

  // Perform search when debounced query changes
  useEffect(() => {
    if (debouncedQuery.trim() || searchResults.length > 0) {
      searchModels({
        q: debouncedQuery.trim(),
        page: 1,
        licenses: licenseFilter,
        downloadable: true,
        sort: 'relevance',
      });
      setQuery(debouncedQuery);
      setPage(1);
    }
  }, [debouncedQuery, licenseFilter]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSearch = useCallback(() => {
    searchModels({
      q: searchInput.trim(),
      page: 1,
      licenses: licenseFilter,
      downloadable: true,
      sort: 'relevance',
    });
    setQuery(searchInput);
    setPage(1);
  }, [searchInput, licenseFilter, searchModels, setQuery, setPage]);

  const handlePageChange = useCallback(
    (newPage: number) => {
      searchModels({
        q: currentQuery,
        page: newPage,
        licenses: licenseFilter,
        downloadable: true,
        sort: 'relevance',
      });
      setPage(newPage);
    },
    [currentQuery, licenseFilter, searchModels, setPage]
  );

  const handlePreview = useCallback(
    (model: SketchfabModel) => {
      setSelectedModel(model);
    },
    [setSelectedModel]
  );

  const addModel = usePlacedModelsStore((state) => state.addModel);
  const setLoading = usePlacedModelsStore((state) => state.setLoading);
  const setError = usePlacedModelsStore((state) => state.setError);

  const handleAddToScene = useCallback(
    async (model: SketchfabModel) => {
      if (!model.is_downloadable) {
        alert('This model is not downloadable');
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Call download API
        const downloadUrl = `/api/sketchfab/download?uid=${encodeURIComponent(model.uid)}${projectId ? `&projectId=${encodeURIComponent(projectId)}` : ''}`;
        const response = await fetch(downloadUrl);

        if (!response.ok) {
          // Try to parse error response, but handle empty responses
          let errorData: any = {};
          try {
            const text = await response.text();
            if (text) {
              errorData = JSON.parse(text);
            }
          } catch (parseError) {
            console.warn('Failed to parse error response:', parseError);
            errorData = { message: `Download failed: ${response.status} ${response.statusText}` };
          }
          
          if (errorData.requiresAuth) {
            // User needs to connect Sketchfab account
            const connect = confirm('You need to connect your Sketchfab account to download models. Open connection page?');
            if (connect) {
              window.location.href = '/api/sketchfab/oauth/start';
            }
            return;
          }

          throw new Error(errorData.message || errorData.error || `Download failed: ${response.status}`);
        }

        const data = await response.json();

        if (!data.success || !data.url) {
          throw new Error('Invalid response from download API');
        }

        // Add model to placed models store
        // Place at origin (0, 0, 0) - can be adjusted later
        addModel({
          modelUid: model.uid,
          fileUrl: data.url,
          position: [0, 0, 0],
          rotation: [0, 0, 0],
          scale: [1, 1, 1],
          attribution: data.attribution || {
            author: model.author,
            modelUrl: model.viewer_url,
            license: model.license,
            title: model.name,
          },
          license: data.license || model.license,
        });

        setLoading(false);
      } catch (error) {
        console.error('Failed to add model to scene:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to add model to scene';
        setError(errorMessage);
        setLoading(false);
        alert(`Error: ${errorMessage}`);
      }
    },
    [projectId, addModel, setLoading, setError]
  );

  const totalPages = Math.ceil(totalResults / perPage);

  return (
    <div className="flex flex-col bg-gray-900 text-white h-full">
      {/* Header */}
      <div className="p-4">
        {/* Search Input */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearch();
              }
            }}
            placeholder="Search for models..."
            className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-500"
          />
        </div>

      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto p-4">
        {isLoading && searchResults.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <Loader2 className="animate-spin mb-2" size={24} />
            <p className="text-sm">Searching models...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-64 text-red-600">
            <AlertCircle className="mb-2" size={24} />
            <p className="text-sm">{error}</p>
            <button
              onClick={handleSearch}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        ) : searchResults.length === 0 && currentQuery ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <p className="text-sm">No models found</p>
            <p className="text-xs text-gray-400 mt-1">Try a different search term</p>
          </div>
        ) : searchResults.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <p className="text-sm">Enter a search term to find models</p>
          </div>
        ) : (
          <>
            {/* Results count */}
            <div className="mb-4 text-xs text-gray-400">
              {totalResults} {totalResults === 1 ? 'model' : 'models'} found
            </div>

            {/* Results grid */}
            <div className="grid grid-cols-2 gap-3">
              {searchResults.map((model) => (
                <ModelCard
                  key={model.uid}
                  model={model}
                  onPreview={handlePreview}
                  onAddToScene={handleAddToScene}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6 flex items-center justify-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Previous
                </button>
                <span className="px-4 py-1.5 text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage >= totalPages}
                  className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Preview Modal */}
      {selectedModel && (
        <ModelPreviewModal model={selectedModel} onClose={() => setSelectedModel(null)} />
      )}
    </div>
  );
};

