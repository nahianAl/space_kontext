/**
 * File validation utilities
 * Handles file type, size, and content validation
 */

import { FILE_VALIDATION, type FileCategory, type UploadOptions } from './types';

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validates file size based on category
 */
export function validateFileSize(
  size: number, 
  category: FileCategory, 
  maxSize?: number
): ValidationResult {
  const categoryMaxSize = getMaxSizeForCategory(category);
  const effectiveMaxSize = maxSize || categoryMaxSize;
  
  if (size > effectiveMaxSize) {
    return {
      isValid: false,
      error: `File size (${formatBytes(size)}) exceeds maximum allowed size (${formatBytes(effectiveMaxSize)}) for category '${category}'`
    };
  }
  
  return { isValid: true };
}

/**
 * Validates file MIME type based on category
 */
export function validateMimeType(
  mimeType: string, 
  category: FileCategory, 
  allowedTypes?: string[]
): ValidationResult {
  const categoryAllowedTypes = getAllowedTypesForCategory(category);
  const effectiveAllowedTypes = allowedTypes || categoryAllowedTypes;
  
  if (!effectiveAllowedTypes.includes(mimeType)) {
    return {
      isValid: false,
      error: `File type '${mimeType}' is not allowed for category '${category}'. Allowed types: ${effectiveAllowedTypes.join(', ')}`
    };
  }
  
  return { isValid: true };
}

/**
 * Validates filename for security and compatibility
 */
export function validateFilename(filename: string): ValidationResult {
  // Check for dangerous characters
  const dangerousChars = /[<>:"/\\|?*\x00-\x1f]/;
  if (dangerousChars.test(filename)) {
    return {
      isValid: false,
      error: 'Filename contains invalid characters'
    };
  }
  
  // Check filename length
  if (filename.length > 255) {
    return {
      isValid: false,
      error: 'Filename is too long (maximum 255 characters)'
    };
  }
  
  // Check for reserved names (Windows)
  const reservedNames = ['CON', 'PRN', 'AUX', 'NUL', 'COM1', 'COM2', 'COM3', 'COM4', 'COM5', 'COM6', 'COM7', 'COM8', 'COM9', 'LPT1', 'LPT2', 'LPT3', 'LPT4', 'LPT5', 'LPT6', 'LPT7', 'LPT8', 'LPT9'];
  const nameWithoutExt = filename.split('.')[0]?.toUpperCase();
  if (nameWithoutExt && reservedNames.includes(nameWithoutExt)) {
    return {
      isValid: false,
      error: 'Filename is reserved and cannot be used'
    };
  }
  
  return { isValid: true };
}

/**
 * Comprehensive file validation
 */
export function validateFile(
  file: { 
    size: number; 
    mimetype: string; 
    originalname: string; 
  },
  options: UploadOptions
): ValidationResult {
  // Validate filename
  const filenameValidation = validateFilename(file.originalname);
  if (!filenameValidation.isValid) {
    return filenameValidation;
  }
  
  // Validate file size
  const sizeValidation = validateFileSize(file.size, options.category, options.maxSize);
  if (!sizeValidation.isValid) {
    return sizeValidation;
  }
  
  // Validate MIME type
  const mimeValidation = validateMimeType(file.mimetype, options.category, options.allowedMimeTypes);
  if (!mimeValidation.isValid) {
    return mimeValidation;
  }
  
  return { isValid: true };
}

/**
 * Get maximum file size for a category
 */
function getMaxSizeForCategory(category: FileCategory): number {
  switch (category) {
    case 'image':
      return FILE_VALIDATION.MAX_IMAGE_SIZE;
    case 'document':
      return FILE_VALIDATION.MAX_DOCUMENT_SIZE;
    case 'model':
      return FILE_VALIDATION.MAX_MODEL_SIZE;
    case 'project':
      return FILE_VALIDATION.MAX_FILE_SIZE;
    case 'temporary':
      return FILE_VALIDATION.MAX_FILE_SIZE;
    default:
      return FILE_VALIDATION.MAX_FILE_SIZE;
  }
}

/**
 * Get allowed MIME types for a category
 */
function getAllowedTypesForCategory(category: FileCategory): string[] {
  switch (category) {
    case 'image':
      return [...FILE_VALIDATION.ALLOWED_IMAGE_TYPES];
    case 'document':
      return [...FILE_VALIDATION.ALLOWED_DOCUMENT_TYPES];
    case 'model':
      return [...FILE_VALIDATION.ALLOWED_MODEL_TYPES];
    case 'project':
      return [...FILE_VALIDATION.ALLOWED_PROJECT_TYPES];
    case 'temporary':
      return [
        ...FILE_VALIDATION.ALLOWED_IMAGE_TYPES,
        ...FILE_VALIDATION.ALLOWED_DOCUMENT_TYPES,
        ...FILE_VALIDATION.ALLOWED_MODEL_TYPES,
        ...FILE_VALIDATION.ALLOWED_PROJECT_TYPES
      ];
    default:
      return [];
  }
}

/**
 * Format bytes to human readable string
 */
export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) {
    return '0 Bytes';
  }
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * Generate a safe filename
 */
export function generateSafeFilename(originalName: string, userId: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  const extension = originalName.split('.').pop() || '';
  const baseName = originalName.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9-_]/g, '_');
  
  return `${userId}_${timestamp}_${random}_${baseName}.${extension}`;
}

/**
 * Get file category from MIME type
 */
export function getCategoryFromMimeType(mimeType: string): FileCategory | null {
  if (FILE_VALIDATION.ALLOWED_IMAGE_TYPES.includes(mimeType as any)) {
    return 'image';
  }
  if (FILE_VALIDATION.ALLOWED_DOCUMENT_TYPES.includes(mimeType as any)) {
    return 'document';
  }
  if (FILE_VALIDATION.ALLOWED_MODEL_TYPES.includes(mimeType as any)) {
    return 'model';
  }
  if (FILE_VALIDATION.ALLOWED_PROJECT_TYPES.includes(mimeType as any)) {
    return 'project';
  }
  
  return null;
}
