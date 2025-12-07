/**
 * Wall generator component for creating 3D wall meshes and opening cutouts
 * Generates Three.js meshes from wall graph data with proper geometry and materials
 * Handles opening cutout boxes using CSG operations for doors and windows
 */
'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { ThreeEvent, useThree } from '@react-three/fiber';
import { getWallGraphStore } from '@/features/floorplan-2d/store/wallGraphStore';
import { useThreeSceneStore } from '../store/threeSceneStore';
import {
  DEFAULT_WALL_COLOR,
  generateOpeningModels,
  generateWallMeshes,
} from '../utils/geometryConverter';
import { useCADToolsStore } from '../store/cadToolsStore';
import { buildFaceData } from '../utils/pushPull';
import { metersToMillimeters } from '@/lib/units/unitsSystem';

interface WallGeneratorProps {
  projectId: string;
}

const HOVER_EDGE_COLOR = '#FF6600'; // Very bright orange
const SELECTED_EDGE_COLOR = '#FF6600'; // Very bright orange
const COLOR_BUFFER = new THREE.Color();

const WallGenerator = ({ projectId }: WallGeneratorProps) => {
  // Get the project-specific store directly (bypasses context for React Three Fiber)
  // Use useMemo to ensure we get the same store instance
  const useWallGraphStore = React.useMemo(() => getWallGraphStore(projectId), [projectId]);
  const graph = useWallGraphStore((state) => state.graph);
  const wallHeight = useWallGraphStore((state) => state.wallHeight);
  const setMeshes = useThreeSceneStore((state) => state.setMeshes);
  const setOpeningModels = useThreeSceneStore((state) => state.setOpeningModels);
  const clearOpeningModels = useThreeSceneStore((state) => state.clearOpeningModels);
  const clearCutoutBoxes = useThreeSceneStore((state) => state.clearCutoutBoxes);


  // Listen for manual sync via localStorage
  useEffect(() => {
    const key = `sk:graph:${projectId}`;
    const onStorage = (e: StorageEvent) => {
      if (e.key !== key || !e.newValue) {
        return;
      }
      try {
        const payload = JSON.parse(e.newValue);
        if (payload?.graph) {
          useWallGraphStore.setState({ graph: payload.graph, wallHeight: payload.wallHeight || useWallGraphStore.getState().wallHeight });
          // Only clear meshes and cutout boxes - preserve opening models until regeneration
          const sceneStore = useThreeSceneStore.getState();
          sceneStore.clearMeshes();
          sceneStore.clearCutoutBoxes();
        }
      } catch (err) {
        // Silent error handling
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [projectId, useWallGraphStore]);

  useEffect(() => {
    const generateAllGeometry = async () => {
      // Get the latest state directly from store to ensure we have the most current data
      const latestState = useWallGraphStore.getState();
      const latestGraph = latestState.graph;
      const latestWallCount = Object.keys(latestGraph.edges).length;
      const latestNodeCount = Object.keys(latestGraph.nodes).length;

      // Get current meshes for cleanup
      const currentMeshes = useThreeSceneStore.getState().meshes;
      const currentOpeningModels = useThreeSceneStore.getState().openingModels;
      const newMeshes: THREE.Mesh[] = [];

      // Use the latest graph from getState() instead of the hook value
      if (latestWallCount === 0) {
        // Cleanup old meshes even if empty
        currentMeshes.forEach(mesh => {
          mesh.geometry.dispose();
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach(m => m.dispose());
          } else {
            mesh.material.dispose();
          }
        });
        // Cleanup opening models
        currentOpeningModels.forEach(model => {
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
        });
        setMeshes([]);
        clearOpeningModels();
        return;
      }
      
      try {
        // Generate wall meshes (cutout boxes are generated internally but not rendered)
        // Use latestGraph to ensure we have the most current data
        // Convert wallHeight from meters to millimeters for 3D generation (functions expect mm)
        const wallHeightMm = metersToMillimeters(latestState.wallHeight);
        const { wallMeshes } = await generateWallMeshes(latestGraph, wallHeightMm);
        
        newMeshes.push(...wallMeshes);
        
        // Clear cutout boxes (no longer rendering them)
        clearCutoutBoxes();
        
        // Count total openings in graph for logging
        const totalOpenings = Object.values(latestGraph.edges).reduce((sum, wall) => {
          return sum + (wall.openings || []).length;
        }, 0);
        
        const openingsByWall = Object.values(latestGraph.edges).map(wall => ({
          wallId: wall.id,
          openingCount: (wall.openings || []).length,
          openingTypes: (wall.openings || []).map(op => op.type),
          openingIds: (wall.openings || []).map(op => op.id)
        }));
        
        console.log('🔍 [3D] Starting opening model generation:', {
          wallCount: latestWallCount,
          totalOpenings,
          openingsByWall,
          wallHeight: latestState.wallHeight
        });
        
        // Generate opening models from OBJ files
        // Reuse wallHeightMm already converted above
        const openingModelsPromise = generateOpeningModels(latestGraph, wallHeightMm);
        
        // Cleanup old meshes
        currentMeshes.forEach(mesh => {
          mesh.geometry.dispose();
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach(m => m.dispose());
          } else {
            mesh.material.dispose();
          }
        });

        // Cleanup old opening models
        const currentModels = useThreeSceneStore.getState().openingModels;
        currentModels.forEach(model => {
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
        });

        // Cleanup old cutout boxes
        const currentCutoutBoxes = useThreeSceneStore.getState().cutoutBoxes;
        currentCutoutBoxes.forEach(box => {
          box.geometry.dispose();
          if (Array.isArray(box.material)) {
            box.material.forEach(m => m.dispose());
          } else {
            box.material.dispose();
          }
        });

        setMeshes(newMeshes);

        // Load opening models asynchronously
        openingModelsPromise
          .then((openingModels) => {
            console.log('✅ [3D] Opening models generated successfully:', {
              count: openingModels.length,
              modelIds: openingModels.map(m => m.userData?.openingId),
              modelTypes: openingModels.map(m => {
                const openingId = m.userData?.openingId;
                // Find the opening type from the graph
                for (const wall of Object.values(latestGraph.edges)) {
                  const opening = (wall.openings || []).find(op => op.id === openingId);
                  if (opening) {
                    return opening.type;
                  }
                }
                return 'unknown';
              })
            });
            setOpeningModels(openingModels);
          })
          .catch((error) => {
            console.error('❌ [3D] Failed to generate opening models:', error);
            console.error('❌ [3D] Error stack:', error instanceof Error ? error.stack : 'No stack trace');
            // Still clear old models on error
            clearOpeningModels();
          });
      } catch (error) {
        // Silent error handling
      }
    };

    generateAllGeometry();

  }, [graph, wallHeight, setMeshes, setOpeningModels, clearOpeningModels, clearCutoutBoxes, useWallGraphStore, projectId]);

  return null; // This component does not render anything itself
};


// Keep wall material at default color - we'll use edge lines for selection/hover
// Skip meshes with custom PBR materials (those with texture maps)
const resetMeshColor = (mesh: THREE.Mesh) => {
  const baseColor = typeof mesh.userData?.baseColor === 'string' ? mesh.userData.baseColor : DEFAULT_WALL_COLOR;
  const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
  materials.forEach((material) => {
    // Skip materials that have custom textures (user-applied materials)
    const standardMaterial = material as THREE.MeshStandardMaterial;
    if (standardMaterial.map || standardMaterial.normalMap || standardMaterial.roughnessMap || standardMaterial.aoMap) {
      console.log('[resetMeshColor] Skipping material with textures:', material);
      return;
    }

    if (
      material instanceof THREE.MeshStandardMaterial ||
      material instanceof THREE.MeshPhysicalMaterial ||
      material instanceof THREE.MeshLambertMaterial ||
      material instanceof THREE.MeshPhongMaterial ||
      material instanceof THREE.MeshBasicMaterial
    ) {
      COLOR_BUFFER.set(baseColor);
      if (!material.color.equals(COLOR_BUFFER)) {
        material.color.copy(COLOR_BUFFER);
      }
      if ('flatShading' in material && material.flatShading !== true) {
        material.flatShading = true;
        material.needsUpdate = true;
      }
      if ('emissive' in material && typeof material.emissive !== 'undefined') {
        material.emissive.setHex(0x000000);
        if ('emissiveIntensity' in material) {
          material.emissiveIntensity = 0;
        }
      }
    }
  });
};

interface RenderWallsProps {
  projectId: string;
}

const RenderWalls = ({ projectId }: RenderWallsProps) => {
  const { camera, controls, gl } = useThree((state) => ({
    camera: state.camera,
    controls: state.controls as THREE.EventDispatcher & { enabled?: boolean } | undefined,
    gl: state.gl,
  }));
  const meshes = useThreeSceneStore((state) => state.meshes);
  const useWallGraphStore = React.useMemo(() => getWallGraphStore(projectId), [projectId]);
  const selectedWallIds = useWallGraphStore((state) => state.selectedWallIds);
  const hoveredWallId = useWallGraphStore((state) => state.hoveredWallId);
  const selectWall = useWallGraphStore((state) => state.selectWall);
  const addToSelection = useWallGraphStore((state) => state.addToSelection);
  const removeFromSelection = useWallGraphStore((state) => state.removeFromSelection);
  const setHoveredWallId = useWallGraphStore((state) => state.setHoveredWallId);
  // Face selection (always active)
  const selectedFaces = useWallGraphStore((state) => state.selectedFaces);
  const hoveredFace = useWallGraphStore((state) => state.hoveredFace);
  const selectFace = useWallGraphStore((state) => state.selectFace);
  const addFaceToSelection = useWallGraphStore((state) => state.addFaceToSelection);
  const removeFaceFromSelection = useWallGraphStore((state) => state.removeFaceFromSelection);
  const setHoveredFace = useWallGraphStore((state) => state.setHoveredFace);
  const activeTool = useCADToolsStore((state) => state.activeTool);
  const setPushPullFace = useCADToolsStore((state) => state.setPushPullFace);
  const startPushPull = useCADToolsStore((state) => state.startPushPull);
  const pushPullState = useCADToolsStore((state) => state.pushPullState);
  const updatePushPullDistance = useCADToolsStore((state) => state.updatePushPullDistance);
  const applyPushPull = useCADToolsStore((state) => state.applyPushPull);
  const cancelPushPull = useCADToolsStore((state) => state.cancelPushPull);
  const dragInfoRef = useRef<{
    face: ReturnType<typeof buildFaceData>;
    startPointLocal: THREE.Vector3;
    plane: THREE.Plane;
  } | null>(null);
  const isFinalizingRef = useRef(false);
  const raycasterRef = useRef<THREE.Raycaster>(new THREE.Raycaster());
  const rafIdRef = useRef<number | null>(null);
  const pendingDistanceRef = useRef<number | null>(null);

  const setOrbitControlsEnabled = React.useCallback(
    (enabled: boolean) => {
      if (controls && 'enabled' in controls) {
        (controls as { enabled: boolean }).enabled = enabled;
      }
    },
    [controls]
  );

  const finalizePushPull = React.useCallback(async () => {
    if (pushPullState.isApplying) {
      return;
    }

    isFinalizingRef.current = true;
    try {
      await applyPushPull();
    } catch (error) {
      console.error('RenderWalls.finalizePushPull:', error);
    } finally {
      dragInfoRef.current = null;
      isFinalizingRef.current = false;
      setOrbitControlsEnabled(true);
    }
  }, [applyPushPull, pushPullState.isApplying, setOrbitControlsEnabled]);

  // Keep wall colors at default - edge lines will show selection/hover
  useEffect(() => {
    meshes.forEach((mesh) => {
      resetMeshColor(mesh);
      // Ensure mesh matrix is updated for edge rendering
      mesh.updateMatrix();
      mesh.updateMatrixWorld(true);
    });
  }, [meshes, selectedWallIds, hoveredWallId]);

  const handleWallClick = React.useCallback(
    (event: ThreeEvent<MouseEvent>, wallId: string) => {
      if (activeTool === 'push-pull') {
        return;
      }
      if (event.nativeEvent.button !== 0) {
        return;
      }
      event.stopPropagation();

      const isMultiSelect = event.nativeEvent.shiftKey || event.nativeEvent.metaKey || event.nativeEvent.ctrlKey;

      // Default: Face selection (single click selects individual faces)
      const faceIndex = event.faceIndex;
      if (faceIndex != null && event.object instanceof THREE.Mesh) {
        // Build face data to get all triangles that make up this face
        const faceData = buildFaceData(event.object, faceIndex, event.point);
        // Use the first triangle index as the representative faceIndex for this face
        const representativeFaceIndex = faceData.triangleIndices[0] ?? faceIndex;

        const faceSelection = { wallId, faceIndex: representativeFaceIndex };

        if (isMultiSelect) {
          // Check if this face is already selected
          const isSelected = selectedFaces.some(
            f => f.wallId === wallId && f.faceIndex === representativeFaceIndex
          );
          if (isSelected) {
            removeFaceFromSelection(faceSelection);
          } else {
            addFaceToSelection(faceSelection);
          }
        } else {
          selectFace(faceSelection);
        }
      }
    },
    [
      activeTool,
      selectedFaces,
      selectFace,
      addFaceToSelection,
      removeFaceFromSelection,
    ]
  );

  // Double-click handler for selecting entire walls
  const handleWallDoubleClick = React.useCallback(
    (event: ThreeEvent<MouseEvent>, wallId: string) => {
      if (activeTool === 'push-pull') {
        return;
      }
      if (event.nativeEvent.button !== 0) {
        return;
      }
      event.stopPropagation();

      const isMultiSelect = event.nativeEvent.shiftKey || event.nativeEvent.metaKey || event.nativeEvent.ctrlKey;

      // Double-click selects entire wall
      if (isMultiSelect) {
        if (selectedWallIds.includes(wallId)) {
          removeFromSelection(wallId);
        } else {
          addToSelection(wallId);
        }
      } else {
        selectWall(wallId);
      }
    },
    [
      activeTool,
      selectedWallIds,
      addToSelection,
      removeFromSelection,
      selectWall,
    ]
  );

  const handlePointerOver = React.useCallback(
    (event: ThreeEvent<PointerEvent>, wallId: string) => {
      event.stopPropagation();

      // Always highlight individual faces on hover
      const faceIndex = event.faceIndex;
      if (faceIndex != null && event.object instanceof THREE.Mesh) {
        const faceData = buildFaceData(event.object, faceIndex, event.point);
        const representativeFaceIndex = faceData.triangleIndices[0] ?? faceIndex;
        setHoveredFace({ wallId, faceIndex: representativeFaceIndex });

        if (activeTool === 'push-pull' && !dragInfoRef.current && !pushPullState.active) {
          setPushPullFace(faceData);
        }
      }
    },
    [activeTool, pushPullState.active, setHoveredFace, setPushPullFace]
  );

  const handlePointerOut = React.useCallback(
    (event: ThreeEvent<PointerEvent>, wallId: string) => {
      event.stopPropagation();

      // Always clear hovered face
      const currentHoveredFace = useWallGraphStore.getState().hoveredFace;
      if (currentHoveredFace && currentHoveredFace.wallId === wallId) {
        setHoveredFace(null);
      }
    },
    [setHoveredFace, useWallGraphStore]
  );

  const handlePushPullPointerDown = React.useCallback(
    (event: ThreeEvent<PointerEvent>) => {
      if (event.button !== 0 || pushPullState.isApplying || pushPullState.active) {
        return;
      }

      if (activeTool !== 'push-pull') {
        return;
      }

      event.stopPropagation();
      event.nativeEvent.stopPropagation();

      const faceIndex = event.faceIndex;
      if (faceIndex == null) {
        return;
      }

      const mesh = event.object;
      if (!(mesh instanceof THREE.Mesh)) {
        return;
      }

      const faceData = buildFaceData(mesh, faceIndex, event.point);
      const startPointWorld = faceData.hitPoint ? faceData.hitPoint.clone() : faceData.worldCenter.clone();
      const startPointLocal = startPointWorld.clone();
      faceData.mesh.worldToLocal(startPointLocal);

      const planeNormal = faceData.worldNormal.clone().normalize();
      const plane = new THREE.Plane().setFromNormalAndCoplanarPoint(planeNormal, startPointWorld);

      dragInfoRef.current = {
        face: faceData,
        startPointLocal,
        plane,
      };

      setOrbitControlsEnabled(false);

      const didStart = startPushPull(faceData);
      if (!didStart) {
        dragInfoRef.current = null;
        setOrbitControlsEnabled(true);
        return;
      }
    },
    [activeTool, pushPullState.active, pushPullState.isApplying, setOrbitControlsEnabled, startPushPull]
  );

  const handlePushPullPointerMove = React.useCallback(
    (event: ThreeEvent<PointerEvent>) => {
      if (activeTool !== 'push-pull' || pushPullState.isApplying) {
        return;
      }

      if (dragInfoRef.current || pushPullState.active) {
        return;
      }

      const faceIndex = event.faceIndex;
      if (faceIndex == null) {
        return;
      }

      const mesh = event.object;
      if (mesh instanceof THREE.Mesh) {
        event.stopPropagation();
        const faceData = buildFaceData(mesh, faceIndex, event.point);
        setPushPullFace(faceData);
      }
    },
    [activeTool, pushPullState.active, pushPullState.isApplying, setPushPullFace]
  );

  const handlePushPullPointerUp = React.useCallback(
    (event: ThreeEvent<PointerEvent>) => {
      if (activeTool !== 'push-pull') {
        return;
      }

      if (
        pushPullState.active &&
        !pushPullState.isApplying &&
        dragInfoRef.current
      ) {
        event.stopPropagation();
        void finalizePushPull();
      }
    },
    [activeTool, finalizePushPull, pushPullState.active, pushPullState.isApplying]
  );

  React.useEffect(() => {
    if (activeTool !== 'push-pull') {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
      pendingDistanceRef.current = null;

      cancelPushPull();
      setPushPullFace(null);
      dragInfoRef.current = null;
      setOrbitControlsEnabled(true);
    }
  }, [activeTool, cancelPushPull, setPushPullFace, setOrbitControlsEnabled]);

  React.useEffect(() => {
    if (!pushPullState.active) {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
      pendingDistanceRef.current = null;
      return;
    }

    const handleWindowPointerMove = (event: PointerEvent) => {
      const dragInfo = dragInfoRef.current;
      if (!dragInfo || !pushPullState.active) {
        return;
      }

      try {
        event.preventDefault();
        event.stopPropagation();
      } catch {
        // ignore
      }

      const rect = gl.domElement.getBoundingClientRect();
      const mouse = new THREE.Vector2(
        ((event.clientX - rect.left) / rect.width) * 2 - 1,
        -((event.clientY - rect.top) / rect.height) * 2 + 1
      );

      const raycaster = raycasterRef.current;
      raycaster.setFromCamera(mouse, camera);
      const intersectionPoint = new THREE.Vector3();
      const didIntersect = raycaster.ray.intersectPlane(dragInfo.plane, intersectionPoint);

      if (didIntersect && intersectionPoint) {
        const currentPointLocal = intersectionPoint.clone();
        dragInfo.face.mesh.worldToLocal(currentPointLocal);

        const delta = currentPointLocal.sub(dragInfo.startPointLocal);
        const distance = delta.dot(dragInfo.face.normal);

        pendingDistanceRef.current = distance;

        if (rafIdRef.current === null) {
          rafIdRef.current = requestAnimationFrame(() => {
            const currentState = useCADToolsStore.getState().pushPullState;
            if (
              pendingDistanceRef.current !== null &&
              currentState.active
            ) {
              try {
                updatePushPullDistance(pendingDistanceRef.current);
              } catch (error) {
                console.error('[push-pull] Error in RAF update (walls):', error);
              }
              pendingDistanceRef.current = null;
            }
            rafIdRef.current = null;
          });
        }
      }
    };

    window.addEventListener('pointermove', handleWindowPointerMove, { passive: false });

    return () => {
      window.removeEventListener('pointermove', handleWindowPointerMove);
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
      pendingDistanceRef.current = null;
    };
  }, [camera, gl, pushPullState.active, updatePushPullDistance]);

  React.useEffect(() => {
    if (!pushPullState.active) {
      return;
    }

    const handleWindowPointerUp = (event: PointerEvent) => {
      try {
        event.preventDefault();
        event.stopPropagation();
      } catch {
        // ignore
      }

      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }

      if (pendingDistanceRef.current !== null) {
        try {
          updatePushPullDistance(pendingDistanceRef.current);
        } catch (error) {
          console.error('[push-pull] Error applying final distance (walls):', error);
        }
        pendingDistanceRef.current = null;
      }

      if (!pushPullState.isApplying) {
        void finalizePushPull();
      }
    };

    window.addEventListener('pointerup', handleWindowPointerUp, { passive: false });
    return () => {
      window.removeEventListener('pointerup', handleWindowPointerUp);
    };
  }, [finalizePushPull, pushPullState.active, pushPullState.isApplying, updatePushPullDistance]);

  // Helper function to create geometry for specific face triangles
  const createFaceGeometry = React.useCallback((mesh: THREE.Mesh, faceIndex: number): THREE.BufferGeometry | null => {
    try {
      const faceData = buildFaceData(mesh, faceIndex);
      const positionAttr = mesh.geometry.getAttribute('position') as THREE.BufferAttribute;

      if (!positionAttr || faceData.triangleIndices.length === 0) {
        return null;
      }

      // Create new geometry with only the triangles from this face
      const positions: number[] = [];

      faceData.triangleIndices.forEach((triIndex) => {
        const i0 = triIndex * 3;
        const i1 = triIndex * 3 + 1;
        const i2 = triIndex * 3 + 2;

        // Get vertex positions for this triangle
        for (const vertIndex of [i0, i1, i2]) {
          positions.push(
            positionAttr.getX(vertIndex),
            positionAttr.getY(vertIndex),
            positionAttr.getZ(vertIndex)
          );
        }
      });

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));

      return geometry;
    } catch (error) {
      console.error('Error creating face geometry:', error);
      return null;
    }
  }, []);

  return (
    <group>
      {meshes.map((mesh) => {
        const wallId = typeof mesh.userData?.wallId === 'string' ? mesh.userData.wallId : undefined;
        const key = wallId ? `wall-${wallId}` : `mesh-${mesh.uuid}`;

        // Wall-level selection/hover (only on double-click)
        const isWallSelected = wallId ? selectedWallIds.includes(wallId) : false;
        const isWallHovered = wallId === hoveredWallId;
        const showWallEdges = isWallSelected;

        // Face-level selection/hover (default behavior)
        const selectedFacesForThisWall = wallId
          ? selectedFaces.filter(f => f.wallId === wallId)
          : [];
        const hoveredFaceForThisWall = wallId && hoveredFace?.wallId === wallId
          ? hoveredFace
          : null;

        return (
          <group key={key}>
            <primitive
              object={mesh}
              onPointerDown={(event: ThreeEvent<PointerEvent>) => {
                if (activeTool === 'push-pull') {
                  handlePushPullPointerDown(event);
                }
              }}
              onPointerMove={(event: ThreeEvent<PointerEvent>) => {
                if (activeTool === 'push-pull') {
                  handlePushPullPointerMove(event);
                }
              }}
              onPointerUp={(event: ThreeEvent<PointerEvent>) => {
                if (activeTool === 'push-pull') {
                  handlePushPullPointerUp(event);
                }
              }}
              onClick={wallId ? (event: ThreeEvent<MouseEvent>) => handleWallClick(event, wallId) : undefined}
              onDoubleClick={wallId ? (event: ThreeEvent<MouseEvent>) => handleWallDoubleClick(event, wallId) : undefined}
              onPointerOver={wallId ? (event: ThreeEvent<PointerEvent>) => handlePointerOver(event, wallId) : undefined}
              onPointerOut={wallId ? (event: ThreeEvent<PointerEvent>) => handlePointerOut(event, wallId) : undefined}
            />

            {/* Wall-level edge highlighting */}
            {showWallEdges && mesh.geometry && (
              <lineSegments
                key={`edges-${mesh.uuid}-${isWallSelected}-${isWallHovered}`}
                geometry={new THREE.EdgesGeometry(mesh.geometry, 15)}
                matrix={mesh.matrix}
                matrixAutoUpdate={false}
                renderOrder={1000}
              >
                <lineBasicMaterial
                  color={SELECTED_EDGE_COLOR}
                  linewidth={1}
                  depthTest={false}
                  depthWrite={false}
                />
              </lineSegments>
            )}

            {/* Face-level highlighting for selected faces */}
            {selectedFacesForThisWall.map((faceSelection) => {
              const faceGeometry = createFaceGeometry(mesh, faceSelection.faceIndex);
              if (!faceGeometry) {
                return null;
              }

              return (
                <group key={`face-${wallId}-${faceSelection.faceIndex}`}>
                  {/* Face edges */}
                  <lineSegments
                    geometry={new THREE.EdgesGeometry(faceGeometry, 1)}
                    position={mesh.position}
                    rotation={mesh.rotation}
                    scale={mesh.scale}
                    renderOrder={1001}
                  >
                    <lineBasicMaterial
                      color={SELECTED_EDGE_COLOR}
                      linewidth={2}
                      depthTest={false}
                      depthWrite={false}
                    />
                  </lineSegments>
                  {/* Face highlight overlay */}
                  <mesh
                    geometry={faceGeometry}
                    position={mesh.position}
                    rotation={mesh.rotation}
                    scale={mesh.scale}
                    renderOrder={999}
                  >
                    <meshBasicMaterial
                      color={SELECTED_EDGE_COLOR}
                      transparent
                      opacity={0.2}
                      side={THREE.DoubleSide}
                      depthTest={false}
                      depthWrite={false}
                    />
                  </mesh>
                </group>
              );
            })}

            {/* Face-level highlighting for hovered face */}
            {hoveredFaceForThisWall && (() => {
              const faceGeometry = createFaceGeometry(mesh, hoveredFaceForThisWall.faceIndex);
              if (!faceGeometry) {
                return null;
              }

              // Don't show hover if this face is already selected
              const isAlreadySelected = selectedFacesForThisWall.some(
                f => f.faceIndex === hoveredFaceForThisWall.faceIndex
              );
              if (isAlreadySelected) {
                return null;
              }

              return (
                <group key={`hover-face-${wallId}-${hoveredFaceForThisWall.faceIndex}`}>
                  {/* Hover edges */}
                  <lineSegments
                    geometry={new THREE.EdgesGeometry(faceGeometry, 1)}
                    position={mesh.position}
                    rotation={mesh.rotation}
                    scale={mesh.scale}
                    renderOrder={1001}
                  >
                    <lineBasicMaterial
                      color={HOVER_EDGE_COLOR}
                      linewidth={1}
                      depthTest={false}
                      depthWrite={false}
                    />
                  </lineSegments>
                  {/* Hover overlay */}
                  <mesh
                    geometry={faceGeometry}
                    position={mesh.position}
                    rotation={mesh.rotation}
                    scale={mesh.scale}
                    renderOrder={999}
                  >
                    <meshBasicMaterial
                      color={HOVER_EDGE_COLOR}
                      transparent
                      opacity={0.1}
                      side={THREE.DoubleSide}
                      depthTest={false}
                      depthWrite={false}
                    />
                  </mesh>
                </group>
              );
            })()}
          </group>
        );
      })}
    </group>
  );
};

interface RenderOpeningsProps {
  projectId: string;
}

const RenderOpenings = ({ projectId }: RenderOpeningsProps) => {
  const openingModels = useThreeSceneStore((state) => state.openingModels);
  const useWallGraphStore = React.useMemo(() => getWallGraphStore(projectId), [projectId]);
  const selectOpening = useWallGraphStore((state) => state.selectOpening);
  const addOpeningToSelection = useWallGraphStore((state) => state.addOpeningToSelection);
  const removeOpeningFromSelection = useWallGraphStore((state) => state.removeOpeningFromSelection);
  const selectedOpeningIds = useWallGraphStore((state) => state.selectedOpeningIds);

  // Log when opening models change
  React.useEffect(() => {
    console.log('🎨 [3D] RenderOpenings: opening models updated', {
      count: openingModels.length,
      modelIds: openingModels.map(m => m.userData?.openingId),
      models: openingModels.map(m => ({
        id: m.userData?.openingId,
        position: m.position.toArray(),
        rotation: m.rotation.toArray(),
        visible: m.visible
      }))
    });
  }, [openingModels]);

  const handleOpeningClick = React.useCallback(
    (event: ThreeEvent<MouseEvent>, openingId: string) => {
      if (event.nativeEvent.button !== 0) {
        return;
      }
      event.stopPropagation();

      const isMultiSelect = event.nativeEvent.shiftKey || event.nativeEvent.metaKey || event.nativeEvent.ctrlKey;
      if (isMultiSelect) {
        if (selectedOpeningIds.includes(openingId)) {
          removeOpeningFromSelection(openingId);
        } else {
          addOpeningToSelection(openingId);
        }
        return;
      }

      selectOpening(openingId);
    },
    [addOpeningToSelection, removeOpeningFromSelection, selectOpening, selectedOpeningIds]
  );

  // Log detailed model info when models change (outside of map to avoid hook violations)
  React.useEffect(() => {
    openingModels.forEach((model) => {
      const openingId = typeof model.userData?.openingId === 'string' ? model.userData.openingId : undefined;
      
      console.log(`🎨 [3D] Rendering opening model ${openingId}:`, {
        openingId,
        modelType: model.constructor.name,
        position: model.position.toArray(),
        rotation: model.rotation.toArray(),
        scale: model.scale.toArray(),
        visible: model.visible,
        childrenCount: model.children.length,
        userData: model.userData,
        // Check if model has meshes
        hasMeshes: model.children.some(child => child instanceof THREE.Mesh),
        meshCount: model.children.filter(child => child instanceof THREE.Mesh).length
      });
      
      // Log each child mesh
      model.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          console.log(`  📦 Child mesh:`, {
            name: child.name,
            position: child.position.toArray(),
            visible: child.visible,
            material: child.material ? (Array.isArray(child.material) ? `${child.material.length} materials` : child.material.type) : 'no material',
            geometry: child.geometry ? `${child.geometry.constructor.name} (${child.geometry.attributes.position?.count || 0} vertices)` : 'no geometry'
          });
        }
      });
    });
  }, [openingModels]);

  return (
    <group>
      {openingModels.map((model, index) => {
        const openingId = typeof model.userData?.openingId === 'string' ? model.userData.openingId : undefined;
        
        return (
          <primitive 
            key={`opening-${index}-${model.uuid}`} 
            object={model}
            onClick={openingId ? (event: ThreeEvent<MouseEvent>) => handleOpeningClick(event, openingId) : undefined}
          />
        );
      })}
    </group>
  );
};

export { WallGenerator, RenderWalls, RenderOpenings };
