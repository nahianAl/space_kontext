import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import type {
  RenderState,
  ImageSize,
  OutputFormat,
  ImageTransform,
  RenderJob,
} from '../types';

const DEFAULT_TRANSFORM: ImageTransform = {
  rotation: 0,
  scale: 1,
  flipHorizontal: false,
  flipVertical: false,
};

export const useRenderStore = create<RenderState>((set, get) => ({
  // Current configuration
  sourceImage: null,
  sourceImagePreview: null,
  prompt: '',
  imageSize: '1:1',
  outputFormat: 'png',
  transform: { ...DEFAULT_TRANSFORM },

  // Job queue
  jobs: [],
  activeJobId: null,

  // UI state
  isGenerating: false,
  uploadProgress: 0,

  // Actions
  setSourceImage: (file: File | null) => {
    if (!file) {
      set({
        sourceImage: null,
        sourceImagePreview: null,
        transform: { ...DEFAULT_TRANSFORM },
      });
      return;
    }

    // Create preview URL
    const preview = URL.createObjectURL(file);
    set({
      sourceImage: file,
      sourceImagePreview: preview,
      transform: { ...DEFAULT_TRANSFORM },
    });
  },

  setPrompt: (prompt: string) => set({ prompt }),

  setImageSize: (imageSize: ImageSize) => set({ imageSize }),

  setOutputFormat: (outputFormat: OutputFormat) => set({ outputFormat }),

  setTransform: (updates: Partial<ImageTransform>) =>
    set((state) => ({
      transform: { ...state.transform, ...updates },
    })),

  resetTransform: () => set({ transform: { ...DEFAULT_TRANSFORM } }),

  createJob: async () => {
    const state = get();
    const { prompt, imageSize, outputFormat, sourceImage, sourceImagePreview } = state;

    if (!prompt.trim()) {
      throw new Error('Prompt is required');
    }

    if (!sourceImage) {
      throw new Error('Source image is required for editing');
    }

    // Create new job
    const job: RenderJob = {
      id: uuidv4(),
      taskId: null,
      projectId: '', // Will be set by component
      sourceImageUrl: sourceImagePreview,
      prompt,
      specifications: {
        prompt,
        image_urls: [], // Will be set after upload
        image_size: imageSize,
        output_format: outputFormat,
      },
      status: 'uploading',
      resultUrls: [],
      error: null,
      createdAt: Date.now(),
      completedAt: null,
      costTime: null,
    };

    set((state) => ({
      jobs: [job, ...state.jobs],
      activeJobId: job.id,
      isGenerating: true,
      uploadProgress: 0,
    }));

    try {
      // Step 1: Upload source image to R2/S3 to get public URL
      const formData = new FormData();
      formData.append('file', sourceImage);
      formData.append('projectId', job.projectId || 'temp');
      formData.append('category', 'exports');

      set({ uploadProgress: 10 });

      const uploadResponse = await fetch('/api/files/upload', {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload source image');
      }

      const uploadData = await uploadResponse.json();
      const imageUrl = uploadData.url;

      set({ uploadProgress: 50 });

      // Update job with uploaded image URL
      set((state) => ({
        jobs: state.jobs.map((j) =>
          j.id === job.id
            ? { ...j, status: 'pending' as const, sourceImageUrl: imageUrl }
            : j
        ),
        uploadProgress: 60,
      }));

      // Step 2: Call AI API to create generation task
      const response = await fetch('/api/ai/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          image_urls: [imageUrl], // Use uploaded image URL
          image_size: imageSize,
          output_format: outputFormat,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create generation task');
      }

      const data = await response.json();

      set({ uploadProgress: 100 });

      // Update job with taskId
      set((state) => ({
        jobs: state.jobs.map((j) =>
          j.id === job.id
            ? { ...j, taskId: data.taskId, status: 'waiting' as const }
            : j
        ),
        uploadProgress: 0,
      }));

      // Start polling
      get().pollJob(job.id);

    } catch (error) {
      console.error('Error creating job:', error);
      set((state) => ({
        jobs: state.jobs.map((j) =>
          j.id === job.id
            ? {
                ...j,
                status: 'fail' as const,
                error: error instanceof Error ? error.message : 'Unknown error',
                completedAt: Date.now(),
              }
            : j
        ),
        isGenerating: false,
      }));
      throw error;
    }
  },

  pollJob: async (jobId: string) => {
    const state = get();
    const job = state.jobs.find((j) => j.id === jobId);

    if (!job || !job.taskId) return;

    try {
      const response = await fetch(`/api/ai/task-status?taskId=${job.taskId}`);

      if (!response.ok) {
        throw new Error('Failed to query task status');
      }

      const data = await response.json();

      // Update job based on status
      if (data.status === 'success') {
        set((state) => ({
          jobs: state.jobs.map((j) =>
            j.id === jobId
              ? {
                  ...j,
                  status: 'success',
                  resultUrls: data.resultUrls,
                  completedAt: data.completeTime || Date.now(),
                  costTime: data.costTime || null,
                }
              : j
          ),
          isGenerating: state.activeJobId === jobId ? false : state.isGenerating,
        }));
      } else if (data.status === 'fail') {
        set((state) => ({
          jobs: state.jobs.map((j) =>
            j.id === jobId
              ? {
                  ...j,
                  status: 'fail',
                  error: data.failMsg || 'Generation failed',
                  completedAt: Date.now(),
                }
              : j
          ),
          isGenerating: state.activeJobId === jobId ? false : state.isGenerating,
        }));
      } else if (data.status === 'waiting') {
        // Still processing, poll again after delay
        setTimeout(() => get().pollJob(jobId), 2000);
      }
    } catch (error) {
      console.error('Error polling job:', error);
      set((state) => ({
        jobs: state.jobs.map((j) =>
          j.id === jobId
            ? {
                ...j,
                status: 'fail',
                error: error instanceof Error ? error.message : 'Polling failed',
                completedAt: Date.now(),
              }
            : j
        ),
        isGenerating: state.activeJobId === jobId ? false : state.isGenerating,
      }));
    }
  },

  cancelJob: (jobId: string) => {
    set((state) => ({
      jobs: state.jobs.filter((j) => j.id !== jobId),
      isGenerating: state.activeJobId === jobId ? false : state.isGenerating,
      activeJobId: state.activeJobId === jobId ? null : state.activeJobId,
    }));
  },

  clearCompleted: () => {
    set((state) => ({
      jobs: state.jobs.filter(
        (j) => j.status === 'waiting' || j.status === 'pending'
      ),
    }));
  },

  reset: () => {
    // Revoke preview URL if exists
    const state = get();
    if (state.sourceImagePreview) {
      URL.revokeObjectURL(state.sourceImagePreview);
    }

    set({
      sourceImage: null,
      sourceImagePreview: null,
      prompt: '',
      imageSize: '1:1',
      outputFormat: 'png',
      transform: { ...DEFAULT_TRANSFORM },
      isGenerating: false,
      uploadProgress: 0,
    });
  },
}));
