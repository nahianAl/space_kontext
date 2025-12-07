/**
 * Main Content area component for the architectural design platform
 * Provides flexible content area with optional toolbar and panels
 */

'use client';

import { ReactNode } from 'react';
import { cn } from '@/shared/lib/utils';

interface MainContentProps {
  children: ReactNode;
  className?: string;
  showToolbar?: boolean;
  showLeftPanel?: boolean;
  showRightPanel?: boolean;
  leftPanelWidth?: string;
  rightPanelWidth?: string;
  toolbarHeight?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  background?: 'default' | 'canvas' | 'muted';
}

export function MainContent({
  children,
  className,
  showToolbar = false,
  showLeftPanel = false,
  showRightPanel = false,
  leftPanelWidth = 'w-80',
  rightPanelWidth = 'w-80',
  toolbarHeight = 'h-16',
  padding = 'md',
  background = 'default'
}: MainContentProps) {
  const paddingClasses = {
    none: '',
    sm: 'p-2',
    md: 'p-4',
    lg: 'p-6'
  };

  const backgroundClasses = {
    default: 'bg-background',
    canvas: 'bg-canvas',
    muted: 'bg-muted/30'
  };

  return (
    <div className={cn(
      'flex flex-col flex-1 min-h-0',
      className
    )}>
      {/* Toolbar */}
      {showToolbar && (
        <div className={cn(
          'border-b border-border bg-background',
          toolbarHeight
        )}>
          {/* Toolbar content will be provided by parent */}
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex flex-1 min-h-0">
        {/* Left Panel */}
        {showLeftPanel && (
          <div className={cn(
            'border-r border-border bg-background flex-shrink-0',
            leftPanelWidth
          )}>
            {/* Left panel content will be provided by parent */}
          </div>
        )}

        {/* Center Content */}
        <div className={cn(
          'flex-1 min-h-0 overflow-auto',
          paddingClasses[padding],
          backgroundClasses[background]
        )}>
          {children}
        </div>

        {/* Right Panel */}
        {showRightPanel && (
          <div className={cn(
            'border-l border-border bg-background flex-shrink-0',
            rightPanelWidth
          )}>
            {/* Right panel content will be provided by parent */}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Toolbar component for design tools
 */
interface ToolbarProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'floating' | 'compact';
}

export function Toolbar({ 
  children, 
  className, 
  variant = 'default' 
}: ToolbarProps) {
  const variantClasses = {
    default: 'border-b border-border bg-background',
    floating: 'bg-background/95 backdrop-blur-sm border border-border rounded-lg shadow-lg',
    compact: 'bg-muted/50 border-b border-border'
  };

  return (
    <div className={cn(
      'flex items-center px-4 py-2 space-x-2',
      variantClasses[variant],
      className
    )}>
      {children}
    </div>
  );
}

/**
 * Panel component for sidebars and property panels
 */
interface PanelProps {
  children: ReactNode;
  className?: string;
  title?: string;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  onToggle?: (collapsed: boolean) => void;
}

export function Panel({ 
  children, 
  className, 
  title,
  collapsible = false,
  defaultCollapsed = false,
  onToggle
}: PanelProps) {
  return (
    <div className={cn(
      'flex flex-col h-full bg-background',
      className
    )}>
      {title && (
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <h3 className="font-semibold text-sm">{title}</h3>
          {collapsible && (
            <button
              onClick={() => onToggle?.(!defaultCollapsed)}
              className="text-muted-foreground hover:text-foreground"
            >
              {/* Collapse/Expand icon would go here */}
            </button>
          )}
        </div>
      )}
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
}
