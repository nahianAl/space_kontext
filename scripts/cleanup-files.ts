/**
 * File cleanup maintenance script
 * Removes temporary files and performs storage maintenance
 */

import { fileStorage } from '../src/lib/storage';

async function main() {
  console.log('🧹 Starting file cleanup...');

  try {
    // Clean up temporary files older than 24 hours
    const result = await fileStorage.cleanupTemporaryFiles(24);
    
    console.log(`✅ Cleanup complete:`);
    console.log(`   - Deleted ${result.deleted} temporary files`);
    
    if (result.errors.length > 0) {
      console.log(`   - ${result.errors.length} errors occurred:`);
      result.errors.forEach(error => console.log(`     - ${error}`));
    }

    // Get storage statistics
    const stats = await fileStorage.getStorageStats();
    console.log('\n📊 Storage Statistics:');
    console.log(`   - Total files: ${stats.totalFiles}`);
    console.log(`   - Total size: ${formatBytes(stats.totalSize)}`);
    console.log(`   - Files by category:`);
    
    Object.entries(stats.filesByCategory).forEach(([category, count]) => {
      const size = stats.sizeByCategory[category as keyof typeof stats.sizeByCategory];
      console.log(`     - ${category}: ${count} files (${formatBytes(size)})`);
    });

  } catch (error) {
    console.error('❌ Cleanup failed:', error);
    process.exit(1);
  }
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

main();
