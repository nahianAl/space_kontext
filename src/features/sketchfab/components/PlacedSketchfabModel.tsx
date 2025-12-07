/**
 * React Three Fiber component for rendering placed Sketchfab models
 * Loads and displays GLB models in the 3D scene
 */

'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { usePlacedModelsStore, type PlacedSketchfabModel } from '../store/placedModelsStore';
import { loadGLBModel, placeModelOnGround } from '../utils/glbLoader';

interface PlacedSketchfabModelProps {
  model: PlacedSketchfabModel;
}

/**
 * Individual placed model component
 */
const PlacedModel = ({ model }: PlacedSketchfabModelProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const [loadedMesh, setLoadedMesh] = React.useState<THREE.Group | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // Load the GLB model
  useEffect(() => {
    let mounted = true;

    const loadModel = async () => {
      try {
        setLoading(true);
        setError(null);

        const mesh = await loadGLBModel(model.fileUrl);

        if (!mounted) return;

        // Place model on ground
        placeModelOnGround(mesh);

        // Set initial position, rotation, scale
        mesh.position.set(...model.position);
        mesh.rotation.set(...model.rotation);
        mesh.scale.set(...model.scale);

        // Store mesh reference in the model
        usePlacedModelsStore.getState().updateModel(model.id, { mesh });

        setLoadedMesh(mesh);
        setLoading(false);
      } catch (err) {
        if (!mounted) return;
        console.error('Failed to load Sketchfab model:', err);
        setError(err instanceof Error ? err.message : 'Failed to load model');
        setLoading(false);
      }
    };

    loadModel();

    return () => {
      mounted = false;
    };
  }, [model.fileUrl, model.id]);

  // Update position/rotation/scale when model data changes
  useEffect(() => {
    if (loadedMesh && groupRef.current) {
      groupRef.current.position.set(...model.position);
      groupRef.current.rotation.set(...model.rotation);
      groupRef.current.scale.set(...model.scale);
    }
  }, [model.position, model.rotation, model.scale, loadedMesh]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (loadedMesh) {
        loadedMesh.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.geometry.dispose();
            if (Array.isArray(child.material)) {
              child.material.forEach((mat) => mat.dispose());
            } else {
              child.material.dispose();
            }
          }
        });
      }
    };
  }, [loadedMesh]);

  if (loading) {
    // Show placeholder while loading
    return (
      <group ref={groupRef} position={model.position} rotation={model.rotation} scale={model.scale}>
        <mesh>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#888888" transparent opacity={0.5} />
        </mesh>
      </group>
    );
  }

  if (error || !loadedMesh) {
    // Show error placeholder
    return (
      <group ref={groupRef} position={model.position} rotation={model.rotation} scale={model.scale}>
        <mesh>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#ff0000" transparent opacity={0.5} />
        </mesh>
      </group>
    );
  }

  return <primitive ref={groupRef} object={loadedMesh} />;
};

/**
 * Component that renders all placed Sketchfab models
 */
export const RenderPlacedSketchfabModels = () => {
  const placedModels = usePlacedModelsStore((state) => state.placedModels);

  return (
    <>
      {placedModels.map((model) => (
        <PlacedModel key={model.id} model={model} />
      ))}
    </>
  );
};

