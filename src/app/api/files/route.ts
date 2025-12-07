/**
 * File listing API endpoint
 * Returns list of files with optional filtering
 */

import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { fileStorage, type FileListOptions } from '@/lib/storage';

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const userId = await getCurrentUser();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse query parameters
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const projectId = searchParams.get('projectId');
    const tags = searchParams.get('tags');
    const limit = searchParams.get('limit');
    const offset = searchParams.get('offset');

    // Build options
    const options: FileListOptions = {
      userId, // Only return files for the current user
      limit: limit ? parseInt(limit) : 50,
      offset: offset ? parseInt(offset) : 0
    };

    if (category) {
      options.category = category as any;
    }
    if (projectId) {
      options.projectId = projectId;
    }

    // Parse tags if provided
    if (tags) {
      try {
        options.tags = JSON.parse(tags);
      } catch {
        options.tags = tags.split(',').map(tag => tag.trim());
      }
    }

    // Get files
    const result = await fileStorage.listFiles(options);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      files: result.files,
      total: result.total,
      limit: options.limit,
      offset: options.offset
    });

  } catch (error) {
    console.error('File listing error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
