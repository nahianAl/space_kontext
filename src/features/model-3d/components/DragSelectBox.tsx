/**
 * Drag Select Box Component
 * Renders the selection box overlay during drag-select operations
 * Handles mouse events for click-drag marquee selection
 */
'use client';

import React from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useCADToolsStore } from '../store/cadToolsStore';

export const DragSelectBox = () => {
  const { camera, gl, scene, controls } = useThree();
  const activeTool = useCADToolsStore((state) => state.activeTool);
  const objects = useCADToolsStore((state) => state.objects);
  const dragSelectState = useCADToolsStore((state) => state.dragSelectState);
  const startDragSelect = useCADToolsStore((state) => state.startDragSelect);
  const updateDragSelect = useCADToolsStore((state) => state.updateDragSelect);
  const endDragSelect = useCADToolsStore((state) => state.endDragSelect);
  const cancelDragSelect = useCADToolsStore((state) => state.cancelDragSelect);
  const selectObjects = useCADToolsStore((state) => state.selectObjects);

  const isDraggingRef = React.useRef(false);
  const startPositionRef = React.useRef({ x: 0, y: 0 });

  React.useEffect(() => {
    if (activeTool !== 'select') {
      // Cancel any active drag select when switching tools
      if (dragSelectState.active) {
        cancelDragSelect();
      }
      return;
    }

    const canvas = gl.domElement;

    const handlePointerDown = (event: PointerEvent) => {
      // Only start drag select on left click
      if (event.button !== 0) {
        return;
      }

      // Don't start drag select if clicking on a mesh (handled by RenderCADObjects)
      const rect = canvas.getBoundingClientRect();
      const mouse = new THREE.Vector2(
        ((event.clientX - rect.left) / rect.width) * 2 - 1,
        -((event.clientY - rect.top) / rect.height) * 2 + 1
      );

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, camera);

      // Get all meshes from CAD objects
      const meshes = objects.map(obj => obj.mesh);
      const intersects = raycaster.intersectObjects(meshes, false);

      // If clicking on an object, don't start drag select (let click handlers handle it)
      if (intersects.length > 0) {
        return;
      }

      // Start drag select
      isDraggingRef.current = true;
      startPositionRef.current = { x: event.clientX, y: event.clientY };
      startDragSelect(event.clientX, event.clientY);

      // Disable orbit controls while dragging
      if (controls && 'enabled' in controls) {
        (controls as { enabled: boolean }).enabled = false;
      }
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (!isDraggingRef.current || !dragSelectState.active) {
        return;
      }

      // Update the drag select box
      updateDragSelect(event.clientX, event.clientY);
    };

    const handlePointerUp = (event: PointerEvent) => {
      if (!isDraggingRef.current || !dragSelectState.active) {
        isDraggingRef.current = false;
        return;
      }

      isDraggingRef.current = false;

      // Calculate selection box in screen space
      const rect = canvas.getBoundingClientRect();
      const x1 = Math.min(dragSelectState.startX, dragSelectState.currentX) - rect.left;
      const y1 = Math.min(dragSelectState.startY, dragSelectState.currentY) - rect.top;
      const x2 = Math.max(dragSelectState.startX, dragSelectState.currentX) - rect.left;
      const y2 = Math.max(dragSelectState.startY, dragSelectState.currentY) - rect.top;

      // Convert to NDC (Normalized Device Coordinates)
      const minX = (x1 / rect.width) * 2 - 1;
      const maxX = (x2 / rect.width) * 2 - 1;
      const minY = -((y2 / rect.height) * 2 - 1);
      const maxY = -((y1 / rect.height) * 2 - 1);

      // Find all objects whose center is within the selection box
      const selectedIds: string[] = [];
      const raycaster = new THREE.Raycaster();

      objects.forEach((obj) => {
        // Get object center in world space
        const center = new THREE.Vector3();
        obj.mesh.geometry.computeBoundingBox();
        if (obj.mesh.geometry.boundingBox) {
          obj.mesh.geometry.boundingBox.getCenter(center);
          obj.mesh.localToWorld(center);
        }

        // Project to screen space
        const screenPos = center.clone().project(camera);

        // Check if within selection box
        if (
          screenPos.x >= minX &&
          screenPos.x <= maxX &&
          screenPos.y >= minY &&
          screenPos.y <= maxY &&
          screenPos.z >= -1 &&
          screenPos.z <= 1
        ) {
          selectedIds.push(obj.id);
        }
      });

      // Apply selection
      if (selectedIds.length > 0) {
        // Check if shift/cmd/ctrl is held for adding to selection
        const isMultiSelect = event.shiftKey || event.metaKey || event.ctrlKey;
        if (isMultiSelect) {
          // Add to existing selection
          const currentSelection = useCADToolsStore.getState().selectedObjectIds;
          const newSelection = Array.from(new Set([...currentSelection, ...selectedIds]));
          selectObjects(newSelection);
        } else {
          // Replace selection
          selectObjects(selectedIds);
        }
      } else if (!event.shiftKey && !event.metaKey && !event.ctrlKey) {
        // Clear selection if nothing selected and not multi-selecting
        selectObjects([]);
      }

      endDragSelect();

      // Re-enable orbit controls after drag ends
      if (controls && 'enabled' in controls) {
        (controls as { enabled: boolean }).enabled = true;
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && dragSelectState.active) {
        isDraggingRef.current = false;
        cancelDragSelect();

        // Re-enable orbit controls when canceling
        if (controls && 'enabled' in controls) {
          (controls as { enabled: boolean }).enabled = true;
        }
      }
    };

    canvas.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      canvas.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [
    activeTool,
    camera,
    gl,
    controls,
    objects,
    dragSelectState,
    startDragSelect,
    updateDragSelect,
    endDragSelect,
    cancelDragSelect,
    selectObjects,
  ]);

  return null; // This component only handles events, rendering is done in overlay
};

/**
 * Selection Box Overlay Component
 * Renders the visual selection box during drag operations
 */
export const DragSelectBoxOverlay = () => {
  const dragSelectState = useCADToolsStore((state) => state.dragSelectState);

  if (!dragSelectState.active) {
    return null;
  }

  const x = Math.min(dragSelectState.startX, dragSelectState.currentX);
  const y = Math.min(dragSelectState.startY, dragSelectState.currentY);
  const width = Math.abs(dragSelectState.currentX - dragSelectState.startX);
  const height = Math.abs(dragSelectState.currentY - dragSelectState.startY);

  return (
    <div
      style={{
        position: 'fixed',
        left: x,
        top: y,
        width,
        height,
        border: '2px solid #FF6600',
        backgroundColor: 'rgba(255, 102, 0, 0.1)',
        pointerEvents: 'none',
        zIndex: 1000,
      }}
    />
  );
};
