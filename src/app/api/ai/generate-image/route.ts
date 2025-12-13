import { NextRequest, NextResponse } from 'next/server';
import type { CreateTaskRequest, CreateTaskResponse, GenerationInput } from '@/features/ai-rendering/types';

const KIE_AI_API_KEY = process.env.KIE_AI_API_KEY;
const KIE_AI_BASE_URL = 'https://api.kie.ai/api/v1/jobs';

/**
 * POST /api/ai/generate-image
 * Creates a new image generation task with Nano Banana (Gemini 2.5 Flash)
 */
export async function POST(request: NextRequest) {
  try {
    // Check API key
    if (!KIE_AI_API_KEY) {
      return NextResponse.json(
        { error: 'KIE_AI_API_KEY not configured' },
        { status: 500 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { prompt, image_urls, image_size, output_format } = body as GenerationInput;

    // Validate prompt
    if (!prompt || prompt.trim().length === 0) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    if (prompt.length > 5000) {
      return NextResponse.json(
        { error: 'Prompt must be 5000 characters or less' },
        { status: 400 }
      );
    }

    // Validate image_urls
    if (!image_urls || !Array.isArray(image_urls) || image_urls.length === 0) {
      return NextResponse.json(
        { error: 'At least one image URL is required for image editing' },
        { status: 400 }
      );
    }

    if (image_urls.length > 10) {
      return NextResponse.json(
        { error: 'Maximum 10 images allowed' },
        { status: 400 }
      );
    }

    // Build request payload
    const payload: CreateTaskRequest = {
      model: 'google/nano-banana-edit',
      input: {
        prompt: prompt.trim(),
        image_urls,
        output_format: output_format || 'png',
        image_size: image_size || '1:1',
      },
    };

    // Call KIE.AI API
    const response = await fetch(`${KIE_AI_BASE_URL}/createTask`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${KIE_AI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('KIE.AI API error:', response.status, errorText);
      return NextResponse.json(
        {
          error: 'Failed to create generation task',
          details: errorText,
          status: response.status
        },
        { status: response.status }
      );
    }

    const data: CreateTaskResponse = await response.json();

    // Return task ID
    return NextResponse.json({
      success: true,
      taskId: data.data.taskId,
      message: data.msg,
    });

  } catch (error) {
    console.error('Error in generate-image API:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
