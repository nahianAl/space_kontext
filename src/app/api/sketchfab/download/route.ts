/**
 * Download API Route
 * Downloads GLB files from Sketchfab and caches them
 * Requires user to be authenticated with Sketchfab OAuth
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getCurrentUser } from '@/lib/auth';
import { getValidAccessToken } from '@/features/sketchfab/services/tokenService';
import { prisma } from '@/lib/prisma/client';
import { fileStorage } from '@/lib/storage';

const DownloadQuerySchema = z.object({
  uid: z.string().min(1, 'Model UID is required'),
  projectId: z.string().optional(),
});

/**
 * GET /api/sketchfab/download?uid=XXXX&projectId=YYYY
 * Downloads a Sketchfab model and returns the cached GLB URL
 */
export async function GET(request: NextRequest) {
  // Check authentication
  const userId = await getCurrentUser();
  if (!userId) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  // Parse and validate query parameters
  const searchParams = request.nextUrl.searchParams;
  const validation = DownloadQuerySchema.safeParse({
    uid: searchParams.get('uid'),
    projectId: searchParams.get('projectId'),
  });

  try {

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid parameters', details: validation.error.flatten() },
        { status: 400 }
      );
    }

    const { uid, projectId } = validation.data;

    // Check if model is already cached in database (optional - don't fail if DB unavailable)
    let existingModel = null;
    try {
      existingModel = await prisma.sketchfabModel.findUnique({
        where: { modelUid: uid },
      });
    } catch (dbError) {
      console.warn('Database query failed, continuing without cache:', dbError);
    }

    if (existingModel && existingModel.fileUrl) {
      // Return cached URL
      return NextResponse.json({
        success: true,
        url: existingModel.fileUrl,
        cached: true,
        attribution: existingModel.attribution,
        license: existingModel.license,
      });
    }

    // Check if user has Sketchfab token BEFORE trying to get access token
    // This provides a clearer error message
    let hasToken = false;
    try {
      const tokenCheck = await prisma.sketchfabToken.findUnique({
        where: { userId },
        select: { id: true }, // Only select id to minimize data transfer
      });
      hasToken = !!tokenCheck;
    } catch (dbError) {
      // Database error - might be table doesn't exist or connection issue
      console.error('Error checking for Sketchfab token:', dbError);
      // Continue to try getValidAccessToken which will handle the error
    }

    if (!hasToken) {
      return NextResponse.json(
        {
          error: 'Sketchfab not connected',
          message: 'Please connect your Sketchfab account to download models',
          requiresAuth: true,
        },
        { status: 403 }
      );
    }

    // Get valid access token (auto-refreshes if needed)
    let accessToken: string;
    try {
      accessToken = await getValidAccessToken(userId);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      const errorString = String(error).toLowerCase();
      
      console.error('Token error in download route:', {
        errorMessage,
        errorString,
        error,
        userId,
        errorType: error instanceof Error ? error.constructor.name : typeof error,
      });
      
      // Check for various token-related error messages (case-insensitive)
      if (
        errorMessage.toLowerCase().includes('no sketchfab token') ||
        errorMessage.toLowerCase().includes('token found') ||
        errorMessage.toLowerCase().includes('connect your sketchfab') ||
        errorMessage.toLowerCase().includes('sketchfab not connected') ||
        errorString.includes('no sketchfab token') ||
        errorString.includes('token found')
      ) {
        return NextResponse.json(
          {
            error: 'Sketchfab not connected',
            message: 'Please connect your Sketchfab account to download models',
            requiresAuth: true,
          },
          { status: 403 }
        );
      }
      
      // If it's a database error about missing table, also return requiresAuth
      if (
        errorString.includes('does not exist') ||
        errorString.includes('relation') ||
        errorString.includes('table') ||
        errorMessage.includes('P2001') || // Prisma "Record does not exist" error code
        errorMessage.includes('P2025')    // Prisma "Record to update not found" error code
      ) {
        // Table might not exist or record doesn't exist - user needs to connect
        return NextResponse.json(
          {
            error: 'Sketchfab not connected',
            message: 'Please connect your Sketchfab account to download models',
            requiresAuth: true,
          },
          { status: 403 }
        );
      }
      
      // Re-throw other errors to be caught by outer catch
      throw error;
    }

    // Call Sketchfab Download API
    // Docs: https://sketchfab.com/developers/download-api
    const downloadResponse = await fetch(
      `https://api.sketchfab.com/v3/models/${uid}/download`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!downloadResponse.ok) {
      if (downloadResponse.status === 403) {
        return NextResponse.json(
          {
            error: 'Download permission denied',
            message: 'You do not have permission to download this model',
          },
          { status: 403 }
        );
      }

      if (downloadResponse.status === 404) {
        return NextResponse.json(
          {
            error: 'Model not found',
            message: 'The requested model does not exist or is not available',
          },
          { status: 404 }
        );
      }

      const errorText = await downloadResponse.text();
      console.error('Sketchfab download API error:', errorText);
      return NextResponse.json(
        {
          error: 'Download failed',
          message: `Sketchfab API error: ${downloadResponse.status} ${downloadResponse.statusText}`,
        },
        { status: downloadResponse.status }
      );
    }

    const downloadData = await downloadResponse.json();

    // Extract GLB URL from response
    // Response structure: { gltf: { url: "..." }, glb: { url: "..." }, ... }
    const glbUrl = downloadData.glb?.url || downloadData.gltf?.url;

    if (!glbUrl) {
      console.error('No GLB URL in Sketchfab response:', downloadData);
      return NextResponse.json(
        {
          error: 'Invalid download response',
          message: 'Sketchfab did not provide a download URL',
        },
        { status: 500 }
      );
    }

    // Download the GLB file
    const glbResponse = await fetch(glbUrl);
    if (!glbResponse.ok) {
      console.error('Failed to download GLB from Sketchfab:', glbResponse.statusText);
      return NextResponse.json(
        {
          error: 'Download failed',
          message: 'Failed to download model file from Sketchfab',
        },
        { status: 500 }
      );
    }

    const glbBuffer = await glbResponse.arrayBuffer();
    const buffer = Buffer.from(glbBuffer);

    // Upload to file storage
    const uploadResult = await fileStorage.uploadFile(
      {
        buffer: buffer,
        mimetype: 'model/gltf-binary',
        originalname: `${uid}.glb`,
        size: buffer.length,
      },
      userId,
      {
        category: 'model',
        ...(projectId && { projectId }),
        tags: ['sketchfab', uid],
        metadata: {
          sketchfabUid: uid,
          source: 'sketchfab',
        },
      }
    );

    if (!uploadResult.success || !uploadResult.file) {
      console.error('Failed to upload GLB to storage:', uploadResult.error);
      return NextResponse.json(
        {
          error: 'Storage failed',
          message: 'Failed to save model file',
        },
        { status: 500 }
      );
    }

    // Build file URL (for local storage, use API route)
    // In production with cloud storage, this would be the CDN URL
    const fileUrl = `/api/files/${uploadResult.file.id}`;

    // Get model attribution from search results or download response
    const attribution = {
      author: downloadData.author?.username || downloadData.user?.username || 'Unknown',
      modelUrl: `https://sketchfab.com/models/${uid}`,
      license: downloadData.license || 'unknown',
      title: downloadData.name || uid,
    };

    // Cache model info in database (optional - don't fail if DB unavailable)
    try {
      await prisma.sketchfabModel.upsert({
        where: { modelUid: uid },
        update: {
          fileUrl: fileUrl,
          attribution: attribution as any,
          license: attribution.license,
          ...(projectId && { projectId }),
        },
        create: {
          modelUid: uid,
          userId: userId,
          fileUrl: fileUrl,
          attribution: attribution as any,
          license: attribution.license,
          ...(projectId && { projectId }),
        },
      });
    } catch (dbError) {
      console.warn('Failed to cache model in database, continuing:', dbError);
      // Continue even if database cache fails
    }

    return NextResponse.json({
      success: true,
      url: fileUrl,
      cached: false,
      attribution: attribution,
      license: attribution.license,
    });
  } catch (error) {
    console.error('GET /api/sketchfab/download - Full error:', {
      error,
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      userId,
      uid: validation.success ? validation.data.uid : 'unknown',
    });
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : undefined;
    
    // Check if it's a token-related error (catch various phrasings)
    if (
      errorMessage.includes('No Sketchfab token') ||
      errorMessage.includes('token found') ||
      errorMessage.includes('connect your Sketchfab') ||
      errorMessage.includes('Sketchfab not connected')
    ) {
      return NextResponse.json(
        {
          error: 'Sketchfab not connected',
          message: 'Please connect your Sketchfab account to download models',
          requiresAuth: true,
        },
        { status: 403 }
      );
    }
    
    // Check if it's a database error
    if (errorMessage.includes('prisma') || errorMessage.includes('database')) {
      console.error('Database error in download route:', error);
      // Still return 500 but with clearer message
      return NextResponse.json(
        {
          error: 'Database error',
          message: 'Failed to access database. Please try again.',
          ...(process.env.NODE_ENV === 'development' && { details: errorMessage }),
        },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: errorMessage,
        ...(process.env.NODE_ENV === 'development' && { 
          stack: errorStack,
          details: error instanceof Error ? error.toString() : String(error),
        }),
      },
      { status: 500 }
    );
  }
}

