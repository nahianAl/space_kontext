/**
 * Sketchfab API service layer
 * Handles communication with Sketchfab Data API v3
 */

import type { SketchfabModel, SketchfabSearchParams, SketchfabSearchResponse } from '../types';

const SKETCHFAB_API_BASE = 'https://api.sketchfab.com/v3';

/**
 * Search for downloadable CC-licensed models on Sketchfab
 */
export async function searchModels(params: SketchfabSearchParams): Promise<SketchfabSearchResponse> {
  const {
    q = '',
    page = 1,
    licenses = 'cc-by,cc-by-sa',
    downloadable = true,
    sort = 'relevance',
    category,
  } = params;

  // Build query parameters
  const searchParams = new URLSearchParams({
    type: 'models',
    q: q.trim(),
    page: page.toString(),
    per_page: '24',
    downloadable: downloadable.toString(),
    license: licenses,
    sort_by: sort,
  });

  if (category) {
    searchParams.append('categories', category);
  }

  const url = `${SKETCHFAB_API_BASE}/search?${searchParams.toString()}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Sketchfab API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    // Sanitize and transform results
    const results: SketchfabModel[] = (data.results || []).map((model: any) => ({
      uid: model.uid,
      name: model.name,
      thumbnail:
        model.thumbnails?.images?.[0]?.url ||
        model.thumbnails?.['360']?.url ||
        model.thumbnail?.url ||
        '',
      author: model.user?.displayName || model.user?.username || 'Unknown',
      license: model.license || model.licenseType || 'unknown',
      is_downloadable: model.isDownloadable || model.is_downloadable || false,
      viewer_url: `https://sketchfab.com/models/${model.uid}`,
      description: model.description,
      faceCount: model.faceCount,
      vertexCount: model.vertexCount,
      animationCount: model.animationCount,
      publishedAt: model.publishedAt,
    }));

    return {
      results,
      total: data.total || 0,
      page: data.page || page,
      perPage: data.per_page || 24,
    };
  } catch (error) {
    console.error('SketchfabService.searchModels:', error);
    throw error;
  }
}

/**
 * Get model details by UID
 */
export async function getModelDetails(uid: string): Promise<SketchfabModel | null> {
  try {
    const response = await fetch(`${SKETCHFAB_API_BASE}/models/${uid}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`Sketchfab API error: ${response.status}`);
    }

    const model = await response.json();

    return {
      uid: model.uid,
      name: model.name,
      thumbnail:
        model.thumbnails?.images?.[0]?.url ||
        model.thumbnails?.['360']?.url ||
        model.thumbnail?.url ||
        '',
      author: model.user?.displayName || model.user?.username || 'Unknown',
      license: model.license || model.licenseType || 'unknown',
      is_downloadable: model.isDownloadable || model.is_downloadable || false,
      viewer_url: `https://sketchfab.com/models/${model.uid}`,
      description: model.description,
      faceCount: model.faceCount,
      vertexCount: model.vertexCount,
      animationCount: model.animationCount,
      publishedAt: model.publishedAt,
    };
  } catch (error) {
    console.error('SketchfabService.getModelDetails:', error);
    throw error;
  }
}

