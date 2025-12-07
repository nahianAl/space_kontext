/**
 * File cleanup API endpoint
 * Handles maintenance operations like cleaning up temporary files
 */

import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { fileStorage } from '@/lib/storage';

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const userId = getCurrentUser();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse request body
    const body = await request.json().catch(() => ({}));
    const maxAgeHours = body.maxAgeHours || 24;

    // Clean up temporary files
    const result = await fileStorage.cleanupTemporaryFiles(maxAgeHours);

    return NextResponse.json({
      success: true,
      deleted: result.deleted,
      errors: result.errors
    });

  } catch (error) {
    console.error('File cleanup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Get storage statistics
 */
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const userId = getCurrentUser();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get storage statistics
    const stats = await fileStorage.getStorageStats();

    return NextResponse.json({
      success: true,
      stats
    });

  } catch (error) {
    console.error('Storage stats error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
