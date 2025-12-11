/**
 * Project-related TypeScript types
 * Used across the application for project and file management
 */

export interface Project {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  userId: string | null;
  files?: ProjectFile[];
}

export interface ProjectFile {
  id: string;
  projectId: string;
  name: string;
  type: 'dxf' | 'png' | 'svg' | 'gltf' | 'obj' | 'pdf';
  category: 'import' | 'export' | 'render';
  url: string;
  size: number;
  uploadedAt: string;
}

export type FeatureType = 'site-analysis' | 'floorplan-2d' | 'model-3d' | 'render';

export interface FeatureMetadata {
  id: FeatureType;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  route: string;
  color: string;
}
