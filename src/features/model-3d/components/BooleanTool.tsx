/**
 * Boolean Tool Component
 * Direct-manipulation boolean operations - click on regions to execute operations
 */

'use client';

import React from 'react';
import * as THREE from 'three';
import { useThree } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { useCADToolsStore } from '../store/cadToolsStore';
import { BooleanPreview } from './BooleanPreview';
import {
  computeAllRegions,
  detectClickedRegion,
  type RegionData,
} from '../utils/booleanRegionDetection';
import { performBoolean } from '../utils/booleanOperations';
import { disposeMeshResources } from '../store/utils/meshUtils';
import { isPointInMesh2D } from '../utils/polygon2D';

export const BooleanTool = () => {
  const activeTool = useCADToolsStore((state) => state.activeTool);
  const selectedObjectIds = useCADToolsStore((state) => state.selectedObjectIds);
  const objects = useCADToolsStore((state) => state.objects);
  const setActiveTool = useCADToolsStore((state) => state.setActiveTool);
  const addObject = useCADToolsStore((state) => state.addObject);
  const removeObject = useCADToolsStore((state) => state.removeObject);
  const clearSelection = useCADToolsStore((state) => state.clearSelection);
  const applyBoolean = useCADToolsStore((state) => state.applyBoolean);

  const { camera, gl, raycaster } = useThree();

  const [regions, setRegions] = React.useState<RegionData[]>([]);
  const [hoveredRegion, setHoveredRegion] = React.useState<string | null>(null);
  const [selectedRegions, setSelectedRegions] = React.useState<Set<string>>(new Set());
  const [isComputing, setIsComputing] = React.useState(false);
  const mouseRef = React.useRef(new THREE.Vector2());
  const previewMeshesRef = React.useRef<Map<string, THREE.Mesh>>(new Map());

  // Get selected meshes
  const selectedMeshes = React.useMemo(() => {
    return selectedObjectIds
      .map((id) => objects.find((obj) => obj.id === id)?.mesh)
      .filter((mesh): mesh is THREE.Mesh => !!mesh);
  }, [selectedObjectIds, objects]);

  // Disable raycasting and hide selected meshes when in boolean mode
  // This allows clicking through to the preview meshes and avoids visual confusion
  React.useEffect(() => {
    if (activeTool === 'boolean' && selectedMeshes.length >= 2) {
      selectedMeshes.forEach(mesh => {
        mesh.raycast = () => {}; // Disable raycasting
        mesh.visible = false; // Hide the original meshes
      });
    }

    return () => {
      // Re-enable raycasting and show meshes when leaving boolean mode
      if (selectedMeshes.length > 0) {
        selectedMeshes.forEach(mesh => {
          delete (mesh as any).raycast; // Remove override, use default
          mesh.visible = true; // Show the meshes again
        });
      }
    };
  }, [activeTool, selectedMeshes]);

  // Compute regions when selection changes
  React.useEffect(() => {
    if (activeTool !== 'boolean' || selectedMeshes.length < 2) {
      setRegions((prevRegions) => {
        // Dispose of previous region meshes
        prevRegions.forEach((region) => {
          if (region.mesh) {
            disposeMeshResources(region.mesh);
          }
        });
        return [];
      });
      setHoveredRegion(null);
      setSelectedRegions(new Set());
      previewMeshesRef.current.clear();
      return;
    }

    setIsComputing(true);
    setSelectedRegions(new Set());
    previewMeshesRef.current.clear(); // Clear preview meshes before recomputing

    // Use setTimeout to avoid blocking the UI
    const timeoutId = setTimeout(() => {
      try {
        const computedRegions = computeAllRegions(selectedMeshes);
        setRegions((prevRegions) => {
          // Dispose of previous region meshes
          prevRegions.forEach((region) => {
            if (region.mesh) {
              disposeMeshResources(region.mesh);
            }
          });
          return computedRegions;
        });
      } catch (error) {
        console.error('[BooleanTool] Failed to compute regions:', error);
        setRegions((prevRegions) => {
          // Dispose even on error
          prevRegions.forEach((region) => {
            if (region.mesh) {
              disposeMeshResources(region.mesh);
            }
          });
          return [];
        });
      } finally {
        setIsComputing(false);
      }
    }, 0);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [activeTool, selectedMeshes]);

  const getMouseFromEvent = React.useCallback(
    (event: MouseEvent | PointerEvent) => {
      const rect = gl.domElement.getBoundingClientRect();
      const mouse = mouseRef.current;
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      return mouse;
    },
    [gl]
  );

  const handlePointerMove = React.useCallback(
    (event: PointerEvent) => {
      if (activeTool !== 'boolean' || selectedMeshes.length < 2 || isComputing) {
        return;
      }

      const mouse = getMouseFromEvent(event);
      raycaster.setFromCamera(mouse, camera);

      // Find intersection with preview meshes first (most reliable)
      let foundRegion: string | null = null;
      let minDistance = Infinity;

      // Check preview meshes from ref - find closest hit
      for (const [regionType, mesh] of previewMeshesRef.current.entries()) {
        if (mesh) {
          const intersections = raycaster.intersectObject(mesh, false);
          const firstIntersection = intersections[0];
          if (firstIntersection && firstIntersection.distance < minDistance) {
            foundRegion = regionType;
            minDistance = firstIntersection.distance;
          }
        }
      }

      setHoveredRegion(foundRegion);
    },
    [activeTool, selectedMeshes, regions, camera, raycaster, getMouseFromEvent, isComputing]
  );

  const executeBooleanOperation = React.useCallback(
    async (regionTypes: string[]) => {
      if (selectedMeshes.length < 2 || isComputing || regionTypes.length === 0) {
        return;
      }

      setIsComputing(true);

      try {
        const [baseMesh, toolMesh] = selectedMeshes;
        const baseObject = objects.find((obj) => obj.mesh === baseMesh);
        const toolObject = objects.find((obj) => obj.mesh === toolMesh);

        if (!baseObject || !toolObject) {
          console.error('[BooleanTool] Selected objects not found');
          return;
        }

        // Get the meshes for selected regions
        const selectedRegionMeshes: THREE.Mesh[] = [];

        for (const regionType of regionTypes) {
          let regionMesh: THREE.Mesh | null = null;

          switch (regionType) {
            case 'intersection':
              if (baseMesh && toolMesh) {
                regionMesh = performBoolean(baseMesh, toolMesh, 'intersect');
              }
              break;
            case 'union':
              if (baseMesh && toolMesh) {
                regionMesh = performBoolean(baseMesh, toolMesh, 'union');
              }
              break;
            case 'outer-shell':
              if (baseMesh && toolMesh) {
                regionMesh = performBoolean(baseMesh, toolMesh, 'subtract');
              }
              break;
            case 'base':
              if (baseMesh && toolMesh) {
                regionMesh = performBoolean(baseMesh, toolMesh, 'subtract');
              }
              break;
            case 'tool':
              if (baseMesh && toolMesh) {
                regionMesh = performBoolean(toolMesh, baseMesh, 'subtract');
              }
              break;
            default:
              console.error('[BooleanTool] Unknown region type:', regionType);
              continue;
          }

          if (regionMesh) {
            selectedRegionMeshes.push(regionMesh);
          }
        }

        if (selectedRegionMeshes.length === 0) {
          console.error('[BooleanTool] Failed to create any region meshes');
          return;
        }

        // If multiple regions selected, union them together
        let resultMesh: THREE.Mesh | undefined;
        if (selectedRegionMeshes.length === 1) {
          resultMesh = selectedRegionMeshes[0];
        } else if (selectedRegionMeshes.length > 1) {
          const firstMesh = selectedRegionMeshes[0];
          if (!firstMesh) {
            console.error('[BooleanTool] First region mesh is undefined');
            return;
          }
          resultMesh = firstMesh;
          for (let i = 1; i < selectedRegionMeshes.length; i++) {
            const nextMesh = selectedRegionMeshes[i];
            if (!nextMesh || !resultMesh) {continue;}
            resultMesh = performBoolean(resultMesh, nextMesh, 'union');
          }
        }
        
        if (!resultMesh) {
          console.error('[BooleanTool] Failed to create result mesh');
          return;
        }

        // Dispose of region meshes first
        regions.forEach((region) => {
          if (region.mesh) {
            disposeMeshResources(region.mesh);
          }
        });

        // Create new CAD object from result
        const euler = new THREE.Euler().setFromQuaternion(
          new THREE.Quaternion().setFromRotationMatrix(resultMesh.matrixWorld),
          'XYZ'
        );

        const newObject = {
          id: `cad-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          type: 'plane' as const,
          mesh: resultMesh,
          position: [
            resultMesh.position.x,
            resultMesh.position.y,
            resultMesh.position.z,
          ] as [number, number, number],
          rotation: [euler.x, euler.y, euler.z] as [number, number, number],
          scale: [
            resultMesh.scale.x,
            resultMesh.scale.y,
            resultMesh.scale.z,
          ] as [number, number, number],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };

        resultMesh.userData.cadObjectId = newObject.id;
        resultMesh.userData.originFeature = 'boolean-tool';
        resultMesh.castShadow = true;
        resultMesh.receiveShadow = true;

        // Record boolean operation (use 'union' for multi-region or the actual operation for single region)
        const operation: 'union' | 'subtract' | 'intersect' =
          regionTypes.length === 1 && regionTypes[0] === 'intersection' ? 'intersect' :
          regionTypes.length === 1 && (regionTypes[0] === 'base' || regionTypes[0] === 'tool' || regionTypes[0] === 'outer-shell') ? 'subtract' :
          'union';
        applyBoolean(baseObject.id, toolObject.id, operation);

        // Remove original objects and add result
        if (baseMesh) {
          disposeMeshResources(baseMesh);
        }
        if (toolMesh) {
          disposeMeshResources(toolMesh);
        }
        removeObject(baseObject.id);
        removeObject(toolObject.id);
        addObject(newObject);

        // Clear selection and exit boolean mode
        clearSelection();
        setActiveTool('select');
      } catch (error) {
        console.error('[BooleanTool] Boolean operation failed:', error);
      } finally {
        setIsComputing(false);
      }
    },
    [
      selectedMeshes,
      objects,
      isComputing,
      applyBoolean,
      removeObject,
      addObject,
      clearSelection,
      setActiveTool,
    ]
  );

  const toggleRegionSelection = React.useCallback(
    (regionType: string) => {
      setSelectedRegions((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(regionType)) {
          newSet.delete(regionType);
        } else {
          newSet.add(regionType);
        }
        return newSet;
      });
    },
    []
  );

  const handlePointerDown = React.useCallback(
    (event: PointerEvent) => {
      if (
        activeTool !== 'boolean' ||
        selectedMeshes.length < 2 ||
        isComputing ||
        event.button !== 0
      ) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      const mouse = getMouseFromEvent(event);
      raycaster.setFromCamera(mouse, camera);

      let clickedRegion: string | null = null;

      // Check if both meshes are on ground plane (Y position near 0)
      const isGroundPlane = selectedMeshes.every(
        (mesh) => Math.abs(mesh.position.y) < 0.02
      );

      if (isGroundPlane) {
        // Use 2D point-in-polygon selection for ground plane
        // Project click to ground plane
        const groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
        const clickPoint3D = new THREE.Vector3();
        raycaster.ray.intersectPlane(groundPlane, clickPoint3D);

        if (clickPoint3D) {
          const clickPoint2D = { x: clickPoint3D.x, z: clickPoint3D.z };

          // Test each region in priority order (smallest/most specific first)
          // Priority: intersection > base > tool > outer-shell > union
          const priorityOrder = ['intersection', 'base', 'tool', 'outer-shell', 'union'];

          for (const regionType of priorityOrder) {
            const mesh = previewMeshesRef.current.get(regionType);
            if (mesh && mesh.visible) {
              const isInside = isPointInMesh2D(clickPoint2D, mesh);
              if (isInside) {
                clickedRegion = regionType;
                break;
              }
            }
          }
        }
      } else {
        // Use 3D raycasting for non-ground-plane booleans
        let minDistance = Infinity;

        for (const [regionType, mesh] of previewMeshesRef.current.entries()) {
          if (mesh) {
            const intersections = raycaster.intersectObject(mesh, false);
            const firstIntersection = intersections[0];
            if (firstIntersection && firstIntersection.distance < minDistance) {
              clickedRegion = regionType;
              minDistance = firstIntersection.distance;
            }
          }
        }
      }

      // Fallback to hovered region if nothing detected
      if (!clickedRegion && hoveredRegion) {
        clickedRegion = hoveredRegion;
      }

      if (clickedRegion) {
        toggleRegionSelection(clickedRegion);
      }
    },
    [
      activeTool,
      selectedMeshes,
      regions,
      isComputing,
      camera,
      raycaster,
      getMouseFromEvent,
      toggleRegionSelection,
      hoveredRegion,
    ]
  );

  const handleKeyDown = React.useCallback(
    (event: KeyboardEvent) => {
      if (activeTool !== 'boolean') {
        return;
      }

      if (event.key === 'Escape') {
        event.preventDefault();
        setActiveTool('select');
        setHoveredRegion(null);
        setSelectedRegions(new Set());
      } else if (event.key === 'Enter' && selectedRegions.size > 0 && !isComputing) {
        // Execute operation with selected regions when Enter is pressed
        event.preventDefault();
        executeBooleanOperation(Array.from(selectedRegions));
      }
    },
    [activeTool, selectedRegions, isComputing, setActiveTool, executeBooleanOperation]
  );

  React.useEffect(() => {
    if (activeTool !== 'boolean') {
      return;
    }

    const canvas = gl.domElement;
    canvas.addEventListener('pointerdown', handlePointerDown, { capture: true });
    window.addEventListener('pointermove', handlePointerMove, { passive: false });
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      canvas.removeEventListener('pointerdown', handlePointerDown, { capture: true });
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeTool, gl, handlePointerDown, handlePointerMove, handleKeyDown]);

  // Track preview meshes
  const handlePreviewMeshCreated = React.useCallback((regionType: string, mesh: THREE.Mesh) => {
    previewMeshesRef.current.set(regionType, mesh);
  }, []);

  if (activeTool !== 'boolean' || selectedMeshes.length < 2) {
    return null;
  }

  return (
    <>
      <BooleanPreview
        regions={regions}
        hoveredRegion={hoveredRegion}
        selectedRegions={selectedRegions}
        selectedObjects={selectedMeshes}
        onPreviewMeshCreated={handlePreviewMeshCreated}
      />
      {isComputing && (
        <Html center>
          <div
            style={{
              background: 'rgba(0, 0, 0, 0.8)',
              color: 'white',
              padding: '16px 24px',
              borderRadius: '8px',
              fontSize: '14px',
              fontFamily: 'system-ui, sans-serif',
            }}
          >
            Computing boolean operation...
          </div>
        </Html>
      )}
      {!isComputing && selectedRegions.size > 0 && (
        <Html center>
          <div
            style={{
              background: 'rgba(0, 0, 0, 0.9)',
              color: '#4eedc3',
              padding: '12px 20px',
              borderRadius: '6px',
              fontSize: '13px',
              fontFamily: 'system-ui, sans-serif',
              border: '1px solid #4eedc3',
            }}
          >
            {selectedRegions.size} region{selectedRegions.size > 1 ? 's' : ''} selected - Press ENTER to finish
          </div>
        </Html>
      )}
    </>
  );
};

