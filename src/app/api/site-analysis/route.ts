import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma/client'; // Use singleton
import { z } from 'zod';

const SiteAnalysisSchema = z.object({
  projectId: z.string(),
  coordinates: z.object({
    center: z.object({ lat: z.number(), lng: z.number() }),
    boundary: z.any(), // GeoJSON.Polygon
    areaSqFeet: z.number().nullable().optional(), // Area in square feet (primary)
    areaSqMeters: z.number().nullable().optional(), // Area in square meters (for compatibility)
    scale: z.number().nullable(),
    rotation: z.number(),
  }),
  boundary: z.any(), // GeoJSON.FeatureCollection
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = SiteAnalysisSchema.safeParse(body);
    
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid site analysis data' },
        { status: 400 }
      );
    }
    
    // Upsert: update if exists, create if not
    const siteAnalysis = await prisma.siteAnalysis.upsert({
      where: { projectId: validation.data.projectId },
      update: {
        coordinates: validation.data.coordinates as any,
        boundary: validation.data.boundary as any,
      },
      create: {
        projectId: validation.data.projectId,
        coordinates: validation.data.coordinates as any,
        boundary: validation.data.boundary as any,
      },
    });
    
    return NextResponse.json({ success: true, siteAnalysis });
  } catch (error) {
    console.error('POST /api/site-analysis:', error);
    return NextResponse.json(
      { error: 'Failed to save site analysis' },
      { status: 500 }
    );
  }
}
