/**
 * Visual preview system for boolean operations
 * Renders semi-transparent preview regions with hover highlighting
 */

'use client';

import React from 'react';
import * as THREE from 'three';
import { useThree } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import type { RegionData } from '../utils/booleanRegionDetection';

interface BooleanPreviewProps {
  regions: RegionData[];
  hoveredRegion: string | null;
  selectedRegions: Set<string>;
  selectedObjects: THREE.Mesh[];
  onPreviewMeshCreated?: (regionType: string, mesh: THREE.Mesh) => void;
}

interface PreviewMesh {
  mesh: THREE.Mesh;
  material: THREE.Material;
  wireframe: THREE.LineSegments;
}

export const BooleanPreview = ({
  regions,
  hoveredRegion,
  selectedRegions,
  selectedObjects,
  onPreviewMeshCreated,
}: BooleanPreviewProps) => {
  const { camera } = useThree();
  const previewMeshesRef = React.useRef<Map<string, PreviewMesh>>(new Map());

  // Create preview meshes once when regions change
  React.useEffect(() => {
    console.log('[BooleanPreview] Effect triggered with', regions.length, 'regions');
    console.log('[BooleanPreview] Selected objects count:', selectedObjects.length);

    // Clean up old meshes
    console.log('[BooleanPreview] Cleaning up', previewMeshesRef.current.size, 'old preview meshes');
    previewMeshesRef.current.forEach((preview) => {
      preview.mesh.geometry.dispose();
      preview.wireframe.geometry.dispose();
      if (Array.isArray(preview.material)) {
        preview.material.forEach((m) => m.dispose());
      } else {
        preview.material.dispose();
      }
      if (preview.wireframe.material instanceof THREE.Material) {
        preview.wireframe.material.dispose();
      }
    });
    previewMeshesRef.current.clear();

    // Create new preview meshes
    regions.forEach((region) => {
      console.log('[BooleanPreview] Processing region:', region.type, 'has mesh:', !!region.mesh);
      let previewMesh: THREE.Mesh | null = null;
      let material: THREE.Material;

      if (region.mesh) {
        // Clone computed region mesh
        console.log('[BooleanPreview] Cloning computed region mesh for:', region.type);
        previewMesh = region.mesh.clone();
        material = new THREE.MeshStandardMaterial({
          color: 0x5c2b34, // Dark maroon
          opacity: 0.4,
          transparent: true,
          side: THREE.DoubleSide,
          depthTest: true,
          depthWrite: false,
          polygonOffset: true,
          polygonOffsetFactor: 1,
          polygonOffsetUnits: 1,
        });
        previewMesh.material = material;
        previewMesh.userData.isPreviewRegion = true;
        previewMesh.userData.regionType = region.type;
        previewMesh.renderOrder = 1000; // Render on top
      } else if (region.type === 'base' && selectedObjects[0]) {
        // Clone base mesh
        console.log('[BooleanPreview] Cloning base mesh (fallback)');
        previewMesh = selectedObjects[0].clone();
        material = new THREE.MeshStandardMaterial({
          color: 0x5c2b34, // Dark maroon
          opacity: 0.4,
          transparent: true,
          side: THREE.DoubleSide,
          depthTest: true,
          depthWrite: false,
          polygonOffset: true,
          polygonOffsetFactor: 1,
          polygonOffsetUnits: 1,
        });
        previewMesh.material = material;
        previewMesh.userData.isPreviewRegion = true;
        previewMesh.userData.regionType = 'base';
        previewMesh.renderOrder = 1000; // Render on top
      } else if (region.type === 'tool' && selectedObjects[1]) {
        // Clone tool mesh
        console.log('[BooleanPreview] Cloning tool mesh (fallback)');
        previewMesh = selectedObjects[1].clone();
        material = new THREE.MeshStandardMaterial({
          color: 0x5c2b34, // Dark maroon
          opacity: 0.4,
          transparent: true,
          side: THREE.DoubleSide,
          depthTest: true,
          depthWrite: false,
          polygonOffset: true,
          polygonOffsetFactor: 1,
          polygonOffsetUnits: 1,
        });
        previewMesh.material = material;
        previewMesh.userData.isPreviewRegion = true;
        previewMesh.userData.regionType = 'tool';
        previewMesh.renderOrder = 1000; // Render on top
      }

      if (previewMesh) {
        console.log('[BooleanPreview] Creating preview for region:', region.type, 'mesh vertices:', previewMesh.geometry.attributes.position?.count);

        // Log mesh bounds to see if it has volume
        const bounds = new THREE.Box3().setFromObject(previewMesh);
        const size = new THREE.Vector3();
        bounds.getSize(size);
        console.log('[BooleanPreview] Mesh bounds size:', size.toArray(), 'position:', previewMesh.position.toArray());

        // Check if geometry is valid
        if (!previewMesh.geometry.attributes.position || previewMesh.geometry.attributes.position.count === 0) {
          console.error('[BooleanPreview] Invalid geometry for region:', region.type);
        }

        // Create white wireframe border
        const wireframeGeometry = new THREE.EdgesGeometry(previewMesh.geometry);
        const wireframeMaterial = new THREE.LineBasicMaterial({
          color: 0xffffff,
          linewidth: 2,
          transparent: true,
          opacity: 0.8,
          depthTest: true,
          depthWrite: false,
        });
        const wireframe = new THREE.LineSegments(wireframeGeometry, wireframeMaterial);
        wireframe.position.copy(previewMesh.position);
        wireframe.rotation.copy(previewMesh.rotation);
        wireframe.scale.copy(previewMesh.scale);
        wireframe.renderOrder = 1001; // Render wireframe on top of preview mesh

        // Get material from previewMesh (it's already set in the if/else blocks above)
        // Handle both single material and material array cases
        const meshMaterial = previewMesh.material;
        const singleMaterial = Array.isArray(meshMaterial) ? meshMaterial[0] : meshMaterial;
        if (singleMaterial) {
          previewMeshesRef.current.set(region.type, { mesh: previewMesh, material: singleMaterial, wireframe });
          console.log('[BooleanPreview] Added to ref, current size:', previewMeshesRef.current.size);
        } else {
          console.error('[BooleanPreview] No material found on preview mesh');
        }

        // Notify parent about the preview mesh
        if (onPreviewMeshCreated) {
          onPreviewMeshCreated(region.type, previewMesh);
        }
      } else {
        console.warn('[BooleanPreview] No preview mesh created for region:', region.type, 'selectedObjects:', selectedObjects.length);
      }
    });

    console.log('[BooleanPreview] Total preview meshes created:', previewMeshesRef.current.size);

    return () => {
      // Cleanup on unmount
      previewMeshesRef.current.forEach((preview) => {
        preview.mesh.geometry.dispose();
        preview.wireframe.geometry.dispose();
        if (Array.isArray(preview.material)) {
          preview.material.forEach((m) => m.dispose());
        } else {
          preview.material.dispose();
        }
        if (preview.wireframe.material instanceof THREE.Material) {
          preview.wireframe.material.dispose();
        }
      });
      previewMeshesRef.current.clear();
    };
  }, [regions, selectedObjects, onPreviewMeshCreated]);

  // Update opacity, color, and scale based on hover and selected state
  React.useEffect(() => {
    previewMeshesRef.current.forEach((preview, regionType) => {
      const isHovered = hoveredRegion === regionType;
      const isSelected = selectedRegions.has(regionType);
      const material = preview.material;

      if (material instanceof THREE.MeshStandardMaterial) {
        // Selected regions are bright cyan, non-selected are maroon
        if (isSelected) {
          material.color.setHex(0x4eedc3); // Bright cyan for selected
          material.opacity = 0.6;
        } else {
          material.color.setHex(0x5c2b34); // Dark maroon for non-selected
          material.opacity = 0.4;
        }
      }

      // No scaling - keep consistent size
    });
  }, [hoveredRegion, selectedRegions]);

  if (regions.length === 0) {
    return null;
  }

  return (
    <group>
      {Array.from(previewMeshesRef.current.values()).map((preview, index) => (
        <group key={`preview-group-${preview.mesh.userData.regionType}-${index}`}>
          <primitive object={preview.mesh} />
          <primitive object={preview.wireframe} />
        </group>
      ))}

      {/* Tooltip for hovered region */}
      {hoveredRegion && (() => {
        const hoveredRegionData = regions.find((r) => r.type === hoveredRegion);
        const position = hoveredRegionData?.bounds.getCenter(new THREE.Vector3());
        if (!position) {return null;}
        return (
          <Html
            position={position}
            center
            style={{
              pointerEvents: 'none',
              userSelect: 'none',
            }}
          >
          <div
            style={{
              background: 'rgba(0, 0, 0, 0.8)',
              color: 'white',
              padding: '8px 12px',
              borderRadius: '4px',
              fontSize: '12px',
              whiteSpace: 'nowrap',
              fontFamily: 'system-ui, sans-serif',
            }}
          >
            {hoveredRegionData?.label || ''}
          </div>
        </Html>
        );
      })()}
    </group>
  );
};
