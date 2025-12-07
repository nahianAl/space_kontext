/**
 * File storage types and interfaces
 * Designed to be compatible with both local storage and future cloud storage (R2/S3)
 */

export interface FileMetadata {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  category: FileCategory;
  userId: string;
  projectId?: string;
  uploadedAt: Date;
  lastAccessedAt?: Date;
  tags?: string[];
  metadata?: Record<string, unknown>;
}

export type FileCategory = 'image' | 'document' | 'model' | 'project' | 'temporary';

export interface UploadOptions {
  category: FileCategory;
  projectId?: string;
  tags?: string[];
  metadata?: Record<string, unknown>;
  maxSize?: number; // in bytes
  allowedMimeTypes?: string[];
}

export interface UploadResult {
  success: boolean;
  file?: FileMetadata;
  error?: string;
  path?: string;
}

export interface DownloadResult {
  success: boolean;
  data?: Buffer;
  metadata?: FileMetadata;
  error?: string;
}

export interface DeleteResult {
  success: boolean;
  error?: string;
}

export interface FileListOptions {
  category?: FileCategory;
  projectId?: string;
  userId?: string;
  limit?: number;
  offset?: number;
  tags?: string[];
}

export interface FileListResult {
  success: boolean;
  files?: FileMetadata[];
  total?: number;
  error?: string;
}

// File validation constants
export const FILE_VALIDATION = {
  MAX_FILE_SIZE: 50 * 1024 * 1024, // 50MB
  MAX_IMAGE_SIZE: 10 * 1024 * 1024, // 10MB
  MAX_DOCUMENT_SIZE: 25 * 1024 * 1024, // 25MB
  MAX_MODEL_SIZE: 100 * 1024 * 1024, // 100MB
  
  ALLOWED_IMAGE_TYPES: [
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml'
  ],
  
  ALLOWED_DOCUMENT_TYPES: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
    'text/csv',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ],
  
  ALLOWED_MODEL_TYPES: [
    'model/gltf+json',
    'model/gltf-binary',
    'application/octet-stream', // For .obj, .fbx, etc.
    'text/plain' // For .obj files
  ],
  
  ALLOWED_PROJECT_TYPES: [
    'application/json',
    'application/zip',
    'application/x-zip-compressed'
  ]
} as const;

// Storage configuration
export interface StorageConfig {
  basePath: string;
  maxFileSize: number;
  allowedMimeTypes: string[];
  enableCompression: boolean;
  enableEncryption: boolean;
}
