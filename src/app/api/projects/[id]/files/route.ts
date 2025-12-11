import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma/client';
import { upsertUser } from '@/lib/prisma/utils';
import { z } from 'zod';

const CreateProjectFileSchema = z.object({
  name: z.string().min(1).max(255),
  type: z.enum(['dxf', 'png', 'svg', 'gltf', 'obj', 'pdf']),
  category: z.enum(['import', 'export', 'render']),
  url: z.string().url(),
  size: z.number().int().positive(),
});

/**
 * Get or create user in database from Clerk authentication
 * Returns the user's database ID
 */
async function getOrCreateUser(clerkUserId: string): Promise<string> {
  // Try to find existing user
  const user = await prisma.user.findUnique({
    where: { clerkId: clerkUserId },
    select: { id: true },
  });
  
  // If user doesn't exist, create it from Clerk data
  if (!user) {
    const clerkUser = await currentUser();
    if (!clerkUser) {
      throw new Error('Unable to fetch user data from Clerk');
    }

    // Create user in database
    const newUser = await upsertUser({
      id: clerkUser.id,
      emailAddresses: clerkUser.emailAddresses.map(e => ({ emailAddress: e.emailAddress })),
      firstName: clerkUser.firstName,
      lastName: clerkUser.lastName,
      imageUrl: clerkUser.imageUrl,
    });
    
    return newUser.id;
  }

  return user.id;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = await getOrCreateUser(clerkUserId);
    const projectId = params.id;

    // Verify project ownership
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project || project.userId !== userId) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Fetch files separately
    const files = await prisma.projectFile.findMany({
      where: { projectId },
    });

    return NextResponse.json({ files });
  } catch (error) {
    console.error('Error fetching project files:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = await getOrCreateUser(clerkUserId);
    const projectId = params.id;
    const body = await request.json();
    
    // Validate request body
    const validation = CreateProjectFileSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid data', details: validation.error },
        { status: 400 }
      );
    }

    // Verify project ownership
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project || project.userId !== userId) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const file = await prisma.projectFile.create({
      data: {
        projectId,
        name: validation.data.name,
        type: validation.data.type,
        category: validation.data.category,
        url: validation.data.url,
        size: validation.data.size,
      },
    });

    return NextResponse.json({ file }, { status: 201 });
  } catch (error) {
    console.error('Error creating project file:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
