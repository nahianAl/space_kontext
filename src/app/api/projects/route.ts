import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/lib/prisma/generated';
import { z } from 'zod';

// Create Prisma client instance
const prisma = new PrismaClient({
  log: ['query', 'error', 'warn'],
  datasources: {
    db: {
      url: 'postgresql://jjc4@localhost:5432/space_kontext?search_path=app',
    },
  },
});

const DEMO_USER_ID = 'demo-user'; // Use existing demo user

const CreateProjectSchema = z.object({
  name: z.string().min(1).max(255),
});

export async function GET(request: NextRequest) {
  try {
    console.log('GET /api/projects: Starting...');
    console.log('DEMO_USER_ID:', DEMO_USER_ID);
    
    const projects = await prisma.project.findMany({
      where: { userId: DEMO_USER_ID },
      orderBy: { createdAt: 'desc' },
    });
    
    console.log('GET /api/projects: Found projects:', projects.length);
    return NextResponse.json({ success: true, projects });
  } catch (error) {
    console.error('GET /api/projects:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch projects',
        details: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = CreateProjectSchema.safeParse(body);
    
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid project name' },
        { status: 400 }
      );
    }
    
    const project = await prisma.project.create({
      data: {
        name: validation.data.name,
        userId: DEMO_USER_ID,
      },
    });
    
    return NextResponse.json({ success: true, project }, { status: 201 });
  } catch (error) {
    console.error('POST /api/projects:', error);
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    );
  }
}
