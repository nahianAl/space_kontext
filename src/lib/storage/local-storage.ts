/**
 * Local file storage service
 * Handles file operations using the local filesystem
 * Designed to be compatible with future cloud storage migration
 */

import { promises as fs } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { 
  type FileMetadata, 
  type UploadOptions, 
  type UploadResult, 
  type DownloadResult, 
  type DeleteResult,
  type FileListOptions,
  type FileListResult,
  type FileCategory
} from './types';
import { validateFile, generateSafeFilename } from './validation';

export class LocalFileStorage {
  private basePath: string;
  private metadataPath: string;

  constructor(basePath: string = './uploads') {
    this.basePath = path.resolve(basePath);
    this.metadataPath = path.join(this.basePath, '.metadata');
    this.ensureDirectories();
  }

  /**
   * Ensure all required directories exist
   */
  private async ensureDirectories(): Promise<void> {
    const directories = [
      this.basePath,
      this.metadataPath,
      path.join(this.basePath, 'images'),
      path.join(this.basePath, 'documents'),
      path.join(this.basePath, 'models'),
      path.join(this.basePath, 'projects'),
      path.join(this.basePath, 'temporary')
    ];

    for (const dir of directories) {
      try {
        await fs.access(dir);
      } catch {
        await fs.mkdir(dir, { recursive: true });
      }
    }
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
    try {
      // Validate file
      const validation = validateFile(file, options);
      if (!validation.isValid) {
        return {
          success: false,
          error: validation.error || 'Validation failed'
        };
      }

      // Generate safe filename and path
      const safeFilename = generateSafeFilename(file.originalname, userId);
      const categoryPath = path.join(this.basePath, options.category);
      const filePath = path.join(categoryPath, safeFilename);

      // Ensure category directory exists
      await fs.mkdir(categoryPath, { recursive: true });

      // Write file to disk
      await fs.writeFile(filePath, file.buffer);

      // Create metadata
      const metadata: FileMetadata = {
        id: uuidv4(),
        filename: safeFilename,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        category: options.category,
        userId,
        ...(options.projectId !== undefined && { projectId: options.projectId }),
        uploadedAt: new Date(),
        ...(options.tags !== undefined && { tags: options.tags }),
        ...(options.metadata !== undefined && { metadata: options.metadata })
      };

      // Save metadata
      await this.saveMetadata(metadata);

      return {
        success: true,
        file: metadata,
        path: filePath
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Download a file
   */
  async downloadFile(fileId: string): Promise<DownloadResult> {
    try {
      const metadata = await this.getMetadata(fileId);
      if (!metadata) {
        return {
          success: false,
          error: 'File not found'
        };
      }

      const filePath = path.join(this.basePath, metadata.category, metadata.filename);
      
      // Check if file exists
      try {
        await fs.access(filePath);
      } catch {
        return {
          success: false,
          error: 'File not found on disk'
        };
      }

      // Read file
      const data = await fs.readFile(filePath);

      // Update last accessed time
      metadata.lastAccessedAt = new Date();
      await this.saveMetadata(metadata);

      return {
        success: true,
        data,
        metadata
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Delete a file
   */
  async deleteFile(fileId: string): Promise<DeleteResult> {
    try {
      const metadata = await this.getMetadata(fileId);
      if (!metadata) {
        return {
          success: false,
          error: 'File not found'
        };
      }

      const filePath = path.join(this.basePath, metadata.category, metadata.filename);
      
      // Delete file from disk
      try {
        await fs.unlink(filePath);
      } catch (error) {
        // File might not exist, but we still want to remove metadata
        console.warn(`File not found on disk: ${filePath}`);
      }

      // Delete metadata
      await this.deleteMetadata(fileId);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * List files with optional filtering
   */
  async listFiles(options: FileListOptions = {}): Promise<FileListResult> {
    try {
      const allMetadata = await this.getAllMetadata();
      
      let filteredFiles = allMetadata;

      // Apply filters
      if (options.category) {
        filteredFiles = filteredFiles.filter(file => file.category === options.category);
      }
      if (options.projectId) {
        filteredFiles = filteredFiles.filter(file => file.projectId === options.projectId);
      }
      if (options.userId) {
        filteredFiles = filteredFiles.filter(file => file.userId === options.userId);
      }
      if (options.tags && options.tags.length > 0) {
        filteredFiles = filteredFiles.filter(file => 
          file.tags && options.tags!.some(tag => file.tags!.includes(tag))
        );
      }

      // Sort by upload date (newest first)
      filteredFiles.sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime());

      // Apply pagination
      const total = filteredFiles.length;
      const offset = options.offset || 0;
      const limit = options.limit || 50;
      const paginatedFiles = filteredFiles.slice(offset, offset + limit);

      return {
        success: true,
        files: paginatedFiles,
        total
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Get file metadata by ID
   */
  async getFileMetadata(fileId: string): Promise<FileMetadata | null> {
    return await this.getMetadata(fileId);
  }

  /**
   * Clean up temporary files older than specified age
   */
  async cleanupTemporaryFiles(maxAgeHours: number = 24): Promise<{ deleted: number; errors: string[] }> {
    const errors: string[] = [];
    let deleted = 0;

    try {
      const allMetadata = await this.getAllMetadata();
      const cutoffTime = new Date(Date.now() - maxAgeHours * 60 * 60 * 1000);
      
      const tempFiles = allMetadata.filter(file => 
        file.category === 'temporary' && file.uploadedAt < cutoffTime
      );

      for (const file of tempFiles) {
        const result = await this.deleteFile(file.id);
        if (result.success) {
          deleted++;
        } else {
          errors.push(`Failed to delete ${file.id}: ${result.error}`);
        }
      }
    } catch (error) {
      errors.push(error instanceof Error ? error.message : 'Unknown error');
    }

    return { deleted, errors };
  }

  /**
   * Get storage statistics
   */
  async getStorageStats(): Promise<{
    totalFiles: number;
    totalSize: number;
    filesByCategory: Record<FileCategory, number>;
    sizeByCategory: Record<FileCategory, number>;
  }> {
    const allMetadata = await this.getAllMetadata();
    
    const stats = {
      totalFiles: allMetadata.length,
      totalSize: 0,
      filesByCategory: {} as Record<FileCategory, number>,
      sizeByCategory: {} as Record<FileCategory, number>
    };

    // Initialize category counters
    const categories: FileCategory[] = ['image', 'document', 'model', 'project', 'temporary'];
    categories.forEach(cat => {
      stats.filesByCategory[cat] = 0;
      stats.sizeByCategory[cat] = 0;
    });

    // Calculate statistics
    allMetadata.forEach(file => {
      stats.totalSize += file.size;
      stats.filesByCategory[file.category]++;
      stats.sizeByCategory[file.category] += file.size;
    });

    return stats;
  }

  // Private helper methods

  private async saveMetadata(metadata: FileMetadata): Promise<void> {
    const metadataFile = path.join(this.metadataPath, `${metadata.id}.json`);
    await fs.writeFile(metadataFile, JSON.stringify(metadata, null, 2));
  }

  private async getMetadata(fileId: string): Promise<FileMetadata | null> {
    try {
      const metadataFile = path.join(this.metadataPath, `${fileId}.json`);
      const data = await fs.readFile(metadataFile, 'utf-8');
      const metadata = JSON.parse(data);
      
      // Convert date strings back to Date objects
      metadata.uploadedAt = new Date(metadata.uploadedAt);
      if (metadata.lastAccessedAt) {
        metadata.lastAccessedAt = new Date(metadata.lastAccessedAt);
      }
      
      return metadata;
    } catch {
      return null;
    }
  }

  private async deleteMetadata(fileId: string): Promise<void> {
    try {
      const metadataFile = path.join(this.metadataPath, `${fileId}.json`);
      await fs.unlink(metadataFile);
    } catch {
      // Metadata file might not exist, ignore error
    }
  }

  private async getAllMetadata(): Promise<FileMetadata[]> {
    try {
      const files = await fs.readdir(this.metadataPath);
      const metadataFiles = files.filter(file => file.endsWith('.json'));
      
      const allMetadata: FileMetadata[] = [];
      
      for (const file of metadataFiles) {
        const fileId = file.replace('.json', '');
        const metadata = await this.getMetadata(fileId);
        if (metadata) {
          allMetadata.push(metadata);
        }
      }
      
      return allMetadata;
    } catch {
      return [];
    }
  }
}
