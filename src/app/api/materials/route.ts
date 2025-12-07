/**
 * API endpoint to scan and return available materials
 * Scans the Public/Materials folder structure
 */
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export interface Material {
  id: string;
  name: string;
  category: string;
  basePath: string;
  diffuse: string;
  normal: string;
  rough: string;
  ao: string;
}

export async function GET() {
  try {
    const materialsPath = path.join(process.cwd(), 'Public', 'Materials');
    const materials: Material[] = [];

    // Check if Materials folder exists
    if (!fs.existsSync(materialsPath)) {
      return NextResponse.json({ materials: [], error: 'Materials folder not found' });
    }

    // Get all category folders (Plaster, Wood, Floor)
    const categories = fs.readdirSync(materialsPath, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory() && !dirent.name.startsWith('.'))
      .map(dirent => dirent.name);

    // Scan each category
    for (const category of categories) {
      const categoryPath = path.join(materialsPath, category);
      const textureFolders = fs.readdirSync(categoryPath, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory() && !dirent.name.startsWith('.'))
        .map(dirent => dirent.name);

      // Scan each texture folder
      for (const folder of textureFolders) {
        const folderPath = path.join(categoryPath, folder);
        const files = fs.readdirSync(folderPath);

        // Find the texture files
        const diffuseFile = files.find(f => f.includes('diff') && f.endsWith('.jpg'));
        const normalFile = files.find(f => f.includes('nor_gl') && f.endsWith('.jpg'));
        const roughFile = files.find(f => f.includes('rough') && f.endsWith('.jpg'));
        const aoFile = files.find(f => f.includes('ao') && f.endsWith('.jpg'));

        if (diffuseFile && normalFile && roughFile && aoFile) {
          // Extract material name from diffuse file
          const textureName = diffuseFile.replace('_diff_2k.jpg', '');
          const displayName = textureName
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');

          const basePath = `/Materials/${category}/${folder}`;
          const materialId = `${category.toLowerCase()}-${folder.replace(/\s+/g, '-')}`;

          materials.push({
            id: materialId,
            name: displayName,
            category,
            basePath,
            diffuse: `${basePath}/${diffuseFile}`,
            normal: `${basePath}/${normalFile}`,
            rough: `${basePath}/${roughFile}`,
            ao: `${basePath}/${aoFile}`,
          });
        }
      }
    }

    return NextResponse.json({ materials });
  } catch (error) {
    console.error('Error scanning materials:', error);
    return NextResponse.json(
      { materials: [], error: 'Failed to scan materials' },
      { status: 500 }
    );
  }
}
