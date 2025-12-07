import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { uploadFile, generateFilePath } from '@/lib/storage/r2-storage';
import { prisma } from '@/lib/prisma/client';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const projectId = formData.get('projectId') as string;
    const category = formData.get('category') as string;

    if (!file || !projectId) {
      return NextResponse.json({ error: 'Missing file or projectId' }, { status: 400 });
    }

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Determine category for file path
    const fileCategory = (category || 'exports') as 'floorplans' | 'models' | 'site' | 'exports';

    // Generate path and upload to R2
    const path = generateFilePath(userId, projectId, file.name, fileCategory);
    const url = await uploadFile(buffer, path, file.type);

    // Determine file type from MIME type
    const fileType = file.type.split('/')[0] || 'application';

    // Save metadata to database
    const fileRecord = await prisma.file.create({
      data: {
        userId,
        projectId,
        filename: file.name,
        originalName: file.name,
        mimeType: file.type,
        size: file.size,
        storageUrl: url,
        storagePath: path,
        fileType,
        category: fileCategory,
      },
    });

    return NextResponse.json({ url, file: fileRecord }, { status: 201 });
  } catch (error) {
    console.error('File upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}
