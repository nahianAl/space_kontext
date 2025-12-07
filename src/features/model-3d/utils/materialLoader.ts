/**
 * Material loader utility for Three.js PBR materials
 * Loads diffuse, normal, roughness, and AO maps for materials
 */
import * as THREE from 'three';
import type { Material } from '../components/MaterialCard';

// Cache loaded textures to avoid reloading
const textureCache = new Map<string, THREE.Texture>();

/**
 * Load a texture with caching
 */
function loadTexture(url: string, loader: THREE.TextureLoader): Promise<THREE.Texture> {
  // Check cache first
  if (textureCache.has(url)) {
    return Promise.resolve(textureCache.get(url)!.clone());
  }

  return new Promise((resolve, reject) => {
    loader.load(
      url,
      (texture) => {
        // Configure texture
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.colorSpace = THREE.SRGBColorSpace;

        // Cache it
        textureCache.set(url, texture);
        resolve(texture.clone());
      },
      undefined,
      (error) => {
        console.error(`Failed to load texture: ${url}`, error);
        reject(error);
      }
    );
  });
}

/**
 * Create a PBR material from material data
 */
export async function createPBRMaterial(material: Material): Promise<THREE.MeshStandardMaterial> {
  const loader = new THREE.TextureLoader();

  try {
    // Load all textures in parallel
    const [diffuseMap, normalMap, roughnessMap, aoMap] = await Promise.all([
      loadTexture(material.diffuse, loader),
      loadTexture(material.normal, loader),
      loadTexture(material.rough, loader),
      loadTexture(material.ao, loader),
    ]);

    // Normal map needs linear color space
    normalMap.colorSpace = THREE.LinearSRGBColorSpace;
    roughnessMap.colorSpace = THREE.LinearSRGBColorSpace;
    aoMap.colorSpace = THREE.LinearSRGBColorSpace;

    // Create the material
    const pbr = new THREE.MeshStandardMaterial({
      map: diffuseMap,
      normalMap: normalMap,
      roughnessMap: roughnessMap,
      aoMap: aoMap,
      aoMapIntensity: 1,
      metalness: 0, // Most architectural materials are non-metallic
      roughness: 1, // Will be controlled by roughness map
      flatShading: false, // Use smooth shading for better PBR appearance
    });

    // Mark as user-applied material so it doesn't get reset
    pbr.userData.isUserMaterial = true;

    return pbr;
  } catch (error) {
    console.error('Failed to create PBR material:', error);
    // Return a fallback material
    return new THREE.MeshStandardMaterial({
      color: 0xcccccc,
      roughness: 0.8,
      metalness: 0,
    });
  }
}

/**
 * Apply a material to a Three.js mesh
 */
export function applyMaterialToMesh(mesh: THREE.Mesh, material: THREE.Material): void {
  // Dispose old material if it exists
  if (mesh.material instanceof THREE.Material) {
    mesh.material.dispose();
  }

  // Apply new material
  mesh.material = material;
  mesh.material.needsUpdate = true;
}

/**
 * Clear texture cache (useful for memory management)
 */
export function clearTextureCache(): void {
  textureCache.forEach((texture) => {
    texture.dispose();
  });
  textureCache.clear();
}

/**
 * Get cache size (for debugging)
 */
export function getTextureCacheSize(): number {
  return textureCache.size;
}
