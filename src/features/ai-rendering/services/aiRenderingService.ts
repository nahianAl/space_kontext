/**
 * AI Rendering Service
 * Handles communication with KIE.AI API for Nano Banana image generation
 */

import type { GenerationInput, ImageSize, OutputFormat } from '../types';

interface GenerateImageResult {
  success: boolean;
  taskId?: string;
  error?: string;
}

interface TaskStatusResult {
  success: boolean;
  taskId: string;
  status: 'waiting' | 'success' | 'fail';
  resultUrls: string[];
  failCode?: string | null;
  failMsg?: string | null;
  costTime?: number | null;
  completeTime?: number | null;
  createTime?: number;
}

/**
 * Edit an image using Nano Banana Edit
 */
export async function generateImage(
  prompt: string,
  imageUrls: string[],
  imageSize: ImageSize = '1:1',
  outputFormat: OutputFormat = 'png'
): Promise<GenerateImageResult> {
  try {
    const input: GenerationInput = {
      prompt,
      image_urls: imageUrls,
      image_size: imageSize,
      output_format: outputFormat,
    };

    const response = await fetch('/api/ai/generate-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || 'Failed to generate image',
      };
    }

    return {
      success: true,
      taskId: data.taskId,
    };
  } catch (error) {
    console.error('Error in generateImage:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Poll the status of a generation task
 */
export async function pollTaskStatus(taskId: string): Promise<TaskStatusResult> {
  try {
    const response = await fetch(`/api/ai/task-status?taskId=${taskId}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to query task status');
    }

    return data;
  } catch (error) {
    console.error('Error in pollTaskStatus:', error);
    throw error;
  }
}

/**
 * Download generated image and convert to File object
 */
export async function downloadGeneratedImage(
  url: string,
  filename: string = 'generated-image.png'
): Promise<File> {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('Failed to download image');
    }

    const blob = await response.blob();
    const file = new File([blob], filename, { type: blob.type });

    return file;
  } catch (error) {
    console.error('Error downloading image:', error);
    throw error;
  }
}

/**
 * Upload generated image to project files (R2/S3)
 */
export async function saveToProjectFiles(
  projectId: string,
  imageUrl: string,
  filename: string
): Promise<{ success: boolean; fileId?: string; error?: string }> {
  try {
    // Download the image first
    const imageFile = await downloadGeneratedImage(imageUrl, filename);

    // Create form data
    const formData = new FormData();
    formData.append('file', imageFile);
    formData.append('projectId', projectId);
    formData.append('category', 'exports'); // Using 'exports' category for generated renders

    // Upload to file storage
    const response = await fetch('/api/files/upload', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || 'Failed to save image to project',
      };
    }

    return {
      success: true,
      fileId: data.file?.id,
    };
  } catch (error) {
    console.error('Error saving to project files:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Wait for task completion with polling
 */
export async function waitForCompletion(
  taskId: string,
  maxAttempts: number = 30,
  intervalMs: number = 2000
): Promise<TaskStatusResult> {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const status = await pollTaskStatus(taskId);

    if (status.status === 'success' || status.status === 'fail') {
      return status;
    }

    // Wait before next poll
    await new Promise(resolve => setTimeout(resolve, intervalMs));
  }

  throw new Error('Task timed out');
}
