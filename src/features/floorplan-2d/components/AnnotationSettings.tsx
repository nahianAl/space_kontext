/**
 * Annotation settings panel component for configuring annotation tools
 * Provides controls for dimension, text, and leader annotation settings
 * Dynamically shows settings based on active annotation tool
 */
'use client';

import React from 'react';
import { useAnnotationsStore } from '../store/annotationsStore';
import { Ruler, Type, MoveRight } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Switch } from "@/shared/components/ui/switch";

// Reusable sub-components
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

const NumberInput = ({
  value,
  onChange,
  min,
  max,
  step = 1
}: {
  value: number,
  onChange: (value: number) => void,
  min?: number,
  max?: number,
  step?: number
}) => (
  <input
    type="number"
    value={value}
    onChange={(e) => onChange(Number(e.target.value))}
    min={min}
    max={max}
    step={step}
    className="w-20 h-7 bg-gray-700 border border-gray-600 rounded-md px-2 text-xs text-gray-200 focus:outline-none focus:border-[#0f7787]"
  />
);

// Tool selection component
const ToolSelector = () => {
  const activeAnnotationTool = useAnnotationsStore((state) => state.activeAnnotationTool);
  const setActiveAnnotationTool = useAnnotationsStore((state) => state.setActiveAnnotationTool);

  const tools = [
    { value: 'dimension', label: 'Dimension', icon: <Ruler size={16} /> },
    { value: 'text', label: 'Text', icon: <Type size={16} /> },
    { value: 'leader', label: 'Leader', icon: <MoveRight size={16} /> },
  ];

  return (
    <div className="px-4 py-2 space-y-2">
      <label className="text-xs font-bold uppercase text-gray-400">Annotation Type</label>
      <div className="grid grid-cols-3 gap-2">
        {tools.map((tool) => (
          <button
            key={tool.value}
            onClick={() => setActiveAnnotationTool(
              activeAnnotationTool === tool.value ? null : tool.value as any
            )}
            className={`flex flex-col items-center justify-center h-16 rounded-md transition-colors ${
              activeAnnotationTool === tool.value
                ? 'bg-[#0f7787] text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {tool.icon}
            <span className="text-xs mt-1">{tool.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

// Dimension settings
const DimensionSettings = () => {
  const settings = useAnnotationsStore((state) => state.defaultDimensionSettings);
  const updateSettings = useAnnotationsStore((state) => state.updateDimensionSettings);

  return (
    <>
      <SettingsSection title="Dimension Settings">
        <SettingRow label="Arrow Style">
          <Select
            value={settings.arrowStyle}
            onValueChange={(value: any) => updateSettings({ arrowStyle: value })}
          >
            <SelectTrigger className="w-[100px] h-7 bg-gray-700 border-gray-600 text-xs text-gray-200">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-black border-gray-700">
              <SelectItem value="slash" className="text-white hover:bg-gray-800">Slash</SelectItem>
              <SelectItem value="filled-arrow" className="text-white hover:bg-gray-800">Filled Arrow</SelectItem>
              <SelectItem value="dot" className="text-white hover:bg-gray-800">Dot</SelectItem>
            </SelectContent>
          </Select>
        </SettingRow>

        <SettingRow label="Offset">
          <NumberInput
            value={settings.offset}
            onChange={(value) => updateSettings({ offset: value })}
            min={5}
            max={50}
            step={5}
          />
        </SettingRow>

        <SettingRow label="Precision">
          <Select
            value={settings.precision.toString()}
            onValueChange={(value) => updateSettings({ precision: parseInt(value) })}
          >
            <SelectTrigger className="w-[80px] h-7 bg-gray-700 border-gray-600 text-xs text-gray-200">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-black border-gray-700">
              <SelectItem value="0" className="text-white hover:bg-gray-800">0</SelectItem>
              <SelectItem value="1" className="text-white hover:bg-gray-800">0.0</SelectItem>
              <SelectItem value="2" className="text-white hover:bg-gray-800">0.00</SelectItem>
              <SelectItem value="3" className="text-white hover:bg-gray-800">0.000</SelectItem>
            </SelectContent>
          </Select>
        </SettingRow>

        <SettingRow label="Show Units">
          <Switch
            checked={settings.showUnits}
            onCheckedChange={(checked) => updateSettings({ showUnits: checked })}
          />
        </SettingRow>
      </SettingsSection>
    </>
  );
};

// Text settings
const TextSettingsComponent = () => {
  const settings = useAnnotationsStore((state) => state.defaultTextSettings);
  const updateSettings = useAnnotationsStore((state) => state.updateTextSettings);

  return (
    <>
      <SettingsSection title="Text Settings">
        <SettingRow label="Font Size">
          <NumberInput
            value={settings.fontSize}
            onChange={(value) => updateSettings({ fontSize: value })}
            min={8}
            max={48}
            step={2}
          />
        </SettingRow>

        <SettingRow label="Font Weight">
          <Select
            value={settings.fontWeight}
            onValueChange={(value: any) => updateSettings({ fontWeight: value })}
          >
            <SelectTrigger className="w-[100px] h-7 bg-gray-700 border-gray-600 text-xs text-gray-200">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-black border-gray-700">
              <SelectItem value="normal" className="text-white hover:bg-gray-800">Normal</SelectItem>
              <SelectItem value="bold" className="text-white hover:bg-gray-800">Bold</SelectItem>
            </SelectContent>
          </Select>
        </SettingRow>

        <SettingRow label="Text Color">
          <ColorPicker
            value={settings.textColor}
            onChange={(value) => updateSettings({ textColor: value })}
          />
        </SettingRow>

        <SettingRow label="Background">
          <Switch
            checked={settings.showBackground}
            onCheckedChange={(checked) => updateSettings({ showBackground: checked })}
          />
        </SettingRow>

        {settings.showBackground && (
          <SettingRow label="BG Color">
            <ColorPicker
              value={settings.backgroundColor}
              onChange={(value) => updateSettings({ backgroundColor: value })}
            />
          </SettingRow>
        )}
      </SettingsSection>
    </>
  );
};

// Leader settings
const LeaderSettingsComponent = () => {
  const settings = useAnnotationsStore((state) => state.defaultLeaderSettings);
  const updateSettings = useAnnotationsStore((state) => state.updateLeaderSettings);

  return (
    <>
      <SettingsSection title="Leader Settings">
        <SettingRow label="Arrow Style">
          <Select
            value={settings.arrowStyle}
            onValueChange={(value: any) => updateSettings({ arrowStyle: value })}
          >
            <SelectTrigger className="w-[100px] h-7 bg-gray-700 border-gray-600 text-xs text-gray-200">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-black border-gray-700">
              <SelectItem value="filled" className="text-white hover:bg-gray-800">Filled</SelectItem>
              <SelectItem value="open" className="text-white hover:bg-gray-800">Open</SelectItem>
              <SelectItem value="dot" className="text-white hover:bg-gray-800">Dot</SelectItem>
            </SelectContent>
          </Select>
        </SettingRow>

        <SettingRow label="Leader Style">
          <Select
            value={settings.leaderStyle}
            onValueChange={(value: any) => updateSettings({ leaderStyle: value })}
          >
            <SelectTrigger className="w-[100px] h-7 bg-gray-700 border-gray-600 text-xs text-gray-200">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-black border-gray-700">
              <SelectItem value="straight" className="text-white hover:bg-gray-800">Straight</SelectItem>
              <SelectItem value="orthogonal" className="text-white hover:bg-gray-800">Orthogonal</SelectItem>
              <SelectItem value="arc" className="text-white hover:bg-gray-800">Arc</SelectItem>
            </SelectContent>
          </Select>
        </SettingRow>

        <SettingRow label="Landing">
          <NumberInput
            value={settings.landingLength}
            onChange={(value) => updateSettings({ landingLength: value })}
            min={0}
            max={100}
            step={10}
          />
        </SettingRow>

        <SettingRow label="Background">
          <Switch
            checked={settings.showBackground}
            onCheckedChange={(checked) => updateSettings({ showBackground: checked })}
          />
        </SettingRow>
      </SettingsSection>
    </>
  );
};

// Main component
export const AnnotationSettings = () => {
  const activeAnnotationTool = useAnnotationsStore((state) => state.activeAnnotationTool);
  const selectedAnnotationId = useAnnotationsStore((state) => state.selectedAnnotationId);

  return (
    <div className="space-y-4">
      <ToolSelector />

      <hr className="border-gray-800 mx-4" />

      {!activeAnnotationTool && !selectedAnnotationId && (
        <div className="px-4 py-8 text-center text-gray-500 text-sm">
          Select an annotation type above to begin
        </div>
      )}

      {activeAnnotationTool === 'dimension' && <DimensionSettings />}
      {activeAnnotationTool === 'text' && <TextSettingsComponent />}
      {activeAnnotationTool === 'leader' && <LeaderSettingsComponent />}

      {/* Placeholder for future tools */}
      {(activeAnnotationTool === 'section-marker' ||
        activeAnnotationTool === 'elevation-marker' ||
        activeAnnotationTool === 'detail-marker' ||
        activeAnnotationTool === 'level-marker') && (
        <div className="px-4 py-8 text-center text-gray-500 text-sm">
          {activeAnnotationTool.replace('-', ' ')} settings coming soon
        </div>
      )}
    </div>
  );
};
