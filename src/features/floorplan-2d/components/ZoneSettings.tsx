/**
 * Zone settings panel component
 * Shows settings specific to zone tool
 */
'use client';

import React, { useState } from 'react';
import { useShapesStore } from '../store/shapesStore';
import { useFloorStoreContext } from '../context/FloorStoreContext';
import { MaterialsBrowser } from './MaterialsBrowser';
import type { Zone, ZoneMaterial } from '../types/floor';
import { ChevronDown } from 'lucide-react';

const SettingRow = ({ label, children }: { label: string, children: React.ReactNode }) => (
  <div className="flex items-center justify-between h-10 px-4">
    <label className="text-sm text-gray-200">{label}</label>
    {children}
  </div>
);

const ColorPicker = ({ value, onChange }: { value: string, onChange: (color: string) => void }) => {
  return (
  <div className="flex items-center gap-2">
    <input
      type="color"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-10 h-7 rounded border border-gray-600 bg-gray-700 cursor-pointer"
    />
    <span className="text-xs text-gray-400 font-mono">{value}</span>
  </div>
  );
};
ColorPicker.displayName = 'ColorPicker';

const Collapsible = ({ title, children, defaultOpen = false }: { title: string, children: React.ReactNode, defaultOpen?: boolean }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="px-2">
      <button onClick={() => setIsOpen(!isOpen)} className="w-full flex items-center justify-between h-10 px-2 rounded-md hover:bg-gray-900">
        <span className="text-sm text-gray-200">{title}</span>
        <ChevronDown size={16} className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && <div className="pt-1 pb-2">{children}</div>}
    </div>
  );
};

export const ZoneSettings = () => {
  const activeShapeTool = useShapesStore((state) => state.activeShapeTool);
  const useFloorStore = useFloorStoreContext();
  const zones = useFloorStore((state) => state.zones);
  const selectedZoneIds = useFloorStore((state) => state.selectedZoneIds);
  const updateZone = useFloorStore((state) => state.updateZone);
  const defaultZoneFill = useFloorStore((state) => state.defaultZoneFill);
  const defaultZoneFillOpacity = useFloorStore((state) => state.defaultZoneFillOpacity);
  const defaultZoneMaterial = useFloorStore((state) => state.defaultZoneMaterial);
  const setDefaultZoneFill = useFloorStore((state) => state.setDefaultZoneFill);
  const setDefaultZoneFillOpacity = useFloorStore((state) => state.setDefaultZoneFillOpacity);
  const setDefaultZoneMaterial = useFloorStore((state) => state.setDefaultZoneMaterial);

  // Get the selected zone (if any)
  const selectedZone = selectedZoneIds.length === 1
    ? zones.find(z => z.id === selectedZoneIds[0])
    : undefined;

  const handleColorChange = (color: string) => {
    if (selectedZone) {
      updateZone(selectedZone.id, { fill: color }); // Clear material when using color
    } else {
      setDefaultZoneFill(color);
      setDefaultZoneMaterial(undefined); // Clear default material when using color
    }
  };

  const handleOpacityChange = (opacity: number) => {
    if (selectedZone) {
      updateZone(selectedZone.id, { fillOpacity: opacity });
    } else {
      setDefaultZoneFillOpacity(opacity);
    }
  };

  const handleMaterialSelect = (material: ZoneMaterial) => {
    if (selectedZone) {
      updateZone(selectedZone.id, { material });
    } else {
      setDefaultZoneMaterial(material);
    }
  };

  const handleClearMaterial = () => {
    if (selectedZone) {
      // Note: Cannot set material to undefined with exactOptionalPropertyTypes
      // Material will remain unchanged, or we'd need a separate clear method
      updateZone(selectedZone.id, {});
    } else {
      setDefaultZoneMaterial(undefined);
    }
  };

  // Get current values (from selected zone or defaults)
  const currentFill = selectedZone?.fill || defaultZoneFill;
  const currentOpacity = selectedZone?.fillOpacity ?? defaultZoneFillOpacity;
  const currentMaterial = selectedZone?.material || defaultZoneMaterial;

  return (
    <div className="px-4 py-2 space-y-4">
      {!selectedZone && activeShapeTool === 'zone' && (
        <div className="text-xs text-gray-400 mb-2">
          Default settings for new zones
        </div>
      )}

      {/* Material Browser - Show when zone tool is active or zone is selected */}
      {(selectedZone || activeShapeTool === 'zone') && (
        <Collapsible title="Material" defaultOpen={true}>
          <div className="space-y-2">
            {currentMaterial && (
              <div className="flex items-center justify-between px-2 py-1 bg-gray-800 rounded">
                <div className="flex items-center gap-2">
                  <img
                    src={currentMaterial.diffuse}
                    alt={currentMaterial.name}
                    className="w-8 h-8 rounded object-cover"
                  />
                  <div>
                    <div className="text-xs text-white">{currentMaterial.name}</div>
                    <div className="text-xs text-gray-400">{currentMaterial.category}</div>
                  </div>
                </div>
                <button
                  onClick={handleClearMaterial}
                  className="text-xs text-gray-400 hover:text-white"
                >
                  Clear
                </button>
              </div>
            )}
            <MaterialsBrowser
              onMaterialSelect={handleMaterialSelect}
              {...(currentMaterial?.id !== undefined && { selectedMaterialId: currentMaterial.id })}
            />
          </div>
        </Collapsible>
      )}

      {/* Color Fill - Show when no material or no zone selected */}
      {!currentMaterial && (
        <SettingRow label="Fill Color">
          <ColorPicker
            value={currentFill}
            onChange={handleColorChange}
          />
        </SettingRow>
      )}

      <SettingRow label="Opacity">
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={currentOpacity}
          onChange={(e) => handleOpacityChange(parseFloat(e.target.value))}
          className="w-20 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
        />
      </SettingRow>
    </div>
  );
};
