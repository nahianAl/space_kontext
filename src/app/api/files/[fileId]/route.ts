/**
 * File download API endpoint
 * Handles file downloads with proper headers and security
 */

import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { fileStorage } from '@/lib/storage';

export async function GET(
  request: NextRequest,
  { params }: { params: { fileId: string } }
) {
  try {
    // Check authentication
    const userId = await getCurrentUser();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { fileId } = params;

    if (!fileId) {
      return NextResponse.json({ error: 'File ID required' }, { status: 400 });
    }

    // Download file
    const result = await fileStorage.downloadFile(fileId);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 404 });
    }

    if (!result.data || !result.metadata) {
      return NextResponse.json({ error: 'File data not found' }, { status: 404 });
    }

    // Set appropriate headers
    const headers = new Headers();
    headers.set('Content-Type', result.metadata.mimeType);
    headers.set('Content-Length', result.metadata.size.toString());
    headers.set('Content-Disposition', `inline; filename="${result.metadata.originalName}"`);
    headers.set('Cache-Control', 'private, max-age=3600'); // Cache for 1 hour

    return new NextResponse(result.data as any, {
      status: 200,
      headers
    });

  } catch (error) {
    console.error('File download error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Delete file endpoint
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { fileId: string } }
) {
  try {
    // Check authentication
    const userId = await getCurrentUser();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { fileId } = params;

    if (!fileId) {
      return NextResponse.json({ error: 'File ID required' }, { status: 400 });
    }

    // Get file metadata to verify ownership
    const metadata = await fileStorage.getFileMetadata(fileId);
    if (!metadata) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    // Check if user owns the file
    if (metadata.userId !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Delete file
    const result = await fileStorage.deleteFile(fileId);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('File deletion error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
