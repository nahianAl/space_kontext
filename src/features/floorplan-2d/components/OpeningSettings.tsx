/**
 * Opening settings panel component for configuring doors and windows
 * Provides controls for opening type, dimensions, orientation, alignment, and properties
 * Updates selected openings or sets defaults for new openings
 */
'use client';

import React, { useMemo, useState } from 'react';
import { useWallGraphStoreContext } from '../context/WallGraphStoreContext';
import { Library, ArrowLeft, ArrowRight, ArrowUp, ArrowDown } from 'lucide-react';
import { CadBlocksLibrary } from './CadBlocksLibrary';

// Tooltip component for showing labels on hover
const Tooltip = ({ label, children }: { label: string, children: React.ReactNode }) => {
  const [visible, setVisible] = useState(false);
  return (
    <div 
      className="relative"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2 py-1 bg-gray-900 text-white text-xs rounded-md shadow-lg z-10 whitespace-nowrap">
          {label}
        </div>
      )}
    </div>
  );
};

// SvgIcon component for displaying SVG icons
const SvgIcon = ({ 
  src, 
  isActive, 
  size = 'normal',
  reducedBrightness = false,
  thinnerStroke = false
}: { 
  src: string, 
  isActive: boolean, 
  size?: 'small' | 'normal' | 'large' | 'xlarge',
  reducedBrightness?: boolean,
  thinnerStroke?: boolean
}) => {
  const iconSize = size === 'small' ? '20px' : size === 'large' ? '28px' : size === 'xlarge' ? '32px' : '24px';
  
  let filter: string;
  if (reducedBrightness) {
    filter = isActive 
      ? 'invert(1) brightness(1.5) contrast(1.2)' 
      : 'invert(1) brightness(1.2) contrast(1.0)';
  } else {
    filter = isActive 
      ? 'invert(1) brightness(3.0) contrast(1.4)' 
      : 'invert(1) brightness(2.0) contrast(1.2)';
  }
  
  // Reduce stroke thickness by lowering contrast
  if (thinnerStroke) {
    filter += ' contrast(0.7)';
  }
  
  return (
    <img 
      src={src} 
      alt="element icon" 
      className="w-6 h-6"
      style={{ 
        filter,
        opacity: isActive ? 1 : 0.7,
        width: iconSize,
        height: iconSize
      }}
    />
  );
};

// Reusable sub-components from SettingsPanel could be moved to a shared file later
const SettingsSection = ({ title, children, className, titleSpacing = 'mb-2' }: { title?: string; children: React.ReactNode; className?: string; titleSpacing?: string }) => (
  <div className={className}>
    {title ? (
      <h3 className={`text-xs font-bold text-gray-400 px-4 ${titleSpacing} ${title === title.toUpperCase() ? 'uppercase' : 'normal-case'}`}>{title}</h3>
    ) : null}
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

const SegmentedControl = ({ value, onValueChange, options }: { value: string, onValueChange: (value: any) => void, options: {label: string, value: string}[] }) => (
  <div className="flex bg-gray-700 rounded-md p-0.5">
    {options.map(opt => (
      <button
        key={opt.value}
        onClick={() => onValueChange(opt.value)}
        className={`flex-1 text-sm py-1 rounded-sm transition-colors ${value === opt.value ? 'bg-[#0f7787]' : 'hover:bg-gray-600'}`}
      >
        {opt.label}
      </button>
    ))}
  </div>
);

const NumberInput = ({ value, onChange, unit }: { value: number; onChange: (value: number) => void; unit: string }) => (
  <div className="relative flex items-center bg-gray-700 rounded-md border border-gray-600">
    <input
      type="number"
      value={value}
      onChange={(e) => {
        const next = parseFloat(e.target.value);
        if (!Number.isNaN(next)) {
          onChange(next);
        }
      }}
      className="w-20 bg-transparent text-white text-left pl-2 pr-6 py-0.5 border-none outline-none text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
    />
    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-400 pointer-events-none">
      {unit}
    </span>
  </div>
);

export const OpeningSettings = () => {
  const useWallGraphStore = useWallGraphStoreContext();
  const activeOpeningType = useWallGraphStore((state) => state.activeOpeningType);
  const setActiveOpeningType = useWallGraphStore((state) => state.setActiveOpeningType);
  const sillHeight = useWallGraphStore((state) => state.sillHeight);
  const setSillHeight = useWallGraphStore((state) => state.setSillHeight);
  const openingWidth = useWallGraphStore((state) => state.openingWidth);
  const setOpeningWidth = useWallGraphStore((state) => state.setOpeningWidth);
  const openingHeight = useWallGraphStore((state) => state.openingHeight);
  const setOpeningHeight = useWallGraphStore((state) => state.setOpeningHeight);
  const unitSystem = useWallGraphStore((state) => state.unitSystem);
  const doorOrientation = useWallGraphStore((state) => state.doorOrientation);
  const setDoorOrientation = useWallGraphStore((state) => state.setDoorOrientation);
  const doorAlignment = useWallGraphStore((state) => state.doorAlignment);
  const setDoorAlignment = useWallGraphStore((state) => state.setDoorAlignment);
  const windowAlignment = useWallGraphStore((state) => state.windowAlignment);
  const setWindowAlignment = useWallGraphStore((state) => state.setWindowAlignment);
  const selectedOpeningIds = useWallGraphStore((state) => state.selectedOpeningIds ?? []);
  const selectedOpeningId = useWallGraphStore((state) => state.selectedOpeningId);
  const graph = useWallGraphStore((state) => state.graph);
  const updateSelectedOpeningsDimensions = useWallGraphStore((state) => state.updateSelectedOpeningsDimensions);
  const updateSelectedOpeningSillHeight = useWallGraphStore((state) => state.updateSelectedOpeningSillHeight);
  const deleteSelectedOpenings = useWallGraphStore((state) => state.deleteSelectedOpenings);

  // CAD Blocks Library state
  const [selectedLibraryCategory, setSelectedLibraryCategory] = useState<string | null>(null);
  const [selectedLibrarySubcategory, setSelectedLibrarySubcategory] = useState<string | null>(null);

  // Determine unit label based on unit system
  const unitLabel = unitSystem === 'imperial' ? 'in' : 'cm';

  const selectedOpening = useMemo(() => {
    if (!selectedOpeningId) {
      return null;
    }
    for (const edge of Object.values(graph.edges)) {
      const openings = edge.openings || [];
      const hit = openings.find(opening => opening.id === selectedOpeningId);
      if (hit) {
        return hit;
      }
    }
    return null;
  }, [graph.edges, selectedOpeningId]);

  const selectedUnitSystem = selectedOpening?.unitSystem ?? unitSystem;
  const isDoorSelected = selectedOpening?.type === 'door';
  const isWindowSelected = selectedOpening?.type === 'window';

  const selectedWidth = selectedOpening
    ? selectedOpening.userWidth ?? (selectedUnitSystem === 'imperial' ? (selectedOpening.width * 12) / 100 : selectedOpening.width)
    : openingWidth;

  const selectedHeight = selectedOpening
    ? selectedOpening.userHeight ?? (() => {
        if (selectedOpening.height === null || selectedOpening.height === undefined) {
          return openingHeight;
        }
        return selectedUnitSystem === 'imperial'
          ? selectedOpening.height / 0.0254
          : selectedOpening.height / 0.01;
      })()
    : openingHeight;

  const selectedSillHeight = selectedOpening && selectedOpening.type === 'window'
    ? selectedOpening.userSillHeight ?? (selectedUnitSystem === 'imperial'
        ? (selectedOpening.sillHeight ?? 0) / 25.4
        : (selectedOpening.sillHeight ?? 0) / 10)
    : sillHeight;

  const currentOpeningType = selectedOpening?.type ?? activeOpeningType ?? null;

  const currentOrientation = selectedOpening && selectedOpening.type === 'door'
    ? selectedOpening.orientation ?? doorOrientation
    : doorOrientation;

  const currentAlignment = selectedOpening && selectedOpening.type === 'door'
    ? selectedOpening.alignment ?? doorAlignment
    : selectedOpening && selectedOpening.type === 'window'
      ? selectedOpening.alignment ?? windowAlignment
      : currentOpeningType === 'window'
        ? windowAlignment
        : doorAlignment;

  const handleWidthChange = (value: number) => {
    if (selectedOpening) {
      updateSelectedOpeningsDimensions(value, undefined);
    }
    setOpeningWidth(value);
  };

  const handleHeightChange = (value: number) => {
    if (selectedOpening) {
      updateSelectedOpeningsDimensions(undefined, value);
    }
    setOpeningHeight(value);
  };

  const handleSillHeightChange = (value: number) => {
    if (selectedOpening && selectedOpening.type === 'window') {
      updateSelectedOpeningSillHeight(value);
    }
    setSillHeight(value);
  };

  const orientationOptions: { value: 'left-in' | 'left-out' | 'right-in' | 'right-out'; icon: React.ReactNode; label: string }[] = [
    { value: 'left-in', icon: <ArrowLeft size={16} />, label: 'Left In' },
    { value: 'right-in', icon: <ArrowRight size={16} />, label: 'Right In' },
    { value: 'left-out', icon: <ArrowUp size={16} />, label: 'Left Out' },
    { value: 'right-out', icon: <ArrowDown size={16} />, label: 'Right Out' }
  ];

  const alignmentOptions: { value: 'center' | 'inner' | 'outer'; icon: string; label: string }[] = [
    { value: 'outer', icon: '/alignment_L.svg', label: 'Outer' },
    { value: 'center', icon: '/alignment_C.svg', label: 'Center' },
    { value: 'inner', icon: '/alignment_R.svg', label: 'Inner' }
  ];

  const formatDisplayValue = (value: number) => {
    if (!Number.isFinite(value)) {
      return 0;
    }
    return Math.round(value * 100) / 100;
  };

  // Element buttons configuration
  const elementButtons = [
    { id: 1, label: 'Door', value: 'door' as const, icon: '/elmnts_door.svg', reducedBrightness: false, thinnerStroke: false, category: 'door', subcategory: 'door' },
    { id: 2, label: 'Window', value: 'window' as const, icon: '/elmnts_wind.svg', reducedBrightness: false, thinnerStroke: false, category: 'window', subcategory: 'window' },
    { id: 3, label: 'Couches and Chairs', value: 'furniture-seating' as const, icon: '/elmnt_couch.svg', reducedBrightness: true, thinnerStroke: true, category: 'furniture', subcategory: 'seating' },
    { id: 4, label: 'Table', value: 'furniture-tables' as const, icon: '/elmnts_table.svg', reducedBrightness: false, thinnerStroke: false, category: 'furniture', subcategory: 'tables' },
    { id: 5, label: 'Bed', value: 'furniture-bedroom' as const, icon: '/elmnts_bed.svg', reducedBrightness: true, thinnerStroke: false, category: 'furniture', subcategory: 'bedroom' },
    { id: 6, label: 'Bathroom', value: 'bathroom' as const, icon: '/elmnt_vanity.svg', reducedBrightness: false, thinnerStroke: false, category: 'bathroom', subcategory: 'bathroom' },
    { id: 7, label: 'Kitchen', value: 'kitchen' as const, icon: '/elmnts_kitchen.svg', reducedBrightness: false, thinnerStroke: false, category: 'kitchen', subcategory: 'kitchen' },
    { id: 8, label: 'Miscellaneous', value: 'misc' as const, icon: '/elmnt_misc.svg', reducedBrightness: false, thinnerStroke: false, category: 'misc', subcategory: 'misc' },
  ];

  return (
    <>
      <SettingsSection className="mb-0">
        <div className="px-4">
          <div className="grid grid-cols-4 gap-0.5">
            {elementButtons.map((button) => (
              <Tooltip key={button.id} label={button.label}>
                <button
                  onClick={() => {
                    // For doors and windows, keep existing opening tool behavior
                    if (button.value === 'door' || button.value === 'window') {
                      setActiveOpeningType(button.value);
                      setSelectedLibraryCategory(null); // Hide library
                    } else {
                      // For furniture/bathroom/kitchen/misc, show CAD library
                      setSelectedLibraryCategory(button.category);
                      setSelectedLibrarySubcategory(button.subcategory);
                    }
                  }}
                  className={`aspect-square rounded-md border-2 flex items-center justify-center transition-colors p-3 ${
                    currentOpeningType === button.value || (selectedLibraryCategory === button.category && selectedLibrarySubcategory === button.subcategory)
                      ? 'border-[#0f7787] bg-[#0f7787]/20'
                      : 'border-gray-700 hover:bg-gray-700'
                  }`}
                >
                  <SvgIcon 
                    src={button.icon} 
                    isActive={currentOpeningType === button.value || button.value === null}
                    size="large"
                    reducedBrightness={button.reducedBrightness}
                    thinnerStroke={button.thinnerStroke}
                  />
                </button>
              </Tooltip>
            ))}
          </div>
        </div>
      </SettingsSection>

      {currentOpeningType && currentOpeningType === 'door' && (
        <>
          <hr className="border-gray-800 mx-4 my-4" />
        </>
      )}

      {currentOpeningType && currentOpeningType === 'window' && (
        <>
          <hr className="border-gray-800 mx-4 my-4" />
        </>
      )}

      {!currentOpeningType && (
        <div className="px-4 py-4 text-center text-gray-500 text-sm">
          Select an element type to configure settings
        </div>
      )}

      {currentOpeningType && currentOpeningType === 'door' && (
        <SettingsSection className="mb-6">
          <SettingRow label="Width">
            <NumberInput value={formatDisplayValue(selectedWidth)} onChange={handleWidthChange} unit={unitLabel} />
          </SettingRow>
          <SettingRow label="Height">
            <NumberInput value={formatDisplayValue(selectedHeight)} onChange={handleHeightChange} unit={unitLabel} />
          </SettingRow>
        </SettingsSection>
      )}

      {currentOpeningType && currentOpeningType === 'window' && (
        <SettingsSection className="mb-6">
          <SettingRow label="Width">
            <NumberInput value={formatDisplayValue(selectedWidth)} onChange={handleWidthChange} unit={unitLabel} />
          </SettingRow>
          <SettingRow label="Height from Sill">
            <NumberInput value={formatDisplayValue(selectedHeight)} onChange={handleHeightChange} unit={unitLabel} />
          </SettingRow>
          <SettingRow label="Sill Height">
            <NumberInput value={formatDisplayValue(selectedSillHeight)} onChange={handleSillHeightChange} unit={unitLabel} />
          </SettingRow>
        </SettingsSection>
      )}

      {currentOpeningType && currentOpeningType === 'door' && (
        <SettingsSection className="mb-3">
          <div className="px-4 flex items-center justify-between">
            <h3 className="text-sm text-gray-200 whitespace-nowrap">Orientation</h3>
            <div className="flex gap-1">
              {orientationOptions.map(option => (
                <Tooltip key={option.value} label={option.label}>
                  <button
                    onClick={() => setDoorOrientation(option.value)}
                    className={`flex items-center justify-center w-8 h-8 rounded-md transition-colors ${currentOrientation === option.value ? 'border-2 border-[#0f7787] bg-[#0f7787]/20 text-[#a0e5f0]' : 'border border-gray-700 hover:bg-gray-700 text-gray-300'}`}
                  >
                    {React.cloneElement(option.icon as React.ReactElement, { size: 14 })}
                  </button>
                </Tooltip>
              ))}
            </div>
          </div>
        </SettingsSection>
      )}

      {currentOpeningType && currentOpeningType === 'door' && (
        <SettingsSection className="mb-6">
          <div className="px-4 flex items-center justify-between">
            <h3 className="text-sm text-gray-200 whitespace-nowrap">Alignment</h3>
            <div className="flex gap-1">
              {alignmentOptions.map(option => {
                const isActive = currentAlignment === option.value;
                return (
                  <Tooltip key={option.value} label={option.label}>
                    <button
                      onClick={() => setDoorAlignment(option.value)}
                      className={`flex items-center justify-center w-8 h-8 rounded-md transition-colors ${isActive ? 'border-2 border-[#0f7787] bg-[#0f7787]/20' : 'border border-gray-700 hover:bg-gray-700'}`}
                    >
                      <img 
                        src={option.icon} 
                        alt={option.value}
                        className="w-5 h-5"
                        style={{ 
                          filter: isActive 
                            ? 'invert(1) brightness(3.0) contrast(1.4)' 
                            : 'invert(1) brightness(2.0) contrast(1.2)',
                          opacity: isActive ? 1 : 0.7
                        }}
                      />
                    </button>
                  </Tooltip>
                );
              })}
            </div>
          </div>
        </SettingsSection>
      )}

      {currentOpeningType && currentOpeningType === 'window' && (
        <SettingsSection className="mb-6">
          <div className="px-4 flex items-center justify-between">
            <h3 className="text-sm text-gray-200 whitespace-nowrap">Alignment</h3>
            <div className="flex gap-1">
              {alignmentOptions.map(option => {
                const isActive = currentAlignment === option.value;
                return (
                  <Tooltip key={option.value} label={option.label}>
                    <button
                      onClick={() => setWindowAlignment(option.value)}
                      className={`flex items-center justify-center w-8 h-8 rounded-md transition-colors ${isActive ? 'border-2 border-[#0f7787] bg-[#0f7787]/20' : 'border border-gray-700 hover:bg-gray-700'}`}
                    >
                      <img 
                        src={option.icon} 
                        alt={option.value}
                        className="w-5 h-5"
                        style={{ 
                          filter: isActive 
                            ? 'invert(1) brightness(3.0) contrast(1.4)' 
                            : 'invert(1) brightness(2.0) contrast(1.2)',
                          opacity: isActive ? 1 : 0.7
                        }}
                      />
                    </button>
                  </Tooltip>
                );
              })}
            </div>
          </div>
        </SettingsSection>
      )}

      {selectedOpeningIds.length > 0 && (
        <div className="px-4 mt-4">
          <button
            onClick={deleteSelectedOpenings}
            className="w-full py-2 text-sm text-red-300 border border-red-500 rounded-md transition-colors hover:bg-red-600/20"
          >
            Delete Selected Opening{selectedOpeningIds.length > 1 ? 's' : ''}
          </button>
        </div>
      )}

      {selectedLibraryCategory && (
        <>
          <hr className="border-gray-800 mx-4 my-4" />
          <div className="px-2">
            <h3 className="text-xs font-bold text-gray-400 px-2 mb-2 uppercase">Library</h3>
            <CadBlocksLibrary
              category={selectedLibraryCategory}
              subcategory={selectedLibrarySubcategory}
            />
          </div>
        </>
      )}
    </>
  );
};
