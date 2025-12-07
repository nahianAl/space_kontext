/**
 * TypeScript types for Sketchfab integration
 */

export interface SketchfabModel {
  uid: string;
  name: string;
  thumbnail: string;
  author: string;
  license: string; // Normalized: 'cc-by', 'cc-by-sa', 'unknown'
  licenseLabel?: string; // Original label from Sketchfab: 'CC Attribution', etc.
  is_downloadable: boolean;
  viewer_url: string;
  description?: string;
  faceCount?: number;
  vertexCount?: number;
  animationCount?: number;
  publishedAt?: string;
}

export interface SketchfabSearchParams {
  q?: string;
  page?: number;
  licenses?: string; // 'cc-by,cc-by-sa'
  downloadable?: boolean;
  sort?: 'relevance' | 'popularity' | 'publishedAt';
  category?: string;
}

export interface SketchfabSearchResponse {
  results: SketchfabModel[];
  total: number;
  page: number;
  perPage: number;
}

export interface SketchfabAttribution {
  author: string;
  authorUrl: string;
  modelUrl: string;
  license: string;
  title: string;
}

