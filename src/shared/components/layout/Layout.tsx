/**
 * Main Layout component for the architectural design platform
 * Orchestrates Header, Sidebar, and MainContent components
 */

'use client';

import { useState, ReactNode } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { MainContent } from './MainContent';
import { cn } from '@/shared/lib/utils';

interface LayoutProps {
  children: ReactNode;
  className?: string;
  showSidebar?: boolean;
  showHeader?: boolean;
  sidebarCollapsed?: boolean;
  onSidebarToggle?: (collapsed: boolean) => void;
  activeSection?: string;
  onSectionChange?: (section: string) => void;
  projectName?: string;
  showDesignTools?: boolean;
  onSave?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
  hasUnsavedChanges?: boolean;
}

export function Layout({
  children,
  className,
  showSidebar = true,
  showHeader = true,
  sidebarCollapsed = false,
  onSidebarToggle,
  activeSection = 'dashboard',
  onSectionChange,
  projectName,
  showDesignTools = false,
  onSave,
  onUndo,
  onRedo,
  canUndo = false,
  canRedo = false,
  hasUnsavedChanges = false
}: LayoutProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(sidebarCollapsed);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSidebarToggle = () => {
    const newCollapsed = !isSidebarCollapsed;
    setIsSidebarCollapsed(newCollapsed);
    onSidebarToggle?.(newCollapsed);
  };

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className={cn(
      'flex h-screen bg-background',
      className
    )}>
      {/* Sidebar */}
      {showSidebar && (
        <>
          {/* Desktop Sidebar */}
          <div className="hidden lg:block">
            <Sidebar
              collapsed={isSidebarCollapsed}
              onToggle={handleSidebarToggle}
              activeSection={activeSection}
              {...(onSectionChange && { onSectionChange })}
            />
          </div>

          {/* Mobile Sidebar Overlay */}
          {isMobileMenuOpen && (
            <div className="lg:hidden fixed inset-0 z-50">
              <div 
                className="fixed inset-0 bg-black/50"
                onClick={() => setIsMobileMenuOpen(false)}
              />
              <div className="fixed left-0 top-0 h-full w-64">
                <Sidebar
                  collapsed={false}
                  onToggle={() => setIsMobileMenuOpen(false)}
                  activeSection={activeSection}
                  onSectionChange={(section) => {
                    onSectionChange?.(section);
                    setIsMobileMenuOpen(false);
                  }}
                />
              </div>
            </div>
          )}
        </>
      )}

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 min-h-0">
        {/* Header */}
        {showHeader && (
          <Header
            onMenuToggle={handleMobileMenuToggle}
            showDesignTools={showDesignTools}
            {...(projectName && { projectName })}
            {...(onSave && { onSave })}
            {...(onUndo && { onUndo })}
            {...(onRedo && { onRedo })}
            canUndo={canUndo}
            canRedo={canRedo}
            hasUnsavedChanges={hasUnsavedChanges}
          />
        )}

        {/* Page Content */}
        <MainContent
          showToolbar={showDesignTools}
          padding="none"
          background="default"
        >
          {children}
        </MainContent>
      </div>
    </div>
  );
}

/**
 * Page Layout component for standard pages
 */
interface PageLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
  className?: string;
  showBackButton?: boolean;
  onBack?: () => void;
  actions?: ReactNode;
}

export function PageLayout({
  children,
  title,
  description,
  className,
  showBackButton = false,
  onBack,
  actions
}: PageLayoutProps) {
  return (
    <div className={cn('min-h-screen bg-background', className)}>
      {/* Page Header */}
      {(title || description || actions) && (
        <div className="border-b border-border bg-background">
          <div className="px-6 py-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                {showBackButton && (
                  <button
                    onClick={onBack}
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    ← Back
                  </button>
                )}
                {title && (
                  <h1 className="text-3xl font-bold text-foreground">
                    {title}
                  </h1>
                )}
                {description && (
                  <p className="text-muted-foreground">
                    {description}
                  </p>
                )}
              </div>
              {actions && (
                <div className="flex items-center space-x-2">
                  {actions}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Page Content */}
      <div className="px-6 py-6">
        {children}
      </div>
    </div>
  );
}

/**
 * Dashboard Layout component for dashboard pages
 */
interface DashboardLayoutProps {
  children: ReactNode;
  className?: string;
}

export function DashboardLayout({ children, className }: DashboardLayoutProps) {
  return (
    <div className={cn('min-h-screen bg-background', className)}>
      <div className="px-6 py-6">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
