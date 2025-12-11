/**
 * Geometry conversion utilities for 2D to 3D conversion
 * Converts wall graph data into Three.js geometry with proper scaling and positioning
 * Handles wall mesh generation, opening cutout box creation, and coordinate system transformations
 * Uses CSG operations for creating opening cutouts in walls
 * 
 * CRITICAL: Wall graph data is stored in METERS:
 * - wall.length → meters (NOT pixels)
 * - wall.thickness → meters (NOT pixels)
 * - opening.width → meters (NOT pixels)
 * - opening.position → meters (NOT pixels)
 * - opening.height → meters (NOT pixels)
 * 
 * Only node positions (wall.startNodeId, wall.endNodeId) are in pixels for canvas rendering.
 * All other geometric data must be used directly without pixel-to-meter conversion.
 */

import * as THREE from 'three';
import { Brush, Evaluator, SUBTRACTION } from 'three-bvh-csg';
import { WallGraph, WallEdge, WallNode, Opening, Point } from '@/features/floorplan-2d/types/wallGraph';
import { createMiteredWallsFromGraphMaker } from '@/features/floorplan-2d/utils/wallGeometryMaker';
import type { WallPolygon } from '@/features/floorplan-2d/utils/wallGeometryMaker';
import { loadOBJModel, scaleModelToFit, getBoundingBox, centerModelAtOrigin } from './objLoader';

export const DEFAULT_WALL_COLOR = '#cccccc';

// Conversion constants
const PIXELS_TO_METERS = 0.01; // 1 pixel = 0.01 meters (1cm per pixel) - adjustable
const MM_TO_METERS = 0.001;

/**
 * Convert 2D pixel coordinates to 3D world coordinates (meters)
 */
export function pixelToMeters(pixels: number): number {
  return pixels * PIXELS_TO_METERS;
}

/**
 * Convert meters back to 2D pixel coordinates
 */
export function metersToPixels(meters: number): number {
  return meters / PIXELS_TO_METERS;
}

/**
 * Convert millimeters to meters
 */
export function mmToMeters(mm: number): number {
  return mm * MM_TO_METERS;
}

/**
 * Generate wall mesh from mitered 2D polygon (with proper corner mitering)
 * Converts 2D polygon to 3D by extruding it vertically
 */
function generateWallMeshFromPolygon(
  polygon: WallPolygon,
  wallHeightMm: number
): THREE.Mesh | null {
  if (polygon.length < 3) {
    return null;
  }
  
  const wallHeightM = mmToMeters(wallHeightMm);
  
  // Create Three.js Shape from 2D polygon (convert pixels to meters)
  // Shape coordinates are interpreted as (X, Y) in the XY plane
  // We'll rotate to align with floor plane (XZ) and extrude along Y axis (up)
  const shape = new THREE.Shape();
  const firstPoint = polygon[0];

  // Safety check (should never happen due to length check above)
  if (!firstPoint || firstPoint[0] === undefined || firstPoint[1] === undefined) {
    return null;
  }

  // Use positive Y coordinate so after rotation it maps to negative Z, then we'll flip it
  // After +90° rotation around X: (x, y, z) -> (x, z, -y)
  // So (px, py, 0) -> (px, 0, -py) in world space
  // To fix Z-axis flip, we'll use positive Y (which gives -py after rotation) then scale Z by -1
  // OR: Use negative Y which gives +py, then scale Z by -1 to get -py
  // Actually simpler: Use positive Y and add a scale flip on Z after rotation
  shape.moveTo(
    pixelToMeters(firstPoint[0]),
    pixelToMeters(firstPoint[1]) // Positive Y - will become negative Z after rotation, then we'll flip
  );

  for (let i = 1; i < polygon.length; i++) {
    const point = polygon[i];
    if (point && point[0] !== undefined && point[1] !== undefined) {
      shape.lineTo(
        pixelToMeters(point[0]),
        pixelToMeters(point[1]) // Positive Y
      );
    }
  }
  shape.closePath();
  
  // Extrude shape along Z axis (will become Y axis after rotation)
  const extrudeSettings = {
    depth: wallHeightM,
    bevelEnabled: false,
    curveSegments: 1,
    steps: 1,
  };
  
  const extruded = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  let geometry: THREE.BufferGeometry = extruded;

  // Check if already non-indexed
  if (geometry.index !== null) {
    geometry = geometry.toNonIndexed();
  }

  // CRITICAL: Compute normals for CSG operations to work
  // The three-bvh-csg library requires normal attributes
  geometry.computeVertexNormals();

  const material = new THREE.MeshLambertMaterial({
    color: DEFAULT_WALL_COLOR,
    side: THREE.DoubleSide,
    flatShading: true, // Prevent diagonal triangle lines from showing
  });
  material.needsUpdate = true;

  const mesh = new THREE.Mesh(geometry, material);
  
  // Enable shadows
  mesh.castShadow = true;
  mesh.receiveShadow = false;
  
  // Rotate +90° around X axis to align with floor plane:
  // Shape is in XY plane, ExtrudeGeometry extrudes from z=0 to z=depth
  // After +90° rotation around X: (x,y,z) -> (x,z,-y)
  // So (px, py, 0 to depth) -> (px, 0 to depth, -py) after rotation
  mesh.rotation.x = Math.PI / 2;
  
  // Flip Z axis to fix mirroring issue
  // After rotation: Z = -py (from positive Y in shape)
  // We want Z = -(-py) = py, so we scale Z by -1
  mesh.scale.z = -1;
  
  // Position wall base at y=0 (grid surface)
  // ExtrudeGeometry extrudes from z=0 to z=depth
  // After +90° rotation around X: z=0 becomes y=0, z=depth becomes y=depth
  // So the base is at y=0 in local space, position the mesh at y=0 to place base on ground
  mesh.position.y = 0;
  
  // Ensure matrix is updated before CSG operations
  mesh.updateMatrixWorld(true);
  
  return mesh;
}

/**
 * Create a simple cutout box for an opening - USING STORED VALUES
 * Now uses pre-calculated center3D, angle, and height from Opening interface
 * For doors, calculates actual scaled model height to match the 3D model exactly
 */
async function createSimpleOpeningCutout(
  opening: Opening,
  wall: WallEdge,
  startNode: WallNode,
  endNode: WallNode,
  wallHeightMm: number
): Promise<THREE.Mesh | null> {
  // Use stored values if available, otherwise calculate (for backwards compatibility)
  let center3D: [number, number, number];
  let angle: number;
  let openingHeightM: number;
  let openingWidthM: number;
  // wall.thickness is already in METERS (not pixels!)
  const wallThicknessM = wall.thickness;
  
  if (opening.center3D && opening.angle !== undefined) {
    // Use pre-calculated stored values - much simpler!
    angle = opening.angle;
    
    // For cutout dimensions, we'll calculate them by loading the model
    // and simulating the same scaling that happens in generateOpeningModels
    // So we don't set openingWidthM/openingHeightM here - they'll be calculated below
    let initialTargetWidth: number;
    let initialTargetHeight: number;
    
    // CRITICAL: Always prefer userWidth if available, but if missing, use pixel-based calculation
    // opening.width is in pixels and should remain constant regardless of wall length changes
    // We cannot safely derive userWidth from opening.width without knowing the unit system
    // So we'll use pixelToMeters conversion which maintains physical size
    if (opening.userWidth !== undefined && opening.userHeight !== undefined && opening.unitSystem) {
      // Convert user-defined dimensions to meters (these are TARGET dimensions, not final)
      if (opening.unitSystem === 'metric') {
        // Convert cm to meters
        initialTargetWidth = opening.userWidth * 0.01;
        initialTargetHeight = opening.userHeight * 0.01;
      } else {
        // Convert inches to meters
        initialTargetWidth = opening.userWidth * 0.0254;
        initialTargetHeight = opening.userHeight * 0.0254;
      }
      
      // For doors, ensure height doesn't exceed wall height
      if (opening.type === 'door') {
        const wallHeightM = mmToMeters(wallHeightMm);
        initialTargetHeight = Math.min(initialTargetHeight, wallHeightM);
      }
      
      // Set as initial values (will be recalculated below based on actual model scaling)
      openingWidthM = initialTargetWidth;
      openingHeightM = initialTargetHeight;
    } else {
      // opening.width is already in METERS (not pixels!)
      openingWidthM = opening.width;
      
      if (opening.height !== undefined) {
        // Use stored height, but for doors we need to recalculate based on actual model dimensions
        openingHeightM = opening.height;
      } else {
        // Fallback: calculate height
        const wallHeightM = mmToMeters(wallHeightMm);
        // Use userSillHeight if available, otherwise convert from mm
        let openingSillHeightM: number;
        if (opening.userSillHeight !== undefined && opening.unitSystem) {
          if (opening.unitSystem === 'metric') {
            openingSillHeightM = opening.userSillHeight * 0.01;
          } else {
            openingSillHeightM = opening.userSillHeight * 0.0254;
          }
        } else {
          openingSillHeightM = mmToMeters(opening.sillHeight);
        }
        openingHeightM = opening.type === 'door' 
          ? wallHeightM - openingSillHeightM
          : 1.5;
      }
    }
    
    // For doors and windows: ALWAYS recalculate dimensions based on actual model scaling
    // We need to simulate the same scaling that happens in generateOpeningModels
    // The model is scaled using uniform scaling (Math.min(scaleX, scaleY))
    // So we need to load the model temporarily to get its actual dimensions after scaling
    // This is critical because uniform scaling can change the final dimensions from user-defined values
    if (opening.type === 'door' || opening.type === 'window') {
      try {
        // Load the appropriate model to calculate actual scaled dimensions
        const modelPath = opening.type === 'door' ? '/Door.obj' : '/Window.obj';
        const model = await loadOBJModel(modelPath);
        
        // CRITICAL: Center the model at origin FIRST (same as scaleModelToFit does)
        // This ensures bounding box calculations are accurate
        centerModelAtOrigin(model);
        
        // Update matrix after centering to ensure bounding box calculation is accurate
        model.updateMatrix();
        model.updateMatrixWorld(true);
        
        // Calculate target dimensions - MUST match exactly what's used in generateOpeningModels
        let targetWidth: number;
        let targetHeight: number;
        
        // Use the same logic as generateOpeningModels for calculating target dimensions
        if (opening.userWidth !== undefined && opening.userHeight !== undefined && opening.unitSystem) {
          // Convert user-defined dimensions to meters
          if (opening.unitSystem === 'metric') {
            targetWidth = opening.userWidth * 0.01;
            targetHeight = opening.userHeight * 0.01;
          } else {
            targetWidth = opening.userWidth * 0.0254;
            targetHeight = opening.userHeight * 0.0254;
          }
          
          // For doors: ensure height doesn't exceed wall height
          // For windows: userHeight is the opening height from sill, not from floor
          // So we need to validate that sill + opening doesn't exceed wall height
          if (opening.type === 'door') {
            const wallHeightM = mmToMeters(wallHeightMm);
            targetHeight = Math.min(targetHeight, wallHeightM);
          } else {
            // Windows: validate that sillHeight + openingHeight doesn't exceed wall height
            const wallHeightM = mmToMeters(wallHeightMm);
            let openingSillHeightM: number;
            if (opening.userSillHeight !== undefined && opening.unitSystem) {
              if (opening.unitSystem === 'metric') {
                openingSillHeightM = opening.userSillHeight * 0.01;
              } else {
                openingSillHeightM = opening.userSillHeight * 0.0254;
              }
            } else {
              openingSillHeightM = mmToMeters(opening.sillHeight);
            }
            const totalWindowHeight = openingSillHeightM + targetHeight;
            if (totalWindowHeight > wallHeightM) {
              // Reduce opening height to fit within wall
              targetHeight = Math.max(0, wallHeightM - openingSillHeightM);
            }
          }
        } else {
          // opening.width is already in METERS (not pixels!)
          targetWidth = opening.width;
          // Use userSillHeight if available for height calculation
          let fallbackSillHeightM: number;
          if (opening.userSillHeight !== undefined && opening.unitSystem) {
            if (opening.unitSystem === 'metric') {
              fallbackSillHeightM = opening.userSillHeight * 0.01;
            } else {
              fallbackSillHeightM = opening.userSillHeight * 0.0254;
            }
          } else {
            fallbackSillHeightM = mmToMeters(opening.sillHeight);
          }
          targetHeight = opening.height || (opening.type === 'door' 
            ? mmToMeters(wallHeightMm) - fallbackSillHeightM
            : 1.5);
        }
        
        // Get original model dimensions AFTER centering
        // Need to ensure model is properly updated for accurate bounding box
        const originalBbox = getBoundingBox(model);
        const originalWidth = originalBbox.max.x - originalBbox.min.x;
        const originalHeight = originalBbox.max.y - originalBbox.min.y;
        
        if (originalWidth === 0 || originalHeight === 0) {
          console.warn(`⚠️ Model ${modelPath} has zero dimensions`);
          throw new Error('Invalid model dimensions');
        }
        
        // Calculate scale factors (EXACT same logic as scaleModelToFit)
        const scaleX = targetWidth / originalWidth;
        const scaleY = targetHeight / originalHeight;
        const uniformScale = Math.min(scaleX, scaleY);
        
        // CRITICAL: Actually scale the model temporarily to get EXACT bounding box
        // This ensures we get the same result as generateOpeningModels
        const originalScale = model.scale.clone();
        model.scale.set(uniformScale, uniformScale, uniformScale);
        model.updateMatrix();
        model.updateMatrixWorld(true);
        
        // Get bounding box of the SCALED model (exactly what generateOpeningModels does)
        const scaledBbox = getBoundingBox(model);
        const actualScaledWidth = scaledBbox.max.x - scaledBbox.min.x;
        const actualScaledHeight = scaledBbox.max.y - scaledBbox.min.y;
        
        // Reset model scale for cleanup
        model.scale.copy(originalScale);
        model.updateMatrix();
        model.updateMatrixWorld(true);
        
        // Use actual scaled dimensions from bounding box - these match generateOpeningModels exactly
        // CRITICAL: These are the FINAL dimensions after uniform scaling, which may differ from target
        // due to aspect ratio preservation. This ensures cutout matches model exactly.
        openingWidthM = actualScaledWidth;
        openingHeightM = actualScaledHeight;
        
        // Verify: Log the final dimensions being used
        console.log(`✅ [CUTOUT FINAL] ${opening.id} using dimensions:`, {
          'Width (m)': openingWidthM.toFixed(4),
          'Height (m)': openingHeightM.toFixed(4),
          'These match model dimensions': 'YES'
        });
        
        // Debug: Log to verify dimensions match
        console.log(`✂️ [CUTOUT DEBUG] ${opening.type} ${opening.id} - Calculated cutout dimensions:`, {
          'Has userWidth': opening.userWidth !== undefined,
          'userWidth': opening.userWidth,
          'opening.width (px)': opening.width,
          'Target Width (m)': targetWidth.toFixed(3),
          'Target Height (m)': targetHeight.toFixed(3),
          'Actual Scaled Width (m)': actualScaledWidth.toFixed(3),
          'Actual Scaled Height (m)': actualScaledHeight.toFixed(3),
          'Uniform Scale': uniformScale.toFixed(4),
          'Original Width (m)': originalWidth.toFixed(3),
          'Original Height (m)': originalHeight.toFixed(3),
          'Cutout will use': 'actualScaledWidth/Height (matches model)',
        });
        
        // Cleanup
        model.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.geometry.dispose();
            if (Array.isArray(child.material)) {
              child.material.forEach(m => m.dispose());
            } else {
              child.material.dispose();
            }
          }
        });
        
      } catch (error) {
        console.error(`❌ [CUTOUT] Failed to load model for ${opening.type} cutout calculation:`, error);
        console.error('[CUTOUT] Opening details:', {
          openingId: opening.id,
          openingType: opening.type,
          modelPath: opening.type === 'door' ? '/Door.obj' : '/Window.obj',
          errorMessage: error instanceof Error ? error.message : String(error)
        });
        // Fallback: use stored dimensions or reasonable defaults
        if (opening.type === 'door') {
          openingHeightM = Math.min(mmToMeters(wallHeightMm), 2.1); // Cap at 2.1m (7ft)
        } else {
          // For windows, use stored height if available
          if (opening.height !== undefined) {
            openingHeightM = opening.height;
          }
        }
      }
    }
    
    // Adjust center3D Y position: doors should start from ground (y=0)
    if (opening.type === 'door') {
      // Doors start at y=0, center is at half height (using actual scaled height)
      center3D = [opening.center3D[0], openingHeightM / 2, opening.center3D[2]];
    } else {
      // Windows: recalculate center Y using actual scaled height instead of target height
      // The stored center3D[1] was calculated with target height, but model uses actual scaled height
      let openingSillHeightM: number;
      if (opening.userSillHeight !== undefined && opening.unitSystem) {
        if (opening.unitSystem === 'metric') {
          openingSillHeightM = opening.userSillHeight * 0.01;
        } else {
          openingSillHeightM = opening.userSillHeight * 0.0254;
        }
      } else {
        openingSillHeightM = mmToMeters(opening.sillHeight);
      }
      // Center Y = sill height + half of actual scaled height
      center3D = [
        opening.center3D[0], 
        openingSillHeightM + openingHeightM / 2,  // Use actual scaled height
        opening.center3D[2]
      ];
      // NOTE: Do NOT override openingHeightM here - it's already set to actualScaledHeight
      // The stored opening.height is the target height, which may differ from actual scaled height
      // due to aspect ratio preservation during scaling
    }
    
  } else {
    // Fallback: Calculate values (for backwards compatibility with old openings)
    // CRITICAL: Even in fallback, we must load the model to get actual scaled dimensions
    // to match generateOpeningModels exactly
    
    const wallHeightM = mmToMeters(wallHeightMm);
    // Use userSillHeight if available, otherwise convert from mm
    let openingSillHeightM: number;
    if (opening.userSillHeight !== undefined && opening.unitSystem) {
      if (opening.unitSystem === 'metric') {
        // Convert cm to meters
        openingSillHeightM = opening.userSillHeight * 0.01;
      } else {
        // Convert inches to meters
        openingSillHeightM = opening.userSillHeight * 0.0254;
      }
    } else {
      // Fallback: convert from millimeters
      openingSillHeightM = mmToMeters(opening.sillHeight);
    }
    
    // Calculate target dimensions (same logic as above)
    let targetWidth: number;
    let targetHeight: number;
    
    if (opening.userWidth !== undefined && opening.userHeight !== undefined && opening.unitSystem) {
      if (opening.unitSystem === 'metric') {
        targetWidth = opening.userWidth * 0.01;
        targetHeight = opening.userHeight * 0.01;
      } else {
        targetWidth = opening.userWidth * 0.0254;
        targetHeight = opening.userHeight * 0.0254;
      }
      
      if (opening.type === 'door') {
        targetHeight = Math.min(targetHeight, wallHeightM);
      } else {
        const totalWindowHeight = openingSillHeightM + targetHeight;
        if (totalWindowHeight > wallHeightM) {
          targetHeight = Math.max(0, wallHeightM - openingSillHeightM);
        }
      }
    } else {
      // opening.width is already in METERS (not pixels!)
      targetWidth = opening.width;
      targetHeight = opening.height || (opening.type === 'door' 
        ? wallHeightM - openingSillHeightM
        : 1.5);
    }
    
    // Load model to get actual scaled dimensions (CRITICAL: must match generateOpeningModels)
    if (opening.type === 'door' || opening.type === 'window') {
      try {
        const modelPath = opening.type === 'door' ? '/Door.obj' : '/Window.obj';
        const model = await loadOBJModel(modelPath);
        centerModelAtOrigin(model);
        model.updateMatrix();
        model.updateMatrixWorld(true);
        
        const originalBbox = getBoundingBox(model);
        const originalWidth = originalBbox.max.x - originalBbox.min.x;
        const originalHeight = originalBbox.max.y - originalBbox.min.y;
        
        if (originalWidth === 0 || originalHeight === 0) {
          console.warn(`⚠️ Model ${modelPath} has zero dimensions`);
          throw new Error('Invalid model dimensions');
        }
        
        const scaleX = targetWidth / originalWidth;
        const scaleY = targetHeight / originalHeight;
        const uniformScale = Math.min(scaleX, scaleY);
        
        const originalScale = model.scale.clone();
        model.scale.set(uniformScale, uniformScale, uniformScale);
        model.updateMatrix();
        model.updateMatrixWorld(true);
        
        const scaledBbox = getBoundingBox(model);
        openingWidthM = scaledBbox.max.x - scaledBbox.min.x;
        openingHeightM = scaledBbox.max.y - scaledBbox.min.y;
        
        model.scale.copy(originalScale);
        model.updateMatrix();
        model.updateMatrixWorld(true);
        
        // Cleanup
        model.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.geometry.dispose();
            if (Array.isArray(child.material)) {
              child.material.forEach(m => m.dispose());
            } else {
              child.material.dispose();
            }
          }
        });
      } catch (error) {
        // Fallback to direct calculation if model loading fails
        // opening.width is already in METERS (not pixels!)
        openingWidthM = opening.width;
        openingHeightM = opening.height || (opening.type === 'door' 
          ? wallHeightM - openingSillHeightM
          : 1.5);
      }
    } else {
      // Not a door/window, use direct calculation
      // opening.width is already in METERS (not pixels!)
      openingWidthM = opening.width;
      openingHeightM = opening.height || (opening.type === 'door' 
        ? wallHeightM - openingSillHeightM
        : 1.5);
    }
    
    if (openingHeightM <= 0) {return null;}
    
    // Calculate from scratch
    const startPoint = new THREE.Vector2(
      pixelToMeters(startNode.position[0]),
      pixelToMeters(startNode.position[1])
    );
    const endPoint = new THREE.Vector2(
      pixelToMeters(endNode.position[0]),
      pixelToMeters(endNode.position[1])
    );
    
    const wallVector = endPoint.clone().sub(startPoint);
    angle = Math.atan2(wallVector.y, wallVector.x);
    // opening.position is already in METERS (not pixels!)
    const positionAlongWallM = opening.position;
    
    const openingCenter2D = startPoint.clone().add(
      wallVector.normalize().multiplyScalar(positionAlongWallM)
    );
    
    center3D = [
      openingCenter2D.x,
      openingSillHeightM + openingHeightM / 2,
      openingCenter2D.y
    ];
  }
  
  if (openingHeightM <= 0) {return null;}
  
  // Create cutout box with exact same dimensions as the opening model
  // Width and height match the scaled model, depth is thicker for clean cutouts
  const cutoutGeometry = new THREE.BoxGeometry(
    openingWidthM,        // Width: matches opening model width
    openingHeightM,       // Height: matches opening model height
    wallThicknessM + 0.2  // Depth: extra thickness (along wall depth/Z-axis) for clean cut-through
  );
  
  const cutoutMaterial = new THREE.MeshBasicMaterial({ 
    color: 'red',
    transparent: true,
    opacity: 0.5
  });
  
  const cutoutMesh = new THREE.Mesh(cutoutGeometry, cutoutMaterial);
  
  // Position using stored center3D values
  cutoutMesh.position.set(center3D[0], center3D[1], center3D[2]);
  cutoutMesh.rotation.y = -angle;  // Use stored angle
  
  // Ensure geometry normals are computed
  cutoutGeometry.computeVertexNormals();
  cutoutMesh.updateMatrix();
  cutoutMesh.updateMatrixWorld(true);
  
  return cutoutMesh;
}

/**
 * Generate all wall meshes from wall graph using mitered corners
 * Cuts out openings using CSG boolean operations - SIMPLIFIED APPROACH
 * Returns both wall meshes and cutout boxes for debugging
 */
export async function generateWallMeshes(
  graph: WallGraph,
  wallHeightMm: number
): Promise<{ wallMeshes: THREE.Mesh[]; cutoutBoxes: THREE.Mesh[] }> {
  const meshes: THREE.Mesh[] = [];
  const debugCutoutBoxes: THREE.Mesh[] = [];
  
  // Debug: Log wall dimensions in 3D generation
  const METERS_TO_FEET = 3.28084;
  const wallHeightM = mmToMeters(wallHeightMm);
  
  // Log dimensions for each wall in the graph
  Object.values(graph.edges).forEach((wall: WallEdge) => {
    const startNode = graph.nodes[wall.startNodeId];
    const endNode = graph.nodes[wall.endNodeId];
    if (!startNode || !endNode) {return;}
    
    // wall.length and wall.thickness are already in METERS (not pixels!)
    const wallLengthM = wall.length;
    const wallThicknessM = wall.thickness;
    
    // Convert to pixels for logging/debugging only
    const wallLengthPx = wallLengthM / PIXELS_TO_METERS;
    
    console.log(`🏗️ [3D WALL DEBUG] Processing wall ${wall.id}:`, {
      'Length (px)': wallLengthPx.toFixed(2),
      'Length (m)': wallLengthM.toFixed(3),
      'Length (ft)': (wallLengthM * METERS_TO_FEET).toFixed(3),
      'Thickness (px)': wall.thickness,
      'Thickness (m)': wallThicknessM.toFixed(3),
      'Thickness (ft)': (wallThicknessM * METERS_TO_FEET).toFixed(3),
      'Thickness (mm)': (wallThicknessM * 1000).toFixed(1),
      'Height (mm)': wallHeightMm,
      'Height (m)': wallHeightM.toFixed(3),
      'Height (ft)': (wallHeightM * METERS_TO_FEET).toFixed(3),
      'Openings count': (wall.openings || []).length
    });
  });
  
  // Use 2D mitering logic to get proper corner geometry
  const miteredPolygons = createMiteredWallsFromGraphMaker(graph);
  
  // Process openings asynchronously to get actual scaled dimensions (for doors especially)
  const openingCutoutPromises: Promise<THREE.Mesh | null>[] = [];
  const openingIdList: string[] = [];
  
  // Collect all opening cutout promises
  Object.values(graph.edges).forEach((wall: WallEdge) => {
    const startNode = graph.nodes[wall.startNodeId];
    const endNode = graph.nodes[wall.endNodeId];
    
    if (!startNode || !endNode) {
      return;
    }
    
    const openings = wall.openings || [];
    
    openings.forEach((opening: Opening) => {
      openingIdList.push(opening.id);
      openingCutoutPromises.push(
        createSimpleOpeningCutout(opening, wall, startNode, endNode, wallHeightMm)
      );
    });
  });
  
  // Wait for all cutouts to be created
  console.log(`🔍 [CSG] Waiting for ${openingCutoutPromises.length} cutout creation promises...`);
  const cutoutResults = await Promise.all(openingCutoutPromises);
  console.log(`✅ [CSG] Cutout promises resolved. Results:`, {
    totalPromises: openingCutoutPromises.length,
    successfulCutouts: cutoutResults.filter(c => c !== null).length,
    failedCutouts: cutoutResults.filter(c => c === null).length
  });

  // Process the results into a map
  const cutoutMap = new Map<string, THREE.Mesh>();
  const allCutoutsMap = new Map<string, THREE.Mesh>();

  cutoutResults.forEach((cutout, index) => {
    const openingId = openingIdList[index];
    if (!openingId) {
      return;
    }
    if (cutout) {
      // Find the opening in the graph to get its data AND wallId
      let openingData: Opening | null = null;
      let openingWallId: string | null = null;
      for (const wall of Object.values(graph.edges)) {
        const found = (wall.openings || []).find(op => op.id === openingId);
        if (found) {
          openingData = found;
          openingWallId = wall.id;
          break;
        }
      }

      if (openingData && openingWallId) {
        // Store wallId in cutout userData for filtering later
        cutout.userData.wallId = openingWallId;
        cutout.userData.openingId = openingId;
        const boxGeometry = cutout.geometry as THREE.BoxGeometry;
        const cutoutWidthM = boxGeometry.parameters?.width || 0;
        const cutoutHeightM = boxGeometry.parameters?.height || 0;
        const cutoutDepthM = boxGeometry.parameters?.depth || 0;
        
        console.log(`🚪 [3D CUTOUT DEBUG] Cutout box for ${openingData.type} ${openingId}:`, {
          'Width (m)': cutoutWidthM.toFixed(3),
          'Width (ft)': (cutoutWidthM * METERS_TO_FEET).toFixed(3),
          'Width (mm)': (cutoutWidthM * 1000).toFixed(1),
          'Width (px)': (cutoutWidthM / PIXELS_TO_METERS).toFixed(2),
          'Height (m)': cutoutHeightM.toFixed(3),
          'Height (ft)': (cutoutHeightM * METERS_TO_FEET).toFixed(3),
          'Height (mm)': (cutoutHeightM * 1000).toFixed(1),
          'Height (px)': (cutoutHeightM / PIXELS_TO_METERS).toFixed(2),
          'Depth (m)': cutoutDepthM.toFixed(3),
          'Depth (ft)': (cutoutDepthM * METERS_TO_FEET).toFixed(3),
          'Original Width (px)': openingData.width,
          'Original Sill Height (mm)': openingData.sillHeight,
          'Stored Height (m)': openingData.height?.toFixed(3) || 'N/A',
          'Position': cutout.position.toArray(),
          conversion_note_1: '1px = 0.01m = 1cm',
          conversion_note_2: '1mm = 0.001m'
        });
      }
      
      cutoutMap.set(openingId, cutout);
      allCutoutsMap.set(openingId, cutout);
      
      // Create a visible debug version (semi-transparent red)
      const debugGeometry = cutout.geometry.clone();
      const debugMaterial = new THREE.MeshBasicMaterial({
        color: '#ff0000',
        transparent: true,
        opacity: 0.6,
        wireframe: false,
        side: THREE.DoubleSide
      });
      const debugCutout = new THREE.Mesh(debugGeometry, debugMaterial);
      debugCutout.position.copy(cutout.position);
      debugCutout.rotation.copy(cutout.rotation);
      debugCutout.scale.copy(cutout.scale);
      debugCutout.updateMatrix();
      debugCutout.updateMatrixWorld(true);
      debugCutoutBoxes.push(debugCutout);
    }
  });
  
  console.log(`🔍 [CSG] Starting wall mesh processing. Total cutouts available:`, cutoutMap.size);

  // Now process wall meshes
  for (const { polygon, wallId } of miteredPolygons) {
    const wallMesh = generateWallMeshFromPolygon(polygon, wallHeightMm);
    if (!wallMesh) {
      continue;
    }
    wallMesh.userData = {
      ...wallMesh.userData,
      wallId,
      baseColor: DEFAULT_WALL_COLOR,
    };
    wallMesh.name = wallId;

    // Ensure shadows are enabled
    wallMesh.castShadow = true;
    wallMesh.receiveShadow = true;

    // CRITICAL FIX: Only use cutouts that belong to THIS wall!
    const wallCutouts = Array.from(cutoutMap.values()).filter(
      cutout => cutout.userData.wallId === wallId
    );

    console.log(`🔍 [CSG] Processing wall ${wallId}:`, {
      wallId,
      totalCutoutsAvailable: cutoutMap.size,
      cutoutsForThisWall: wallCutouts.length,
      cutoutIds: wallCutouts.map(c => c.userData.openingId)
    });

    if (wallCutouts.length === 0) {
      console.log(`⚠️ [CSG] No cutouts for wall ${wallId}, pushing unmodified wall mesh`);
      meshes.push(wallMesh);
      continue;
    }
    
    try {
      // Create evaluator
      const evaluator = new Evaluator();
      
      // Reset wall mesh transforms to identity for CSG operations
      // We'll apply transforms to the final result
      const wallPosition = wallMesh.position.clone();
      const wallRotation = wallMesh.rotation.clone();
      const wallScale = wallMesh.scale.clone();
      
      // Clone geometry and reset transforms for CSG
      const wallGeometry = wallMesh.geometry.clone();

      // CRITICAL: Ensure wall geometry has all required attributes for CSG
      if (!wallGeometry.attributes.position) {
        throw new Error('Wall geometry missing position attribute');
      }
      if (!wallGeometry.attributes.normal) {
        console.warn(`⚠️ [CSG] Wall geometry missing normals, computing...`);
        wallGeometry.computeVertexNormals();
      }

      console.log(`🔍 [CSG] Wall geometry attributes:`, {
        hasPosition: !!wallGeometry.attributes.position,
        hasNormal: !!wallGeometry.attributes.normal,
        positionCount: wallGeometry.attributes.position.count,
        isIndexed: wallGeometry.index !== null
      });

      const wallMaterial = wallMesh.material instanceof THREE.Material
        ? wallMesh.material.clone()
        : new THREE.MeshStandardMaterial({ color: DEFAULT_WALL_COLOR, side: THREE.DoubleSide });

      // Create wall brush - transforms will be applied via Brush position/rotation/scale
      const wallBrush = new Brush(wallGeometry, wallMaterial);
      wallBrush.position.copy(wallPosition);
      wallBrush.rotation.copy(wallRotation);
      wallBrush.scale.copy(wallScale);
      wallBrush.updateMatrix();
      wallBrush.updateMatrixWorld(true);
      
      let resultBrush = wallBrush;
      let successfulSubtractions = 0;

      console.log(`🔧 [CSG] Starting CSG subtraction for wall ${wallId} with ${wallCutouts.length} cutouts`);

      // Subtract each cutout FOR THIS WALL ONLY
      wallCutouts.forEach((cutoutMesh, cutoutIdx) => {
        try {
          // Create cutout brush with proper transforms
          const cutoutGeometry = cutoutMesh.geometry.clone();

          // CRITICAL: Ensure cutout geometry has all required attributes for CSG
          if (!cutoutGeometry.attributes.position) {
            throw new Error('Cutout geometry missing position attribute');
          }
          if (!cutoutGeometry.attributes.normal) {
            console.warn(`⚠️ [CSG] Cutout geometry missing normals, computing...`);
            cutoutGeometry.computeVertexNormals();
          }

          console.log(`🔍 [CSG] Cutout ${cutoutIdx} geometry attributes:`, {
            openingId: cutoutMesh.userData.openingId,
            hasPosition: !!cutoutGeometry.attributes.position,
            hasNormal: !!cutoutGeometry.attributes.normal,
            positionCount: cutoutGeometry.attributes.position.count,
            isIndexed: cutoutGeometry.index !== null
          });

          const cutoutMaterial = cutoutMesh.material instanceof THREE.Material
            ? cutoutMesh.material.clone()
            : new THREE.MeshBasicMaterial({ color: 'red' });

          const cutoutBrush = new Brush(cutoutGeometry, cutoutMaterial);
          cutoutBrush.position.copy(cutoutMesh.position);
          cutoutBrush.rotation.copy(cutoutMesh.rotation);
          cutoutBrush.scale.copy(cutoutMesh.scale);
          cutoutBrush.updateMatrix();
          cutoutBrush.updateMatrixWorld(true);
          
          // Perform subtraction
          resultBrush = evaluator.evaluate(resultBrush, cutoutBrush, SUBTRACTION);
          successfulSubtractions++;
          console.log(`✅ [CSG] Successfully subtracted cutout ${cutoutIdx} (opening ${cutoutMesh.userData.openingId}) from wall ${wallId}`);
        } catch (cutoutError) {
          console.error(`❌ [CSG] Failed to subtract cutout ${cutoutIdx}:`, cutoutError);
          console.error('[CSG] Cutout details:', {
            position: cutoutMesh.position.toArray(),
            rotation: cutoutMesh.rotation.toArray(),
            scale: cutoutMesh.scale.toArray(),
          });
        }
      });
      
      if (successfulSubtractions === 0) {
        console.warn(`⚠️ [CSG] No successful subtractions for wall ${wallId}, using unmodified wall`);
        meshes.push(wallMesh);
        continue;
      }

      console.log(`✅ [CSG] ${successfulSubtractions} cutouts successfully subtracted from wall ${wallId}`);

      // Prepare final geometry
      resultBrush.prepareGeometry();
      resultBrush.markUpdated();

      // Create final mesh with proper material
      let finalGeometry = resultBrush.geometry;

      // Check if already non-indexed
      if (finalGeometry.index !== null) {
        finalGeometry = finalGeometry.toNonIndexed();
      }

      // Ensure normals are computed for proper rendering
      if (!finalGeometry.attributes.normal) {
        finalGeometry.computeVertexNormals();
      }

      const finalMaterial = new THREE.MeshLambertMaterial({
        color: DEFAULT_WALL_COLOR,
        side: THREE.DoubleSide,
        flatShading: true, // Prevent diagonal triangle lines from showing
      });
      finalMaterial.needsUpdate = true;
      const finalMesh = new THREE.Mesh(finalGeometry, finalMaterial);
      finalMesh.userData = {
        ...finalMesh.userData,
        wallId,
        baseColor: DEFAULT_WALL_COLOR,
      };
      finalMesh.name = wallId;
      
      // Copy transforms from result brush (CSG preserves transforms)
      finalMesh.position.copy(resultBrush.position);
      finalMesh.rotation.copy(resultBrush.rotation);
      finalMesh.scale.copy(resultBrush.scale);
      finalMesh.updateMatrix();
      finalMesh.updateMatrixWorld(true);
      
      // Verify geometry is valid
      if (!finalMesh.geometry || finalMesh.geometry.attributes.position === undefined) {
        meshes.push(wallMesh);
        continue;
      }
      
      // Normals already handled by flat shading - no need to compute
      // (already deleted normal attribute above for flat shading)

      finalMesh.castShadow = true;
      finalMesh.receiveShadow = false;
      meshes.push(finalMesh);
      
    } catch (csgError) {
      console.error(`❌ [CSG] Failed CSG operation for wall ${wallId}:`, csgError);
      console.error('[CSG] Error details:', {
        wallId,
        cutoutCount: wallCutouts.length,
        errorMessage: csgError instanceof Error ? csgError.message : String(csgError),
        errorStack: csgError instanceof Error ? csgError.stack : 'No stack'
      });
      meshes.push(wallMesh);
    }

    // Cleanup cutouts for this wall (but keep debug versions)
    wallCutouts.forEach(cutout => {
      cutout.geometry.dispose();
      if (cutout.material instanceof THREE.Material) {
        cutout.material.dispose();
      }
    });
  }
  
  return {
    wallMeshes: meshes,
    cutoutBoxes: debugCutoutBoxes // Return visible cutout boxes for debugging
  };
}

/**
 * Generate opening models (doors/windows) from OBJ files
 * Positions them based on opening data in the wall graph
 */
export async function generateOpeningModels(
  graph: WallGraph,
  wallHeightMm: number
): Promise<THREE.Group[]> {
  const openingModels: THREE.Group[] = [];
  
  // Define conversion constants
  const METERS_TO_FEET = 3.28084;
  
  console.log('🔍 [3D] generateOpeningModels called:', {
    wallCount: Object.keys(graph.edges).length,
    wallHeightMm,
    totalOpenings: Object.values(graph.edges).reduce((sum, wall) => sum + (wall.openings || []).length, 0)
  });
  
  for (const wall of Object.values(graph.edges)) {
    const startNode = graph.nodes[wall.startNodeId];
    const endNode = graph.nodes[wall.endNodeId];
    
    if (!startNode || !endNode) {
      console.warn(`⚠️ [3D] Skipping wall ${wall.id}: missing start or end node`, {
        hasStartNode: !!startNode,
        hasEndNode: !!endNode,
        startNodeId: wall.startNodeId,
        endNodeId: wall.endNodeId
      });
      continue;
    }
    
    const openings = wall.openings || [];
    
    if (openings.length > 0) {
      console.log(`🔍 [3D] Processing wall ${wall.id} with ${openings.length} opening(s):`, {
        wallId: wall.id,
        openingCount: openings.length,
        openingIds: openings.map(op => op.id),
        openingTypes: openings.map(op => op.type)
      });
    }
    
    for (const opening of openings) {
      console.log(`🔍 [3D] Processing opening ${opening.id}:`, {
        type: opening.type,
        wallId: opening.wallId,
        width: opening.width,
        hasCenter3D: !!opening.center3D,
        hasAngle: opening.angle !== undefined,
        center3D: opening.center3D,
        angle: opening.angle,
        userWidth: opening.userWidth,
        userHeight: opening.userHeight,
        unitSystem: opening.unitSystem
      });
      
      try {
        // Load appropriate OBJ model based on opening type
        const modelPath = opening.type === 'door' ? '/Door.obj' : '/Window.obj';
        console.log(`📦 [3D] Loading OBJ model for ${opening.type}: ${modelPath}`);
        const model = await loadOBJModel(modelPath);
        console.log(`✅ [3D] OBJ model loaded successfully for ${opening.id}`);
        
        // Use stored center3D if available, otherwise calculate
        let finalPosition: [number, number, number];
        let finalAngle: number;
        
        if (opening.center3D && opening.angle !== undefined) {
          // Use stored values
          finalPosition = opening.center3D;
          finalAngle = opening.angle;
        } else {
          // Fallback calculation
          const startPoint = new THREE.Vector2(
            pixelToMeters(startNode.position[0]),
            pixelToMeters(startNode.position[1])
          );
          const endPoint = new THREE.Vector2(
            pixelToMeters(endNode.position[0]),
            pixelToMeters(endNode.position[1])
          );
          
          const wallVector = endPoint.clone().sub(startPoint);
          finalAngle = Math.atan2(wallVector.y, wallVector.x);
          // opening.position is already in METERS (not pixels!)
          const positionAlongWallM = opening.position;
          
          const openingCenter2D = startPoint.clone().add(
            wallVector.normalize().multiplyScalar(positionAlongWallM)
          );
          
          // Use userSillHeight if available, otherwise convert from mm
          let openingSillHeightM: number;
          if (opening.userSillHeight !== undefined && opening.unitSystem) {
            if (opening.unitSystem === 'metric') {
              // Convert cm to meters
              openingSillHeightM = opening.userSillHeight * 0.01;
            } else {
              // Convert inches to meters
              openingSillHeightM = opening.userSillHeight * 0.0254;
            }
          } else {
            // Fallback: convert from millimeters
            openingSillHeightM = mmToMeters(opening.sillHeight);
          }
          
          const openingHeightM = opening.type === 'door' 
            ? mmToMeters(wallHeightMm) - openingSillHeightM
            : 1.5;
          
          finalPosition = [
            openingCenter2D.x,
            openingSillHeightM + openingHeightM / 2,
            openingCenter2D.y
          ];
        }
        
        // Scale model to fit opening dimensions
        // Use user-defined dimensions if available, otherwise fall back to pixel-based calculation
        let openingWidthM: number;
        let targetHeightM: number;
        
        if (opening.userWidth !== undefined && opening.userHeight !== undefined && opening.unitSystem) {
          // Convert user-defined dimensions to meters
          // userWidth/userHeight are in inches (imperial) or cm (metric)
          if (opening.unitSystem === 'metric') {
            // Convert cm to meters
            openingWidthM = opening.userWidth * 0.01;
            targetHeightM = opening.userHeight * 0.01;
          } else {
            // Convert inches to meters
            openingWidthM = opening.userWidth * 0.0254;
            targetHeightM = opening.userHeight * 0.0254;
          }
          
          // For doors: ensure height doesn't exceed wall height
          // For windows: userHeight is the opening height from sill, not from floor
          // So we need to validate that sill + opening doesn't exceed wall height
          if (opening.type === 'door') {
            const wallHeightM = mmToMeters(wallHeightMm);
            targetHeightM = Math.min(targetHeightM, wallHeightM);
          } else {
            // Windows: validate that sillHeight + openingHeight doesn't exceed wall height
            const wallHeightM = mmToMeters(wallHeightMm);
            let openingSillHeightM: number;
            if (opening.userSillHeight !== undefined && opening.unitSystem) {
              if (opening.unitSystem === 'metric') {
                openingSillHeightM = opening.userSillHeight * 0.01;
              } else {
                openingSillHeightM = opening.userSillHeight * 0.0254;
              }
            } else {
              openingSillHeightM = mmToMeters(opening.sillHeight);
            }
            const totalWindowHeight = openingSillHeightM + targetHeightM;
            if (totalWindowHeight > wallHeightM) {
              // Reduce opening height to fit within wall
              targetHeightM = Math.max(0, wallHeightM - openingSillHeightM);
            }
          }
        } else {
          // opening.width is already in METERS (not pixels!)
          openingWidthM = opening.width;
          // Use userSillHeight if available for height calculation
          let fallbackSillHeightM: number;
          if (opening.userSillHeight !== undefined && opening.unitSystem) {
            if (opening.unitSystem === 'metric') {
              fallbackSillHeightM = opening.userSillHeight * 0.01;
            } else {
              fallbackSillHeightM = opening.userSillHeight * 0.0254;
            }
          } else {
            fallbackSillHeightM = mmToMeters(opening.sillHeight);
          }
          targetHeightM = opening.height || (opening.type === 'door' 
            ? mmToMeters(wallHeightMm) - fallbackSillHeightM
            : 1.5);
        }
        
        scaleModelToFit(model, openingWidthM, targetHeightM);
        
        // Get the ACTUAL scaled dimensions after scaling (may differ due to aspect ratio)
        const bbox = getBoundingBox(model);
        const actualModelWidth = bbox.max.x - bbox.min.x;
        const actualModelHeight = bbox.max.y - bbox.min.y;
        
        // For windows: recalculate finalPosition[1] using actual scaled height instead of target height
        // This ensures the model center matches the cutout box center (which also uses actual scaled height)
        if (opening.type === 'window') {
          // Get sill height (already calculated above if using stored center3D, otherwise calculate)
          let openingSillHeightM: number;
          if (opening.userSillHeight !== undefined && opening.unitSystem) {
            if (opening.unitSystem === 'metric') {
              openingSillHeightM = opening.userSillHeight * 0.01;
            } else {
              openingSillHeightM = opening.userSillHeight * 0.0254;
            }
          } else {
            openingSillHeightM = mmToMeters(opening.sillHeight);
          }
          // Recalculate center Y using actual scaled height
          finalPosition[1] = openingSillHeightM + actualModelHeight / 2;
        }
        
        // Debug: Log final model dimensions
        console.log(`🚪 [3D MODEL DEBUG] ${opening.type} model for opening ${opening.id}:`, {
          'Target Width (px)': opening.width,
          'Target Width (m)': openingWidthM.toFixed(3),
          'Target Width (ft)': (openingWidthM * METERS_TO_FEET).toFixed(3),
          'Actual Scaled Width (m)': actualModelWidth.toFixed(3),
          'Actual Scaled Width (ft)': (actualModelWidth * METERS_TO_FEET).toFixed(3),
          'Actual Scaled Width (mm)': (actualModelWidth * 1000).toFixed(1),
          'Actual Scaled Width (px)': (actualModelWidth / PIXELS_TO_METERS).toFixed(2),
          'Target Height (m)': targetHeightM.toFixed(3),
          'Target Height (ft)': (targetHeightM * METERS_TO_FEET).toFixed(3),
          'Actual Scaled Height (m)': actualModelHeight.toFixed(3),
          'Actual Scaled Height (ft)': (actualModelHeight * METERS_TO_FEET).toFixed(3),
          'Actual Scaled Height (mm)': (actualModelHeight * 1000).toFixed(1),
          'Actual Scaled Height (px)': (actualModelHeight / PIXELS_TO_METERS).toFixed(2),
          'User Sill Height': opening.userSillHeight !== undefined && opening.unitSystem 
            ? `${opening.userSillHeight} ${opening.unitSystem === 'imperial' ? 'in' : 'cm'}` 
            : 'N/A',
          'Sill Height (mm)': opening.sillHeight,
          'Sill Height (m)': opening.userSillHeight !== undefined && opening.unitSystem
            ? (opening.unitSystem === 'metric' 
              ? (opening.userSillHeight * 0.01).toFixed(3)
              : (opening.userSillHeight * 0.0254).toFixed(3))
            : mmToMeters(opening.sillHeight).toFixed(3),
          'Sill Height (ft)': opening.userSillHeight !== undefined && opening.unitSystem
            ? ((opening.unitSystem === 'metric' 
              ? opening.userSillHeight * 0.01
              : opening.userSillHeight * 0.0254) * METERS_TO_FEET).toFixed(3)
            : (mmToMeters(opening.sillHeight) * METERS_TO_FEET).toFixed(3),
          'Model Position': finalPosition,
          'Wall Height (mm)': wallHeightMm,
          conversion_note_1: '1px = 0.01m = 1cm',
          conversion_note_2: '1mm = 0.001m'
        });
        
        // Position the model in the center of the cutout opening
        // For doors: position so bottom is at ground (y=0)
        // For windows: position at stored center3D (accounts for sill height)
        let modelY: number;
        if (opening.type === 'door') {
          // Position so bottom of model is at y=0
          modelY = actualModelHeight / 2;
        } else {
          // Windows use the calculated/stored position (includes sill height)
          modelY = finalPosition[1];
        }
        
        // Position the model at the center of the opening cutout
        // The cutout box is positioned at center3D, so the model should match that position
        model.position.set(finalPosition[0], modelY, finalPosition[2]);
        model.rotation.y = -finalAngle; // Rotate to align with wall
        model.updateMatrix();
        model.updateMatrixWorld(true);
        
        // Store actual dimensions and opening ID for cutout box and selection
        model.userData.actualWidth = actualModelWidth;
        model.userData.actualHeight = actualModelHeight;
        model.userData.openingId = opening.id; // Store opening ID for selection
        
        openingModels.push(model);
        console.log(`✅ [3D] Successfully created ${opening.type} model for opening ${opening.id}`, {
          openingId: opening.id,
          modelPosition: model.position.toArray(),
          modelRotation: model.rotation.toArray(),
          actualWidth: model.userData.actualWidth,
          actualHeight: model.userData.actualHeight
        });
      } catch (error) {
        console.error(`❌ [3D] Failed to create ${opening.type} model for opening ${opening.id}:`, error);
        console.error(`❌ [3D] Error details:`, {
          openingId: opening.id,
          openingType: opening.type,
          errorMessage: error instanceof Error ? error.message : String(error),
          errorStack: error instanceof Error ? error.stack : 'No stack trace',
          modelPath: opening.type === 'door' ? '/Door.obj' : '/Window.obj'
        });
        // Still continue to next opening, but now we'll see the error
      }
    }
  }
  
  console.log(`✅ [3D] generateOpeningModels completed:`, {
    totalModelsCreated: openingModels.length,
    modelIds: openingModels.map(m => m.userData?.openingId)
  });
  
  return openingModels;
}