import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const R2_CONFIG = {
  accountId: process.env.R2_ACCOUNT_ID!,
  accessKeyId: process.env.R2_ACCESS_KEY_ID!,
  secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  bucketName: process.env.R2_BUCKET_NAME!,
  publicUrl: process.env.R2_PUBLIC_URL!,
};

const s3Client = new S3Client({
  region: 'auto',
  endpoint: `https://${R2_CONFIG.accountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_CONFIG.accessKeyId,
    secretAccessKey: R2_CONFIG.secretAccessKey,
  },
});

/**
 * Upload a file to Cloudflare R2
 */
export async function uploadFile(
  file: Buffer,
  path: string,
  contentType: string
): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: R2_CONFIG.bucketName,
    Key: path,
    Body: file,
    ContentType: contentType,
  });

  await s3Client.send(command);

  return `${R2_CONFIG.publicUrl}/${path}`;
}

/**
 * Get the public URL for a file in R2
 */
export async function getFileUrl(path: string): Promise<string> {
  return `${R2_CONFIG.publicUrl}/${path}`;
}

/**
 * Delete a file from R2
 */
export async function deleteFile(path: string): Promise<void> {
  const command = new DeleteObjectCommand({
    Bucket: R2_CONFIG.bucketName,
    Key: path,
  });

  await s3Client.send(command);
}

/**
 * Generate a file path for R2 storage
 */
export function generateFilePath(
  userId: string,
  projectId: string,
  filename: string,
  category: 'floorplans' | 'models' | 'site' | 'exports'
): string {
  const timestamp = Date.now();
  const sanitizedFilename = filename.replace(/[^a-zA-Z0-9.-]/g, '_');
  return `users/${userId}/projects/${projectId}/${category}/${timestamp}-${sanitizedFilename}`;
}
