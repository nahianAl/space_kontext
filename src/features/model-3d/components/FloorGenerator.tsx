/**
 * Floor generator component for creating 3D floor meshes
 * Generates base floor from wall boundaries and zone overlays with materials
 * Auto-regenerates when walls or zones change
 */
'use client';

import React, { useEffect } from 'react';
import * as THREE from 'three';
import { getWallGraphStore } from '@/features/floorplan-2d/store/wallGraphStore';
import { getFloorStore } from '@/features/floorplan-2d/store/floorStore';
import { useThreeSceneStore } from '../store/threeSceneStore';
import { generateFloorMeshes } from '../utils/floorGenerator';
import { DEFAULT_WALL_COLOR } from '../utils/geometryConverter';

interface FloorGeneratorProps {
  projectId: string;
}

const FloorGenerator = ({ projectId }: FloorGeneratorProps) => {
  // Get project-specific stores
  const useWallGraphStore = React.useMemo(() => getWallGraphStore(projectId), [projectId]);
  const useFloorStore = React.useMemo(() => getFloorStore(projectId), [projectId]);

  const graph = useWallGraphStore((state) => state.graph);
  const zones = useFloorStore((state) => state.zones);

  const setBaseFloor = useThreeSceneStore((state) => state.setBaseFloor);
  const setZoneMeshes = useThreeSceneStore((state) => state.setZoneMeshes);
  const clearFloors = useThreeSceneStore((state) => state.clearFloors);

  useEffect(() => {
    const generateFloors = async () => {
      console.log('🔄 [Floor] FloorGenerator triggered');

      // Get current meshes for cleanup
      const currentBaseFloor = useThreeSceneStore.getState().baseFloorMesh;
      const currentZoneMeshes = useThreeSceneStore.getState().zoneMeshes;

      // Check if we have walls
      const wallCount = Object.keys(graph.edges).length;
      const nodeCount = Object.keys(graph.nodes).length;

      if (wallCount === 0 || nodeCount < 3) {
        console.log('⚠️ [Floor] No walls or insufficient nodes, clearing floors');
        // No walls, cleanup old floors
        if (currentBaseFloor) {
          currentBaseFloor.geometry.dispose();
          if (Array.isArray(currentBaseFloor.material)) {
            currentBaseFloor.material.forEach(m => m.dispose());
          } else {
            currentBaseFloor.material.dispose();
          }
        }
        currentZoneMeshes.forEach(mesh => {
          mesh.geometry.dispose();
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach(m => m.dispose());
          } else {
            mesh.material.dispose();
          }
        });
        clearFloors();
        return;
      }

      try {
        // Create default floor material (same as walls)
        const defaultMaterial = new THREE.MeshStandardMaterial({
          color: DEFAULT_WALL_COLOR,
          side: THREE.DoubleSide, // Render both sides to ensure visibility
          flatShading: true,
        });

        // Generate floor meshes
        const { baseFloor, zoneMeshes } = await generateFloorMeshes(
          graph,
          zones,
          defaultMaterial
        );

        // Cleanup old meshes
        if (currentBaseFloor) {
          currentBaseFloor.geometry.dispose();
          if (Array.isArray(currentBaseFloor.material)) {
            currentBaseFloor.material.forEach(m => m.dispose());
          } else {
            currentBaseFloor.material.dispose();
          }
        }
        currentZoneMeshes.forEach(mesh => {
          mesh.geometry.dispose();
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach(m => m.dispose());
          } else {
            mesh.material.dispose();
          }
        });

        // Store new meshes
        setBaseFloor(baseFloor);
        setZoneMeshes(zoneMeshes);

        console.log('✅ [Floor] Generated floors:', {
          hasBaseFloor: !!baseFloor,
          zoneCount: zoneMeshes.length,
          wallCount,
          nodeCount
        });
      } catch (error) {
        console.error('❌ [Floor] Error generating floors:', error);
        clearFloors();
      }
    };

    generateFloors();
  }, [graph, zones, setBaseFloor, setZoneMeshes, clearFloors, projectId]);

  return null; // This component does not render anything itself
};

interface RenderFloorsProps {
  projectId: string;
}

const RenderFloors = ({ projectId }: RenderFloorsProps) => {
  const baseFloorMesh = useThreeSceneStore((state) => state.baseFloorMesh);
  const zoneMeshes = useThreeSceneStore((state) => state.zoneMeshes);

  return (
    <group>
      {/* Base floor */}
      {baseFloorMesh && <primitive object={baseFloorMesh} />}

      {/* Zone overlay meshes */}
      {zoneMeshes.map((mesh, index) => (
        <primitive key={`zone-floor-${index}-${mesh.uuid}`} object={mesh} />
      ))}
    </group>
  );
};

export { FloorGenerator, RenderFloors };
