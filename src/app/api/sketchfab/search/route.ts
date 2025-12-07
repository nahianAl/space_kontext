/**
 * Sketchfab search API route
 * Proxies search requests to Sketchfab Data API v3 with caching
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma/client';

const SearchQuerySchema = z.object({
  q: z.string().optional().default(''),
  page: z.coerce.number().int().min(1).optional().default(1),
  licenses: z.string().optional().default('cc-by,cc-by-sa'),
  downloadable: z.coerce.boolean().optional().default(true),
  sort: z.enum(['relevance', 'popularity', 'publishedAt']).optional().default('relevance'),
  category: z.string().optional(),
});

const CACHE_TTL_MINUTES = 10; // Cache search results for 10 minutes

/**
 * Generate cache key from search parameters
 */
function getCacheKey(params: z.infer<typeof SearchQuerySchema>): string {
  return `sketchfab_search:${JSON.stringify(params)}`;
}

export const dynamic = 'force-dynamic';

/**
 * GET /api/sketchfab/search
 * Search for downloadable CC-licensed models
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const params = {
      q: searchParams.get('q') || '',
      page: searchParams.get('page'),
      licenses: searchParams.get('licenses') || 'cc-by,cc-by-sa',
      downloadable: searchParams.get('downloadable'),
      sort: searchParams.get('sort') || 'relevance',
      category: searchParams.get('category') || undefined,
    };

    // Validate parameters
    const validation = SearchQuerySchema.safeParse(params);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid search parameters', details: validation.error },
        { status: 400 }
      );
    }

    const validatedParams = validation.data;
    const cacheKey = getCacheKey(validatedParams);

    // Check cache (optional - don't fail if cache is unavailable)
    let cached = null;
    if (prisma) {
      try {
        cached = await prisma.geospatialCache.findUnique({
          where: { cacheKey },
        });

        if (cached && cached.expiresAt > new Date()) {
          return NextResponse.json({
            success: true,
            ...(cached.data as any),
            cached: true,
          });
        }
      } catch (cacheError) {
        // Cache unavailable - continue without cache
        console.warn('Cache check failed, continuing without cache:', cacheError);
      }
    }

    // Build Sketchfab API request
    // Note: Sketchfab API might have specific requirements for parameters
    const sketchfabParams = new URLSearchParams({
      type: 'models',
      page: validatedParams.page.toString(),
      per_page: '24',
    });

    // Only add query if it's not empty
    if (validatedParams.q.trim()) {
      sketchfabParams.append('q', validatedParams.q.trim());
    }

    // Add downloadable filter
    if (validatedParams.downloadable) {
      sketchfabParams.append('downloadable', 'true');
    }

    // Note: Sketchfab API doesn't accept license parameter in search
    // We'll filter results client-side based on license labels

    // Add sort
    if (validatedParams.sort) {
      sketchfabParams.append('sort_by', validatedParams.sort);
    }

    if (validatedParams.category) {
      sketchfabParams.append('categories', validatedParams.category);
    }

    const sketchfabUrl = `https://api.sketchfab.com/v3/search?${sketchfabParams.toString()}`;

    // Call Sketchfab API
    const response = await fetch(sketchfabUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      // Try to get error details from Sketchfab
      let errorDetails = '';
      try {
        const errorData = await response.json();
        errorDetails = errorData.error || errorData.message || JSON.stringify(errorData);
        console.error('Sketchfab API error details:', errorData);
      } catch {
        errorDetails = response.statusText;
      }
      
      console.error('Sketchfab API error:', {
        status: response.status,
        statusText: response.statusText,
        url: sketchfabUrl,
        errorDetails,
      });
      
      return NextResponse.json(
        { 
          error: 'Sketchfab search failed', 
          status: response.status,
          details: errorDetails,
          url: sketchfabUrl, // For debugging
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Sanitize and transform results
    let results = (data.results || []).map((model: any) => {
      // Extract license info - Sketchfab returns license as object with uid and label
      const licenseLabel = model.license?.label || model.licenseType || 'unknown';
      const licenseUid = model.license?.uid || '';
      
      // Map license labels to our format
      let license = 'unknown';
      if (licenseLabel.includes('CC Attribution') && !licenseLabel.includes('NonCommercial') && !licenseLabel.includes('ShareAlike')) {
        license = 'cc-by';
      } else if (licenseLabel.includes('CC Attribution-ShareAlike') || licenseLabel.includes('CC Attribution') && licenseLabel.includes('ShareAlike')) {
        license = 'cc-by-sa';
      } else if (licenseLabel.includes('CC Attribution')) {
        license = 'cc-by'; // Default to cc-by if it's any CC Attribution variant
      }

      return {
        uid: model.uid,
        name: model.name,
        thumbnail:
          model.thumbnails?.images?.[0]?.url ||
          model.thumbnails?.['360']?.url ||
          model.thumbnail?.url ||
          '',
        author: model.user?.displayName || model.user?.username || 'Unknown',
        license,
        licenseLabel, // Keep original label for display
        is_downloadable: model.isDownloadable || model.is_downloadable || false,
        viewer_url: `https://sketchfab.com/models/${model.uid}`,
        description: model.description,
        faceCount: model.faceCount,
        vertexCount: model.vertexCount,
        animationCount: model.animationCount,
        publishedAt: model.publishedAt,
      };
    });

    // Filter by license if specified (client-side filtering since API doesn't support it)
    if (validatedParams.licenses) {
      const allowedLicenses = validatedParams.licenses.split(',').map(l => l.trim());
      results = results.filter((model: any) => allowedLicenses.includes(model.license));
    }

    const responseData = {
      results,
      total: data.total || 0,
      page: data.page || validatedParams.page,
      perPage: data.per_page || 24,
    };

    // Cache the response (optional - don't fail if cache is unavailable)
    if (prisma) {
      try {
        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + CACHE_TTL_MINUTES);

        await prisma.geospatialCache.upsert({
          where: { cacheKey },
          update: {
            data: responseData as any,
            expiresAt,
          },
          create: {
            cacheKey,
            data: responseData as any,
            expiresAt,
          },
        });
      } catch (cacheError) {
        // Cache unavailable - continue without caching
        console.warn('Cache save failed, continuing without cache:', cacheError);
      }
    }

    return NextResponse.json({
      success: true,
      ...responseData,
      cached: false,
    });
  } catch (error) {
    console.error('GET /api/sketchfab/search:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : undefined;
    
    return NextResponse.json(
      { 
        error: 'Internal server error', 
        details: errorMessage,
        ...(process.env.NODE_ENV === 'development' && { stack: errorStack }),
      },
      { status: 500 }
    );
  }
}

