/**
 * Wall settings panel component for configuring selected walls
 * Provides controls for wall thickness, height, fill color, and hatch patterns
 * Updates selected wall properties or sets defaults for new walls
 */
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useWallGraphStoreContext } from '../context/WallGraphStoreContext';
import { HatchPatternSelector } from './HatchPatternSelector';
import {
  parseImperialInput,
  parseMetricInput,
  formatMetersAsImperial,
  formatMetersAsMetric,
} from '@/lib/units/unitsSystem';

// Reusable sub-components (same as OpeningSettings)
const SettingsSection = ({ title, children }: { title: string, children: React.ReactNode }) => (
  <div>
    {title && <h3 className="text-xs font-bold uppercase text-gray-400 mb-2 px-4">{title}</h3>}
    {children}
  </div>
);

const SettingRow = ({ label, children }: { label: string, children: React.ReactNode }) => (
  <div className="flex items-center justify-between h-10 px-4">
    <label className="text-sm text-gray-200">{label}</label>
    {children}
  </div>
);

const PlaceholderRow = ({ icon, label }: { icon: React.ReactNode, label: string }) => (
  <div className="flex items-center justify-between h-10 px-4 text-gray-500">
    <div className="flex items-center space-x-2">
      {icon}
      <span className="text-sm">{label}</span>
    </div>
    <span className="text-xs">(coming soon)</span>
  </div>
);

const ColorPicker = ({ value, onChange }: { value: string, onChange: (value: string) => void }) => (
  <div className="flex items-center space-x-2">
    <div 
      className="h-8 w-16 rounded overflow-hidden relative"
      style={{ border: '1px solid #778f8e' }}
    >
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="absolute inset-0 w-full h-full cursor-pointer border-0 outline-none opacity-0"
        style={{ 
          WebkitAppearance: 'none',
          MozAppearance: 'none',
          appearance: 'none',
          padding: '0',
          margin: '0'
        }}
      />
      <div 
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ backgroundColor: value }}
      />
    </div>
  </div>
);

// Dimension input component matching hatch/fill button style
const DimensionInput = ({
  value,
  onChange,
  unitSystem,
}: {
  value: number; // in meters
  onChange: (meters: number) => void;
  unitSystem: 'imperial' | 'metric';
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState('');

  // Format meters for display
  const formatValue = useCallback((meters: number): string => {
    return unitSystem === 'imperial'
      ? formatMetersAsImperial(meters)
      : formatMetersAsMetric(meters);
  }, [unitSystem]);

  // Initialize input value when editing starts
  useEffect(() => {
    if (isEditing) {
      // For editing, show formatted value that user can edit
      setInputValue(formatValue(value));
    }
  }, [isEditing, value, unitSystem, formatValue]);

  const handleBlur = () => {
    setIsEditing(false);
    // Parse and convert input to meters
    const parsed = unitSystem === 'imperial'
      ? parseImperialInput(inputValue)
      : parseMetricInput(inputValue);
    
    if (parsed !== null && parsed > 0) {
      onChange(parsed);
    }
    // Reset input value
    setInputValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleBlur();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setInputValue('');
    }
  };

  return (
    <div className="h-8 w-16 rounded relative" style={{ border: '1px solid #778f8e' }}>
      {isEditing ? (
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          autoFocus
          className="w-full h-full px-1 text-xs bg-black text-gray-200 border-0 outline-none rounded"
          placeholder={unitSystem === 'imperial' ? "6\"" : "15 cm"}
        />
      ) : (
        <button
          onClick={() => setIsEditing(true)}
          className="w-full h-full px-1 text-xs text-gray-200 bg-black hover:bg-gray-900 rounded flex items-center justify-center"
        >
          {formatValue(value)}
        </button>
      )}
    </div>
  );
};

export const WallSettings = () => {
  const useWallGraphStore = useWallGraphStoreContext();
  const selectedWallId = useWallGraphStore((state) => state.selectedWallId);
  const isToolActive = useWallGraphStore((state) => state.isToolActive);
  const graph = useWallGraphStore((state) => state.graph);
  const wallFill = useWallGraphStore((state) => state.wallFill);
  const unitSystem = useWallGraphStore((state) => state.unitSystem);
  
  // Get current thickness and height (in meters)
  const wallThickness = useWallGraphStore((state) => state.wallThickness);
  const wallHeight = useWallGraphStore((state) => state.wallHeight);
  
  // Get the selected wall
  const selectedWall = selectedWallId ? graph.edges[selectedWallId] : null;
  
  // Determine if we're in "default settings" mode (tool active, no wall selected)
  // or "edit wall" mode (wall selected)
  const isDefaultMode = isToolActive && !selectedWall;
  
  // For selected walls, use wall's thickness/height, otherwise use defaults
  const currentThickness = selectedWall ? (selectedWall.thickness || wallThickness) : wallThickness;
  const currentHeight = wallHeight; // Height is global, not per-wall
  
  const currentFill = selectedWall ? (selectedWall.fill || '#2c2a3b') : wallFill;
  const wallHatchPattern = useWallGraphStore((state) => state.wallHatchPattern);
  const currentHatchPattern = selectedWall ? (selectedWall.hatchPattern || null) : wallHatchPattern;
  
  // Actions for default settings
  const setWallFill = useWallGraphStore((state) => state.setWallFill);
  const setWallHatchPattern = useWallGraphStore((state) => state.setWallHatchPattern);
  const setWallThickness = useWallGraphStore((state) => state.setWallThickness);
  const setWallHeight = useWallGraphStore((state) => state.setWallHeight);
  
  // Actions for editing existing walls
  const updateWallFill = useWallGraphStore((state) => state.updateWallFill);
  const updateWallHatchPattern = useWallGraphStore((state) => state.updateWallHatchPattern);
  const updateWallThickness = useWallGraphStore((state) => state.updateWallThickness);

  const handleFillChange = (newColor: string) => {
    if (isDefaultMode) {
      // Update default fill for new walls
      setWallFill(newColor);
    } else if (selectedWallId) {
      // Update selected wall's fill color
      updateWallFill(selectedWallId, newColor);
    }
  };
  
  const handleHatchPatternChange = (pattern: string | null) => {
    if (isDefaultMode) {
      // Update default hatch pattern for new walls
      setWallHatchPattern(pattern);
    } else if (selectedWallId) {
      // Update selected wall's hatch pattern
      updateWallHatchPattern(selectedWallId, pattern);
    }
  };

  const handleThicknessChange = (thicknessMeters: number) => {
    if (isDefaultMode) {
      // Update default thickness for new walls
      setWallThickness(thicknessMeters);
    } else if (selectedWallId) {
      // Update selected wall's thickness
      updateWallThickness(selectedWallId, thicknessMeters);
    }
  };

  const handleHeightChange = (heightMeters: number) => {
    // Height is global, always update default
    setWallHeight(heightMeters);
  };
  
  return (
    <>
      <SettingsSection title="">
        <SettingRow label="Thickness">
          <DimensionInput
            value={currentThickness}
            onChange={handleThicknessChange}
            unitSystem={unitSystem}
          />
        </SettingRow>
        <SettingRow label="Height">
          <DimensionInput
            value={currentHeight}
            onChange={handleHeightChange}
            unitSystem={unitSystem}
          />
        </SettingRow>
        <SettingRow label="Fill">
          <ColorPicker value={currentFill} onChange={handleFillChange} />
        </SettingRow>
        <SettingRow label="Hatch">
          <HatchPatternSelector value={currentHatchPattern} onChange={handleHatchPatternChange} />
        </SettingRow>
      </SettingsSection>
      
      {isDefaultMode && (
        <div className="px-4 text-xs text-gray-500 mt-4">
          These settings will apply to all new walls you draw.
        </div>
      )}
    </>
  );
};

