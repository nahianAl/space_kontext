import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma/client';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const subcategory = searchParams.get('subcategory');
    const search = searchParams.get('search');

    // Build where clause
    const where: any = {
      isPublic: true,
    };

    if (category) {
      where.category = category;
    }

    if (subcategory) {
      where.subcategory = subcategory;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { tags: { has: search.toLowerCase() } },
      ];
    }

    // Fetch blocks
    const blocks = await prisma.cadBlock.findMany({
      where,
      orderBy: [
        { category: 'asc' },
        { subcategory: 'asc' },
        { name: 'asc' },
      ],
      select: {
        id: true,
        slug: true,
        name: true,
        category: true,
        subcategory: true,
        dxfUrl: true,
        thumbnailUrl: true,
        width: true,
        depth: true,
        tags: true,
      },
    });

    return NextResponse.json({ success: true, blocks });
  } catch (error) {
    console.error('GET /api/cad-blocks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch CAD blocks' },
      { status: 500 }
    );
  }
}
