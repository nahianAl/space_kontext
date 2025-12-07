/**
 * Floor generation utilities
 * Creates 3D floor meshes from wall graph boundaries and zones
 */

import * as THREE from 'three';
import type { WallGraph } from '@/features/floorplan-2d/types/wallGraph';
import type { Zone } from '@/features/floorplan-2d/types/floor';
import { pixelToMeters } from './geometryConverter';

/**
 * Calculate convex hull using Graham scan algorithm
 * Returns points in counter-clockwise order
 */
function convexHull(points: [number, number][]): [number, number][] {
  if (points.length < 3) return points;

  // Find the point with lowest y-coordinate (and leftmost if tied)
  let start = 0;
  for (let i = 1; i < points.length; i++) {
    const currentPoint = points[i];
    const startPoint = points[start];
    if (currentPoint && startPoint && (currentPoint[1] < startPoint[1] ||
        (currentPoint[1] === startPoint[1] && currentPoint[0] < startPoint[0]))) {
      start = i;
    }
  }

  // Sort points by polar angle with respect to start point
  const p0 = points[start];
  if (!p0) {
    return [];
  }
  const sorted = points
    .map((p, i) => ({ point: p, index: i }))
    .filter((_, i) => i !== start)
    .sort((a, b) => {
      const angleA = Math.atan2(a.point[1] - p0[1], a.point[0] - p0[0]);
      const angleB = Math.atan2(b.point[1] - p0[1], b.point[0] - p0[0]);
      if (Math.abs(angleA - angleB) < 0.0001) {
        // If angles are equal, sort by distance
        const distA = Math.hypot(a.point[0] - p0[0], a.point[1] - p0[1]);
        const distB = Math.hypot(b.point[0] - p0[0], b.point[1] - p0[1]);
        return distA - distB;
      }
      return angleA - angleB;
    });

  const hull: [number, number][] = [p0];

  for (const { point } of sorted) {
    // Remove points that make clockwise turn
    while (hull.length >= 2) {
      const p1 = hull[hull.length - 2];
      const p2 = hull[hull.length - 1];
      if (!p1 || !p2) {
        break;
      }
      const cross = (p2[0] - p1[0]) * (point[1] - p1[1]) -
                    (p2[1] - p1[1]) * (point[0] - p1[0]);
      if (cross <= 0) {
        hull.pop();
      } else {
        break;
      }
    }
    hull.push(point);
  }

  return hull;
}

/**
 * Offset a convex polygon outward by a given distance
 * Moves each point away from the centroid
 */
function offsetPolygon(points: [number, number][], offset: number): [number, number][] {
  if (points.length < 3) return points;

  // Calculate centroid
  const centroid: [number, number] = [
    points.reduce((sum, p) => sum + p[0], 0) / points.length,
    points.reduce((sum, p) => sum + p[1], 0) / points.length
  ];

  // Move each point away from centroid
  return points.map(([x, y]) => {
    const dx = x - centroid[0];
    const dy = y - centroid[1];
    const length = Math.hypot(dx, dy);

    if (length === 0) {
      return [x, y];
    }

    // Normalize and scale by offset
    const offsetX = (dx / length) * offset;
    const offsetY = (dy / length) * offset;

    return [x + offsetX, y + offsetY] as [number, number];
  });
}

/**
 * Extract floor boundary from wall graph
 * Returns the outer perimeter as a polygon (extended to outer wall faces)
 */
export function extractFloorBoundary(graph: WallGraph): [number, number][] {
  const nodes = Object.values(graph.nodes);
  const edges = Object.values(graph.edges);

  if (nodes.length < 3) {
    return [];
  }

  // Get wall thickness (use first wall's thickness, assuming all walls have same thickness)
  // edge.thickness is in METERS (per units fix plan)
  // Default: 0.05m (50mm) if no edges
  const firstEdge = edges.length > 0 ? edges[0] : undefined;
  const wallThicknessM = firstEdge?.thickness ?? 0.05;
  const offset = wallThicknessM / 2; // Offset by half thickness to reach outer wall face

  // Get all unique node positions (convert from pixels to meters)
  const points: [number, number][] = nodes.map(node => [
    pixelToMeters(node.position[0]),
    pixelToMeters(node.position[1])
  ]);

  // Calculate convex hull to get outer boundary
  const centerlineBoundary = convexHull(points);

  // Offset outward by half wall thickness to reach outer wall faces
  const boundary = offsetPolygon(centerlineBoundary, offset);

  return boundary;
}

/**
 * Create floor mesh from boundary polygon
 */
export function createFloorMesh(
  boundary: [number, number][],
  material: THREE.Material,
  elevation: number = 0
): THREE.Mesh | null {
  console.log('🏗️ [Floor] Creating floor mesh:', {
    boundaryPoints: boundary.length,
    elevation,
    boundary
  });

  if (boundary.length < 3) {
    console.log('⚠️ [Floor] Not enough boundary points:', boundary.length);
    return null;
  }

  try {
    // Validate boundary points
    for (let i = 0; i < boundary.length; i++) {
      const point = boundary[i];
      if (!point) {
        continue;
      }
      const [x, y] = point;
      if (!isFinite(x) || !isFinite(y)) {
        console.error('❌ [Floor] Invalid boundary point:', { index: i, x, y });
        return null;
      }
    }

    // THREE.Shape/ExtrudeGeometry is buggy, let's create geometry manually
    // 6 inches = 0.15 meters
    const FLOOR_THICKNESS = 0.15;

    // Triangulate the polygon using Earcut-like approach (simple for convex polygons)
    // For a simple rectangle/convex hull, we can use a fan triangulation
    const vertices: number[] = [];
    const indices: number[] = [];

    // Create extruded floor mesh manually
    // Bottom face vertices (at y = 0, on ground)
    for (const [x, z] of boundary) {
      vertices.push(x, 0, z); // Bottom surface (x, y=0, z)
    }

    // Top face vertices (at y = FLOOR_THICKNESS, 6 inches up)
    for (const [x, z] of boundary) {
      vertices.push(x, FLOOR_THICKNESS, z); // Top surface (x, y=thickness, z)
    }

    const n = boundary.length;

    // Bottom face triangles (fan triangulation, reversed winding for downward-facing)
    for (let i = 1; i < n - 1; i++) {
      indices.push(0, i + 1, i);
    }

    // Top face triangles (fan triangulation, normal winding for upward-facing)
    for (let i = 1; i < n - 1; i++) {
      indices.push(n, n + i, n + i + 1);
    }

    // Side faces (quads made of 2 triangles each)
    for (let i = 0; i < n; i++) {
      const next = (i + 1) % n;
      const bottom1 = i;        // First n vertices are bottom (y=0)
      const bottom2 = next;
      const top1 = i + n;       // Second n vertices are top (y=FLOOR_THICKNESS)
      const top2 = next + n;

      // First triangle of quad (counter-clockwise from outside)
      indices.push(bottom1, top1, bottom2);
      // Second triangle of quad (counter-clockwise from outside)
      indices.push(bottom2, top1, top2);
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setIndex(indices);

    // Validate vertices before further processing
    const hasNaN = vertices.some(v => !isFinite(v));
    if (hasNaN) {
      console.error('❌ [Floor] NaN detected in vertices:', vertices);
      return null;
    }

    const positionAttr = geometry.attributes.position;
    if (!positionAttr) {
      throw new Error('Geometry must have a position attribute');
    }
    console.log('📐 [Floor] Manual geometry created:', {
      vertices: positionAttr.count,
      triangles: indices.length / 3,
      boundaryPoints: n,
      thickness: FLOOR_THICKNESS,
      bottomVertex: [vertices[0], vertices[1], vertices[2]],
      topVertex: [vertices[n * 3], vertices[n * 3 + 1], vertices[n * 3 + 2]],
      elevationRange: [0, FLOOR_THICKNESS]
    });

    // Translate to elevation BEFORE computing UVs and normals
    geometry.translate(0, elevation, 0);

    // Calculate UVs for proper texture tiling (1 unit = 1 meter)
    const positions = positionAttr;
    const uvs: number[] = [];

    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i);
      const z = positions.getZ(i);
      // Use world coordinates for UV mapping (texture repeats every 1 unit)
      // Validate UV values
      if (!isFinite(x) || !isFinite(z)) {
        console.error('❌ [Floor] Invalid UV coordinate:', { i, x, z });
        return null;
      }
      uvs.push(x, z);
    }

    geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));

    console.log('🎨 [Floor] UVs generated:', {
      uvCount: uvs.length / 2,
      sampleUV: [uvs[0], uvs[1]]
    });

    // Compute normals
    geometry.computeVertexNormals();

    const mesh = new THREE.Mesh(geometry, material);
    mesh.receiveShadow = true;
    mesh.userData.isFloor = true;

    console.log('✅ [Floor] Floor mesh created successfully');

    return mesh;
  } catch (error) {
    console.error('❌ [Floor] Error creating floor mesh:', error);
    return null;
  }
}

/**
 * Create zone overlay mesh from zone polygon
 */
export function createZoneMesh(
  zone: Zone,
  elevation: number = 0.16 // Just above base floor top (0.15 + 0.01)
): THREE.Mesh | null {
  if (zone.points.length < 3) {
    return null;
  }

  try {
    // Convert zone points from pixels to meters
    const pointsInMeters = zone.points.map(([x, y]) => [
      pixelToMeters(x),
      pixelToMeters(y)
    ]);

    // Safety check (should never happen due to check above, but satisfies TypeScript)
    if (pointsInMeters.length === 0 || !pointsInMeters[0]) {
      return null;
    }

    // Create THREE.js shape from zone points
    const shape = new THREE.Shape();
    const firstPoint = pointsInMeters[0];
    if (firstPoint[0] === undefined || firstPoint[1] === undefined) {
      return null;
    }

    shape.moveTo(firstPoint[0], firstPoint[1]);

    for (let i = 1; i < pointsInMeters.length; i++) {
      const point = pointsInMeters[i];
      if (point && point[0] !== undefined && point[1] !== undefined) {
        shape.lineTo(point[0], point[1]);
      }
    }

    // Close the path
    shape.lineTo(firstPoint[0], firstPoint[1]);

    // Create thin extruded geometry for zone overlay
    const ZONE_THICKNESS = 0.001; // Very thin overlay

    const extrudeSettings = {
      depth: ZONE_THICKNESS,
      bevelEnabled: false
    };

    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);

    // Check if extrusion worked, fallback to flat geometry if needed
    if (!geometry.attributes.position || geometry.attributes.position.count === 0) {
      console.warn('⚠️ [Floor] Zone ExtrudeGeometry failed, using flat ShapeGeometry');
      const flatGeometry = new THREE.ShapeGeometry(shape);
      flatGeometry.rotateX(-Math.PI / 2);
      flatGeometry.translate(0, elevation, 0);

      // Continue with flat geometry
      const positions = flatGeometry.attributes.position;
      if (!positions) {
        console.error('⚠️ [Floor] Flat geometry has no position attribute');
        return null;
      }

      const uvs: number[] = [];
      for (let i = 0; i < positions.count; i++) {
        const x = positions.getX(i);
        const z = positions.getZ(i);
        uvs.push(x, z);
      }
      flatGeometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
      flatGeometry.computeVertexNormals();

      let material: THREE.Material;
      if (zone.material) {
        const textureLoader = new THREE.TextureLoader();
        const diffuseMap = textureLoader.load(zone.material.diffuse);
        const normalMap = textureLoader.load(zone.material.normal);
        const roughnessMap = textureLoader.load(zone.material.rough);
        const aoMap = textureLoader.load(zone.material.ao);

        [diffuseMap, normalMap, roughnessMap, aoMap].forEach(texture => {
          texture.wrapS = THREE.RepeatWrapping;
          texture.wrapT = THREE.RepeatWrapping;
          texture.repeat.set(1, 1);
        });

        material = new THREE.MeshStandardMaterial({
          map: diffuseMap,
          normalMap: normalMap,
          roughnessMap: roughnessMap,
          aoMap: aoMap,
          side: THREE.DoubleSide,
        });
      } else {
        material = new THREE.MeshStandardMaterial({
          color: zone.fill,
          opacity: zone.fillOpacity,
          transparent: zone.fillOpacity < 1,
          side: THREE.DoubleSide,
        });
      }

      const mesh = new THREE.Mesh(flatGeometry, material);
      mesh.receiveShadow = true;
      mesh.userData.isZoneFloor = true;
      mesh.userData.zoneId = zone.id;
      return mesh;
    }

    // Rotate to be horizontal (XZ plane instead of XY)
    geometry.rotateX(-Math.PI / 2);

    // Set elevation (just above base floor top surface)
    geometry.translate(0, elevation, 0);

    // Calculate UVs for proper texture tiling
    const positions = geometry.attributes.position;
    const uvs: number[] = [];

    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i);
      const z = positions.getZ(i);
      // Use world coordinates for UV mapping (texture repeats every 1 unit)
      uvs.push(x, z);
    }

    geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));

    // Compute normals
    geometry.computeVertexNormals();

    // Create material from zone material data
    let material: THREE.Material;

    if (zone.material) {
      const textureLoader = new THREE.TextureLoader();

      // Load PBR textures
      const diffuseMap = textureLoader.load(zone.material.diffuse);
      const normalMap = textureLoader.load(zone.material.normal);
      const roughnessMap = textureLoader.load(zone.material.rough);
      const aoMap = textureLoader.load(zone.material.ao);

      // Set texture repeat for tiling
      [diffuseMap, normalMap, roughnessMap, aoMap].forEach(texture => {
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(1, 1); // 1 texture unit = 1 world unit
      });

      material = new THREE.MeshStandardMaterial({
        map: diffuseMap,
        normalMap: normalMap,
        roughnessMap: roughnessMap,
        aoMap: aoMap,
        side: THREE.DoubleSide, // Render both sides
      });
    } else {
      // Fallback to color if no material
      material = new THREE.MeshStandardMaterial({
        color: zone.fill,
        opacity: zone.fillOpacity,
        transparent: zone.fillOpacity < 1,
        side: THREE.DoubleSide, // Render both sides
      });
    }

    const mesh = new THREE.Mesh(geometry, material);
    mesh.receiveShadow = true;
    mesh.userData.isZoneFloor = true;
    mesh.userData.zoneId = zone.id;

    return mesh;
  } catch (error) {
    console.error('Error creating zone mesh:', error);
    return null;
  }
}

/**
 * Generate all floor meshes (base + zones)
 */
export async function generateFloorMeshes(
  graph: WallGraph,
  zones: Zone[],
  defaultMaterial: THREE.Material
): Promise<{
  baseFloor: THREE.Mesh | null;
  zoneMeshes: THREE.Mesh[];
}> {
  // Generate base floor from wall boundary
  const boundary = extractFloorBoundary(graph);
  const baseFloor = boundary.length >= 3
    ? createFloorMesh(boundary, defaultMaterial, 0)
    : null;

  // Generate zone overlay meshes (just above floor top at 0.15)
  const zoneMeshes: THREE.Mesh[] = [];
  for (const zone of zones) {
    const zoneMesh = createZoneMesh(zone); // Uses default elevation of 0.16
    if (zoneMesh) {
      zoneMeshes.push(zoneMesh);
    }
  }

  return { baseFloor, zoneMeshes };
}
