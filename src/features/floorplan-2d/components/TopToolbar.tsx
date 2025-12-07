/**
 * Top toolbar component with tool activation buttons
 * Provides access to wall tool, opening tool, shape tools, measure tool, and other utilities
 * Manages tool state and deactivates conflicting tools when switching
 */
'use client';

import React, { useState, useEffect } from 'react';
import { useWallGraphStoreContext, useWallGraphStoreContextValue } from '../context/WallGraphStoreContext';
import { getWallGraphStore } from '../store/wallGraphStore';
import { useShapesStore } from '../store/shapesStore';
import { useMeasureStore } from '../store/measureStore';
import { useEraserStore } from '../store/eraserStore';
import { useAnnotationsStore } from '../store/annotationsStore';
import { useGroupStore } from '../store/groupStore';
import { useOffsetStore } from '../store/offsetStore';
import { useSiteLayoutStore } from '../store/siteLayoutStore';
import type { ShapeType } from '../types/shapes';

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

const SvgIcon = ({ 
  src, 
  isActive, 
  isWhite = false,
  size = 'normal',
  strokeAdjustment = 'none'
}: { 
  src: string, 
  isActive: boolean, 
  isWhite?: boolean,
  size?: 'small' | 'normal' | 'large' | 'xlarge',
  strokeAdjustment?: 'none' | 'thicker' | 'thinner' | 'much-thicker'
}) => {
  const iconSize = size === 'small' ? '20px' : size === 'large' ? '28px' : size === 'xlarge' ? '32px' : '24px';
  
  // Base filter for bright white - increased brightness
  let filter = 'invert(1) brightness(3.0) contrast(1.4)';
  
  // Adjust for stroke thickness
  if (strokeAdjustment === 'much-thicker') {
    filter += ' drop-shadow(0 0 1.5px white)';
  } else if (strokeAdjustment === 'thicker') {
    filter += ' drop-shadow(0 0 1px white)';
  } else if (strokeAdjustment === 'thinner') {
    filter += ' contrast(0.8)';
  }
  
  // Screenshot icon special case
  if (isWhite) {
    filter = 'brightness(0) invert(1) brightness(3.0)';
  }
  
  return (
    <img 
      src={src} 
      alt="tool icon" 
      className="w-6 h-6"
      style={{ 
        filter,
        opacity: 0.85,
        width: iconSize,
        height: iconSize
      }}
    />
  );
};

const ToolButton = ({ label, isActive, onClick, children }: { label: string, isActive: boolean, onClick: () => void, children: React.ReactNode }) => (
  <Tooltip label={label}>
    <button
      onClick={onClick}
      className="w-12 h-12 flex items-center justify-center group"
      aria-label={label}
    >
      <div className={`flex items-center justify-center rounded-md transition-colors ${isActive ? 'bg-[#0f7787] w-10 h-10' : 'group-hover:bg-gray-700 w-10 h-10'}`}>
        {children}
      </div>
    </button>
  </Tooltip>
);

export const TopToolbar = () => {
  const useWallGraphStore = useWallGraphStoreContext();
  const { projectId } = useWallGraphStoreContextValue();
  const isToolActive = useWallGraphStore((state) => state.isToolActive);
  const setToolActive = useWallGraphStore((state) => state.setToolActive);
  const isOpeningToolActive = useWallGraphStore((state) => state.isOpeningToolActive);
  const setOpeningToolActive = useWallGraphStore((state) => state.setOpeningToolActive);
  const [isShapesDropdownOpen, setIsShapesDropdownOpen] = useState(false);
  
  // Shape tools state
  const activeShapeTool = useShapesStore((state) => state.activeShapeTool);
  const setActiveShapeTool = useShapesStore((state) => state.setActiveShapeTool);
  
  // Measure tool state
  const isMeasureActive = useMeasureStore((state) => state.isMeasureActive);
  const setMeasureActive = useMeasureStore((state) => state.setMeasureActive);
  
  // Eraser tool state
  const isEraserActive = useEraserStore((state) => state.isEraserActive);
  const setEraserActive = useEraserStore((state) => state.setEraserActive);

  // Annotation tool state
  const isAnnotationModeActive = useAnnotationsStore((state) => state.isAnnotationModeActive);
  const setAnnotationModeActive = useAnnotationsStore((state) => state.setAnnotationModeActive);

  // Group tool state
  const isGroupToolActive = useGroupStore((state) => state.isGroupToolActive);
  const setGroupToolActive = useGroupStore((state) => state.setGroupToolActive);

  // Offset tool state
  const isOffsetToolActive = useOffsetStore((state) => state.isOffsetToolActive);
  const setOffsetToolActive = useOffsetStore((state) => state.setOffsetToolActive);

  // Site layout state
  const isSiteLayoutVisible = useSiteLayoutStore((state) => state.isSiteLayoutVisible);
  const toggleSiteLayout = useSiteLayoutStore((state) => state.toggleSiteLayout);

  const deactivateOtherTools = () => {
    setToolActive(false);
    setOpeningToolActive(false);
    setActiveShapeTool(null);
    setIsShapesDropdownOpen(false);
    setMeasureActive(false);
    setEraserActive(false);
    setAnnotationModeActive(false);
    setGroupToolActive(false);
    setOffsetToolActive(false);
  };

  const handleWallClick = () => {
    if (isToolActive) {
      setToolActive(false);
      return;
    }
    deactivateOtherTools();
    setToolActive(true);
  };

  const handleOpeningClick = () => {
    if (isOpeningToolActive) {
      setOpeningToolActive(false);
      return;
    }
    deactivateOtherTools();
    setOpeningToolActive(true);
  };

  // Keep dropdown open when a shape tool is active (but not zone, which has its own button)
  useEffect(() => {
    if (activeShapeTool && activeShapeTool !== 'zone') {
      setIsShapesDropdownOpen(true);
    }
  }, [activeShapeTool]);

  const handleSyncTo3D = () => {
    try {
      const store = getWallGraphStore(projectId);
      const state = store.getState();
      const payload = {
        projectId,
        graph: state.graph,
        wallHeight: state.wallHeight,
        ts: Date.now(),
      };
      const key = `sk:graph:${projectId}`;
      localStorage.setItem(key, JSON.stringify(payload));
      // Also nudge the store to ensure any subscribers fire
      store.setState({ graph: { ...state.graph } });
      console.log('🔁 [2D] Synced graph to 3D via localStorage:', {
        key,
        wallCount: Object.keys(state.graph.edges).length,
      });
    } catch (e) {
      console.error('❌ [2D] Failed to sync graph to 3D:', e);
    }
  };

  return (
    <div className="flex items-center justify-center w-full px-16">
      {/* Left section - Group 2: 3 buttons (Annotation, Comment, Mark) */}
      <div className="flex-shrink-0">
        <div className="bg-black text-white p-0 rounded-lg shadow-lg border border-gray-800">
          <div className="flex items-center divide-x divide-gray-700">
            <ToolButton
              label="Annotation"
              isActive={isAnnotationModeActive}
              onClick={() => {
                if (isAnnotationModeActive) {
                  setAnnotationModeActive(false);
                  return;
                }
                deactivateOtherTools();
                setAnnotationModeActive(true);
              }}
            >
              <SvgIcon src="/toolbar_annotation.svg" isActive={isAnnotationModeActive} size="small" />
            </ToolButton>
            <ToolButton label="Comment" isActive={false} onClick={() => {}}>
              <SvgIcon src="/toolbar_comment.svg" isActive={false} strokeAdjustment="much-thicker" />
            </ToolButton>
            <ToolButton label="Mark" isActive={false} onClick={() => {}}>
              <SvgIcon src="/toolbar_mark.svg" isActive={false} />
            </ToolButton>
          </div>
        </div>
      </div>

      {/* Spacer with 20px gap */}
      <div style={{ width: '20px' }} />

      {/* Center section - Group 1: 7 buttons (Wall, Openings + 5 tools) */}
      <div className="flex-shrink-0">
        <div className="bg-black text-white p-0 rounded-lg shadow-lg border border-gray-800">
          <div className="flex items-center divide-x divide-gray-700">
            <ToolButton label="Wall" isActive={isToolActive} onClick={handleWallClick}>
              <SvgIcon src="/wall_tool.svg" isActive={isToolActive} />
            </ToolButton>
            <ToolButton label="Elements" isActive={isOpeningToolActive} onClick={handleOpeningClick}>
              <SvgIcon src="/opening_tool.svg" isActive={isOpeningToolActive} />
            </ToolButton>
            <div className="relative">
              <ToolButton 
                label="Shapes" 
                isActive={isShapesDropdownOpen || (!!activeShapeTool && activeShapeTool !== 'zone')} 
                onClick={() => {
                  if (activeShapeTool && activeShapeTool !== 'zone') {
                    setActiveShapeTool(null);
                    setIsShapesDropdownOpen(false);
                    return;
                  }

                  if (isShapesDropdownOpen) {
                    setIsShapesDropdownOpen(false);
                    return;
                  }

                  deactivateOtherTools();
                  setIsShapesDropdownOpen(true);
                }}
              >
                <SvgIcon src="/toolbar-shapes.svg" isActive={isShapesDropdownOpen || (!!activeShapeTool && activeShapeTool !== 'zone')} />
              </ToolButton>
              
              {/* Shapes Dropdown Menu - Always visible when a shape tool is active (but not zone) */}
              {(isShapesDropdownOpen || (!!activeShapeTool && activeShapeTool !== 'zone')) && (
                <>
                  {/* Backdrop - only block pointer events when no shape tool is active (except zone) */}
                  <div 
                    className={`fixed inset-0 z-10 ${activeShapeTool && activeShapeTool !== 'zone' ? 'pointer-events-none' : ''}`}
                    onClick={() => {
                      // Only close if no shape tool is active (except zone)
                      if (!activeShapeTool || activeShapeTool === 'zone') {
                        setIsShapesDropdownOpen(false);
                      }
                    }}
                  />
                  <div className="absolute top-full left-0 mt-2 bg-black border border-gray-800 rounded-lg shadow-lg z-20 p-1 pointer-events-auto">
                    <div className="flex items-center divide-x divide-gray-700">
                      {[
                        { label: 'Line', icon: '/Shape_line.svg', iconSize: 'small' as const, rotation: 0, tool: 'line' as ShapeType, strokeAdjustment: 'none' as const },
                        { label: 'Polyline', icon: '/shape_polyline.svg', iconSize: 'large' as const, rotation: 0, tool: 'polyline' as ShapeType, strokeAdjustment: 'none' as const },
                        { label: 'Circle', icon: '/shape-crcle.svg', iconSize: 'small' as const, rotation: 0, tool: 'circle' as ShapeType, strokeAdjustment: 'none' as const },
                        { label: 'Square', icon: '/shape-rect.svg', iconSize: 'small' as const, rotation: 0, tool: 'square' as ShapeType, strokeAdjustment: 'none' as const },
                        { label: 'Triangle', icon: '/shape-tri.svg', iconSize: 'small' as const, rotation: 0, tool: 'triangle' as ShapeType, strokeAdjustment: 'none' as const },
                        { label: 'Arrow', icon: '/shape-arrow.svg', iconSize: 'small' as const, rotation: 0, tool: 'arrow' as ShapeType, strokeAdjustment: 'none' as const },
                        { label: 'Curve', icon: '/shape_curvey.svg', iconSize: 'small' as const, rotation: 0, tool: 'curve' as ShapeType, strokeAdjustment: 'none' as const },
                        { label: 'Guide line', icon: '/shape-guide.svg', iconSize: 'large' as const, rotation: 45, tool: 'guide-line' as ShapeType, strokeAdjustment: 'thicker' as const },
                      ].map((shape, index) => (
                        <Tooltip key={index} label={shape.label}>
                          <button
                            onClick={() => {
                              if (shape.tool) {
                                // Toggle tool: if already active, deactivate; otherwise activate
                                if (activeShapeTool === shape.tool) {
                                  setActiveShapeTool(null);
                                  setIsShapesDropdownOpen(false);
                                } else {
                                  setActiveShapeTool(shape.tool);
                                  // Keep dropdown open when shape tool is active
                                  setIsShapesDropdownOpen(true);
                                  // Deactivate other tools
                                  setToolActive(false);
                                  setOpeningToolActive(false);
                                  setMeasureActive(false);
                                  setEraserActive(false);
                                }
                              }
                            }}
                            className="w-10 h-10 flex items-center justify-center group"
                            aria-label={shape.label}
                          >
                            <div className={`flex items-center justify-center rounded-md transition-colors ${
                              activeShapeTool === shape.tool 
                                ? 'bg-[#0f7787] w-8 h-8' 
                                : 'group-hover:bg-gray-700 w-8 h-8'
                            }`}>
                              {shape.icon ? (
                                <div style={{ transform: `rotate(${shape.rotation}deg)` }}>
                                  <SvgIcon 
                                    src={shape.icon} 
                                    isActive={activeShapeTool === shape.tool} 
                                    size={shape.iconSize}
                                    strokeAdjustment={shape.strokeAdjustment}
                                  />
                                </div>
                              ) : (
                                <div className="w-5 h-5 flex items-center justify-center text-gray-400 text-xs">
                                  {index + 1}
                                </div>
                              )}
                            </div>
                          </button>
                        </Tooltip>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
            <ToolButton 
              label="Measure" 
              isActive={isMeasureActive} 
              onClick={() => {
                const newState = !isMeasureActive;
                setMeasureActive(newState);
                // Deactivate other tools when activating measure
                if (newState) {
                  setToolActive(false);
                  setOpeningToolActive(false);
                  setActiveShapeTool(null);
                  setIsShapesDropdownOpen(false);
                  setEraserActive(false);
                }
              }}
            >
              <SvgIcon src="/toolbar-tape.svg" isActive={isMeasureActive} />
            </ToolButton>
            <ToolButton 
              label="Zone" 
              isActive={activeShapeTool === 'zone'} 
              onClick={() => {
                const newState = activeShapeTool !== 'zone';
                if (newState) {
                  setActiveShapeTool('zone');
                  // Deactivate other tools when activating zone
                  setToolActive(false);
                  setOpeningToolActive(false);
                  setMeasureActive(false);
                  setEraserActive(false);
                } else {
                  setActiveShapeTool(null);
                }
              }}
            >
              <SvgIcon src="/toolbar-zone.svg" isActive={activeShapeTool === 'zone'} />
            </ToolButton>
            <ToolButton
              label="Group"
              isActive={isGroupToolActive}
              onClick={() => {
                const newState = !isGroupToolActive;
                setGroupToolActive(newState);
                // Deactivate other tools when activating group
                if (newState) {
                  setToolActive(false);
                  setOpeningToolActive(false);
                  setActiveShapeTool(null);
                  setIsShapesDropdownOpen(false);
                  setMeasureActive(false);
                  setEraserActive(false);
                  setOffsetToolActive(false);
                }
              }}
            >
              <SvgIcon src="/toolbar-group.svg" isActive={isGroupToolActive} strokeAdjustment="thinner" />
            </ToolButton>
            <ToolButton
              label="Offset"
              isActive={isOffsetToolActive}
              onClick={() => {
                const newState = !isOffsetToolActive;
                setOffsetToolActive(newState);
                // Deactivate other tools when activating offset
                if (newState) {
                  setToolActive(false);
                  setOpeningToolActive(false);
                  setActiveShapeTool(null);
                  setIsShapesDropdownOpen(false);
                  setMeasureActive(false);
                  setEraserActive(false);
                  setGroupToolActive(false);
                }
              }}
            >
              <SvgIcon src="/toolbar-offset.svg" isActive={isOffsetToolActive} />
            </ToolButton>
            <ToolButton 
              label="Eraser" 
              isActive={isEraserActive} 
              onClick={() => {
                const newState = !isEraserActive;
                setEraserActive(newState);
                // Deactivate other tools when activating eraser
                if (newState) {
                  setToolActive(false);
                  setOpeningToolActive(false);
                  setActiveShapeTool(null);
                  setIsShapesDropdownOpen(false);
                  setMeasureActive(false);
                }
              }}
            >
              <SvgIcon src="/eraser.svg" isActive={isEraserActive} size="large" />
            </ToolButton>
          </div>
        </div>
      </div>

      {/* Spacer with 20px gap */}
      <div style={{ width: '20px' }} />

      {/* Right section - Group 3: 3 buttons (Sync to 3D, Site layout, Screenshot) */}
      <div className="flex-shrink-0">
        <div className="bg-black text-white p-0 rounded-lg shadow-lg border border-gray-800">
          <div className="flex items-center divide-x divide-gray-700">
            <ToolButton label="Sync to 3D" isActive={false} onClick={handleSyncTo3D}>
              <SvgIcon src="/toolbar-3D.svg" isActive={false} size="xlarge" strokeAdjustment="much-thicker" />
            </ToolButton>
            <ToolButton 
              label="Site Layout" 
              isActive={isSiteLayoutVisible} 
              onClick={toggleSiteLayout}
            >
              <SvgIcon src="/toolbar-site.svg" isActive={isSiteLayoutVisible} />
            </ToolButton>
            <ToolButton label="Screenshot" isActive={false} onClick={() => {}}>
              <SvgIcon src="/toolbar_screenshot.svg" isActive={false} isWhite={true} size="large" />
            </ToolButton>
          </div>
        </div>
      </div>
    </div>
  );
};
