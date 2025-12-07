import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';

const GITHUB_REPO = 'GSStnb/dxfBlocks';
const BRANCH = 'master';
const ARCHITECTURE_DIR = 'Architecture';
const DESKTOP_PATH = path.join(process.env.HOME || '', 'Desktop', 'dxfBlocks-Architecture');

interface GitHubTreeItem {
  path: string;
  type: 'blob' | 'tree';
  sha: string;
  url: string;
}

interface GitHubTreeResponse {
  tree: GitHubTreeItem[];
}

/**
 * Fetch the repository tree from GitHub API
 */
async function fetchRepoTree(): Promise<GitHubTreeResponse> {
  return new Promise((resolve, reject) => {
    const url = `https://api.github.com/repos/${GITHUB_REPO}/git/trees/${BRANCH}?recursive=1`;
    
    https.get(url, {
      headers: {
        'User-Agent': 'Node.js',
        'Accept': 'application/vnd.github.v3+json'
      }
    }, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode === 200) {
          resolve(JSON.parse(data));
        } else {
          reject(new Error(`Failed to fetch tree: ${res.statusCode} ${data}`));
        }
      });
    }).on('error', reject);
  });
}

/**
 * Download a file from GitHub raw content
 */
async function downloadFile(filePath: string, outputPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const url = `https://raw.githubusercontent.com/${GITHUB_REPO}/${BRANCH}/${filePath}`;
    
    // Ensure directory exists
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    const file = fs.createWriteStream(outputPath);
    
    https.get(url, {
      headers: {
        'User-Agent': 'Node.js'
      }
    }, (res) => {
      if (res.statusCode === 200) {
        res.pipe(file);
        file.on('finish', () => {
          file.close();
          resolve();
        });
      } else if (res.statusCode === 301 || res.statusCode === 302) {
        // Handle redirects
        const redirectUrl = res.headers.location;
        if (redirectUrl) {
          https.get(redirectUrl, (redirectRes) => {
            redirectRes.pipe(file);
            file.on('finish', () => {
              file.close();
              resolve();
            });
          }).on('error', reject);
        } else {
          reject(new Error(`Redirect without location: ${res.statusCode}`));
        }
      } else {
        file.close();
        fs.unlinkSync(outputPath);
        reject(new Error(`Failed to download ${filePath}: ${res.statusCode}`));
      }
    }).on('error', (err) => {
      file.close();
      if (fs.existsSync(outputPath)) {
        fs.unlinkSync(outputPath);
      }
      reject(err);
    });
  });
}

/**
 * Main function to download all DXF files
 */
async function main() {
  try {
    console.log('Fetching repository structure...');
    const treeResponse = await fetchRepoTree();
    
    // Filter for files in Architecture directory that are .dxf files
    const dxfFiles = treeResponse.tree.filter(
      (item) =>
        item.type === 'blob' &&
        item.path.startsWith(ARCHITECTURE_DIR) &&
        item.path.toLowerCase().endsWith('.dxf')
    );
    
    console.log(`Found ${dxfFiles.length} DXF files in ${ARCHITECTURE_DIR} directory`);
    
    if (dxfFiles.length === 0) {
      console.log('No DXF files found. Exiting.');
      return;
    }
    
    // Create base directory
    if (!fs.existsSync(DESKTOP_PATH)) {
      fs.mkdirSync(DESKTOP_PATH, { recursive: true });
    }
    
    // Download each file maintaining folder structure
    let downloaded = 0;
    let failed = 0;
    
    for (const file of dxfFiles) {
      const relativePath = file.path; // Full path from repo root
      const outputPath = path.join(DESKTOP_PATH, relativePath);
      
      try {
        console.log(`Downloading: ${relativePath}`);
        await downloadFile(relativePath, outputPath);
        downloaded++;
        console.log(`✓ Downloaded: ${relativePath}`);
      } catch (error) {
        failed++;
        console.error(`✗ Failed to download ${relativePath}:`, error instanceof Error ? error.message : error);
      }
    }
    
    console.log('\n=== Download Summary ===');
    console.log(`Total files: ${dxfFiles.length}`);
    console.log(`Downloaded: ${downloaded}`);
    console.log(`Failed: ${failed}`);
    console.log(`\nFiles saved to: ${DESKTOP_PATH}`);
    
  } catch (error) {
    console.error('Error:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

// Run the script
main();












