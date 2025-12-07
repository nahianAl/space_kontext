/**
 * Transform gizmo component using Drei TransformControls
 * Provides move, rotate, and scale controls for selected objects, with snapping
 * Integrates with cadToolsStore for state management
 */

'use client';

import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import { TransformControls } from '@react-three/drei';
import type { TransformControls as TransformControlsImpl, OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { useCADToolsStore } from '../store/cadToolsStore';
import * as THREE from 'three';
import type { SnapCandidate } from '../utils/snapping';

interface TransformGizmoProps {
  object: THREE.Object3D | null;
}

export const TransformGizmo = ({ object }: TransformGizmoProps) => {
  const { controls } = useThree((state) => ({
    controls: state.controls as OrbitControlsImpl | undefined,
  }));
  const controlsRef = useRef<TransformControlsImpl | null>(null);

  const transformMode = useCADToolsStore((state) => state.transformMode);
  const updateObject = useCADToolsStore((state) => state.updateObject);
  const selectedObjectIds = useCADToolsStore((state) => state.selectedObjectIds);
  const objects = useCADToolsStore((state) => state.objects);
  const computeSnapPoint = useCADToolsStore((state) => state.computeSnapPoint);
  const resetActiveSnap = useCADToolsStore((state) => state.resetActiveSnap);
  const gridSize = useCADToolsStore((state) => state.gridSize);
  const snapSettings = useCADToolsStore((state) => state.snapSettings);

  useEffect(() => {
    if (!object && controls) {
      controls.enabled = true;
    }
  }, [controls, object]);

  useEffect(() => {
    const instance = controlsRef.current;
    if (!instance) {
      return;
    }

    (instance as unknown as { translationSnap: number | null }).translationSnap = snapSettings.grid ? gridSize : null;
  }, [gridSize, snapSettings.grid]);

  const snapCandidates = useMemo(() => {
    if (!object) {
      return [];
    }

    const currentId =
      object instanceof THREE.Mesh && typeof object.userData.cadObjectId === 'string'
        ? (object.userData.cadObjectId as string)
        : null;

    const candidates: SnapCandidate[] = [];
    const boundingBox = new THREE.Box3();
    const corner = new THREE.Vector3();
    const worldCenter = new THREE.Vector3();

    objects.forEach((cadObject) => {
      if (cadObject.id === currentId) {
        return;
      }

      const mesh = cadObject.mesh;
      mesh.updateMatrixWorld(true);

      mesh.getWorldPosition(worldCenter);
      candidates.push({
        id: `${cadObject.id}-center`,
        type: 'object-center',
        position: worldCenter.clone(),
        objectId: cadObject.id,
      });

      boundingBox.setFromObject(mesh);

      for (let i = 0; i < 8; i += 1) {
        corner.set(
          i & 1 ? boundingBox.max.x : boundingBox.min.x,
          i & 2 ? boundingBox.max.y : boundingBox.min.y,
          i & 4 ? boundingBox.max.z : boundingBox.min.z
        );

        candidates.push({
          id: `${cadObject.id}-corner-${i}`,
          type: 'vertex',
          position: corner.clone(),
          objectId: cadObject.id,
        });
      }
    });

    return candidates;
  }, [object, objects]);

  const handleObjectChange = useCallback(() => {
    const target = (controlsRef.current as unknown as { object?: THREE.Object3D })?.object;
    if (target instanceof THREE.Mesh && target.userData.cadObjectId) {
      if (transformMode === 'translate') {
        const rawPosition = target.position.clone();
        const result = computeSnapPoint(rawPosition, snapCandidates);
        target.position.copy(result.point);
        target.updateMatrixWorld();
      } else {
        resetActiveSnap();
      }

      const objectId = target.userData.cadObjectId as string;
      updateObject(objectId, {
        position: [target.position.x, target.position.y, target.position.z],
        rotation: [target.rotation.x, target.rotation.y, target.rotation.z],
        scale: [target.scale.x, target.scale.y, target.scale.z],
      });
    }
  }, [computeSnapPoint, resetActiveSnap, snapCandidates, transformMode, updateObject]);

  useEffect(() => {
    const instance = controlsRef.current;
    if (!instance) {
      return;
    }

    instance.addEventListener('change' as keyof THREE.Object3DEventMap, handleObjectChange as (event: THREE.Event) => void);
    instance.addEventListener('objectChange' as keyof THREE.Object3DEventMap, handleObjectChange as (event: THREE.Event) => void);

    return () => {
      instance.removeEventListener('change' as keyof THREE.Object3DEventMap, handleObjectChange as (event: THREE.Event) => void);
      instance.removeEventListener('objectChange' as keyof THREE.Object3DEventMap, handleObjectChange as (event: THREE.Event) => void);
    };
  }, [handleObjectChange]);

  useEffect(() => {
    if (transformMode !== 'translate') {
      resetActiveSnap();
    } else {
      handleObjectChange();
    }
  }, [handleObjectChange, resetActiveSnap, transformMode]);

  const handleDraggingChange = useCallback((value: boolean | { value: boolean }) => {
    const isDragging = typeof value === 'boolean' ? value : value.value;
    if (controls) {
      controls.enabled = !isDragging;
    }
  }, [controls]);

  useEffect(() => {
    return () => {
      if (controls) {
        controls.enabled = true;
      }
    };
  }, [controls]);

  if (!object || selectedObjectIds.length !== 1) {
    return null;
  }

  return (
    <TransformControls
      ref={(value) => {
        controlsRef.current = value ?? null;
        if (value) {
          (value as unknown as { translationSnap: number | null }).translationSnap = snapSettings.grid ? gridSize : null;
        }
      }}
      object={object}
      mode={transformMode}
      enabled
    />
  );
};
/**
 * Transform gizmo component using Three.js TransformControls
 * Provides move, rotate, and scale controls for selected objects
 * Integrates with cadToolsStore for state management
 */


