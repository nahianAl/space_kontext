# 📚 CAD Blocks Library - Implementation Plan

> **Goal:** Create a drag-and-drop CAD blocks library where users can drag PNG thumbnails from the library panel and drop DXF files onto the 2D canvas.

---

## 📋 Overview

### What We're Building

1. **Library Panel** - Shows PNG thumbnails organized by category (Door, Window, Furniture, etc.)
2. **Drag & Drop** - Drag PNG thumbnail → Drop DXF file on canvas
3. **Category Filtering** - Each button in OpeningSettings shows only relevant blocks
4. **Database** - Stores metadata linking PNG ↔ DXF files
5. **R2 Storage** - Hosts all DXF and PNG files

### Architecture

```
User clicks "Couches and Chairs" button
    ↓
Library panel appears (replaces "coming soon")
    ↓
Shows PNG thumbnails from "Couches and Chairs" folder
    ↓
User drags PNG thumbnail
    ↓
Drops on canvas
    ↓
Corresponding DXF file is inserted at drop position
```

---

## 🗂️ Your Current Folder Structure

```
/Users/jjc4/Desktop/CAD BLOCKS/
├── Door/
│   ├── DXF/
│   │   ├── door1.dxf
│   │   └── foldingdoor.dxf
│   └── PNG/
│       ├── door1.png
│       └── foldingdoor.png
├── Window/
│   ├── DXF/
│   └── PNG/
├── Couches and Chairs/
│   ├── DXF/ (47 files)
│   └── PNG/ (46 files)
├── Tables/
│   ├── DXF/
│   └── PNG/
├── Bedroom/
│   ├── DXF/
│   └── PNG/
├── Bathroom/
│   ├── DXF/
│   └── PNG/
├── Kitchen/
│   ├── DXF/
│   └── PNG/
└── Misc/
    ├── DXF/
    └── PNG/
```

### Button → Folder Mapping

| Button (OpeningSettings.tsx) | Folder Name | Category | Subcategory |
|------------------------------|-------------|----------|-------------|
| Door | Door | door | door |
| Window | Window | window | window |
| Couches and Chairs | Couches and Chairs | furniture | seating |
| Table | Tables | furniture | tables |
| Bed | Bedroom | furniture | bedroom |
| Bathroom | Bathroom | bathroom | bathroom |
| Kitchen | Kitchen | kitchen | kitchen |
| Miscellaneous | Misc | misc | misc |

---

## 📦 PHASE 1: Database Setup

### Step 1.1: Create Prisma Migration

**Location:** `prisma/schema.prisma`

**Add this model at the end of the file (before the closing):**

```prisma
model CadBlock {
  id           String   @id @default(cuid())
  slug         String   @unique  // e.g., "door1", "office-chair-modern"
  name         String              // e.g., "Door 1", "Office Chair Modern"
  category     String              // "door", "window", "furniture", "bathroom", "kitchen", "misc"
  subcategory  String?             // "door", "window", "seating", "tables", "bedroom", etc.
  tags         String[]            // For future search functionality

  // File URLs in R2
  dxfUrl       String              // https://pub-xxx.r2.dev/cad-blocks/door/door1.dxf
  thumbnailUrl String              // https://pub-xxx.r2.dev/thumbnails/door/door1.png

  // Dimensions (optional, for display)
  width        Float?              // feet (nullable for now)
  depth        Float?              // feet (nullable for now)

  // Metadata
  isPublic     Boolean  @default(true)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  @@index([category])
  @@index([category, subcategory])
  @@index([slug])
  @@map("cad_blocks")
  @@schema("app")
}
```

### Step 1.2: Generate Prisma Client

```bash
cd /Users/jjc4/Desktop/Space_KONTEXT
npm run db:generate
```

### Step 1.3: Create Migration

```bash
npx prisma migrate dev --name add_cad_blocks
```

**Expected output:**
```
✔ Enter a name for the new migration: ... add_cad_blocks
Applying migration `20241209_add_cad_blocks`
The following migration(s) have been created and applied from new schema changes:

migrations/
  └─ 20241209_add_cad_blocks/
    └─ migration.sql

✔ Generated Prisma Client
```

### Step 1.4: Verify Migration

```bash
npx prisma studio
```

Check if `cad_blocks` table exists (it will be empty for now).

---

## 📤 PHASE 2: Upload CAD Blocks to R2

### Step 2.1: Create Upload Script

**Location:** `scripts/upload-cad-blocks.ts`

**Create this file:**

```typescript
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
```

### Step 2.2: Verify R2 Credentials in .env

**Check your `.env` file has these:**

```env
R2_ACCOUNT_ID=d0d867b2aebf3038decc1929395ff0b8
R2_ACCESS_KEY_ID=f40c986118fbed7aa386285ee9bb9a5f
R2_SECRET_ACCESS_KEY=7018ffd8d0fa2c06e4cc08696f25ec7924e1ea49f3d50e44d2b8ecfb9a2c0c0c
R2_BUCKET_NAME=space-kontext-prod
R2_PUBLIC_URL=https://pub-c91e91785d21410d9142a9d6069b7c7f.r2.dev
```

### Step 2.3: Run Upload Script

```bash
npx tsx scripts/upload-cad-blocks.ts
```

**Expected output:**
```
🚀 Starting CAD blocks upload...

📁 Processing folder: Door
   Category: door, Subcategory: door
   Found 2 DXF files

   📦 Processing: Door 1 (door1)
      ✅ DXF uploaded: cad-blocks/door/door1.dxf
      ✅ PNG uploaded: thumbnails/door/door1.png
      ✅ Database record created

   📦 Processing: Folding Door (foldingdoor)
      ✅ DXF uploaded: cad-blocks/door/foldingdoor.dxf
      ✅ PNG uploaded: thumbnails/door/foldingdoor.png
      ✅ Database record created

📁 Processing folder: Couches and Chairs
   Category: furniture, Subcategory: seating
   Found 47 DXF files
   ...

✨ Upload complete!
   Total blocks uploaded: 150+
   Total errors: 0
```

### Step 2.4: Verify Upload

**Check Prisma Studio:**
```bash
npx prisma studio
```

Navigate to `cad_blocks` table and verify records exist.

**Check R2 bucket** (via Cloudflare dashboard):
- `cad-blocks/door/door1.dxf`
- `thumbnails/door/door1.png`

---

## 🔌 PHASE 3: Create API Route

### Step 3.1: Create API Route File

**Location:** `src/app/api/cad-blocks/route.ts`

**Create this file:**

```typescript
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
```

### Step 3.2: Test API Route

**After creating the file, test it:**

```bash
# Start dev server
npm run dev

# In browser or curl:
http://localhost:3000/api/cad-blocks?category=door
http://localhost:3000/api/cad-blocks?category=furniture&subcategory=seating
```

**Expected response:**
```json
{
  "success": true,
  "blocks": [
    {
      "id": "block_123",
      "slug": "door1",
      "name": "Door 1",
      "category": "door",
      "subcategory": "door",
      "dxfUrl": "https://pub-xxx.r2.dev/cad-blocks/door/door1.dxf",
      "thumbnailUrl": "https://pub-xxx.r2.dev/thumbnails/door/door1.png",
      "width": null,
      "depth": null,
      "tags": ["door", "door", "door1"]
    }
  ]
}
```

---

## 🎨 PHASE 4: Create CadBlocksLibrary Component

### Step 4.1: Create Component File

**Location:** `src/features/floorplan-2d/components/CadBlocksLibrary.tsx`

**Create this file:**

```typescript
'use client';

import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/shared/components/ui/input';

interface CadBlock {
  id: string;
  slug: string;
  name: string;
  category: string;
  subcategory?: string;
  thumbnailUrl: string;
  dxfUrl: string;
  width?: number;
  depth?: number;
  tags: string[];
}

interface CadBlocksLibraryProps {
  category: string;
  subcategory?: string;
}

export const CadBlocksLibrary: React.FC<CadBlocksLibraryProps> = ({
  category,
  subcategory,
}) => {
  const [blocks, setBlocks] = useState<CadBlock[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch blocks when category changes
  useEffect(() => {
    loadBlocks();
  }, [category, subcategory]);

  const loadBlocks = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (category) params.append('category', category);
      if (subcategory) params.append('subcategory', subcategory);

      const res = await fetch(`/api/cad-blocks?${params}`);
      const data = await res.json();
      setBlocks(data.blocks || []);
    } catch (error) {
      console.error('Failed to load CAD blocks:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter blocks by search query
  const filteredBlocks = blocks.filter(
    (block) =>
      block.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      block.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  // Handle drag start - attach DXF URL and metadata
  const handleDragStart = (e: React.DragEvent, block: CadBlock) => {
    e.dataTransfer.effectAllowed = 'copy';
    e.dataTransfer.setData(
      'application/json',
      JSON.stringify({
        type: 'cad-block',
        blockId: block.id,
        slug: block.slug,
        name: block.name,
        category: block.category,
        dxfUrl: block.dxfUrl,
        thumbnailUrl: block.thumbnailUrl,
        width: block.width,
        depth: block.depth,
      })
    );
  };

  return (
    <div className="px-2 py-2 space-y-2">
      {/* Search Bar */}
      <div className="relative px-2">
        <Search size={14} className="absolute left-4 top-2.5 text-gray-400" />
        <Input
          placeholder="Search blocks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-8 h-8 text-xs bg-gray-800 border-gray-700"
        />
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="text-center py-8 text-gray-400 text-xs">
          Loading blocks...
        </div>
      ) : filteredBlocks.length === 0 ? (
        /* Empty State */
        <div className="text-center py-8 text-gray-400 text-xs">
          No blocks found
        </div>
      ) : (
        /* Blocks Grid */
        <div className="grid grid-cols-2 gap-2 px-2 max-h-96 overflow-y-auto">
          {filteredBlocks.map((block) => (
            <div
              key={block.id}
              draggable
              onDragStart={(e) => handleDragStart(e, block)}
              className="bg-gray-800 rounded-md p-2 cursor-move hover:bg-gray-700 transition-colors group"
              title={block.name}
            >
              {/* Thumbnail Image */}
              <div className="w-full h-20 bg-gray-900 rounded mb-1 flex items-center justify-center overflow-hidden">
                <img
                  src={block.thumbnailUrl}
                  alt={block.name}
                  className="max-w-full max-h-full object-contain"
                  onError={(e) => {
                    // Fallback if image fails to load
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>

              {/* Block Name */}
              <p className="text-xs text-gray-200 truncate text-center">
                {block.name}
              </p>

              {/* Dimensions (if available) */}
              {block.width && block.depth && (
                <p className="text-[10px] text-gray-400 text-center">
                  {block.width}' × {block.depth}'
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
```

---

## 🔧 PHASE 5: Update OpeningSettings.tsx

### Step 5.1: Import CadBlocksLibrary

**Location:** `src/features/floorplan-2d/components/OpeningSettings.tsx`

**Add import at top of file (around line 10):**

```typescript
import { CadBlocksLibrary } from './CadBlocksLibrary';
```

### Step 5.2: Add State for Selected Category

**Add after line 160 (after other useState hooks):**

```typescript
// State for CAD blocks library
const [selectedLibraryCategory, setSelectedLibraryCategory] = useState<string | null>(null);
const [selectedLibrarySubcategory, setSelectedLibrarySubcategory] = useState<string | null>(null);
```

### Step 5.3: Update Element Buttons Configuration

**Replace the `elementButtons` array (lines 260-269) with:**

```typescript
const elementButtons = [
  {
    id: 1,
    label: 'Door',
    value: 'door' as const,
    icon: '/elmnts_door.svg',
    reducedBrightness: false,
    thinnerStroke: false,
    category: 'door',
    subcategory: 'door'
  },
  {
    id: 2,
    label: 'Window',
    value: 'window' as const,
    icon: '/elmnts_wind.svg',
    reducedBrightness: false,
    thinnerStroke: false,
    category: 'window',
    subcategory: 'window'
  },
  {
    id: 3,
    label: 'Couches and Chairs',
    value: 'furniture-seating' as const,
    icon: '/elmnt_couch.svg',
    reducedBrightness: true,
    thinnerStroke: true,
    category: 'furniture',
    subcategory: 'seating'
  },
  {
    id: 4,
    label: 'Table',
    value: 'furniture-tables' as const,
    icon: '/elmnts_table.svg',
    reducedBrightness: false,
    thinnerStroke: false,
    category: 'furniture',
    subcategory: 'tables'
  },
  {
    id: 5,
    label: 'Bed',
    value: 'furniture-bedroom' as const,
    icon: '/elmnts_bed.svg',
    reducedBrightness: true,
    thinnerStroke: false,
    category: 'furniture',
    subcategory: 'bedroom'
  },
  {
    id: 6,
    label: 'Bathroom',
    value: 'bathroom' as const,
    icon: '/elmnt_vanity.svg',
    reducedBrightness: false,
    thinnerStroke: false,
    category: 'bathroom',
    subcategory: 'bathroom'
  },
  {
    id: 7,
    label: 'Kitchen',
    value: 'kitchen' as const,
    icon: '/elmnts_kitchen.svg',
    reducedBrightness: false,
    thinnerStroke: false,
    category: 'kitchen',
    subcategory: 'kitchen'
  },
  {
    id: 8,
    label: 'Miscellaneous',
    value: 'misc' as const,
    icon: '/elmnt_misc.svg',
    reducedBrightness: false,
    thinnerStroke: false,
    category: 'misc',
    subcategory: 'misc'
  },
];
```

### Step 5.4: Update Button Click Handler

**In the button onClick (around line 279), replace with:**

```typescript
onClick={() => {
  // For doors and windows, keep existing opening tool behavior
  if (button.value === 'door' || button.value === 'window') {
    setActiveOpeningType(button.value);
    setSelectedLibraryCategory(null); // Hide library
  } else {
    // For furniture/bathroom/kitchen/misc, show library
    setSelectedLibraryCategory(button.category);
    setSelectedLibrarySubcategory(button.subcategory);
  }
}}
```

### Step 5.5: Remove disabled attribute

**In the button element (around line 284), remove:**

```typescript
disabled={button.value === null}
```

### Step 5.6: Replace "Library (coming soon)" Section

**Find and replace line 448:**

```typescript
<PlaceholderRow icon={<Library size={16} />} label="Library" />
```

**With:**

```typescript
{/* CAD Blocks Library - Shows when furniture/bathroom/kitchen/misc is selected */}
{selectedLibraryCategory && (
  <>
    <hr className="border-gray-800 mx-4 my-4" />
    <div className="px-2">
      <h3 className="text-xs font-bold text-gray-400 px-2 mb-2 uppercase">Library</h3>
      <CadBlocksLibrary
        category={selectedLibraryCategory}
        subcategory={selectedLibrarySubcategory}
      />
    </div>
  </>
)}
```

---

## 🎯 PHASE 6: Implement Canvas Drop Handler

### Step 6.1: Find Your Canvas Component

**This depends on your current implementation. Look for:**
- File with Konva Stage component
- Likely in `src/features/floorplan-2d/components/`
- File that has `<Stage>` or canvas drag/drop handlers

### Step 6.2: Add Drop Handler

**Add these handlers to your canvas/stage container:**

```typescript
const handleDragOver = (e: React.DragEvent) => {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'copy';
};

const handleDrop = async (e: React.DragEvent) => {
  e.preventDefault();

  try {
    const data = e.dataTransfer.getData('application/json');
    if (!data) return;

    const dropData = JSON.parse(data);

    // Only handle CAD blocks
    if (dropData.type !== 'cad-block') return;

    // Get drop position relative to stage
    const stage = stageRef.current; // Your Konva stage ref
    if (!stage) return;

    const pointerPos = stage.getPointerPosition();
    if (!pointerPos) return;

    console.log('Dropping CAD block:', dropData.name);
    console.log('Position:', pointerPos);
    console.log('DXF URL:', dropData.dxfUrl);

    // Fetch DXF file content
    const response = await fetch(dropData.dxfUrl);
    const dxfContent = await response.text();

    // TODO: Parse DXF and insert into canvas
    // You'll need to implement DXF parsing logic here
    // For now, log the content
    console.log('DXF content length:', dxfContent.length);

    // Example: Insert placeholder for now
    // Replace with actual DXF parsing and rendering
    insertDXFBlock(dxfContent, pointerPos.x, pointerPos.y, dropData.name);

  } catch (error) {
    console.error('Failed to drop CAD block:', error);
  }
};

// Apply to your canvas container
<div
  onDragOver={handleDragOver}
  onDrop={handleDrop}
  style={{ width: '100%', height: '100%' }}
>
  <Stage ref={stageRef} {...stageProps}>
    {/* Your layers */}
  </Stage>
</div>
```

### Step 6.3: Implement DXF Parsing (Placeholder)

**For now, create a simple placeholder function:**

```typescript
const insertDXFBlock = (dxfContent: string, x: number, y: number, name: string) => {
  console.log(`Inserting ${name} at (${x}, ${y})`);
  console.log('DXF content preview:', dxfContent.substring(0, 200));

  // TODO: Implement actual DXF parsing
  // You'll need a DXF parser library like:
  // - dxf-parser
  // - dxf (npm package)

  // For MVP: Show alert
  alert(`Dropped ${name} at position (${Math.round(x)}, ${Math.round(y)})\n\nDXF parsing coming soon!`);
};
```

---

## ✅ PHASE 7: Testing

### Step 7.1: Test Each Category

**Test Door:**
1. Click "Door" button in OpeningSettings
2. Library should NOT appear (doors use opening tool)
3. Existing door functionality works

**Test Couches and Chairs:**
1. Click "Couches and Chairs" button
2. Library panel appears
3. See thumbnails of all seating furniture
4. Drag a couch PNG
5. Drop on canvas
6. Should trigger drop handler with DXF URL

**Test Tables:**
1. Click "Table" button
2. Library shows only tables
3. Drag and drop works

**Repeat for:** Bedroom, Bathroom, Kitchen, Miscellaneous

### Step 7.2: Test Search

1. Open any library (e.g., Couches and Chairs)
2. Type in search box
3. Blocks filter in real-time

### Step 7.3: Test R2 URLs

1. Open browser dev tools → Network tab
2. Drop a block
3. Verify DXF file downloads from R2
4. Check PNG thumbnails load correctly

---

## 🐛 Troubleshooting

### Issue: "No blocks found"

**Check:**
1. Upload script ran successfully
2. Database has records: `npx prisma studio`
3. API returns data: `http://localhost:3000/api/cad-blocks?category=door`

### Issue: Thumbnails don't show

**Check:**
1. R2 public URL is correct in `.env`
2. PNG files uploaded to R2
3. Browser console for 404 errors
4. CORS settings on R2 bucket (should allow images)

### Issue: DXF file 404

**Check:**
1. DXF files uploaded to R2
2. URL in database is correct
3. R2 bucket has public read access

### Issue: Drag and drop doesn't work

**Check:**
1. `onDragOver` and `onDrop` handlers added to canvas container
2. `e.preventDefault()` called in both handlers
3. Browser console for errors

---

## 📝 Next Steps (Future Enhancements)

### Phase 8: DXF Parsing (Future)
- Implement actual DXF parser
- Convert DXF entities to Konva shapes
- Handle layers, colors, line types

### Phase 9: Advanced Features (Future)
- Add block dimensions to database
- Show dimensions in library
- Allow rotation before drop
- Preview on hover
- Recently used blocks
- Favorites/bookmarks

### Phase 10: User Uploads (Future)
- Allow users to upload custom blocks
- Validation and sanitization
- User-specific block library

---

## 🎉 Success Criteria

✅ **Phase 1:** Database has `cad_blocks` table
✅ **Phase 2:** 150+ blocks uploaded to R2 and database
✅ **Phase 3:** API returns blocks filtered by category
✅ **Phase 4:** Library component shows thumbnails
✅ **Phase 5:** Clicking button shows relevant library
✅ **Phase 6:** Drag PNG → Drop triggers with DXF URL
✅ **Phase 7:** All 8 categories work correctly

---

## 📞 Support

If you get stuck:
1. Check the troubleshooting section
2. Verify each phase completed successfully
3. Check browser console for errors
4. Check server logs for API errors
5. Use Prisma Studio to inspect database

---

**Ready to implement? Start with Phase 1!** 🚀
