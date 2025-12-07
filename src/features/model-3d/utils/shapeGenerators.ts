/**
 * Shape generation utilities for creating Three.js geometries
 * Creates Box, Sphere, Cylinder, Cone, and Torus shapes with proper materials
 */

import * as THREE from 'three';
import type { ShapeType, CADObject, MaterialProperties } from '../types/cadObjects';

const DEFAULT_COLOR = 0xcccccc;
const DEFAULT_MATERIAL: MaterialProperties = {
  color: DEFAULT_COLOR,
  opacity: 1,
  transparent: false,
};

/**
 * Create a Box shape
 */
export function createBoxShape(
  dimensions: [number, number, number] = [1, 1, 1],
  position: [number, number, number] = [0, 0, 0],
  rotation: [number, number, number] = [0, 0, 0],
  material?: MaterialProperties
): THREE.Mesh {
  const geometry = new THREE.BoxGeometry(dimensions[0], dimensions[1], dimensions[2]);
  const mat = createMaterial(material || DEFAULT_MATERIAL);
  const mesh = new THREE.Mesh(geometry, mat);
  
  mesh.position.set(...position);
  mesh.rotation.set(...rotation);
  
  // Enable shadows
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  
  // Store metadata
  mesh.userData.cadObjectId = generateId();
  mesh.userData.shapeType = 'box';
  mesh.userData.dimensions = dimensions;
  
  return mesh;
}

/**
 * Create a Sphere shape
 */
export function createSphereShape(
  radius: number = 0.5,
  position: [number, number, number] = [0, 0, 0],
  rotation: [number, number, number] = [0, 0, 0],
  material?: MaterialProperties
): THREE.Mesh {
  const geometry = new THREE.SphereGeometry(radius, 32, 32);
  const mat = createMaterial(material || DEFAULT_MATERIAL);
  const mesh = new THREE.Mesh(geometry, mat);
  
  mesh.position.set(...position);
  mesh.rotation.set(...rotation);
  
  // Enable shadows
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  
  // Store metadata
  mesh.userData.cadObjectId = generateId();
  mesh.userData.shapeType = 'sphere';
  mesh.userData.radius = radius;
  
  return mesh;
}

/**
 * Create a Cylinder shape
 */
export function createCylinderShape(
  radius: number = 0.5,
  height: number = 1,
  position: [number, number, number] = [0, 0, 0],
  rotation: [number, number, number] = [0, 0, 0],
  material?: MaterialProperties
): THREE.Mesh {
  const geometry = new THREE.CylinderGeometry(radius, radius, height, 32);
  const mat = createMaterial(material || DEFAULT_MATERIAL);
  const mesh = new THREE.Mesh(geometry, mat);
  
  mesh.position.set(...position);
  mesh.rotation.set(...rotation);
  
  // Enable shadows
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  
  // Store metadata
  mesh.userData.cadObjectId = generateId();
  mesh.userData.shapeType = 'cylinder';
  mesh.userData.radius = radius;
  mesh.userData.height = height;
  
  return mesh;
}

/**
 * Create a Cone shape
 */
export function createConeShape(
  radius: number = 0.5,
  height: number = 1,
  position: [number, number, number] = [0, 0, 0],
  rotation: [number, number, number] = [0, 0, 0],
  material?: MaterialProperties
): THREE.Mesh {
  const geometry = new THREE.ConeGeometry(radius, height, 32);
  const mat = createMaterial(material || DEFAULT_MATERIAL);
  const mesh = new THREE.Mesh(geometry, mat);
  
  mesh.position.set(...position);
  mesh.rotation.set(...rotation);
  
  // Enable shadows
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  
  // Store metadata
  mesh.userData.cadObjectId = generateId();
  mesh.userData.shapeType = 'cone';
  mesh.userData.radius = radius;
  mesh.userData.height = height;
  
  return mesh;
}

/**
 * Create a Plane shape
 */
export function createPlaneShape(
  position: [number, number, number] = [0, 0, 0],
  rotation: [number, number, number] = [0, 0, 0],
  material?: MaterialProperties
): THREE.Mesh {
  const geometry = new THREE.PlaneGeometry(1, 1, 1, 1);
  const mat = createMaterial(material || DEFAULT_MATERIAL);
  mat.side = THREE.DoubleSide;
  const mesh = new THREE.Mesh(geometry, mat);

  mesh.position.set(...position);
  mesh.rotation.set(...rotation);

  mesh.castShadow = false;
  mesh.receiveShadow = true;

  mesh.userData.cadObjectId = generateId();
  mesh.userData.shapeType = 'plane';

  return mesh;
}

/**
 * Create a Torus shape
 */
export function createTorusShape(
  radius: number = 0.5,
  tube: number = 0.2,
  position: [number, number, number] = [0, 0, 0],
  rotation: [number, number, number] = [0, 0, 0],
  material?: MaterialProperties
): THREE.Mesh {
  const geometry = new THREE.TorusGeometry(radius, tube, 16, 100);
  const mat = createMaterial(material || DEFAULT_MATERIAL);
  const mesh = new THREE.Mesh(geometry, mat);
  
  mesh.position.set(...position);
  mesh.rotation.set(...rotation);
  
  // Enable shadows
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  
  // Store metadata
  mesh.userData.cadObjectId = generateId();
  mesh.userData.shapeType = 'torus';
  mesh.userData.radius = radius;
  mesh.userData.tube = tube;
  
  return mesh;
}

/**
 * Create a Three.js material from MaterialProperties
 */
function createMaterial(properties: MaterialProperties): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color: properties.color ?? DEFAULT_COLOR,
    opacity: properties.opacity ?? 1,
    transparent: properties.transparent ?? (properties.opacity !== undefined && properties.opacity < 1),
    metalness: properties.metalness ?? 0.1,
    roughness: properties.roughness ?? 0.7,
  });
}

/**
 * Generate a unique ID for CAD objects
 */
function generateId(): string {
  return `cad-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Create a CAD object from a shape type
 */
export function createCADObject(
  type: ShapeType,
  position: [number, number, number] = [0, 0, 0],
  rotation: [number, number, number] = [0, 0, 0],
  scale: [number, number, number] = [1, 1, 1],
  material?: MaterialProperties,
  parameters?: Record<string, number>
): CADObject {
  let mesh: THREE.Mesh;
  
  switch (type) {
    case 'box':
      const boxDims: [number, number, number] = [
        parameters?.width ?? 1,
        parameters?.height ?? 1,
        parameters?.depth ?? 1,
      ];
      mesh = createBoxShape(boxDims, position, rotation, material);
      break;
      
    case 'sphere':
      mesh = createSphereShape(parameters?.radius ?? 0.5, position, rotation, material);
      break;
      
    case 'cylinder':
      mesh = createCylinderShape(
        parameters?.radius ?? 0.5,
        parameters?.height ?? 1,
        position,
        rotation,
        material
      );
      break;
      
    case 'cone':
      mesh = createConeShape(
        parameters?.radius ?? 0.5,
        parameters?.height ?? 1,
        position,
        rotation,
        material
      );
      break;
      
    case 'plane':
      mesh = createPlaneShape(position, rotation, material);
      break;
      
    case 'torus':
      mesh = createTorusShape(
        parameters?.radius ?? 0.5,
        parameters?.tube ?? 0.2,
        position,
        rotation,
        material
      );
      break;
      
    default:
      throw new Error(`Unknown shape type: ${type}`);
  }
  
  // Apply scale
  mesh.scale.set(...scale);
  if (type === 'plane') {
    mesh.userData.width = scale[0];
    mesh.userData.height = scale[1];
  }
  
  const id = mesh.userData.cadObjectId;
  const now = Date.now();

  const cadObject: CADObject = {
    id,
    type,
    mesh,
    position,
    rotation,
    scale,
    createdAt: now,
    updatedAt: now,
  };

  if (material !== undefined) {
    cadObject.material = material;
  }

  return cadObject;
}

