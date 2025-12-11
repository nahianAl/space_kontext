/**
 * GLB/GLTF loader utility for Sketchfab models
 * Loads GLB files and returns Three.js scene objects
 */

import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// Cache for loaded models
const modelCache: Map<string, THREE.Group> = new Map();

/**
 * Load a GLB/GLTF model from a URL
 * @param url - URL to GLB/GLTF file
 * @returns Promise resolving to a THREE.Group (the scene from the GLTF)
 */
export async function loadGLBModel(url: string): Promise<THREE.Group> {
  // Check cache first
  if (modelCache.has(url)) {
    const cached = modelCache.get(url);
    if (cached) {
      // Clone the cached model
      return cached.clone();
    }
  }

  // Load the model
  const loader = new GLTFLoader();

  return new Promise((resolve, reject) => {
    loader.load(
      url,
      (gltf) => {
        // GLTFLoader returns a GLTF object with a scene property
        const scene = gltf.scene;

        // Enable shadows for all meshes in the model
        scene.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });

        // Store in cache
        modelCache.set(url, scene);

        // Return a clone so we can modify it independently
        resolve(scene.clone());
      },
      (progress) => {
        // Loading progress (optional - can be used for progress indicators)
        if (progress.total > 0) {
          const percent = (progress.loaded / progress.total) * 100;
          console.log(`Loading model: ${percent.toFixed(0)}%`);
        }
      },
      (error) => {
        console.error('Failed to load GLB model:', error);
        reject(error);
      }
    );
  });
}

/**
 * Calculate bounding box of a 3D object
 * Useful for centering or scaling models
 */
export function getBoundingBox(object: THREE.Object3D): THREE.Box3 {
  const box = new THREE.Box3();
  box.setFromObject(object);
  return box;
}

/**
 * Center a model at the origin (0, 0, 0)
 * @param object - The Three.js object to center
 */
export function centerModelAtOrigin(object: THREE.Object3D): void {
  const box = getBoundingBox(object);
  const center = box.getCenter(new THREE.Vector3());

  // Move object so its center is at origin
  object.position.sub(center);
}

/**
 * Place model on ground plane (y=0)
 * Centers horizontally and places bottom on ground
 * @param object - The Three.js object to place
 */
export function placeModelOnGround(object: THREE.Object3D): void {
  const box = getBoundingBox(object);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());

  // Center horizontally (x and z)
  object.position.x = -center.x;
  object.position.z = -center.z;

  // Place bottom on ground (y=0)
  object.position.y = size.y / 2 - center.y;
}














