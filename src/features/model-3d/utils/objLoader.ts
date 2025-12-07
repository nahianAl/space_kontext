/**
 * OBJ model loader utility for doors and windows
 * Loads and caches 3D models from OBJ files for use in opening cutouts
 * Provides async loading with caching to avoid redundant file loads
 */

import * as THREE from 'three';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';

// Cache for loaded models
const modelCache: Map<string, THREE.Group> = new Map();

/**
 * Load an OBJ model from the public folder
 * @param path - Path to OBJ file (e.g., '/Window.obj')
 * @returns Promise resolving to a THREE.Group
 */
export async function loadOBJModel(path: string): Promise<THREE.Group> {
  // Check cache first
  if (modelCache.has(path)) {
    const cached = modelCache.get(path);
    if (cached) {
      // Clone the cached model
      return cached.clone();
    }
  }

  // Load the model
  const loader = new OBJLoader();
  
  return new Promise((resolve, reject) => {
    loader.load(
      path,
      (object) => {
        // Store in cache
        modelCache.set(path, object);
        // Return a clone so we can modify it independently
        resolve(object.clone());
      },
      undefined,
      (error) => {
        reject(error);
      }
    );
  });
}

/**
 * Calculate bounding box of a 3D object
 */
export function getBoundingBox(object: THREE.Object3D): THREE.Box3 {
  const box = new THREE.Box3();
  box.setFromObject(object);
  return box;
}

/**
 * Center a model at the origin (0, 0, 0)
 * Translates all meshes within the group so the bounding box center is at origin
 */
export function centerModelAtOrigin(model: THREE.Object3D): void {
  const boundingBox = getBoundingBox(model);
  const center = boundingBox.getCenter(new THREE.Vector3());
  
  // Translate all child meshes by negative center to move center to origin
  model.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      child.position.sub(center);
    }
  });
  
  // Verify centering
  const newBoundingBox = getBoundingBox(model);
  const newCenter = newBoundingBox.getCenter(new THREE.Vector3());
  
  if (Math.abs(newCenter.x) > 0.001 || Math.abs(newCenter.y) > 0.001 || Math.abs(newCenter.z) > 0.001) {
    // Try one more adjustment
    model.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.position.sub(newCenter);
      }
    });
  }
}

/**
 * Scale a model proportionally to fit target width and height
 * Maintains aspect ratio based on the larger dimension
 * Centers the model at origin before scaling
 */
export function scaleModelToFit(
  model: THREE.Object3D,
  targetWidth: number,
  targetHeight: number
): void {
  // First center the model at origin
  centerModelAtOrigin(model);
  
  const boundingBox = getBoundingBox(model);
  const currentWidth = boundingBox.max.x - boundingBox.min.x;
  const currentHeight = boundingBox.max.y - boundingBox.min.y;
  
  if (currentWidth === 0 || currentHeight === 0) {
    return;
  }
  
  // Calculate scale factors for both dimensions
  const scaleX = targetWidth / currentWidth;
  const scaleY = targetHeight / currentHeight;
  
  // Use the smaller scale to maintain aspect ratio (fits within bounds)
  // Or use larger scale to fill (might overflow) - using smaller for now
  const uniformScale = Math.min(scaleX, scaleY);
  
  model.scale.set(uniformScale, uniformScale, uniformScale);
}

