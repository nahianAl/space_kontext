import { NextRequest, NextResponse } from 'next/server';
import type { QueryTaskResponse, TaskResult } from '@/features/ai-rendering/types';

const KIE_AI_API_KEY = process.env.KIE_AI_API_KEY;
const KIE_AI_BASE_URL = 'https://api.kie.ai/api/v1/jobs';

/**
 * GET /api/ai/task-status?taskId=xxx
 * Queries the status of an image generation task
 */
export async function GET(request: NextRequest) {
  try {
    // Check API key
    if (!KIE_AI_API_KEY) {
      return NextResponse.json(
        { error: 'KIE_AI_API_KEY not configured' },
        { status: 500 }
      );
    }

    // Get taskId from query params
    const searchParams = request.nextUrl.searchParams;
    const taskId = searchParams.get('taskId');

    if (!taskId) {
      return NextResponse.json(
        { error: 'taskId query parameter is required' },
        { status: 400 }
      );
    }

    // Call KIE.AI API
    const response = await fetch(
      `${KIE_AI_BASE_URL}/recordInfo?taskId=${taskId}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${KIE_AI_API_KEY}`,
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('KIE.AI API error:', response.status, errorText);
      return NextResponse.json(
        {
          error: 'Failed to query task status',
          details: errorText,
          status: response.status
        },
        { status: response.status }
      );
    }

    const data: QueryTaskResponse = await response.json();

    // Parse resultJson if present
    let resultUrls: string[] = [];
    if (data.data.resultJson) {
      try {
        const result: TaskResult = JSON.parse(data.data.resultJson);
        resultUrls = result.resultUrls || [];
      } catch (error) {
        console.error('Failed to parse resultJson:', error);
      }
    }

    // Return normalized response
    return NextResponse.json({
      success: true,
      taskId: data.data.taskId,
      status: data.data.state,
      resultUrls,
      failCode: data.data.failCode,
      failMsg: data.data.failMsg,
      costTime: data.data.costTime,
      completeTime: data.data.completeTime,
      createTime: data.data.createTime,
    });

  } catch (error) {
    console.error('Error in task-status API:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
