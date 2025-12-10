import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { PrismaClient } from '@/lib/prisma/generated';
import fs from 'fs';
import path from 'path';

// R2 Client configuration
const s3Client = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

const prisma = new PrismaClient();

// Base directory with CAD blocks
const BASE_DIR = '/Users/jjc4/Desktop/CAD BLOCKS';

// Category mapping: Folder name → Database category
const CATEGORY_MAP: Record<string, { category: string; subcategory: string }> = {
  'Door': { category: 'door', subcategory: 'door' },
  'Window': { category: 'window', subcategory: 'window' },
  'Couches and Chairs': { category: 'furniture', subcategory: 'seating' },
  'Tables': { category: 'furniture', subcategory: 'tables' },
  'Bedroom': { category: 'furniture', subcategory: 'bedroom' },
  'Bathroom': { category: 'bathroom', subcategory: 'bathroom' },
  'Kitchen': { category: 'kitchen', subcategory: 'kitchen' },
  'Misc': { category: 'misc', subcategory: 'misc' },
};

/**
 * Upload file to R2 and return public URL
 */
async function uploadToR2(
  localPath: string,
  r2Path: string,
  contentType: string
): Promise<string> {
  const fileBuffer = fs.readFileSync(localPath);

  await s3Client.send(
    new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME!,
      Key: r2Path,
      Body: fileBuffer,
      ContentType: contentType,
    })
  );

  return `${process.env.R2_PUBLIC_URL}/${r2Path}`;
}

/**
 * Create slug from filename
 * "door1.dxf" → "door1"
 * "Office Chair Modern.dxf" → "office-chair-modern"
 */
function createSlug(filename: string): string {
  const nameWithoutExt = path.parse(filename).name;
  return nameWithoutExt
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

/**
 * Create display name from filename
 * "door1" → "Door 1"
 * "office-chair-modern" → "Office Chair Modern"
 */
function createDisplayName(filename: string): string {
  const nameWithoutExt = path.parse(filename).name;
  return nameWithoutExt
    .split(/[-_\s]+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Main upload function
 */
async function main() {
  console.log('🚀 Starting CAD blocks upload...\n');

  let totalBlocks = 0;
  let totalErrors = 0;

  // Get all folders
  const folders = fs
    .readdirSync(BASE_DIR, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory() && !dirent.name.startsWith('.'))
    .map(dirent => dirent.name);

  for (const folderName of folders) {
    const categoryInfo = CATEGORY_MAP[folderName];

    if (!categoryInfo) {
      console.log(`⚠️  Skipping unknown folder: ${folderName}\n`);
      continue;
    }

    console.log(`📁 Processing folder: ${folderName}`);
    console.log(`   Category: ${categoryInfo.category}, Subcategory: ${categoryInfo.subcategory}`);

    const dxfDir = path.join(BASE_DIR, folderName, 'DXF');
    const pngDir = path.join(BASE_DIR, folderName, 'PNG');

    // Check if directories exist
    if (!fs.existsSync(dxfDir) || !fs.existsSync(pngDir)) {
      console.log(`   ⚠️  Missing DXF or PNG directory, skipping...\n`);
      continue;
    }

    // Get all DXF files
    const dxfFiles = fs
      .readdirSync(dxfDir)
      .filter(file => file.toLowerCase().endsWith('.dxf'));

    console.log(`   Found ${dxfFiles.length} DXF files\n`);

    for (const dxfFile of dxfFiles) {
      const baseName = path.parse(dxfFile).name;
      const pngFile = `${baseName}.png`;
      const pngPath = path.join(pngDir, pngFile);

      // Check if corresponding PNG exists
      if (!fs.existsSync(pngPath)) {
        console.log(`   ⚠️  No PNG found for ${dxfFile}, skipping...`);
        totalErrors++;
        continue;
      }

      try {
        const slug = createSlug(dxfFile);
        const displayName = createDisplayName(dxfFile);

        console.log(`   📦 Processing: ${displayName} (${slug})`);

        // Check if block already exists
        const existing = await prisma.cadBlock.findUnique({
          where: { slug },
        });

        if (existing) {
          console.log(`      ⏭️  Already exists, skipping...\n`);
          totalBlocks++;
          continue;
        }

        // Upload DXF to R2
        const dxfLocalPath = path.join(dxfDir, dxfFile);
        const dxfR2Path = `cad-blocks/${categoryInfo.category}/${slug}.dxf`;
        const dxfUrl = await uploadToR2(dxfLocalPath, dxfR2Path, 'application/dxf');
        console.log(`      ✅ DXF uploaded: ${dxfR2Path}`);

        // Upload PNG to R2
        const pngR2Path = `thumbnails/${categoryInfo.category}/${slug}.png`;
        const thumbnailUrl = await uploadToR2(pngPath, pngR2Path, 'image/png');
        console.log(`      ✅ PNG uploaded: ${pngR2Path}`);

        // Create database record
        await prisma.cadBlock.create({
          data: {
            slug,
            name: displayName,
            category: categoryInfo.category,
            subcategory: categoryInfo.subcategory,
            tags: [categoryInfo.category, categoryInfo.subcategory, ...slug.split('-')],
            dxfUrl,
            thumbnailUrl,
            isPublic: true,
          },
        });
        console.log(`      ✅ Database record created\n`);

        totalBlocks++;
      } catch (error) {
        console.error(`      ❌ Error processing ${dxfFile}:`, error);
        totalErrors++;
      }
    }

    console.log('');
  }

  console.log('✨ Upload complete!');
  console.log(`   Total blocks uploaded: ${totalBlocks}`);
  console.log(`   Total errors: ${totalErrors}`);

  await prisma.$disconnect();
}

main().catch(console.error);
