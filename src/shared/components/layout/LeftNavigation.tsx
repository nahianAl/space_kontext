'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Home, Upload, Download, Save, ChevronDown, User } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { ProjectDropdown } from './ProjectDropdown';
import { FilesSection } from './FilesSection';
import { cn } from '@/shared/lib/utils';
import type { FeatureType } from '@/shared/types/project';

interface LeftNavigationProps {
  projectId: string;
  currentFeature: FeatureType;
}

export function LeftNavigation({ projectId, currentFeature }: LeftNavigationProps) {
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleHome = () => router.push('/dashboard');
  const handleImport = () => {
    // TODO: Open import modal
    console.log('Import clicked');
  };
  const handleExport = () => {
    // TODO: Open export modal
    console.log('Export clicked');
  };
  const handleSave = () => {
    // TODO: Trigger manual save
    console.log('Save clicked');
  };

  return (
    <aside
      className={cn(
        'flex flex-col border-r border-border bg-muted/30 transition-all duration-300',
        isCollapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Menu Section */}
      <div className="border-b border-border p-2">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span className="font-semibold">Menu</span>
          <ChevronDown className={cn('ml-auto h-4 w-4 transition-transform', menuOpen && 'rotate-180')} />
        </Button>

        {menuOpen && !isCollapsed && (
          <div className="mt-2 space-y-1">
            <Button variant="ghost" size="sm" className="w-full justify-start" onClick={handleHome}>
              <Home className="mr-2 h-4 w-4" />
              Home
            </Button>
            <Button variant="ghost" size="sm" className="w-full justify-start" onClick={handleImport}>
              <Upload className="mr-2 h-4 w-4" />
              Import
            </Button>
            <Button variant="ghost" size="sm" className="w-full justify-start" onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button variant="ghost" size="sm" className="w-full justify-start" onClick={handleSave}>
              <Save className="mr-2 h-4 w-4" />
              Save
            </Button>
          </div>
        )}
      </div>

      {/* Project Dropdown */}
      <ProjectDropdown
        projectId={projectId}
        currentFeature={currentFeature}
        isCollapsed={isCollapsed}
      />

      {/* Files Section */}
      <FilesSection projectId={projectId} isCollapsed={isCollapsed} />

      {/* Spacer */}
      <div className="flex-1" />

      {/* User Section */}
      <div className="border-t border-border p-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="w-full justify-start">
              <User className="h-4 w-4" />
              {!isCollapsed && <span className="ml-2">Profile</span>}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Billing</DropdownMenuItem>
            <DropdownMenuItem>Sign Out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Collapse Toggle */}
      <Button
        variant="ghost"
        size="sm"
        className="m-2"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        {isCollapsed ? '→' : '←'}
      </Button>
    </aside>
  );
}
