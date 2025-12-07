/**
 * Toolbar component for 3D view
 * Provides CAD tool buttons for shape creation and manipulation
 */
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useCADToolsStore } from '../store/cadToolsStore';
import type { ActiveTool } from '../store/cadToolsStore';

// Local Tooltip Implementation
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

const ToolButton = ({ 
  label, 
  isActive = false, 
  onClick,
  iconSrc,
  iconSize = 'w-6 h-6',
  iconClassName = '',
  iconStyle
}: { 
  label: string; 
  isActive?: boolean; 
  onClick?: () => void;
  iconSrc?: string;
  iconSize?: string;
  iconClassName?: string;
  iconStyle?: React.CSSProperties;
}) => (
  <Tooltip label={label}>
    <button
      onClick={onClick || (() => {})}
      className="w-12 h-12 flex items-center justify-center group"
      aria-label={label}
    >
      <div className={`flex items-center justify-center rounded-md transition-colors ${isActive ? 'bg-[#0f7787] w-10 h-10' : 'group-hover:bg-gray-700 w-10 h-10'}`}>
        {iconSrc ? (
          <img
            src={iconSrc}
            alt={label}
            className={iconStyle ? `${iconSize} ${iconClassName}` : `${iconSize} brightness-0 invert ${iconClassName}`}
            style={iconStyle}
          />
        ) : null}
      </div>
    </button>
  </Tooltip>
);

export const ThreeToolbar = () => {
  const activeTool = useCADToolsStore((state) => state.activeTool);
  const setActiveTool = useCADToolsStore((state) => state.setActiveTool);
  const addObject = useCADToolsStore((state) => state.addObject);
  const transformMode = useCADToolsStore((state) => state.transformMode);
  const setTransformMode = useCADToolsStore((state) => state.setTransformMode);
  const explicitTransformMode = useCADToolsStore((state) => state.explicitTransformMode);
  const setExplicitTransformMode = useCADToolsStore((state) => state.setExplicitTransformMode);
  const selectedObjectIds = useCADToolsStore((state) => state.selectedObjectIds);
  const deleteSelectedObjects = useCADToolsStore((state) => state.deleteSelectedObjects);
  const createGroup = useCADToolsStore((state) => state.createGroup);
  const ungroup = useCADToolsStore((state) => state.ungroup);
  const getGroupForObject = useCADToolsStore((state) => state.getGroupForObject);
  const groups = useCADToolsStore((state) => state.groups);
  
  const activateTool = React.useCallback((tool: ActiveTool | 'select') => {
    setExplicitTransformMode(null);
    setActiveTool(tool);
  }, [setActiveTool, setExplicitTransformMode]);

  const toggleTool = (tool: ActiveTool) => {
    if (activeTool === tool) {
      activateTool('select');
    } else {
      activateTool(tool);
    }
  };

  const handleSelectTool = () => {
    // Toggle select tool on/off
    if (activeTool === 'select') {
      // Turn off select tool - set to null (no tool active)
      setActiveTool(null);
      setExplicitTransformMode(null);
    } else {
      // Turn on select tool
      activateTool('select');
      setExplicitTransformMode(null);
    }
  };
  
  const handleTransformModeClick = (mode: 'translate' | 'rotate' | 'scale') => {
    // Toggle: if already active, turn off; otherwise turn on
    if (explicitTransformMode === mode) {
      // Turn off - reset to default
      setExplicitTransformMode(null);
      setTransformMode('translate'); // Reset to default
      activateTool('select');
    } else {
      // Turn on
      setExplicitTransformMode(mode);
      setTransformMode(mode);
      activateTool('select'); // Ensure select tool is active for transforms
    }
  };

  const handleRectangleToolClick = () => {
    toggleTool('rectangle');
  };

  const handlePushPullClick = () => {
    toggleTool('push-pull');
  };

  const handleBooleanClick = () => {
    // Only allow boolean tool if 2+ objects are selected
    if (selectedObjectIds.length < 2) {
      return;
    }
    toggleTool('boolean');
  };

  const handleEraseToolClick = () => {
    if (!selectedObjectIds.length) {
      activateTool('select');
      return;
    }
    activateTool('erase');
    deleteSelectedObjects();
    activateTool('select');
  };

  const handleLineToolClick = () => {
    toggleTool('line');
  };

  const handlePolygonToolClick = () => {
    toggleTool('polygon');
  };

  const handleArcToolClick = () => {
    toggleTool('arc');
  };

  const handleCircleToolClick = () => {
    toggleTool('circle');
  };

  const handleOffsetToolClick = () => {
    toggleTool('offset');
  };

  const handleTapeToolClick = () => {
    toggleTool('tape');
  };

  const handleGroupClick = () => {
    if (selectedObjectIds.length < 2) {
      return; // Need at least 2 objects to group
    }

    // Check if all selected objects are already in the same group
    const selectedGroups = selectedObjectIds
      .map(id => getGroupForObject(id))
      .filter((group): group is NonNullable<typeof group> => group !== null);

    if (selectedGroups.length > 0) {
      // If all objects are in the same group, ungroup them
      const uniqueGroups = Array.from(new Set(selectedGroups.map(g => g.id)));
      if (uniqueGroups.length === 1 && uniqueGroups[0]) {
        ungroup(uniqueGroups[0]);
        return;
      }
    }

    // Create a new group with the selected objects
    createGroup(selectedObjectIds);
  };

  // Shapes Button with Dropdown
  const ShapesButton = () => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    
    // Close dropdown when clicking outside
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
          setIsOpen(false);
        }
      };
      
      if (isOpen) {
        document.addEventListener('mousedown', handleClickOutside);
      }
      
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [isOpen]);
    
    return (
      <div className="relative" ref={dropdownRef}>
        <Tooltip label="Shapes">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-12 h-12 flex items-center justify-center group"
            aria-label="Shapes"
          >
            <div className={`flex items-center justify-center rounded-md transition-colors ${isOpen ? 'bg-[#0f7787] w-10 h-10' : 'group-hover:bg-gray-700 w-10 h-10'}`}>
              <img
                src="/toolbar-shapes.svg"
                alt="Shapes"
                className="w-6 h-6 brightness-0 invert"
              />
            </div>
          </button>
        </Tooltip>
        
        {isOpen && (
          <div className="absolute top-full left-0 mt-2 bg-black rounded-lg shadow-lg border border-gray-800 z-20">
            <div className="p-0.5 flex items-center gap-0.5">
              {[
                { label: 'Line', icon: '/Shape_line.svg', tool: 'line' as const, onClick: handleLineToolClick },
                { label: 'Polygon', icon: '/toolbar-zone.svg', tool: 'polygon' as const, onClick: handlePolygonToolClick },
                { label: 'Arc', icon: '/shape_curvey.svg', tool: 'arc' as const, onClick: handleArcToolClick },
                { label: 'Circle', icon: '/shape-crcle.svg', tool: 'circle' as const, onClick: handleCircleToolClick },
              ].map((tool) => (
                <Tooltip key={tool.label} label={tool.label}>
                  <button
                    onClick={() => {
                      tool.onClick();
                      setIsOpen(false);
                    }}
                    className="w-8 h-8 flex items-center justify-center group"
                    aria-label={tool.label}
                  >
                    <div className={`flex items-center justify-center rounded-md transition-colors ${activeTool === tool.tool ? 'bg-[#0f7787] w-7 h-7' : 'group-hover:bg-gray-700 w-7 h-7'}`}>
                      <img
                        src={tool.icon}
                        alt={tool.label}
                        className="w-4 h-4 brightness-0 invert"
                      />
                    </div>
                  </button>
                </Tooltip>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };
  
  return (
    <div className="flex items-center justify-center gap-3">
      {/* Left section - Selection and Transform Tools */}
      <div className="flex-shrink-0">
        <div className="bg-black text-white p-0 rounded-lg shadow-lg border border-gray-800">
          <div className="flex items-center divide-x divide-gray-700">
            <ToolButton 
              label="Select (Q)" 
              isActive={activeTool === 'select' && explicitTransformMode === null}
              onClick={handleSelectTool}
              iconSrc="/3D_tool_select.svg"
              iconSize="w-5 h-5"
            />
            <ToolButton 
              label="Move (G)" 
              isActive={explicitTransformMode === 'translate'}
              onClick={() => handleTransformModeClick('translate')}
              iconSrc="/3d-tool-move.svg"
            />
            <ToolButton 
              label="Rotate (R)" 
              isActive={explicitTransformMode === 'rotate'}
              onClick={() => handleTransformModeClick('rotate')}
              iconSrc="/3d-tool-rotate.svg"
            />
            <ToolButton 
              label="Scale (S)" 
              isActive={explicitTransformMode === 'scale'}
              onClick={() => handleTransformModeClick('scale')}
              iconSrc="/3d-tool-scale.svg"
            />
            <ToolButton 
              label="Place Camera" 
              isActive={false}
              onClick={() => {}}
              iconSrc="/3d-tool-camera.svg"
            />
          </div>
        </div>
      </div>

      {/* Spacer */}
      <div style={{ width: '12px' }} />

      {/* Center section - Shape Creation Tools */}
      <div className="flex-shrink-0">
        <div className="bg-black text-white p-0 rounded-lg shadow-lg border border-gray-800">
          <div className="flex items-center divide-x divide-gray-700">
            <ToolButton 
              label="Push-Pull" 
              isActive={activeTool === 'push-pull'}
              onClick={handlePushPullClick}
              iconSrc="/new_3d_push.svg"
              iconSize="w-8 h-8"
              iconStyle={{
                filter: 'brightness(0) invert(1) brightness(1.4) contrast(1.3) drop-shadow(0 0 0.3px rgba(255,255,255,1)) drop-shadow(0 0 0.3px rgba(255,255,255,1)) drop-shadow(0 0 0.3px rgba(255,255,255,1))'
              }}
            />
            <ToolButton 
              label="Rectangle" 
              isActive={activeTool === 'rectangle'}
              onClick={handleRectangleToolClick}
              iconSrc="/3d-rect.svg"
            />
            <ShapesButton />
            <ToolButton
              label="Offset"
              isActive={activeTool === 'offset'}
              onClick={handleOffsetToolClick}
              iconSrc="/toolbar-offset.svg"
            />
            <Tooltip label={selectedObjectIds.length >= 2 ? "Shape Creator - Click regions on canvas" : "Shape Creator - Select 2+ objects to use"}>
              <button
                onClick={handleBooleanClick}
                disabled={selectedObjectIds.length < 2}
                className="w-12 h-12 flex items-center justify-center group disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Shape Creator"
              >
                <div className={`flex items-center justify-center rounded-md transition-colors ${activeTool === 'boolean' ? 'bg-[#0f7787] w-10 h-10' : 'group-hover:bg-gray-700 w-10 h-10'}`}>
                  <img
                    src="/3d_shape_creator_tool.svg"
                    alt="Shape Creator"
                    className="w-7 h-7 brightness-0 invert"
                    style={{
                      filter: 'brightness(0) invert(1) brightness(1.1) contrast(0.85)',
                    }}
                  />
                </div>
              </button>
            </Tooltip>
            <ToolButton
              label="Tape Measure (T)"
              isActive={activeTool === 'tape'}
              onClick={handleTapeToolClick}
              iconSrc="/toolbar-tape.svg"
            />
            <ToolButton 
              label="Protractor" 
              isActive={false}
              onClick={() => {}}
              iconSrc="/3D-protractor-.svg"
            />
            <Tooltip label={selectedObjectIds.length >= 2 ? "Group objects (G)" : "Select 2+ objects to group"}>
              <button
                onClick={handleGroupClick}
                disabled={selectedObjectIds.length < 2}
                className="w-12 h-12 flex items-center justify-center group disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Group"
              >
                <div className="flex items-center justify-center rounded-md transition-colors group-hover:bg-gray-700 w-10 h-10">
                  <img
                    src="/toolbar-group.svg"
                    alt="Group"
                    className="w-6 h-6"
                    style={{
                      filter: 'brightness(0) invert(1) brightness(1.1) contrast(0.85)'
                    }}
                  />
                </div>
              </button>
            </Tooltip>
            <ToolButton 
              label="Flip" 
              isActive={false}
              onClick={() => {}}
              iconSrc="/3d-flip.svg"
            />
            <ToolButton 
              label="Copy" 
              isActive={false}
              onClick={() => {}}
              iconSrc="/3d-copy.svg"
              iconSize="w-7 h-7"
            />
            <ToolButton 
              label="Erase" 
              isActive={activeTool === 'erase'}
              onClick={handleEraseToolClick}
              iconSrc="/3d-erase.svg"
            />
          </div>
        </div>
      </div>

      {/* Spacer */}
      <div style={{ width: '12px' }} />

      {/* Right section - Advanced Tools */}
      <div className="flex-shrink-0">
        <div className="bg-black text-white p-0 rounded-lg shadow-lg border border-gray-800">
          <div className="flex items-center divide-x divide-gray-700">
            <ToolButton 
              label="Placeholder" 
              isActive={false}
              onClick={() => {}}
            />
            <ToolButton 
              label="Placeholder" 
              isActive={false}
              onClick={() => {}}
            />
            <ToolButton 
              label="Placeholder" 
              isActive={false}
              onClick={() => {}}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

