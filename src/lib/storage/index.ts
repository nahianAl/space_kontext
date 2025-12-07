/**
 * Main file storage service
 * Provides a unified interface for file operations
 * Currently uses local storage, designed for easy migration to cloud storage
 */

import { LocalFileStorage } from './local-storage';
import { 
  type FileMetadata, 
  type UploadOptions, 
  type UploadResult, 
  type DownloadResult, 
  type DeleteResult,
  type FileListOptions,
  type FileListResult
} from './types';

export class FileStorageService {
  private storage: LocalFileStorage;

  constructor() {
    this.storage = new LocalFileStorage();
  }

  /**
   * Upload a file
   */
  async uploadFile(
    file: { 
      buffer: Buffer; 
      mimetype: string; 
      originalname: string; 
      size: number;
    },
    userId: string,
    options: UploadOptions
  ): Promise<UploadResult> {
    return await this.storage.uploadFile(file, userId, options);
  }

  /**
   * Download a file
   */
  async downloadFile(fileId: string): Promise<DownloadResult> {
    return await this.storage.downloadFile(fileId);
  }

  /**
   * Delete a file
   */
  async deleteFile(fileId: string): Promise<DeleteResult> {
    return await this.storage.deleteFile(fileId);
  }

  /**
   * List files with optional filtering
   */
  async listFiles(options: FileListOptions = {}): Promise<FileListResult> {
    return await this.storage.listFiles(options);
  }

  /**
   * Get file metadata by ID
   */
  async getFileMetadata(fileId: string): Promise<FileMetadata | null> {
    return await this.storage.getFileMetadata(fileId);
  }

  /**
   * Clean up temporary files
   */
  async cleanupTemporaryFiles(maxAgeHours: number = 24): Promise<{ deleted: number; errors: string[] }> {
    return await this.storage.cleanupTemporaryFiles(maxAgeHours);
  }

  /**
   * Get storage statistics
   */
  async getStorageStats() {
    return await this.storage.getStorageStats();
  }
}

// Export singleton instance
export const fileStorage = new FileStorageService();

// Export types and utilities
export * from './types';
export * from './validation';
export { LocalFileStorage } from './local-storage';
