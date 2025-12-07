/**
 * Hook to integrate zone drawing from shapesStore with floorStore
 * Sets up callback to commit finished zones to floorStore
 */
'use client';

import { useEffect } from 'react';
import { useShapesStore } from '../store/shapesStore';
import { useFloorStoreContext } from '../context/FloorStoreContext';
import type { Zone } from '../types/floor';

// Generate unique ID for zones
function generateZoneId(): string {
  return `zone-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export const useZoneIntegration = () => {
  const useFloorStore = useFloorStoreContext();
  const addZone = useFloorStore((state) => state.addZone);
  const defaultZoneFill = useFloorStore((state) => state.defaultZoneFill);
  const defaultZoneFillOpacity = useFloorStore((state) => state.defaultZoneFillOpacity);
  const defaultZoneMaterial = useFloorStore((state) => state.defaultZoneMaterial);
  const selectZone = useFloorStore((state) => state.selectZone);
  const clearZoneSelection = useFloorStore((state) => state.clearZoneSelection);
  const setOnZoneFinished = useShapesStore((state) => state.setOnZoneFinished);
  const activeShapeTool = useShapesStore((state) => state.activeShapeTool);
  const isShapeDrawing = useShapesStore((state) => state.isShapeDrawing);
  const getActiveLayerId = () => {
    const { useLayerStore } = require('../store/layerStore');
    return useLayerStore.getState().activeLayerId || 'default';
  };

  // Clear zone selection only when starting to draw a new zone
  useEffect(() => {
    if (activeShapeTool === 'zone' && isShapeDrawing) {
      clearZoneSelection();
    }
  }, [activeShapeTool, isShapeDrawing, clearZoneSelection]);

  useEffect(() => {
    // Set up callback to handle finished zones
    const handleZoneFinished = (points: any[]) => {
      if (points.length < 3) {
        return;
      }

      const zone: Zone = {
        id: generateZoneId(),
        points,
        fill: defaultZoneFill,
        fillOpacity: defaultZoneFillOpacity,
        ...(defaultZoneMaterial && { material: defaultZoneMaterial }),
        label: '',
        layerId: getActiveLayerId()
      };

      addZone(zone);
      selectZone(zone.id); // Auto-select the new zone
    };

    setOnZoneFinished(handleZoneFinished);

    return () => {
      setOnZoneFinished(null);
    };
  }, [addZone, defaultZoneFill, defaultZoneFillOpacity, defaultZoneMaterial, selectZone, setOnZoneFinished]);
};
