/**
 * Transform controls for wall meshes generated from 2D floorplans
 * Allows translating walls directly in 3D while syncing back to the wall graph store
 */
'use client';

import React from 'react';
import { TransformControls } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import type { TransformControls as TransformControlsImpl, OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import * as THREE from 'three';

import { useCADToolsStore } from '../store/cadToolsStore';
import { getWallGraphStore } from '@/features/floorplan-2d/store/wallGraphStore';
import { metersToPixels } from '../utils/geometryConverter';

interface WallTransformGizmoProps {
  mesh: THREE.Mesh;
  wallId: string;
  projectId: string;
}

export const WallTransformGizmo = ({ mesh, wallId, projectId }: WallTransformGizmoProps) => {
  const { controls } = useThree((state) => ({
    controls: state.controls as OrbitControlsImpl | undefined,
  }));
  const controlsRef = React.useRef<TransformControlsImpl | null>(null);
  const dragStateRef = React.useRef<{
    position: THREE.Vector3;
    rotationY: number;
    scale: THREE.Vector3;
    planScale: number;
    wallLengthPixels: number;
  } | null>(null);

  const transformMode = useCADToolsStore((state) => state.transformMode);
  const activeTool = useCADToolsStore((state) => state.activeTool);
  const gridSize = useCADToolsStore((state) => state.gridSize);
  const snapSettings = useCADToolsStore((state) => state.snapSettings);

  const useWallGraphStore = React.useMemo(() => getWallGraphStore(projectId), [projectId]);
  const translateWalls = useWallGraphStore((state) => state.translateWalls);
  const rotateWalls = useWallGraphStore((state) => state.rotateWalls);
  const setWallLength = useWallGraphStore((state) => state.setWallLength);

  React.useEffect(() => {
    const instance = controlsRef.current;
    if (instance) {
      const controls = instance as unknown as { translationSnap: number | null; rotationSnap: number | null; scaleSnap: number | null };
      controls.translationSnap = snapSettings.grid ? gridSize : null;
      controls.rotationSnap = null;
      controls.scaleSnap = null;
    }
  }, [gridSize, snapSettings.grid]);

  const handleControlChange = React.useCallback(() => {
    const target = (controlsRef.current as unknown as { object?: THREE.Object3D })?.object;
    if (!(target instanceof THREE.Object3D)) {
      return;
    }

    if (transformMode === 'translate') {
      target.position.y = dragStateRef.current?.position?.y ?? 0;
    } else if (transformMode === 'scale') {
      const initialY = dragStateRef.current?.scale?.y ?? 1;
      target.scale.y = initialY;
    }
  }, [transformMode]);

  const handleDraggingChange = React.useCallback(
    (value: boolean | { value: boolean }) => {
      const isDragging = typeof value === 'boolean' ? value : value.value;

      if (controls) {
        controls.enabled = !isDragging;
      }

      const target = (controlsRef.current as unknown as { object?: THREE.Object3D })?.object;
      if (!(target instanceof THREE.Object3D)) {
        return;
      }

      const wallLength = useWallGraphStore.getState().graph.edges[wallId]?.length ?? 0;
      if (isDragging) {
        dragStateRef.current = {
          position: target.position.clone(),
          rotationY: target.rotation.y,
          scale: target.scale.clone(),
          planScale: Math.hypot(target.scale.x, target.scale.z) || 1,
          wallLengthPixels: wallLength || 0,
        };
        return;
      }

      if (!dragStateRef.current) {
        return;
      }

      const startState = dragStateRef.current;
      dragStateRef.current = null;

      if (transformMode === 'translate') {
        const delta = target.position.clone().sub(startState.position);
        const deltaPixels: [number, number] = [
          metersToPixels(delta.x),
          metersToPixels(delta.z),
        ];

        if (Math.abs(deltaPixels[0]) < 0.001 && Math.abs(deltaPixels[1]) < 0.001) {
          target.position.copy(startState.position);
          return;
        }

        translateWalls([wallId], deltaPixels);
        target.position.copy(startState.position);
        return;
      }

      if (transformMode === 'rotate') {
        const deltaRotation = target.rotation.y - startState.rotationY;
        if (Math.abs(deltaRotation) < 0.0001) {
          target.rotation.y = startState.rotationY;
          return;
        }
        rotateWalls([wallId], deltaRotation);
        target.rotation.y = startState.rotationY;
        return;
      }

      if (transformMode === 'scale') {
        const currentPlanScale = Math.hypot(target.scale.x, target.scale.z) || 1;
        const planScaleFactor = currentPlanScale / (startState.planScale || 1);

        if (!Number.isFinite(planScaleFactor) || Math.abs(planScaleFactor - 1) < 0.001) {
          target.scale.copy(startState.scale);
          return;
        }

        const nextLength = Math.max(startState.wallLengthPixels * planScaleFactor, 0.001);
        setWallLength(wallId, nextLength);
        target.scale.copy(startState.scale);
      }
    },
    [controls, rotateWalls, setWallLength, translateWalls, transformMode, useWallGraphStore, wallId]
  );

  React.useEffect(() => {
    const instance = controlsRef.current;
    if (!instance) {
      return;
    }
    
    let isDragging = false;
    const handleChange = () => {
      handleControlChange();
      if (!isDragging) {
        isDragging = true;
        if (controls) {
          controls.enabled = false;
        }
        const target = (instance as unknown as { object?: THREE.Object3D })?.object;
        if (target instanceof THREE.Object3D) {
          dragStateRef.current = {
            position: target.position.clone(),
            rotationY: target.rotation.y,
            scale: target.scale.clone(),
            planScale: Math.hypot(target.scale.x, target.scale.z) || 1,
            wallLengthPixels: useWallGraphStore.getState().graph.edges[wallId]?.length ?? 0,
          };
        }
      }
    };
    
    const handleMouseUp = () => {
      if (isDragging) {
        isDragging = false;
        if (controls) {
          controls.enabled = true;
        }
        handleDraggingChange(false);
      }
    };
    
    instance.addEventListener('change' as keyof THREE.Object3DEventMap, handleChange as (event: THREE.Event) => void);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('pointerup', handleMouseUp);

    return () => {
      dragStateRef.current = null;
      instance.removeEventListener('change' as keyof THREE.Object3DEventMap, handleChange as (event: THREE.Event) => void);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('pointerup', handleMouseUp);
      if (controls) {
        controls.enabled = true;
      }
    };
  }, [controls, handleControlChange, handleDraggingChange, useWallGraphStore, wallId]);

  if (!mesh || activeTool !== 'select') {
    return null;
  }

  const isRotate = transformMode === 'rotate';
  const gizmoMode = isRotate
    ? 'rotate'
    : transformMode === 'scale'
      ? 'scale'
      : 'translate';

  return (
    <TransformControls
      key={mesh.uuid}
      ref={(value) => {
        controlsRef.current = value ?? null;
        if (value) {
          const controls = value as unknown as { translationSnap: number | null; rotationSnap: number | null; scaleSnap: number | null };
          controls.translationSnap = snapSettings.grid ? gridSize : null;
          controls.rotationSnap = null;
          controls.scaleSnap = null;
        }
      }}
      object={mesh}
      mode={gizmoMode}
      enabled
      showX={!isRotate}
      showY={isRotate}
      showZ={!isRotate}
      space={isRotate ? 'local' : 'world'}
    />
  );
};

