import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma/client';
import { auth, currentUser } from '@clerk/nextjs/server';
import { getUserByClerkId, upsertUser } from '@/lib/prisma/utils';
import { z } from 'zod';

const CreateProjectSchema = z.object({
  name: z.string().min(1).max(255),
});

/**
 * Get or create user in database from Clerk authentication
 */
async function getOrCreateUser(clerkUserId: string) {
  // Try to find existing user
  let user = await getUserByClerkId(clerkUserId);
  
  // If user doesn't exist, create it from Clerk data
  if (!user) {
    const clerkUser = await currentUser();
    if (!clerkUser) {
      throw new Error('Unable to fetch user data from Clerk');
    }

    // Create user in database
    user = await upsertUser({
      id: clerkUser.id,
      emailAddresses: clerkUser.emailAddresses.map(e => ({ emailAddress: e.emailAddress })),
      firstName: clerkUser.firstName,
      lastName: clerkUser.lastName,
      imageUrl: clerkUser.imageUrl,
    });
  }

  return user;
}

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get or create user in database
    const user = await getOrCreateUser(clerkUserId);

    // Fetch projects for this user
    const projects = await prisma.project.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, projects });
  } catch (error) {
    console.error('GET /api/projects:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch projects',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get or create user in database
    const user = await getOrCreateUser(clerkUserId);

    // Validate request body
    const body = await request.json();
    const validation = CreateProjectSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid project name', details: validation.error },
        { status: 400 }
      );
    }

    // Create project with user's database ID
    const project = await prisma.project.create({
      data: {
        name: validation.data.name,
        userId: user.id,
      },
    });

    return NextResponse.json({ success: true, project }, { status: 201 });
  } catch (error) {
    console.error('POST /api/projects:', error);
    return NextResponse.json(
      {
        error: 'Failed to create project',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
