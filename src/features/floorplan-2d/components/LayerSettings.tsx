/**
 * Layer settings panel component for managing CAD-style layers
 * Provides controls for layer visibility, locking, creation, deletion, and reordering
 */
'use client';

import React, { useState, useEffect } from 'react';
import { useLayerStore } from '../store/layerStore';
import { useWallGraphStoreContext } from '../context/WallGraphStoreContext';
import { useShapesStore } from '../store/shapesStore';
import { Eye, EyeOff, Lock, Unlock, Plus, Trash2, GripVertical, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { Switch } from '@/shared/components/ui/switch';
import { Slider } from '@/shared/components/ui/slider';
import { DEFAULT_LAYER_ID } from '../types/layers';

// Reusable sub-components
const SettingRow = ({ label, children }: { label: string, children: React.ReactNode }) => (
  <div className="flex items-center justify-between h-10 px-4">
    <label className="text-sm text-gray-200">{label}</label>
    {children}
  </div>
);

const ColorPicker = ({ value, onChange }: { value: string, onChange: (value: string) => void }) => (
  <div className="flex items-center space-x-2">
    <div 
      className="h-6 w-12 rounded overflow-hidden relative border border-gray-600"
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

export const LayerSettings = () => {
  const useWallGraphStore = useWallGraphStoreContext();
  const graph = useWallGraphStore((state) => state.graph);
  const deleteWall = useWallGraphStore((state) => state.deleteWall);
  const shapes = useShapesStore((state) => state.shapes);
  const deleteShape = useShapesStore((state) => state.deleteShape);
  
  const layers = useLayerStore((state) => state.layers);
  const activeLayerId = useLayerStore((state) => state.activeLayerId);
  const createLayer = useLayerStore((state) => state.createLayer);
  const deleteLayer = useLayerStore((state) => state.deleteLayer);
  const updateLayer = useLayerStore((state) => state.updateLayer);
  const setActiveLayer = useLayerStore((state) => state.setActiveLayer);
  const toggleLayerVisibility = useLayerStore((state) => state.toggleLayerVisibility);
  const toggleLayerLock = useLayerStore((state) => state.toggleLayerLock);
  
  const [editingLayerId, setEditingLayerId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [layersDropdownOpen, setLayersDropdownOpen] = useState(true);
  const [opacityDropdownOpen, setOpacityDropdownOpen] = useState(false);

  // Inject styles for thin opacity slider (just a line)
  useEffect(() => {
    const styleId = 'opacity-slider-thin-styles';
    // Remove existing style if present
    const existingStyle = document.getElementById(styleId);
    if (existingStyle) {
      existingStyle.remove();
    }

    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      .opacity-slider-thin,
      .opacity-slider-thin > div,
      .opacity-slider-thin [data-radix-slider-root] {
        height: 1px !important;
        min-height: 1px !important;
        max-height: 1px !important;
      }
      .opacity-slider-thin [data-radix-slider-track],
      .opacity-slider-thin .relative {
        height: 1px !important;
        min-height: 1px !important;
        max-height: 1px !important;
        background-color: rgba(255, 255, 255, 0.15) !important;
      }
      .opacity-slider-thin [data-radix-slider-range],
      .opacity-slider-thin .absolute {
        background-color: #0f7787 !important;
        height: 1px !important;
        min-height: 1px !important;
        max-height: 1px !important;
      }
      .opacity-slider-thin [data-radix-slider-thumb] {
        width: 6px !important;
        height: 6px !important;
        min-width: 6px !important;
        min-height: 6px !important;
        max-width: 6px !important;
        max-height: 6px !important;
        border: 1px solid #0f7787 !important;
        background-color: #0f7787 !important;
        margin-top: -2.5px !important;
        box-shadow: none !important;
        outline: none !important;
        ring: none !important;
        ring-offset: none !important;
      }
      .opacity-slider-thin [data-radix-slider-thumb]:hover {
        width: 8px !important;
        height: 8px !important;
        min-width: 8px !important;
        min-height: 8px !important;
        max-width: 8px !important;
        max-height: 8px !important;
        margin-top: -3.5px !important;
      }
      .opacity-slider-thin [data-radix-slider-thumb]:focus,
      .opacity-slider-thin [data-radix-slider-thumb]:focus-visible {
        outline: none !important;
        box-shadow: none !important;
        ring: none !important;
        ring-offset: none !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      const styleToRemove = document.getElementById(styleId);
      if (styleToRemove) {
        styleToRemove.remove();
      }
    };
  }, []);

  const handleCreateLayer = () => {
    const newId = createLayer(`Layer ${layers.length}`);
    setActiveLayer(newId);
  };

  const handleDeleteLayer = (layerId: string) => {
    if (layerId === DEFAULT_LAYER_ID) {
      return;
    }
    
    // Collect all walls on this layer
    const wallsToDelete: string[] = [];
    Object.values(graph.edges).forEach((wall) => {
      const wallLayerId = wall.layer || DEFAULT_LAYER_ID;
      if (wallLayerId === layerId) {
        wallsToDelete.push(wall.id);
      }
    });
    
    // Delete all walls on this layer (openings are automatically deleted with their parent wall)
    wallsToDelete.forEach((wallId) => {
      deleteWall(wallId);
    });
    
    // Collect all shapes on this layer
    const shapesToDelete: string[] = [];
    shapes.forEach((shape) => {
      const shapeLayerId = shape.layerId || DEFAULT_LAYER_ID;
      if (shapeLayerId === layerId) {
        shapesToDelete.push(shape.id);
      }
    });
    
    // Delete all shapes on this layer
    shapesToDelete.forEach((shapeId) => {
      deleteShape(shapeId);
    });
    
    // Finally, delete the layer itself
    deleteLayer(layerId);
  };

  const handleStartEdit = (layerId: string, currentName: string) => {
    if (layerId === DEFAULT_LAYER_ID) {
      return;
    }
    setEditingLayerId(layerId);
    setEditingName(currentName);
  };

  const handleFinishEdit = (layerId: string) => {
    if (editingName.trim()) {
      updateLayer(layerId, { name: editingName.trim() });
    }
    setEditingLayerId(null);
    setEditingName('');
  };

  const handleCancelEdit = () => {
    setEditingLayerId(null);
    setEditingName('');
  };

  // Sort layers by order
  const sortedLayers = [...layers].sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-2">
      {/* Header with Add button and dropdown toggle */}
      <div className="flex items-center justify-between px-4 py-2">
        <button
          onClick={() => setLayersDropdownOpen(!layersDropdownOpen)}
          className="flex items-center space-x-2 flex-1 text-left hover:text-white transition-colors"
        >
          <span className="text-sm text-gray-200">Layers</span>
          {layersDropdownOpen ? (
            <ChevronUp size={14} className="text-gray-400" />
          ) : (
            <ChevronDown size={14} className="text-gray-400" />
          )}
        </button>
        {layersDropdownOpen && (
          <button
            onClick={handleCreateLayer}
            className="p-1.5 rounded-md hover:bg-gray-700 text-gray-300 transition-colors"
            aria-label="Add layer"
          >
            <Plus size={16} />
          </button>
        )}
      </div>

      {/* Layer list and opacity (collapsible) */}
      {layersDropdownOpen && (
        <>
          {/* Layer list */}
          <div className="space-y-1">
        {sortedLayers.map((layer) => {
          const isActive = layer.id === activeLayerId;
          const isDefault = layer.id === DEFAULT_LAYER_ID;
          const isEditing = editingLayerId === layer.id;

          return (
            <div
              key={layer.id}
              className={`px-2 py-2 rounded-md transition-colors ${
                isActive ? 'bg-[#0f7787]/20 border border-[#0f7787]' : 'hover:bg-gray-900'
              }`}
            >
              <div className="flex items-center space-x-2">
                {/* Drag handle (placeholder for future drag functionality) */}
                <div className="text-gray-600 cursor-move">
                  <GripVertical size={14} />
                </div>

                {/* Layer name */}
                <div className="flex-1 min-w-0">
                  {isEditing ? (
                    <input
                      type="text"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      onBlur={() => handleFinishEdit(layer.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleFinishEdit(layer.id);
                        } else if (e.key === 'Escape') {
                          handleCancelEdit();
                        }
                      }}
                      className="w-full bg-gray-800 text-white text-sm px-2 py-1 rounded border border-gray-600 focus:outline-none focus:border-[#0f7787]"
                      autoFocus
                    />
                  ) : (
                    <button
                      onClick={() => setActiveLayer(layer.id)}
                      className="text-sm text-gray-200 hover:text-white text-left w-full truncate"
                      onDoubleClick={() => !isDefault && handleStartEdit(layer.id, layer.name)}
                    >
                      {layer.name}
                    </button>
                  )}
                </div>

                {/* Active indicator */}
                {isActive && (
                  <Check size={14} className="text-[#0f7787] flex-shrink-0" />
                )}

                {/* Visibility toggle */}
                <button
                  onClick={() => toggleLayerVisibility(layer.id)}
                  className="p-1 rounded hover:bg-gray-700 text-gray-400 hover:text-gray-200 transition-colors"
                  aria-label={layer.visible ? 'Hide layer' : 'Show layer'}
                >
                  {layer.visible ? <Eye size={14} /> : <EyeOff size={14} />}
                </button>

                {/* Lock toggle */}
                <button
                  onClick={() => toggleLayerLock(layer.id)}
                  className="p-1 rounded hover:bg-gray-700 text-gray-400 hover:text-gray-200 transition-colors"
                  aria-label={layer.locked ? 'Unlock layer' : 'Lock layer'}
                >
                  {layer.locked ? <Lock size={14} /> : <Unlock size={14} />}
                </button>

                {/* Delete button */}
                {!isDefault && (
                  <button
                    onClick={() => handleDeleteLayer(layer.id)}
                    className="p-1 rounded hover:bg-red-900/30 text-gray-500 hover:text-red-400 transition-colors"
                    aria-label="Delete layer"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            </div>
          );
        })}
          </div>

          {/* Opacity dropdown for active layer */}
          {activeLayerId && (
            <div className="px-4 pt-1">
            <button
              onClick={() => setOpacityDropdownOpen(!opacityDropdownOpen)}
              className="w-full flex items-center justify-between py-2 text-sm text-gray-300 hover:text-white transition-colors"
            >
              <span>Opacity</span>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-400">
                  {Math.round((layers.find(l => l.id === activeLayerId)?.opacity ?? 1.0) * 100)}%
                </span>
                {opacityDropdownOpen ? (
                  <ChevronUp size={14} className="text-gray-400" />
                ) : (
                  <ChevronDown size={14} className="text-gray-400" />
                )}
              </div>
            </button>
            {opacityDropdownOpen && (
              <div className="pb-3 pt-2">
                <div 
                  className="opacity-slider-thin"
                  style={{
                    height: '1px',
                    minHeight: '1px'
                  }}
                >
                  <Slider
                    value={[layers.find(l => l.id === activeLayerId)?.opacity ?? 1.0]}
                    onValueChange={(values) => {
                      const opacity = values[0];
                      if (activeLayerId && opacity !== undefined) {
                        updateLayer(activeLayerId, { opacity });
                      }
                    }}
                    min={0}
                    max={1}
                    step={0.01}
                    className="w-full opacity-slider-thin"
                  />
                </div>
              </div>
            )}
          </div>
          )}
        </>
      )}
    </div>
  );
};

