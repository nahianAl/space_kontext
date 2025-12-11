import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma/client';
import { upsertUser } from '@/lib/prisma/utils';

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

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; fileId: string } }
) {
  try {
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = await getOrCreateUser(clerkUserId);
    const { id: projectId, fileId } = params;

    // Verify project ownership
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project || project.userId !== userId) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Delete file
    await prisma.projectFile.delete({
      where: { id: fileId },
    });

    // TODO: Also delete from storage (Vercel Blob, S3, etc.)

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting project file:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
