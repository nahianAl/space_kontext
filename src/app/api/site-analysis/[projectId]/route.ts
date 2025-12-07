import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma/client'; // Use singleton

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> | { projectId: string } }
) {
  try {
    // Handle both sync and async params (Next.js 14 vs 15)
    const resolvedParams = await Promise.resolve(params);
    const projectId = resolvedParams.projectId;
    
    const siteAnalysis = await prisma.siteAnalysis.findUnique({
      where: { projectId },
    });
    
    if (!siteAnalysis) {
      return NextResponse.json(
        { error: 'Site analysis not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, siteAnalysis });
  } catch (error) {
    console.error('GET /api/site-analysis/[projectId]:', error);
    return NextResponse.json(
      { error: 'Failed to load site analysis', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
