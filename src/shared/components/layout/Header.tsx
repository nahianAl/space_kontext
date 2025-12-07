/**
 * Enhanced Header component for the architectural design platform
 * Provides navigation, user controls, and project context
 */

'use client';

import { useState } from 'react';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import { 
  Search, 
  Bell, 
  HelpCircle, 
  Menu,
  Save,
  Undo,
  Redo,
  Share2,
  Download,
  Upload,
  Settings
} from 'lucide-react';
// import { SignInButton, SignUpButton, UserButton, useUser } from '@clerk/nextjs'; // Temporarily disabled for development
import { cn } from '@/shared/lib/utils';

interface HeaderProps {
  className?: string;
  onMenuToggle?: () => void;
  showDesignTools?: boolean;
  projectName?: string;
  onSave?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
  hasUnsavedChanges?: boolean;
}

export function Header({
  className,
  onMenuToggle,
  showDesignTools = false,
  projectName,
  onSave,
  onUndo,
  onRedo,
  canUndo = false,
  canRedo = false,
  hasUnsavedChanges = false
}: HeaderProps) {
  // const { isSignedIn, user } = useUser(); // Temporarily disabled for development
  const isSignedIn = true; // Always show as signed in for development
  const user = { firstName: 'Demo', emailAddresses: [{ emailAddress: 'demo@spacekontext.com' }] }; // Demo user
  const [searchFocused, setSearchFocused] = useState(false);

  return (
    <header className={cn(
      'architectural-header flex items-center justify-between px-6 py-4 bg-background border-b border-border',
      className
    )}>
      {/* Left Section */}
      <div className="flex items-center space-x-4">
        {/* Menu Toggle */}
        {onMenuToggle && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuToggle}
            className="lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>
        )}

        {/* Logo and Project Info */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-architectural-blue rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">SK</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-architectural-blue">
                Space Kontext
              </h1>
              {projectName && (
                <p className="text-sm text-muted-foreground">
                  {projectName}
                  {hasUnsavedChanges && (
                    <span className="ml-2 text-orange-500">• Unsaved changes</span>
                  )}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Center Section - Design Tools */}
      {showDesignTools && (
        <div className="hidden md:flex items-center space-x-2">
          <div className="flex items-center space-x-1 bg-muted rounded-lg p-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={onUndo}
              disabled={!canUndo}
              className="h-8 w-8 p-0"
            >
              <Undo className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onRedo}
              disabled={!canRedo}
              className="h-8 w-8 p-0"
            >
              <Redo className="h-4 w-4" />
            </Button>
          </div>
          
          <Button
            variant="default"
            size="sm"
            onClick={onSave}
            className="bg-architectural-blue hover:bg-architectural-blue/90"
          >
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>

          <div className="flex items-center space-x-1">
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      )}

      {/* Right Section */}
      <div className="flex items-center space-x-4">
        {/* Search */}
        <div className="hidden md:block relative">
          <div className={cn(
            'flex items-center space-x-2 px-3 py-2 rounded-lg border transition-all duration-200',
            searchFocused 
              ? 'border-architectural-blue bg-background' 
              : 'border-border bg-muted/50'
          )}>
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search projects, tools..."
              className="bg-transparent border-none outline-none text-sm placeholder:text-muted-foreground w-64"
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
          </div>
        </div>

        {/* Notifications */}
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
            3
          </span>
        </Button>

        {/* Help */}
        <Button variant="ghost" size="sm">
          <HelpCircle className="h-5 w-5" />
        </Button>

        {/* User Authentication */}
        {isSignedIn ? (
          <div className="flex items-center space-x-3">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium">
                {user?.firstName || user?.emailAddresses[0]?.emailAddress}
              </p>
              <p className="text-xs text-muted-foreground">
                {user?.emailAddresses[0]?.emailAddress}
              </p>
            </div>
            {/* <UserButton
              appearance={{
                elements: {
                  avatarBox: 'w-8 h-8',
                },
              }}
            /> */}
            <div className="w-8 h-8 bg-architectural-blue rounded-full flex items-center justify-center text-white text-sm font-bold">
              D
            </div>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            {/* <SignInButton mode="modal"> */}
              <Button variant="outline" size="sm" onClick={() => window.location.href = '/dashboard'}>
                Sign In
              </Button>
            {/* </SignInButton> */}
            {/* <SignUpButton mode="modal"> */}
              <Button size="sm" className="bg-architectural-blue hover:bg-architectural-blue/90" onClick={() => window.location.href = '/dashboard'}>
                Get Started
              </Button>
            {/* </SignUpButton> */}
          </div>
        )}
      </div>
    </header>
  );
}
