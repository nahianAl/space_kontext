/**
 * Sidebar component for the architectural design platform
 * Provides navigation and tool access for different design modes
 */

'use client';

import { useState } from 'react';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import { 
  Layout, 
  Map, 
  Square, 
  Box, 
  Layers, 
  Settings, 
  FileText,
  ChevronLeft,
  ChevronRight,
  Home,
  FolderOpen,
  Users
} from 'lucide-react';
import { cn } from '@/shared/lib/utils';

interface SidebarProps {
  className?: string;
  collapsed?: boolean;
  onToggle?: () => void;
  activeSection?: string;
  onSectionChange?: (section: string) => void;
}

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  badge?: string;
}

const navigationItems: NavigationItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: Home as React.ComponentType<{ className?: string }>,
    description: 'Project overview and recent work'
  },
  {
    id: 'site-analysis',
    label: 'Site Analysis',
    icon: Map as React.ComponentType<{ className?: string }>,
    description: 'Geospatial data and site context'
  },
  {
    id: 'floorplan-2d',
    label: '2D Floorplan',
    icon: Square as React.ComponentType<{ className?: string }>,
    description: 'Floor plan design and editing'
  },
  {
    id: 'model-3d',
    label: '3D Model',
    icon: Box as React.ComponentType<{ className?: string }>,
    description: '3D visualization and modeling'
  },
  {
    id: 'massing',
    label: 'Massing',
    icon: Layers as React.ComponentType<{ className?: string }>,
    description: 'Building massing and form studies'
  }
];

const projectItems: NavigationItem[] = [
  {
    id: 'projects',
    label: 'Projects',
    icon: FolderOpen as React.ComponentType<{ className?: string }>,
    description: 'Manage your projects'
  },
  {
    id: 'templates',
    label: 'Templates',
    icon: FileText as React.ComponentType<{ className?: string }>,
    description: 'Design templates and presets'
  },
  {
    id: 'collaboration',
    label: 'Team',
    icon: Users as React.ComponentType<{ className?: string }>,
    description: 'Collaborate with team members'
  }
];

export function Sidebar({ 
  className, 
  collapsed = false, 
  onToggle,
  activeSection = 'dashboard',
  onSectionChange 
}: SidebarProps) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const handleItemClick = (itemId: string) => {
    onSectionChange?.(itemId);
  };

  const renderNavigationGroup = (items: NavigationItem[], title: string) => (
    <div className="space-y-1">
      {!collapsed && (
        <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          {title}
        </h3>
      )}
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = activeSection === item.id;
        const isHovered = hoveredItem === item.id;

        return (
          <div key={item.id} className="relative">
            <Button
              variant={isActive ? 'default' : 'ghost'}
              size="sm"
              className={cn(
                'w-full justify-start h-10 px-3',
                collapsed && 'px-2',
                isActive && 'bg-architectural-blue text-white hover:bg-architectural-blue/90',
                !isActive && 'hover:bg-muted'
              )}
              onClick={() => handleItemClick(item.id)}
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <Icon className={cn('h-4 w-4', !collapsed && 'mr-3')} />
              {!collapsed && (
                <span className="truncate">{item.label}</span>
              )}
              {item.badge && !collapsed && (
                <span className="ml-auto bg-architectural-blue text-white text-xs px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </Button>

            {/* Tooltip for collapsed state */}
            {collapsed && isHovered && (
              <div className="absolute left-full top-0 ml-2 z-50">
                <Card className="shadow-lg border">
                  <CardContent className="p-3">
                    <div className="flex items-center space-x-2">
                      <Icon className="h-4 w-4" />
                      <span className="font-medium">{item.label}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );

  return (
    <aside className={cn(
      'flex flex-col h-full bg-background border-r border-border transition-all duration-300',
      collapsed ? 'w-16' : 'w-64',
      className
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-architectural-blue rounded-lg flex items-center justify-center">
              <Layout className="h-4 w-4 text-white" />
            </div>
            <div>
              <h2 className="font-semibold text-sm">Space Kontext</h2>
              <p className="text-xs text-muted-foreground">Design Platform</p>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="w-8 h-8 bg-architectural-blue rounded-lg flex items-center justify-center mx-auto">
            <Layout className="h-4 w-4 text-white" />
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className="h-8 w-8 p-0"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {renderNavigationGroup(navigationItems, 'Design Tools')}
        {renderNavigationGroup(projectItems, 'Project')}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            'w-full justify-start h-10 px-3',
            collapsed && 'px-2'
          )}
        >
          <Settings className={cn('h-4 w-4', !collapsed && 'mr-3')} />
          {!collapsed && <span>Settings</span>}
        </Button>
      </div>
    </aside>
  );
}
