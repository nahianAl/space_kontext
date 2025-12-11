/**
 * Settings panel component for 3D view
 * Includes sun path controls and other 3D-specific settings
 * Includes DimensionDisplay at the bottom matching the 2D editor functionality
 */
'use client';

import React, { useState } from 'react';
import { DimensionDisplay } from '@/features/floorplan-2d/components/DimensionDisplay';
import { Slider } from '@/shared/components/ui/slider';
import { useSunPathStore } from '../store/sunPathStore';
import { getSunriseSunset } from '../services/sunLightService';
import { MaterialsBrowser } from './MaterialsBrowser';
import type { Material } from './MaterialCard';
import { useCADToolsStore } from '../store/cadToolsStore';
import { useThreeSceneStore } from '../store/threeSceneStore';
import { useWallGraphStoreContext } from '@/features/floorplan-2d/context/WallGraphStoreContext';
import { createPBRMaterial } from '../utils/materialLoader';
import { applyMaterialToWall } from '../utils/faceMaterialApplicator';
import { applyMaterialToFacesIncremental } from '../utils/faceMaterialManager';

// Default coordinates: Denver, Colorado
const DEFAULT_LATITUDE = 39.72656773584472;
const DEFAULT_LONGITUDE = -104.65310681881742;

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

/**
 * Format time of day (0-1) to a readable time string
 */
function formatTimeOfDay(timeOfDay: number, month: number): string {
  const year = new Date().getFullYear();
  const date = new Date(year, month - 1, 15, 12, 0, 0);
  const { sunrise, sunset } = getSunriseSunset(date, DEFAULT_LATITUDE, DEFAULT_LONGITUDE);
  
  const timeRange = sunset.getTime() - sunrise.getTime();
  const targetTime = sunrise.getTime() + timeRange * timeOfDay;
  const targetDate = new Date(targetTime);
  
  const hours = targetDate.getHours();
  const minutes = targetDate.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  const displayMinutes = minutes.toString().padStart(2, '0');
  
  return `${displayHours}:${displayMinutes} ${ampm}`;
}

export const SettingsSidebar = () => {
  const month = useSunPathStore((state) => state.month);
  const timeOfDay = useSunPathStore((state) => state.timeOfDay);
  const setMonth = useSunPathStore((state) => state.setMonth);
  const setTimeOfDay = useSunPathStore((state) => state.setTimeOfDay);

  // CAD object selection
  const applyMaterialToSelected = useCADToolsStore((state) => state.applyMaterialToSelected);
  const selectedObjectIds = useCADToolsStore((state) => state.selectedObjectIds);

  // Wall/face selection
  const useWallGraphStore = useWallGraphStoreContext();
  const selectedWallIds = useWallGraphStore((state) => state.selectedWallIds);
  const selectedFaces = useWallGraphStore((state) => state.selectedFaces);
  const meshes = useThreeSceneStore((state) => state.meshes);

  const [isMaterialsOpen, setIsMaterialsOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);

  const handleMaterialSelect = async (material: Material) => {
    setSelectedMaterial(material);

    // Count total selections
    const cadObjectCount = selectedObjectIds.length;
    const wallCount = selectedWallIds.length;
    const faceCount = selectedFaces.length;
    const totalSelections = cadObjectCount + wallCount + faceCount;

    if (totalSelections === 0) {
      console.warn('No objects, walls, or faces selected. Please select something first to apply material.');
      return;
    }

    console.log(`Applying material "${material.name}" to:`, {
      cadObjects: cadObjectCount,
      walls: wallCount,
      faces: faceCount,
    });

    try {
      // Create the PBR material
      const pbrMaterial = await createPBRMaterial(material);
      console.log('Created PBR material:', pbrMaterial);

      // Debug: Log all available meshes
      console.log('Available meshes:', meshes.length, meshes.map(m => ({
        uuid: m.uuid,
        wallId: m.userData?.wallId,
        userData: m.userData
      })));

      // Apply to CAD objects
      if (cadObjectCount > 0) {
        await applyMaterialToSelected({
          id: material.id,
          diffuse: material.diffuse,
          normal: material.normal,
          rough: material.rough,
          ao: material.ao,
        });
      }

      // Apply to walls (entire walls)
      if (wallCount > 0) {
        console.log('Attempting to apply to walls:', selectedWallIds);
        selectedWallIds.forEach((wallId) => {
          const mesh = meshes.find((m) => m.userData?.wallId === wallId);
          console.log(`Looking for wall ${wallId}, found:`, mesh);
          if (mesh) {
            applyMaterialToWall(mesh, pbrMaterial.clone());
            console.log(`✓ Applied material to wall: ${wallId}`);
          } else {
            console.warn(`✗ Could not find mesh for wall: ${wallId}`);
          }
        });
      }

      // Apply to specific faces
      if (faceCount > 0) {
        console.log('Attempting to apply to faces:', selectedFaces);

        // Group faces by wallId
        const facesByWall = new Map<string, typeof selectedFaces>();
        selectedFaces.forEach((face) => {
          if (!facesByWall.has(face.wallId)) {
            facesByWall.set(face.wallId, []);
          }
          facesByWall.get(face.wallId)!.push(face);
        });

        console.log('Faces grouped by wall:', Array.from(facesByWall.entries()));

        // Apply material to each wall's selected faces (incrementally)
        facesByWall.forEach((faces, wallId) => {
          const mesh = meshes.find((m) => m.userData?.wallId === wallId);
          console.log(`Looking for wall ${wallId} for face materials, found:`, mesh);
          if (mesh) {
            console.log(`Applying to ${faces.length} faces on mesh:`, {
              geometry: mesh.geometry,
              currentMaterial: mesh.material,
              faces: faces
            });
            applyMaterialToFacesIncremental(mesh, faces, pbrMaterial.clone());
            console.log(`✓ Applied material to ${faces.length} face(s) on wall: ${wallId}`);
          } else {
            console.warn(`✗ Could not find mesh for wall: ${wallId}`);
          }
        });
      }

      console.log('✓ Material application complete!');
    } catch (error) {
      console.error('✗ Failed to apply material:', error);
    }
  };

  const handleMonthChange = React.useCallback(
    (value: number[]) => {
      if (value[0] !== undefined) {
        setMonth(value[0]);
      }
    },
    [setMonth]
  );

  const handleTimeOfDayChange = React.useCallback(
    (value: number[]) => {
      if (value[0] !== undefined) {
        setTimeOfDay(value[0]);
      }
    },
    [setTimeOfDay]
  );

  return (
    <div className="w-64 bg-black text-white py-4 space-y-2 flex flex-col h-full relative">
      <div className="flex-1 overflow-y-auto px-4 space-y-6">
        {/* Sun Path Section */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-white uppercase tracking-wide">
            Sun Path
          </h3>
          
          {/* Month Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs text-gray-400">Month</label>
              <span className="text-sm text-white font-medium">
                {MONTH_NAMES[month - 1]}
              </span>
            </div>
            <Slider
              value={[month]}
              onValueChange={handleMonthChange}
              min={1}
              max={12}
              step={1}
              className="w-full"
            />
          </div>

          {/* Time of Day Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs text-gray-400">Time</label>
              <span className="text-sm text-white font-medium">
                {formatTimeOfDay(timeOfDay, month)}
              </span>
            </div>
            <Slider
              value={[timeOfDay]}
              onValueChange={handleTimeOfDayChange}
              min={0}
              max={1}
              step={0.01}
              className="w-full"
            />
          </div>
        </div>

        {/* Materials Section */}
        <div className="space-y-4 border-t border-gray-800 pt-4">
          <div>
            <button
              onClick={() => setIsMaterialsOpen(!isMaterialsOpen)}
              className="w-full flex items-center justify-between text-sm font-semibold text-white uppercase tracking-wide hover:text-[#0f7787] transition-colors"
            >
              <span>Materials</span>
              <svg
                className={`w-4 h-4 transition-transform ${isMaterialsOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {/* Selection indicator */}
            {(() => {
              const cadObjectCount = selectedObjectIds.length;
              const wallCount = selectedWallIds.length;
              const faceCount = selectedFaces.length;
              const totalSelections = cadObjectCount + wallCount + faceCount;

              if (totalSelections > 0) {
                const parts: string[] = [];
                if (cadObjectCount > 0) {parts.push(`${cadObjectCount} object${cadObjectCount !== 1 ? 's' : ''}`);}
                if (wallCount > 0) {parts.push(`${wallCount} wall${wallCount !== 1 ? 's' : ''}`);}
                if (faceCount > 0) {parts.push(`${faceCount} face${faceCount !== 1 ? 's' : ''}`);}

                return (
                  <div className="mt-2 text-xs text-gray-400">
                    {parts.join(', ')} selected
                  </div>
                );
              }

              if (isMaterialsOpen) {
                return (
                  <div className="mt-2 text-xs text-yellow-500">
                    Select objects, walls, or faces to apply materials
                  </div>
                );
              }

              return null;
            })()}
          </div>

          {isMaterialsOpen && (
            <MaterialsBrowser
              onMaterialSelect={handleMaterialSelect}
              {...(selectedMaterial?.id ? { selectedMaterialId: selectedMaterial.id } : {})}
            />
          )}
        </div>

        {/* Sketchfab Section */}
        <div className="space-y-4 border-t border-gray-800 pt-4">
          <div>
            <button
              onClick={() => {
                // Trigger the Sketchfab panel in Floorplan3DView
                if ((window as any).__openSketchfabPanel) {
                  (window as any).__openSketchfabPanel();
                }
              }}
              className="w-full flex items-center justify-between text-sm font-semibold text-white uppercase tracking-wide hover:text-[#0f7787] transition-colors"
            >
              <span>Asset Vault</span>
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
            <div className="mt-2 text-xs text-gray-400">
              Search and preview downloadable 3D models
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0">
        <DimensionDisplay />
      </div>
    </div>
  );
};

