/**
 * Design Toolbar component for architectural design tools
 * Provides tool selection and design mode controls
 */

'use client';

import { useState } from 'react';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import { 
  MousePointer2,
  Square,
  Circle,
  Triangle,
  Move,
  RotateCw,
  Scale,
  Copy,
  Trash2,
  Grid3X3,
  Ruler,
  Layers,
  Eye,
  EyeOff,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { cn } from '@/shared/lib/utils';

interface DesignTool {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  shortcut?: string;
  description: string;
  category: 'select' | 'draw' | 'modify' | 'view' | 'utility';
}

const designTools: DesignTool[] = [
  // Selection tools
  {
    id: 'select',
    label: 'Select',
    icon: MousePointer2 as React.ComponentType<{ className?: string }>,
    shortcut: 'V',
    description: 'Select and move objects',
    category: 'select'
  },
  {
    id: 'move',
    label: 'Move',
    icon: Move as React.ComponentType<{ className?: string }>,
    shortcut: 'M',
    description: 'Move selected objects',
    category: 'select'
  },

  // Drawing tools
  {
    id: 'rectangle',
    label: 'Rectangle',
    icon: Square as React.ComponentType<{ className?: string }>,
    shortcut: 'R',
    description: 'Draw rectangular shapes',
    category: 'draw'
  },
  {
    id: 'circle',
    label: 'Circle',
    icon: Circle as React.ComponentType<{ className?: string }>,
    shortcut: 'C',
    description: 'Draw circular shapes',
    category: 'draw'
  },
  {
    id: 'polygon',
    label: 'Polygon',
    icon: Triangle as React.ComponentType<{ className?: string }>,
    shortcut: 'P',
    description: 'Draw polygonal shapes',
    category: 'draw'
  },

  // Modification tools
  {
    id: 'rotate',
    label: 'Rotate',
    icon: RotateCw as React.ComponentType<{ className?: string }>,
    shortcut: 'O',
    description: 'Rotate selected objects',
    category: 'modify'
  },
  {
    id: 'scale',
    label: 'Scale',
    icon: Scale as React.ComponentType<{ className?: string }>,
    shortcut: 'S',
    description: 'Scale selected objects',
    category: 'modify'
  },
  {
    id: 'copy',
    label: 'Copy',
    icon: Copy as React.ComponentType<{ className?: string }>,
    shortcut: 'Ctrl+C',
    description: 'Copy selected objects',
    category: 'modify'
  },
  {
    id: 'delete',
    label: 'Delete',
    icon: Trash2 as React.ComponentType<{ className?: string }>,
    shortcut: 'Delete',
    description: 'Delete selected objects',
    category: 'modify'
  },

  // View tools
  {
    id: 'zoom-in',
    label: 'Zoom In',
    icon: ZoomIn as React.ComponentType<{ className?: string }>,
    shortcut: 'Ctrl++',
    description: 'Zoom in on canvas',
    category: 'view'
  },
  {
    id: 'zoom-out',
    label: 'Zoom Out',
    icon: ZoomOut as React.ComponentType<{ className?: string }>,
    shortcut: 'Ctrl+-',
    description: 'Zoom out on canvas',
    category: 'view'
  },
  {
    id: 'fit-to-screen',
    label: 'Fit to Screen',
    icon: Maximize2 as React.ComponentType<{ className?: string }>,
    shortcut: 'Ctrl+0',
    description: 'Fit all objects to screen',
    category: 'view'
  },

  // Utility tools
  {
    id: 'grid',
    label: 'Grid',
    icon: Grid3X3 as React.ComponentType<{ className?: string }>,
    shortcut: 'G',
    description: 'Toggle grid visibility',
    category: 'utility'
  },
  {
    id: 'ruler',
    label: 'Ruler',
    icon: Ruler as React.ComponentType<{ className?: string }>,
    shortcut: 'U',
    description: 'Toggle ruler visibility',
    category: 'utility'
  },
  {
    id: 'layers',
    label: 'Layers',
    icon: Layers as React.ComponentType<{ className?: string }>,
    shortcut: 'L',
    description: 'Toggle layers panel',
    category: 'utility'
  }
];

interface DesignToolbarProps {
  activeTool?: string;
  onToolSelect?: (toolId: string) => void;
  showGrid?: boolean;
  onGridToggle?: (show: boolean) => void;
  showRuler?: boolean;
  onRulerToggle?: (show: boolean) => void;
  showLayers?: boolean;
  onLayersToggle?: (show: boolean) => void;
  zoom?: number;
  onZoomChange?: (zoom: number) => void;
  className?: string;
}

export function DesignToolbar({
  activeTool = 'select',
  onToolSelect,
  showGrid = true,
  onGridToggle,
  showRuler = true,
  onRulerToggle,
  showLayers = false,
  onLayersToggle,
  zoom = 100,
  onZoomChange,
  className
}: DesignToolbarProps) {
  const [hoveredTool, setHoveredTool] = useState<string | null>(null);

  const handleToolClick = (toolId: string) => {
    onToolSelect?.(toolId);
  };

  const handleZoomIn = () => {
    onZoomChange?.(Math.min(zoom + 25, 400));
  };

  const handleZoomOut = () => {
    onZoomChange?.(Math.max(zoom - 25, 25));
  };

  const handleFitToScreen = () => {
    onZoomChange?.(100);
  };

  const groupedTools = designTools.reduce((acc, tool) => {
    if (!acc[tool.category]) {
      acc[tool.category] = [];
    }
    acc[tool.category]?.push(tool);
    return acc;
  }, {} as Record<string, DesignTool[]>);

  return (
    <div className={cn(
      'flex items-center space-x-1 p-2 bg-background border-b border-border',
      className
    )}>
      {/* Tool Groups */}
      {Object.entries(groupedTools).map(([category, tools]) => (
        <div key={category} className="flex items-center space-x-1">
          {tools.map((tool) => {
            const Icon = tool.icon;
            const isActive = activeTool === tool.id;
            const isHovered = hoveredTool === tool.id;

            return (
              <div key={tool.id} className="relative">
                <Button
                  variant={isActive ? 'default' : 'ghost'}
                  size="sm"
                  className={cn(
                    'h-8 w-8 p-0',
                    isActive && 'bg-architectural-blue text-white hover:bg-architectural-blue/90'
                  )}
                  onClick={() => handleToolClick(tool.id)}
                  onMouseEnter={() => setHoveredTool(tool.id)}
                  onMouseLeave={() => setHoveredTool(null)}
                  title={`${tool.label} (${tool.shortcut})`}
                >
                  <Icon className="h-4 w-4" />
                </Button>

                {/* Tooltip */}
                {isHovered && (
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 z-50">
                    <Card className="shadow-lg border">
                      <CardContent className="p-2">
                        <div className="text-xs">
                          <div className="font-medium">{tool.label}</div>
                          <div className="text-muted-foreground">{tool.description}</div>
                          {tool.shortcut && (
                            <div className="text-muted-foreground mt-1">
                              Shortcut: {tool.shortcut}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            );
          })}
          
          {/* Separator between tool groups */}
          <div className="w-px h-6 bg-border mx-1" />
        </div>
      ))}

      {/* View Controls */}
      <div className="flex items-center space-x-1 ml-4">
        <Button
          variant={showGrid ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onGridToggle?.(!showGrid)}
          className={cn(
            'h-8 w-8 p-0',
            showGrid && 'bg-architectural-blue text-white hover:bg-architectural-blue/90'
          )}
        >
          <Grid3X3 className="h-4 w-4" />
        </Button>

        <Button
          variant={showRuler ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onRulerToggle?.(!showRuler)}
          className={cn(
            'h-8 w-8 p-0',
            showRuler && 'bg-architectural-blue text-white hover:bg-architectural-blue/90'
          )}
        >
          <Ruler className="h-4 w-4" />
        </Button>

        <Button
          variant={showLayers ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onLayersToggle?.(!showLayers)}
          className={cn(
            'h-8 w-8 p-0',
            showLayers && 'bg-architectural-blue text-white hover:bg-architectural-blue/90'
          )}
        >
          <Layers className="h-4 w-4" />
        </Button>
      </div>

      {/* Zoom Controls */}
      <div className="flex items-center space-x-1 ml-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleZoomOut}
          className="h-8 w-8 p-0"
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        
        <div className="px-2 py-1 text-xs font-medium min-w-[3rem] text-center">
          {zoom}%
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={handleZoomIn}
          className="h-8 w-8 p-0"
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={handleFitToScreen}
          className="h-8 w-8 p-0"
        >
          <Maximize2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
