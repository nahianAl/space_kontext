/**
 * Site analysis service for API operations
 * Provides methods for fetching, creating, updating, and deleting site analysis data
 * Handles HTTP requests for site coordinates, boundaries, and analysis data
 */
import type { SiteCoordinates } from '../store/mapStore';

export interface SiteAnalysisData {
  id?: string;
  projectId: string;
  coordinates: SiteCoordinates;
  boundary: GeoJSON.FeatureCollection;
  createdAt?: Date;
  updatedAt?: Date;
}

export class SiteAnalysisService {
  static async save(data: SiteAnalysisData): Promise<SiteAnalysisData> {
    const response = await fetch('/api/site-analysis', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to save site analysis');
    const result = await response.json();
    return result.siteAnalysis;
  }

  static async load(projectId: string): Promise<SiteAnalysisData | null> {
    const response = await fetch(`/api/site-analysis/${projectId}`);
    if (response.status === 404) return null;
    if (!response.ok) throw new Error('Failed to load site analysis');
    const data = await response.json();
    return data.siteAnalysis;
  }
}
