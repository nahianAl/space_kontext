/**
 * Render CAD objects in the 3D scene
 * Displays user-created shapes with selection and hover support
 * Uses orange edge highlighting for selected/hovered objects (matching wall style)
 */

'use client';

import React, { useRef } from 'react';
import * as THREE from 'three';
import { ThreeEvent, useThree } from '@react-three/fiber';
import { useCADToolsStore } from '../store/cadToolsStore';
import {
  buildFaceData,
  createPushPullDragContext,
  computeDistanceFromDragContext,
  type PushPullDragContext,
} from '../utils/pushPull';

const SELECTED_EDGE_COLOR = '#FF6600'; // Bright orange (matching wall selection)
const HOVER_EDGE_COLOR = '#FF6600'; // Bright orange (matching wall hover)
const DEFAULT_EDGE_COLOR = '#000000'; // Black edges for all objects

interface RenderCADObjectsProps {
  // No props needed - reads from store
}

export const RenderCADObjects = ({}: RenderCADObjectsProps) => {
  const { camera, controls, gl } = useThree((state) => ({
    camera: state.camera,
    controls: state.controls as THREE.EventDispatcher & { enabled?: boolean } | undefined,
    gl: state.gl,
  }));
  const objects = useCADToolsStore((state) => state.objects);
  const selectedObjectIds = useCADToolsStore((state) => state.selectedObjectIds);
  const hoveredObjectId = useCADToolsStore((state) => state.hoveredObjectId);
  const selectObject = useCADToolsStore((state) => state.selectObject);
  const selectObjects = useCADToolsStore((state) => state.selectObjects);
  const toggleSelection = useCADToolsStore((state) => state.toggleSelection);
  const setHoveredObjectId = useCADToolsStore((state) => state.setHoveredObjectId);
  // Face selection
  const selectedFaces = useCADToolsStore((state) => state.selectedFaces);
  const selectFace = useCADToolsStore((state) => state.selectFace);
  const addFaceToSelection = useCADToolsStore((state) => state.addFaceToSelection);
  const removeFaceFromSelection = useCADToolsStore((state) => state.removeFaceFromSelection);
  const getGroupForObject = useCADToolsStore((state) => state.getGroupForObject);
  const isObjectVisible = useCADToolsStore((state) => state.isObjectVisible);
  const activeTool = useCADToolsStore((state) => state.activeTool);
  const setPushPullFace = useCADToolsStore((state) => state.setPushPullFace);
  const startPushPull = useCADToolsStore((state) => state.startPushPull);
  const updatePushPullDistance = useCADToolsStore((state) => state.updatePushPullDistance);
  const applyPushPull = useCADToolsStore((state) => state.applyPushPull);
  const cancelPushPull = useCADToolsStore((state) => state.cancelPushPull);
  const pushPullState = useCADToolsStore((state) => state.pushPullState);

  const dragInfoRef = useRef<{
    face: ReturnType<typeof buildFaceData>;
    context: PushPullDragContext;
  } | null>(null);
  const isFinalizingRef = useRef<boolean>(false);
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
    if (pushPullState.isApplying || pushPullState.controller !== 'face') {
      return;
    }

    isFinalizingRef.current = true;
    try {
      await applyPushPull();
    } catch (error) {
      console.error('RenderCADObjects.finalizePushPull:', error);
    } finally {
      dragInfoRef.current = null;
      isFinalizingRef.current = false;
      setOrbitControlsEnabled(true);
    }
  }, [applyPushPull, pushPullState.controller, pushPullState.isApplying, setOrbitControlsEnabled]);

  const handlePointerDown = React.useCallback(
    (event: ThreeEvent<PointerEvent>, objectId: string) => {
      console.log('[push-pull] handlePointerDown called', {
        activeTool,
        button: event.button,
        isApplying: pushPullState.isApplying,
        faceIndex: event.faceIndex,
      });

      if (event.button !== 0 || pushPullState.isApplying || pushPullState.active) {
        console.log('[push-pull] Early return: button !== 0 or isApplying');
        return;
      }

      if (activeTool !== 'push-pull') {
        console.log('[push-pull] Early return: activeTool !== push-pull', activeTool);
        return;
      }

      event.stopPropagation();
      event.nativeEvent.stopPropagation();

      const faceIndex = event.faceIndex;
      if (faceIndex == null) {
        console.log('[push-pull] Early return: faceIndex is null');
        return;
      }

      const mesh = event.object;
      if (!(mesh instanceof THREE.Mesh)) {
        console.log('[push-pull] Early return: not a mesh', mesh?.constructor?.name);
        return;
      }

      console.log('[push-pull] Building face data...');
      const faceData = buildFaceData(mesh, faceIndex, event.point);
      const pointerRay = event.ray.clone();
      const context = createPushPullDragContext(faceData, pointerRay);

      dragInfoRef.current = {
        face: faceData,
        context,
      };

      console.log('[push-pull] Drag started:', {
        objectId,
        faceIndex,
      });

      // Disable orbit controls immediately
      setOrbitControlsEnabled(false);
      
      // startPushPull will set the face and activate push-pull
      console.log('[push-pull] Calling startPushPull...');
      const didStart = startPushPull(faceData);
      if (!didStart) {
        console.warn('[push-pull] startPushPull returned false');
        dragInfoRef.current = null;
        setOrbitControlsEnabled(true);
        return;
      }
      selectObject(objectId);
      console.log('[push-pull] startPushPull completed');
    },
    [activeTool, pushPullState.isApplying, selectObject, setOrbitControlsEnabled, startPushPull]
  );

  const handleObjectClick = React.useCallback(
    (event: ThreeEvent<MouseEvent>, objectId: string) => {
      if (event.nativeEvent.button !== 0) {
        return;
      }

      if (activeTool === 'push-pull') {
        return;
      }

      event.stopPropagation();

      const isMultiSelect =
        event.nativeEvent.shiftKey ||
        event.nativeEvent.metaKey ||
        event.nativeEvent.ctrlKey;

      // Single-click: Face selection (similar to walls)
      const faceIndex = event.faceIndex;
      if (faceIndex != null && event.object instanceof THREE.Mesh) {
        // Build face data to get all triangles that make up this face
        const faceData = buildFaceData(event.object, faceIndex, event.point);
        // Use the first triangle index as the representative faceIndex for this face
        const representativeFaceIndex = faceData.triangleIndices[0] ?? faceIndex;

        const faceSelection = { objectId, faceIndex: representativeFaceIndex };

        if (isMultiSelect) {
          // Check if this face is already selected
          const isSelected = selectedFaces.some(
            f => f.objectId === objectId && f.faceIndex === representativeFaceIndex
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
    [activeTool, selectedFaces, selectFace, addFaceToSelection, removeFaceFromSelection]
  );

  // Double-click handler for selecting entire objects (or groups)
  const handleObjectDoubleClick = React.useCallback(
    (event: ThreeEvent<MouseEvent>, objectId: string) => {
      if (event.nativeEvent.button !== 0) {
        return;
      }

      if (activeTool === 'push-pull') {
        return;
      }

      event.stopPropagation();

      const isMultiSelect =
        event.nativeEvent.shiftKey ||
        event.nativeEvent.metaKey ||
        event.nativeEvent.ctrlKey;

      // Check if object is in a group
      const group = getGroupForObject(objectId);

      if (group) {
        // Select all objects in the group
        const groupObjectIds = group.objectIds;

        if (isMultiSelect) {
          // Toggle all group objects
          const allSelected = groupObjectIds.every(id => selectedObjectIds.includes(id));
          if (allSelected) {
            // Deselect all group objects
            const newSelection = selectedObjectIds.filter(id => !groupObjectIds.includes(id));
            selectObjects(newSelection);
          } else {
            // Add all group objects to selection
            const newSelection = Array.from(new Set([...selectedObjectIds, ...groupObjectIds]));
            selectObjects(newSelection);
          }
        } else {
          // Select only group objects
          selectObjects(groupObjectIds);
        }
      } else {
        // Double-click selects entire object (not in a group)
        if (isMultiSelect) {
          toggleSelection(objectId);
        } else {
          selectObject(objectId);
        }
      }
    },
    [activeTool, getGroupForObject, selectedObjectIds, selectObject, selectObjects, toggleSelection]
  );

  const handlePointerOver = React.useCallback(
    (event: ThreeEvent<PointerEvent>, objectId: string) => {
      event.stopPropagation();

      // Only show push-pull preview if tool is active
      if (activeTool === 'push-pull' && !dragInfoRef.current && !pushPullState.active) {
        const faceIndex = event.faceIndex;
        if (faceIndex != null && event.object instanceof THREE.Mesh) {
          const faceData = buildFaceData(event.object, faceIndex, event.point);
          setPushPullFace(faceData);
        }
      }
    },
    [activeTool, pushPullState.active, setPushPullFace]
  );

  const handlePointerOut = React.useCallback(
    (event: ThreeEvent<PointerEvent>, objectId: string) => {
      event.stopPropagation();
      // Don't clear push-pull face on pointer out - let user interact freely
      // Face will be cleared when tool changes or on cancel
    },
    []
  );

  const handlePointerMove = React.useCallback(
    (event: ThreeEvent<PointerEvent>) => {
      if (activeTool !== 'push-pull' || pushPullState.isApplying) {
        return;
      }

      // During active drag, window-level handler takes over
      if (dragInfoRef.current || pushPullState.active) {
        return;
      }

      // Hover preview only (not dragging and not active)
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
    [activeTool, pushPullState.isApplying, pushPullState.active, setPushPullFace]
  );

  const handlePointerUp = React.useCallback(
    (event: ThreeEvent<PointerEvent>) => {
      if (activeTool !== 'push-pull') {
        return;
      }

      // Only finalize if we were actually dragging (dragInfoRef exists)
      // This prevents immediate finalization on click
      if (
        pushPullState.active &&
        pushPullState.controller === 'face' &&
        !pushPullState.isApplying &&
        dragInfoRef.current
      ) {
        console.log('[push-pull] handlePointerUp: finalizing push-pull');
        event.stopPropagation();
        void finalizePushPull();
      } else {
        console.log('[push-pull] handlePointerUp: skipping finalization', {
          active: pushPullState.active,
          isApplying: pushPullState.isApplying,
          hasDragInfo: !!dragInfoRef.current,
        });
      }
    },
    [activeTool, finalizePushPull, pushPullState.active, pushPullState.isApplying]
  );

  React.useEffect(() => {
    if (activeTool !== 'push-pull') {
      // Cancel any pending RAF
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
      pendingDistanceRef.current = null;
      
      cancelPushPull();
      setPushPullFace(null); // Clear the face when switching tools
      dragInfoRef.current = null;
      setOrbitControlsEnabled(true);
    }
  }, [activeTool, cancelPushPull, setPushPullFace, setOrbitControlsEnabled]);

  // Window-level pointer move for push-pull (works even when cursor leaves mesh)
  // Uses requestAnimationFrame for smooth updates
  React.useEffect(() => {
    if (!pushPullState.active || pushPullState.controller !== 'face') {
      // Cancel any pending RAF
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
      pendingDistanceRef.current = null;
      return;
    }

    const handleWindowPointerMove = (event: PointerEvent) => {
      const dragInfo = dragInfoRef.current;
      const currentState = useCADToolsStore.getState().pushPullState;
      if (!dragInfo || !currentState.active || currentState.controller !== 'face') {
        return;
      }

      // Prevent default to avoid scrolling/other interactions
      try {
        event.preventDefault();
        event.stopPropagation();
      } catch (error) {
        // Ignore errors if event is already handled
      }

      // Get normalized device coordinates
      const rect = gl.domElement.getBoundingClientRect();
      const mouse = new THREE.Vector2(
        ((event.clientX - rect.left) / rect.width) * 2 - 1,
        -((event.clientY - rect.top) / rect.height) * 2 + 1
      );

      // Raycast into scene
      const raycaster = raycasterRef.current;
      raycaster.setFromCamera(mouse, camera);
      const distance = computeDistanceFromDragContext(dragInfo.context, raycaster.ray);

      // Store pending distance (will be applied in RAF)
      pendingDistanceRef.current = distance;

      // Schedule update via RAF (only if not already scheduled)
      if (rafIdRef.current === null) {
        rafIdRef.current = requestAnimationFrame(() => {
          const updatedState = useCADToolsStore.getState().pushPullState;
          if (
            pendingDistanceRef.current !== null &&
            updatedState.active &&
            updatedState.controller === 'face'
          ) {
            try {
              updatePushPullDistance(pendingDistanceRef.current);
            } catch (error) {
              console.error('[push-pull] Error in RAF update:', error);
            }
            pendingDistanceRef.current = null;
          }
          rafIdRef.current = null;
        });
      }
    };

    console.log('[push-pull] Adding window pointermove listener');
    window.addEventListener('pointermove', handleWindowPointerMove, { passive: false });

    return () => {
      console.log('[push-pull] Removing window pointermove listener');
      window.removeEventListener('pointermove', handleWindowPointerMove);
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
      pendingDistanceRef.current = null;
    };
  }, [pushPullState.active, pushPullState.controller, camera, gl, updatePushPullDistance]);

  React.useEffect(() => {
    if (!pushPullState.active || pushPullState.controller !== 'face') {
      return;
    }

    const handleWindowPointerUp = (event: PointerEvent) => {
      const currentState = useCADToolsStore.getState().pushPullState;
      if (!currentState.active || currentState.controller !== 'face') {
        return;
      }

      try {
        event.preventDefault();
        event.stopPropagation();
      } catch (error) {
        // Ignore errors if event is already handled
      }
      
      // Cancel any pending RAF updates
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
      
      // Apply final distance if pending
      if (pendingDistanceRef.current !== null) {
        try {
          updatePushPullDistance(pendingDistanceRef.current);
        } catch (error) {
          console.error('[push-pull] Error applying final distance:', error);
        }
        pendingDistanceRef.current = null;
      }
      
      if (!currentState.isApplying) {
        void finalizePushPull();
      }
    };

    window.addEventListener('pointerup', handleWindowPointerUp, { passive: false });
    return () => {
      window.removeEventListener('pointerup', handleWindowPointerUp);
    };
  }, [finalizePushPull, pushPullState.active, pushPullState.controller, pushPullState.isApplying, updatePushPullDistance]);

  React.useEffect(() => {
    if (!pushPullState.active && !pushPullState.selectedFace) {
      dragInfoRef.current = null;
    }
  }, [pushPullState.active, pushPullState.selectedFace]);

  React.useEffect(() => {
    if (!pushPullState.active) {
      setOrbitControlsEnabled(true);
    }
  }, [pushPullState.active, setOrbitControlsEnabled]);

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
      {objects.filter(obj => isObjectVisible(obj.id)).map((obj) => {
        // Object-level selection (double-click)
        const isObjectSelected = selectedObjectIds.includes(obj.id);
        const showObjectEdges = isObjectSelected;

        // Face-level selection (single-click)
        const selectedFacesForThisObject = selectedFaces.filter(f => f.objectId === obj.id);

        // Only show default black edges for basic CAD tool shapes
        const originFeature = obj.mesh.userData?.originFeature;
        const showDefaultEdges =
          originFeature === 'rectangle-tool' ||
          originFeature === 'circle-tool' ||
          originFeature === 'polygon-tool' ||
          originFeature === 'line-tool' ||
          originFeature === 'arc-tool' ||
          originFeature === 'offset-tool';

        const showEdges = showObjectEdges || showDefaultEdges;
        const edgeColor = isObjectSelected ? SELECTED_EDGE_COLOR : DEFAULT_EDGE_COLOR;

        const isBeingTransformed = false;
        if (!isBeingTransformed) {
          obj.mesh.position.set(...obj.position);
          obj.mesh.rotation.set(...obj.rotation);
          obj.mesh.scale.set(...obj.scale);
          obj.mesh.updateMatrix();
          obj.mesh.updateMatrixWorld(true);
        }

        // Ensure mesh is interactive
        if (obj.mesh) {
          obj.mesh.raycast = THREE.Mesh.prototype.raycast;
        }

        return (
          <group key={obj.id}>
            <primitive
              object={obj.mesh}
              onPointerDown={(event: ThreeEvent<PointerEvent>) => {
                console.log('[push-pull] Primitive onPointerDown fired', { objectId: obj.id, activeTool });
                handlePointerDown(event, obj.id);
              }}
              onClick={(event: ThreeEvent<MouseEvent>) => handleObjectClick(event, obj.id)}
              onDoubleClick={(event: ThreeEvent<MouseEvent>) => handleObjectDoubleClick(event, obj.id)}
              onPointerOver={(event: ThreeEvent<PointerEvent>) => handlePointerOver(event, obj.id)}
              onPointerOut={(event: ThreeEvent<PointerEvent>) => handlePointerOut(event, obj.id)}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
            />

            {/* Object-level edge highlighting (double-click selection) */}
            {showEdges && obj.mesh.geometry && (
              <lineSegments
                key={`edges-${obj.id}-${isObjectSelected}`}
                geometry={new THREE.EdgesGeometry(obj.mesh.geometry, 15)}
                matrix={obj.mesh.matrix}
                matrixAutoUpdate={false}
                renderOrder={1000}
              >
                <lineBasicMaterial
                  color={edgeColor}
                  linewidth={1}
                  depthTest={false}
                  depthWrite={false}
                />
              </lineSegments>
            )}

            {/* Face-level highlighting for selected faces */}
            {selectedFacesForThisObject.map((faceSelection) => {
              const faceGeometry = createFaceGeometry(obj.mesh, faceSelection.faceIndex);
              if (!faceGeometry) return null;

              return (
                <group key={`face-${obj.id}-${faceSelection.faceIndex}`}>
                  {/* Face edges */}
                  <lineSegments
                    geometry={new THREE.EdgesGeometry(faceGeometry, 1)}
                    position={obj.mesh.position}
                    rotation={obj.mesh.rotation}
                    scale={obj.mesh.scale}
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
                    position={obj.mesh.position}
                    rotation={obj.mesh.rotation}
                    scale={obj.mesh.scale}
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
          </group>
        );
      })}
    </group>
  );
};

