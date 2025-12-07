/**
 * Main settings panel component that dynamically shows different settings based on context
 * Displays OpeningSettings, WallSettings, or DefaultSettings based on active tool/selection
 * Includes DimensionDisplay at the bottom for showing current measurements
 */
'use client';

import React, { useState } from 'react';
import { useWallGraphStoreContext } from '../context/WallGraphStoreContext';
import { ChevronDown, Trash2 } from 'lucide-react';
import { Switch } from "@/shared/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { OpeningSettings } from './OpeningSettings';
import { WallSettings } from './WallSettings';
import { LayerSettings } from './LayerSettings';
import { DimensionDisplay } from './DimensionDisplay';
import { AnnotationSettings } from './AnnotationSettings';
import { GroupSettings } from './GroupSettings';
import { OffsetSettings } from './OffsetSettings';
import { ZoneSettings } from './ZoneSettings';
import { useMeasureStore } from '../store/measureStore';
import { useAnnotationsStore } from '../store/annotationsStore';
import { useGroupStore } from '../store/groupStore';
import { useOffsetStore } from '../store/offsetStore';
import { useShapesStore } from '../store/shapesStore';
import { useFloorStoreContext } from '../context/FloorStoreContext';

// --- Sub-components for clarity ---

const SettingRow = ({ label, children }: { label: string, children: React.ReactNode }) => (
  <div className="flex items-center justify-between h-10 px-4">
    <label className="text-sm text-gray-200">{label}</label>
    {children}
  </div>
);


const SegmentedControl = ({ value, onValueChange, options }: { value: string, onValueChange: (value: any) => void, options: {label: string, value: string}[] }) => (
  <div className="flex bg-gray-700 rounded-md p-0.5 w-[80px] h-7">
    {options.map(opt => (
      <button
        key={opt.value}
        onClick={() => onValueChange(opt.value)}
        className={`flex-1 text-xs py-1 rounded-sm transition-colors flex items-center justify-center ${value === opt.value ? 'bg-[#0f7787] text-white' : 'text-gray-300 hover:bg-gray-600'}`}
      >
        {opt.label}
      </button>
    ))}
  </div>
);

const Collapsible = ({ title, children }: { title: string, children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false); // Set default state to false
  return (
    <div className="px-2"> {/* Reduce horizontal padding */}
      <button onClick={() => setIsOpen(!isOpen)} className="w-full flex items-center justify-between h-10 px-2 rounded-md hover:bg-gray-900">
        <span className="text-sm text-gray-200">{title}</span>
        <ChevronDown size={16} className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && <div className="pt-1 pb-2 space-y-1">{children}</div>}
    </div>
  );
};

const UnitSwitcher = ({ value, onToggle }: { value: string, onToggle: () => void }) => (
  <button onClick={onToggle} className="w-[80px] h-7 text-xs text-gray-200 bg-gray-700 hover:bg-gray-600 rounded-md px-3 transition-colors flex items-center justify-center">
    {value === 'imperial' ? 'ft / in' : 'm / cm'}
  </button>
);

const MeasureSettings = ({
  isActive,
  onToggle,
  onClear,
}: {
  isActive: boolean;
  onToggle: (value: boolean) => void;
  onClear: () => void;
}) => (
  <div className="px-4 py-2 space-y-4">
    <div className="flex items-center justify-between h-10">
      <span className="text-sm text-gray-200">Guidelines</span>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onClear}
          className="p-2 rounded-md border border-gray-700 text-gray-300 hover:bg-gray-700"
          aria-label="Remove all guidelines"
        >
          <Trash2 size={16} />
        </button>
        <Switch checked={isActive} onCheckedChange={onToggle} />
      </div>
    </div>
  </div>
);

// --- Main Default Settings Panel ---

const DefaultSettings = () => {
  const useWallGraphStore = useWallGraphStoreContext();
  const snapOptions = useWallGraphStore((state) => state.snapOptions);
  const setSnapOptions = useWallGraphStore((state) => state.setSnapOptions);
  const unitSystem = useWallGraphStore((state) => state.unitSystem);
  const setUnitSystem = useWallGraphStore((state) => state.setUnitSystem);
  const strokeWeight = useWallGraphStore((state) => state.strokeWeight);
  const setStrokeWeight = useWallGraphStore((state) => state.setStrokeWeight);

  return (
    <>
      <LayerSettings />
      
      <hr className="border-gray-800 mx-4 my-4" />
      
      <SettingRow label="Grid">
        <SegmentedControl
          value={snapOptions.snapToGrid ? 'show' : 'hide'}
          onValueChange={(value) => setSnapOptions({ snapToGrid: value === 'show' })}
          options={[
            { label: 'Show', value: 'show' },
            { label: 'Hide', value: 'hide' }
          ]}
        />
      </SettingRow>

      <SettingRow label="Units">
        <UnitSwitcher 
          value={unitSystem}
          onToggle={() => setUnitSystem(unitSystem === 'imperial' ? 'metric' : 'imperial')}
        />
      </SettingRow>

      <SettingRow label="Stroke">
        <Select 
          value={strokeWeight} 
          onValueChange={(value) => {
            setStrokeWeight(value as 'fine' | 'medium' | 'bold');
          }}
        >
          <SelectTrigger className="w-[80px] h-7 bg-gray-700 border-gray-600 text-xs text-gray-200 [&>svg]:hidden flex items-center justify-center">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-black border-gray-700">
            <SelectItem value="fine" className="text-white hover:bg-gray-800 focus:bg-gray-800">Fine</SelectItem>
            <SelectItem value="medium" className="text-white hover:bg-gray-800 focus:bg-gray-800">Medium</SelectItem>
            <SelectItem value="bold" className="text-white hover:bg-gray-800 focus:bg-gray-800">Bold</SelectItem>
          </SelectContent>
        </Select>
      </SettingRow>

      <Collapsible title="Snap">
        <SettingRow label="to Grid">
          <Switch
            checked={snapOptions.snapToGrid}
            onCheckedChange={(checked) => setSnapOptions({ snapToGrid: checked })}
          />
        </SettingRow>
        <SettingRow label="to Walls">
          <Switch
            checked={snapOptions.snapToWalls}
            onCheckedChange={(checked) => setSnapOptions({ snapToWalls: checked })}
          />
        </SettingRow>
        <SettingRow label="to Nodes">
          <Switch
            checked={snapOptions.snapToNodes}
            onCheckedChange={(checked) => setSnapOptions({ snapToNodes: checked })}
          />
        </SettingRow>
        <SettingRow label="to Angles">
          <Switch
            checked={snapOptions.snapToAngles}
            onCheckedChange={(checked) => setSnapOptions({ snapToAngles: checked })}
          />
        </SettingRow>
      </Collapsible>
    </>
  );
};


// --- Main Dynamic Panel Component ---

export const SettingsPanel: React.FC = () => {
  const useWallGraphStore = useWallGraphStoreContext();
  const isToolActive = useWallGraphStore((state) => state.isToolActive);
  const isOpeningToolActive = useWallGraphStore((state) => state.isOpeningToolActive);
  const selectedWallId = useWallGraphStore((state) => state.selectedWallId);
  const selectedOpeningId = useWallGraphStore((state) => state.selectedOpeningId);
  const selectedOpeningIds = useWallGraphStore((state) => state.selectedOpeningIds ?? []);
  const isMeasureActive = useMeasureStore((state) => state.isMeasureActive);
  const guidelinesEnabled = useMeasureStore((state) => state.guidelinesEnabled);
  const setGuidelinesEnabled = useMeasureStore((state) => state.setGuidelinesEnabled);
  const clearGuidelines = useMeasureStore((state) => state.clearGuidelines);

  // Annotation tool state
  const isAnnotationModeActive = useAnnotationsStore((state) => state.isAnnotationModeActive);
  const selectedAnnotationId = useAnnotationsStore((state) => state.selectedAnnotationId);

  // Group tool state
  const isGroupToolActive = useGroupStore((state) => state.isGroupToolActive);

  // Offset tool state
  const isOffsetToolActive = useOffsetStore((state) => state.isOffsetToolActive);

  // Zone tool state
  const activeShapeTool = useShapesStore((state) => state.activeShapeTool);
  const useFloorStore = useFloorStoreContext();
  const selectedZoneIds = useFloorStore((state) => state.selectedZoneIds);

  // Check if we have a zone selected
  const hasZoneSelected = selectedZoneIds.length > 0;

  const showOpeningSettings = isOpeningToolActive || !!selectedOpeningId || selectedOpeningIds.length > 0;
  const showAnnotationSettings = isAnnotationModeActive || !!selectedAnnotationId;

  const renderContent = () => {
    if (isMeasureActive) {
      return (
        <MeasureSettings
          isActive={guidelinesEnabled}
          onToggle={setGuidelinesEnabled}
          onClear={clearGuidelines}
        />
      );
    }

    if (isGroupToolActive) {
      return <GroupSettings />;
    }

    if (isOffsetToolActive) {
      return <OffsetSettings />;
    }

    if (activeShapeTool === 'zone' || hasZoneSelected) {
      return <ZoneSettings />;
    }

    if (showAnnotationSettings) {
      return <AnnotationSettings />;
    }

    if (showOpeningSettings) {
      return <OpeningSettings />;
    }

    if (isToolActive || selectedWallId) {
      return <WallSettings />;
    }

    return <DefaultSettings />;
  };

  return (
    <div className="w-64 bg-black text-white py-4 space-y-2 flex flex-col h-full relative">
      <div className="flex-1 overflow-y-auto">
        {renderContent()}
      </div>
      <div className="absolute bottom-0 left-0 right-0">
        <DimensionDisplay />
      </div>
    </div>
  );
};
