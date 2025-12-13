/**
 * AI Rendering Feature Types
 * For Nano Banana (Gemini 2.5 Flash) image generation via KIE.AI
 */

// Image aspect ratio options
export type ImageSize =
  | '1:1'
  | '9:16'
  | '16:9'
  | '3:4'
  | '4:3'
  | '3:2'
  | '2:3'
  | '5:4'
  | '4:5'
  | '21:9'
  | 'auto';

// Output format options
export type OutputFormat = 'png' | 'jpeg';

// Task status from KIE.AI API
export type TaskStatus = 'waiting' | 'success' | 'fail';

// Generation input parameters
export interface GenerationInput {
  prompt: string;
  image_urls: string[]; // Required: URLs of input images (up to 10, max 10MB each)
  output_format?: OutputFormat;
  image_size?: ImageSize;
}

// API request to create generation task
export interface CreateTaskRequest {
  model: 'google/nano-banana-edit';
  input: GenerationInput;
  callBackUrl?: string;
}

// API response from create task endpoint
export interface CreateTaskResponse {
  code: number;
  msg: string;
  data: {
    taskId: string;
  };
}

// Task record from query endpoint
export interface TaskRecord {
  taskId: string;
  model: string;
  state: TaskStatus;
  param: string; // JSON string of CreateTaskRequest
  resultJson: string | null; // JSON string with {resultUrls: string[]}
  failCode: string | null;
  failMsg: string | null;
  costTime: number | null;
  completeTime: number | null;
  createTime: number;
}

// API response from query task endpoint
export interface QueryTaskResponse {
  code: number;
  msg: string;
  data: TaskRecord;
}

// Parsed result from resultJson
export interface TaskResult {
  resultUrls: string[];
}

// Client-side render job tracking
export interface RenderJob {
  id: string; // Local UUID
  taskId: string | null; // KIE.AI task ID
  projectId: string;
  sourceImageUrl: string | null; // Uploaded source image
  prompt: string;
  specifications: GenerationInput;
  status: TaskStatus | 'uploading' | 'pending';
  resultUrls: string[];
  error: string | null;
  createdAt: number;
  completedAt: number | null;
  costTime: number | null; // Generation time in milliseconds
}

// Image editing operations
export interface ImageTransform {
  rotation: number; // 0, 90, 180, 270
  scale: number; // 0.1 - 2.0
  flipHorizontal: boolean;
  flipVertical: boolean;
}

// Render store state
export interface RenderState {
  // Current job being configured
  sourceImage: File | null;
  sourceImagePreview: string | null;
  prompt: string;
  imageSize: ImageSize;
  outputFormat: OutputFormat;
  transform: ImageTransform;

  // Job queue and history
  jobs: RenderJob[];
  activeJobId: string | null;

  // UI state
  isGenerating: boolean;
  uploadProgress: number;

  // Actions
  setSourceImage: (file: File | null) => void;
  setPrompt: (prompt: string) => void;
  setImageSize: (size: ImageSize) => void;
  setOutputFormat: (format: OutputFormat) => void;
  setTransform: (transform: Partial<ImageTransform>) => void;
  resetTransform: () => void;

  createJob: () => Promise<void>;
  pollJob: (jobId: string) => Promise<void>;
  cancelJob: (jobId: string) => void;
  clearCompleted: () => void;
  reset: () => void;
}
