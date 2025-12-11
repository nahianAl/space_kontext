# User Flow Reorganization - Implementation Plan

## Overview

This document outlines the complete implementation plan for reorganizing the Space Kontext user flow post-login. The new architecture creates a professional, intuitive workspace for architectural and interior design.

---

## Table of Contents

1. [User Flow Summary](#user-flow-summary)
2. [Route Structure](#route-structure)
3. [Component Architecture](#component-architecture)
4. [File Structure](#file-structure)
5. [Data Models](#data-models)
6. [UI Layouts](#ui-layouts)
7. [Implementation Steps](#implementation-steps)
8. [Technical Considerations](#technical-considerations)

---

## User Flow Summary

### Flow Diagram

```
┌─────────────┐
│   Landing   │ (/)
│    Page     │
└──────┬──────┘
       │ Click "Start Designing"
       ↓
┌─────────────┐
│  Dashboard  │ (/dashboard)
│             │
│ • Recent    │
│   Projects  │
│ • Create    │
│   New       │
└──────┬──────┘
       │ Select/Create Project
       ↓
┌─────────────┐
│ Project Hub │ (/projects/[id])
│             │
│ 4 Feature   │
│   Cards:    │
│ • Site      │
│ • 2D        │
│ • 3D        │
│ • Render    │
└──────┬──────┘
       │ Click Feature Card
       ↓
┌─────────────────────────────┐
│   Feature Workspace         │
│                             │
│ ┌────┬────────────────────┐ │
│ │Nav │  Main Canvas       │ │
│ │    │                    │ │
│ │    │  Feature-specific  │ │
│ │    │  Editor UI         │ │
│ │    │                    │ │
│ └────┴────────────────────┘ │
│                             │
│ Routes:                     │
│ • /projects/[id]/site-analysis │
│ • /projects/[id]/floorplan-2d  │
│ • /projects/[id]/model-3d      │
│ • /projects/[id]/render        │
└─────────────────────────────┘
```

### Navigation Rules

1. **Dashboard** has NO left nav
2. **Project Hub** has NO left nav
3. **Feature Workspaces** have persistent left nav
4. Left nav includes Project dropdown to switch between features
5. All navigation is routable (URLs change)

---

## Route Structure

### Current Routes (Keep)

```
/                              → Landing page (existing)
/dashboard                     → Dashboard (existing, needs update)
/projects/[id]                 → Project Hub (existing, needs update)
/projects/[id]/site-analysis   → Site feature (existing)
/projects/[id]/floorplan-2d    → 2D editor feature (existing)
/projects/[id]/model-3d        → 3D model feature (existing)
/projects/[id]/massing         → Massing feature (existing)
```

### New/Modified Routes

```
/projects/[id]/render          → NEW: Render feature (placeholder)
```

### Route Behavior

All feature routes (`/projects/[id]/*`) should:
- Show persistent left navigation
- Load feature-specific workspace
- Maintain project context
- Auto-save progress

---

## Component Architecture

### New Components to Create

```
src/
├── shared/
│   └── components/
│       └── layout/
│           ├── FeatureLayout.tsx        ← NEW: Wrapper for all features
│           ├── LeftNavigation.tsx       ← NEW: Persistent left nav
│           ├── ProjectDropdown.tsx      ← NEW: Feature switcher
│           ├── FilesSection.tsx         ← NEW: Files list/preview
│           └── FilePreviewModal.tsx     ← NEW: File preview modal
│
├── features/
│   └── project-management/
│       ├── components/
│       │   ├── ProjectHub.tsx           ← UPDATE: Feature cards page
│       │   ├── DashboardPage.tsx        ← UPDATE: Remove nav bar
│       │   └── FeatureCard.tsx          ← NEW: Reusable feature card
│       └── hooks/
│           └── useProjectFiles.ts       ← NEW: File management hook
│
└── app/
    ├── dashboard/
    │   └── page.tsx                     ← UPDATE: Simplified layout
    ├── projects/
    │   ├── [id]/
    │   │   ├── page.tsx                 ← UPDATE: Project Hub
    │   │   ├── site-analysis/
    │   │   │   └── page.tsx             ← UPDATE: Add FeatureLayout
    │   │   ├── floorplan-2d/
    │   │   │   └── page.tsx             ← UPDATE: Add FeatureLayout
    │   │   ├── model-3d/
    │   │   │   └── page.tsx             ← UPDATE: Add FeatureLayout
    │   │   └── render/
    │   │       └── page.tsx             ← NEW: Placeholder
    │   └── page.tsx                     ← Projects list (keep)
    └── api/
        └── projects/
            └── [id]/
                └── files/
                    └── route.ts         ← NEW: File operations API
```

---

## Data Models

### Project Model (Update Existing)

```typescript
// prisma/schema.prisma
model Project {
  id              String         @id @default(cuid())
  name            String
  createdAt       DateTime       @default(now())
  updatedAt       DateTime       @updatedAt
  userId          String

  // Feature-specific data (JSON)
  siteData        Json?          // Site analysis state
  floorplan2dData Json?          // 2D editor state
  model3dData     Json?          // 3D model state
  renderData      Json?          // Render settings

  // Files
  files           ProjectFile[]

  // Relations
  user            User           @relation(fields: [userId], references: [id])
}

model ProjectFile {
  id          String   @id @default(cuid())
  projectId   String
  name        String
  type        String   // 'dxf', 'png', 'svg', 'gltf', 'obj', 'pdf'
  category    String   // 'import', 'export', 'render'
  url         String   // Storage URL (Vercel Blob, S3, etc.)
  size        Int      // File size in bytes
  uploadedAt  DateTime @default(now())

  project     Project  @relation(fields: [projectId], references: [id], onDelete: Cascade)

  @@index([projectId])
  @@index([category])
}
```

### TypeScript Interfaces

```typescript
// src/shared/types/project.ts

export interface Project {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  siteData?: any;
  floorplan2dData?: any;
  model3dData?: any;
  renderData?: any;
  files?: ProjectFile[];
}

export interface ProjectFile {
  id: string;
  projectId: string;
  name: string;
  type: 'dxf' | 'png' | 'svg' | 'gltf' | 'obj' | 'pdf';
  category: 'import' | 'export' | 'render';
  url: string;
  size: number;
  uploadedAt: string;
}

export type FeatureType = 'site-analysis' | 'floorplan-2d' | 'model-3d' | 'render';

export interface FeatureMetadata {
  id: FeatureType;
  title: string;
  description: string;
  icon: React.ComponentType;
  route: string;
  color: string;
}
```

---

## UI Layouts

### 1. Dashboard Layout

```
┌──────────────────────────────────────────────┐
│  Space Kontext              [User Avatar] 👤 │
├──────────────────────────────────────────────┤
│                                              │
│  Dashboard                                   │
│                                              │
│  ┌────────────────────────────────────────┐  │
│  │ Create New Project                     │  │
│  │ [Project Name Input]      [Create]     │  │
│  └────────────────────────────────────────┘  │
│                                              │
│  My Projects                                 │
│  ┌──────────────┐ ┌──────────────┐         │
│  │ Downtown     │ │ Residential  │         │
│  │ Office       │ │ Complex      │         │
│  │              │ │              │         │
│  │ [Open]       │ │ [Open]       │         │
│  └──────────────┘ └──────────────┘         │
│                                              │
└──────────────────────────────────────────────┘
```

**Components:**
- No left navigation
- Simple header with logo + user avatar
- Project creation card
- Project grid with cards

---

### 2. Project Hub Layout

```
┌──────────────────────────────────────────────┐
│  ← Dashboard    Downtown Office Building  👤 │
├──────────────────────────────────────────────┤
│                                              │
│  Select a feature to begin designing         │
│                                              │
│  ┌────────────┐ ┌────────────┐             │
│  │  🗺️        │ │  📐        │             │
│  │  Site      │ │  2D Floor  │             │
│  │  Analysis  │ │  Editor    │             │
│  │            │ │            │             │
│  │  [Open]    │ │  [Open]    │             │
│  └────────────┘ └────────────┘             │
│                                              │
│  ┌────────────┐ ┌────────────┐             │
│  │  🧊        │ │  🎨        │             │
│  │  3D Model  │ │  Render    │             │
│  │  Editor    │ │  (Soon)    │             │
│  │            │ │            │             │
│  │  [Open]    │ │  [Open]    │             │
│  └────────────┘ └────────────┘             │
│                                              │
│  Optional: Recent Activity, Quick Stats      │
│                                              │
└──────────────────────────────────────────────┘
```

**Components:**
- Header with back button + project name + user avatar
- 4 feature cards (2x2 grid)
- Each card has icon, title, description, button
- No left navigation

---

### 3. Feature Workspace Layout

```
┌────────┬─────────────────────────────────────┐
│ Menu   │  Downtown Office - 2D Floor Editor │👤
│ ┌────┐ ├─────────────────────────────────────┤
│ │Home│ │                                     │
│ │Imp.│ │                                     │
│ │Exp.│ │                                     │
│ │Save│ │         MAIN WORKSPACE              │
│ └────┘ │      (Feature-Specific UI)          │
│        │                                     │
│Project │       • 2D Editor: Canvas           │
│  ⚡ [v]│       • 3D Model: Three.js          │
│        │       • Site: Map                   │
│┌──────┐│       • Render: Placeholder         │
││Site  ││                                     │
││2D Ed.││                                     │
││3D Mod││                                     │
││Render││                                     │
│└──────┘│                                     │
│        │                                     │
│Files   │                                     │
│📁 Imp..│                                     │
│📁 Exp..│                                     │
│📁 Ren..│                                     │
│        │                                     │
│        │                                     │
│        │                                     │
│[User]  │                                     │
└────────┴─────────────────────────────────────┘
```

**Left Nav Sections (60-260px wide):**

1. **Menu** (Collapsible section)
   - Home (→ Dashboard)
   - Import (Modal/Dialog)
   - Export (Context menu)
   - Save (Manual save)

2. **Project** (Dropdown button)
   - Dropdown menu to switch features
   - Shows current feature with checkmark
   - Options: Site | 2D | 3D | Render

3. **Files** (Collapsible tree)
   - 📁 Imports (expandable)
   - 📁 Exports (expandable)
   - 📁 Renders (expandable)
   - Click file → preview modal

4. **User** (Bottom)
   - Avatar thumbnail
   - Settings, Profile, Billing, Logout

---

## Implementation Steps

### Phase 1: Foundation (Database & Types)

#### Step 1.1: Update Prisma Schema

**File:** `prisma/schema.prisma`

```prisma
// Add ProjectFile model
model ProjectFile {
  id          String   @id @default(cuid())
  projectId   String
  name        String
  type        String
  category    String
  url         String
  size        Int
  uploadedAt  DateTime @default(now())

  project     Project  @relation(fields: [projectId], references: [id], onDelete: Cascade)

  @@index([projectId])
  @@index([category])
}

// Update Project model
model Project {
  // ... existing fields ...
  files ProjectFile[]
}
```

**Commands:**
```bash
npx prisma migrate dev --name add_project_files
npx prisma generate
```

---

#### Step 1.2: Create TypeScript Types

**File:** `src/shared/types/project.ts`

```typescript
export interface Project {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  files?: ProjectFile[];
}

export interface ProjectFile {
  id: string;
  projectId: string;
  name: string;
  type: 'dxf' | 'png' | 'svg' | 'gltf' | 'obj' | 'pdf';
  category: 'import' | 'export' | 'render';
  url: string;
  size: number;
  uploadedAt: string;
}

export type FeatureType = 'site-analysis' | 'floorplan-2d' | 'model-3d' | 'render';

export interface FeatureMetadata {
  id: FeatureType;
  title: string;
  description: string;
  icon: React.ComponentType;
  route: string;
  color: string;
}
```

---

### Phase 2: Layout Components

#### Step 2.1: Create FeatureLayout Wrapper

**File:** `src/shared/components/layout/FeatureLayout.tsx`

```typescript
'use client';

import { ReactNode } from 'react';
import { useParams } from 'next/navigation';
import { LeftNavigation } from './LeftNavigation';

interface FeatureLayoutProps {
  children: ReactNode;
  featureType: 'site-analysis' | 'floorplan-2d' | 'model-3d' | 'render';
}

export function FeatureLayout({ children, featureType }: FeatureLayoutProps) {
  const params = useParams();
  const projectId = params?.id as string;

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Left Navigation */}
      <LeftNavigation projectId={projectId} currentFeature={featureType} />

      {/* Main Content Area */}
      <main className="flex-1 overflow-auto bg-background">
        {children}
      </main>
    </div>
  );
}
```

**Usage in feature pages:**
```typescript
// src/app/projects/[id]/floorplan-2d/page.tsx
import { FeatureLayout } from '@/shared/components/layout/FeatureLayout';

export default function Floorplan2DPage() {
  return (
    <FeatureLayout featureType="floorplan-2d">
      {/* Existing 2D editor content */}
    </FeatureLayout>
  );
}
```

---

#### Step 2.2: Create Left Navigation Component

**File:** `src/shared/components/layout/LeftNavigation.tsx`

```typescript
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

interface LeftNavigationProps {
  projectId: string;
  currentFeature: 'site-analysis' | 'floorplan-2d' | 'model-3d' | 'render';
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
```

---

#### Step 2.3: Create Project Dropdown

**File:** `src/shared/components/layout/ProjectDropdown.tsx`

```typescript
'use client';

import { useRouter } from 'next/navigation';
import { Map, Square, Box, Palette, Check } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { Button } from '@/shared/components/ui/button';

interface ProjectDropdownProps {
  projectId: string;
  currentFeature: 'site-analysis' | 'floorplan-2d' | 'model-3d' | 'render';
  isCollapsed: boolean;
}

const features = [
  { id: 'site-analysis', label: 'Site Analysis', icon: Map },
  { id: 'floorplan-2d', label: '2D Editor', icon: Square },
  { id: 'model-3d', label: '3D Model', icon: Box },
  { id: 'render', label: 'Render', icon: Palette },
];

export function ProjectDropdown({ projectId, currentFeature, isCollapsed }: ProjectDropdownProps) {
  const router = useRouter();

  const handleFeatureChange = (featureId: string) => {
    router.push(`/projects/${projectId}/${featureId}`);
  };

  return (
    <div className="border-b border-border p-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="w-full justify-start">
            <span className="mr-2">⚡</span>
            {!isCollapsed && <span>Project</span>}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-48">
          {features.map((feature) => {
            const Icon = feature.icon;
            const isActive = feature.id === currentFeature;

            return (
              <DropdownMenuItem
                key={feature.id}
                onClick={() => handleFeatureChange(feature.id)}
              >
                <Icon className="mr-2 h-4 w-4" />
                <span>{feature.label}</span>
                {isActive && <Check className="ml-auto h-4 w-4" />}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
```

---

#### Step 2.4: Create Files Section

**File:** `src/shared/components/layout/FilesSection.tsx`

```typescript
'use client';

import { useState, useEffect } from 'react';
import { ChevronRight, ChevronDown, Folder, File } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { FilePreviewModal } from './FilePreviewModal';
import type { ProjectFile } from '@/shared/types/project';

interface FilesSectionProps {
  projectId: string;
  isCollapsed: boolean;
}

export function FilesSection({ projectId, isCollapsed }: FilesSectionProps) {
  const [files, setFiles] = useState<ProjectFile[]>([]);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['imports']));
  const [selectedFile, setSelectedFile] = useState<ProjectFile | null>(null);

  useEffect(() => {
    loadFiles();
  }, [projectId]);

  const loadFiles = async () => {
    try {
      const res = await fetch(`/api/projects/${projectId}/files`);
      const data = await res.json();
      setFiles(data.files || []);
    } catch (error) {
      console.error('Failed to load files:', error);
    }
  };

  const toggleFolder = (folder: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folder)) {
      newExpanded.delete(folder);
    } else {
      newExpanded.add(folder);
    }
    setExpandedFolders(newExpanded);
  };

  const filesByCategory = {
    imports: files.filter(f => f.category === 'import'),
    exports: files.filter(f => f.category === 'export'),
    renders: files.filter(f => f.category === 'render'),
  };

  if (isCollapsed) {
    return (
      <div className="border-b border-border p-2">
        <Button variant="ghost" size="sm" className="w-full">
          📁
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="flex-1 overflow-auto border-b border-border p-2">
        <div className="mb-2 text-xs font-semibold text-muted-foreground">Files</div>

        {/* Imports */}
        <div>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start"
            onClick={() => toggleFolder('imports')}
          >
            {expandedFolders.has('imports') ? (
              <ChevronDown className="mr-2 h-4 w-4" />
            ) : (
              <ChevronRight className="mr-2 h-4 w-4" />
            )}
            <Folder className="mr-2 h-4 w-4" />
            Imports ({filesByCategory.imports.length})
          </Button>
          {expandedFolders.has('imports') && (
            <div className="ml-6 space-y-1">
              {filesByCategory.imports.map(file => (
                <Button
                  key={file.id}
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-xs"
                  onClick={() => setSelectedFile(file)}
                >
                  <File className="mr-2 h-3 w-3" />
                  {file.name}
                </Button>
              ))}
            </div>
          )}
        </div>

        {/* Exports */}
        <div>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start"
            onClick={() => toggleFolder('exports')}
          >
            {expandedFolders.has('exports') ? (
              <ChevronDown className="mr-2 h-4 w-4" />
            ) : (
              <ChevronRight className="mr-2 h-4 w-4" />
            )}
            <Folder className="mr-2 h-4 w-4" />
            Exports ({filesByCategory.exports.length})
          </Button>
          {expandedFolders.has('exports') && (
            <div className="ml-6 space-y-1">
              {filesByCategory.exports.map(file => (
                <Button
                  key={file.id}
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-xs"
                  onClick={() => setSelectedFile(file)}
                >
                  <File className="mr-2 h-3 w-3" />
                  {file.name}
                </Button>
              ))}
            </div>
          )}
        </div>

        {/* Renders */}
        <div>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start"
            onClick={() => toggleFolder('renders')}
          >
            {expandedFolders.has('renders') ? (
              <ChevronDown className="mr-2 h-4 w-4" />
            ) : (
              <ChevronRight className="mr-2 h-4 w-4" />
            )}
            <Folder className="mr-2 h-4 w-4" />
            Renders ({filesByCategory.renders.length})
          </Button>
          {expandedFolders.has('renders') && (
            <div className="ml-6 space-y-1">
              {filesByCategory.renders.map(file => (
                <Button
                  key={file.id}
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-xs"
                  onClick={() => setSelectedFile(file)}
                >
                  <File className="mr-2 h-3 w-3" />
                  {file.name}
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* File Preview Modal */}
      {selectedFile && (
        <FilePreviewModal
          file={selectedFile}
          onClose={() => setSelectedFile(null)}
          onImport={() => {
            // TODO: Handle import to canvas
            console.log('Import file:', selectedFile);
          }}
        />
      )}
    </>
  );
}
```

---

#### Step 2.5: Create File Preview Modal

**File:** `src/shared/components/layout/FilePreviewModal.tsx`

```typescript
'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';
import { Download, Upload, Trash2 } from 'lucide-react';
import type { ProjectFile } from '@/shared/types/project';

interface FilePreviewModalProps {
  file: ProjectFile;
  onClose: () => void;
  onImport: () => void;
}

export function FilePreviewModal({ file, onClose, onImport }: FilePreviewModalProps) {
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const handleDownload = () => {
    window.open(file.url, '_blank');
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this file?')) return;

    try {
      await fetch(`/api/projects/${file.projectId}/files/${file.id}`, {
        method: 'DELETE',
      });
      onClose();
      // TODO: Refresh files list
    } catch (error) {
      console.error('Failed to delete file:', error);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{file.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* File Preview */}
          <div className="flex h-64 items-center justify-center rounded-lg border border-border bg-muted">
            {file.type === 'png' || file.type === 'svg' ? (
              <img src={file.url} alt={file.name} className="max-h-full max-w-full" />
            ) : (
              <div className="text-center text-muted-foreground">
                <p className="text-4xl">{file.type.toUpperCase()}</p>
                <p className="mt-2">Preview not available</p>
              </div>
            )}
          </div>

          {/* File Info */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Type:</span> {file.type.toUpperCase()}
            </div>
            <div>
              <span className="text-muted-foreground">Size:</span> {formatFileSize(file.size)}
            </div>
            <div>
              <span className="text-muted-foreground">Category:</span> {file.category}
            </div>
            <div>
              <span className="text-muted-foreground">Uploaded:</span>{' '}
              {new Date(file.uploadedAt).toLocaleDateString()}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button onClick={onImport} className="flex-1">
              <Upload className="mr-2 h-4 w-4" />
              Import to Canvas
            </Button>
            <Button variant="outline" onClick={handleDownload}>
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
```

---

### Phase 3: Update Existing Pages

#### Step 3.1: Update Dashboard

**File:** `src/app/dashboard/page.tsx`

```typescript
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';

interface Project {
  id: string;
  name: string;
  createdAt: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const res = await fetch('/api/projects');
      const data = await res.json();
      setProjects(data.projects || []);
    } catch (error) {
      console.error('Failed to load projects:', error);
    }
  };

  const handleCreateProject = async () => {
    if (!newProjectName.trim()) return;
    setIsCreating(true);

    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newProjectName }),
      });

      const data = await res.json();
      if (data.project) {
        router.push(`/projects/${data.project.id}`);
      }
    } catch (error) {
      console.error('Failed to create project:', error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-muted/30 px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-architectural-blue">Space Kontext</h1>
          <div className="h-10 w-10 rounded-full bg-architectural-neutral-500/20" />
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-6xl p-8">
        <h2 className="mb-6 text-3xl font-bold">Dashboard</h2>

        {/* Create New Project */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Create New Project</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                placeholder="Enter project name..."
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleCreateProject()}
              />
              <Button onClick={handleCreateProject} disabled={isCreating}>
                {isCreating ? 'Creating...' : 'Create'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Projects List */}
        <h3 className="mb-4 text-2xl font-bold">My Projects</h3>
        {projects.length === 0 ? (
          <p className="text-muted-foreground">No projects yet. Create one above!</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <Card
                key={project.id}
                className="cursor-pointer transition-shadow hover:shadow-lg"
                onClick={() => router.push(`/projects/${project.id}`)}
              >
                <CardHeader>
                  <CardTitle>{project.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Created: {new Date(project.createdAt).toLocaleDateString()}
                  </p>
                  <Button className="mt-4 w-full">Open</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
```

---

#### Step 3.2: Update Project Hub

**File:** `src/app/projects/[id]/page.tsx`

```typescript
'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Map, Square, Box, Palette, ArrowLeft } from 'lucide-react';

interface Project {
  id: string;
  name: string;
}

const features = [
  {
    id: 'site-analysis',
    title: 'Site Analysis',
    description: 'Real-world geospatial data integration with sun path, weather, topography, and context buildings.',
    icon: Map,
    color: 'bg-architectural-blue/10 text-architectural-blue',
  },
  {
    id: 'floorplan-2d',
    title: '2D Floorplan Editor',
    description: 'Professional floorplan drawing with intuitive tools, object library, and multi-floor support.',
    icon: Square,
    color: 'bg-architectural-green/10 text-architectural-green',
  },
  {
    id: 'model-3d',
    title: '3D Model Generation',
    description: 'Automatic 3D generation from 2D floorplans with sun simulation and realistic shadows.',
    icon: Box,
    color: 'bg-architectural-sun/10 text-architectural-sun',
  },
  {
    id: 'render',
    title: 'Render (Coming Soon)',
    description: 'High-quality rendering and visualization tools for your architectural designs.',
    icon: Palette,
    color: 'bg-architectural-neutral-500/10 text-architectural-neutral-500',
  },
];

export default function ProjectHub() {
  const params = useParams();
  const router = useRouter();
  const projectId = params?.id as string;
  const [project, setProject] = useState<Project | null>(null);

  const loadProject = useCallback(async () => {
    try {
      if (!projectId) return;

      const res = await fetch(`/api/projects/${projectId}`);
      if (!res.ok) throw new Error(`Failed to fetch project: ${res.status}`);

      const data = await res.json();
      if (data.success && data.project) {
        setProject(data.project);
      }
    } catch (error) {
      console.error('Failed to load project:', error);
      setProject({ id: projectId, name: `Project (${projectId})` });
    }
  }, [projectId]);

  useEffect(() => {
    if (projectId) loadProject();
  }, [projectId, loadProject]);

  if (!project) return <div className="p-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-muted/30 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => router.push('/dashboard')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
            <h1 className="text-2xl font-bold">{project.name}</h1>
          </div>
          <div className="h-10 w-10 rounded-full bg-architectural-neutral-500/20" />
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-6xl p-8">
        <h2 className="mb-6 text-xl text-muted-foreground">Select a feature to begin designing</h2>

        {/* Features Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {features.map((feature) => {
            const Icon = feature.icon;
            const isComingSoon = feature.id === 'render';

            return (
              <Card
                key={feature.id}
                className={`architectural-card transition-shadow ${
                  isComingSoon ? 'opacity-60' : 'cursor-pointer hover:shadow-lg'
                }`}
                onClick={() => !isComingSoon && router.push(`/projects/${projectId}/${feature.id}`)}
              >
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg ${feature.color}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
                      <CardDescription className="mt-2">{feature.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button
                    className="w-full"
                    disabled={isComingSoon}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!isComingSoon) router.push(`/projects/${projectId}/${feature.id}`);
                    }}
                  >
                    {isComingSoon ? 'Coming Soon' : `Open ${feature.title}`}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </main>
    </div>
  );
}
```

---

#### Step 3.3: Wrap Feature Pages with FeatureLayout

**Update all feature pages:**

**File:** `src/app/projects/[id]/site-analysis/page.tsx`

```typescript
import { FeatureLayout } from '@/shared/components/layout/FeatureLayout';
// ... existing imports

export default function SiteAnalysisPage() {
  return (
    <FeatureLayout featureType="site-analysis">
      {/* Existing site analysis content */}
    </FeatureLayout>
  );
}
```

**File:** `src/app/projects/[id]/floorplan-2d/page.tsx`

```typescript
import { FeatureLayout } from '@/shared/components/layout/FeatureLayout';
// ... existing imports

export default function Floorplan2DPage() {
  return (
    <FeatureLayout featureType="floorplan-2d">
      {/* Existing 2D editor content */}
    </FeatureLayout>
  );
}
```

**File:** `src/app/projects/[id]/model-3d/page.tsx`

```typescript
import { FeatureLayout } from '@/shared/components/layout/FeatureLayout';
// ... existing imports

export default function Model3DPage() {
  return (
    <FeatureLayout featureType="model-3d">
      {/* Existing 3D model content */}
    </FeatureLayout>
  );
}
```

---

#### Step 3.4: Create Render Page (Placeholder)

**File:** `src/app/projects/[id]/render/page.tsx`

```typescript
import { FeatureLayout } from '@/shared/components/layout/FeatureLayout';

export default function RenderPage() {
  return (
    <FeatureLayout featureType="render">
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-muted-foreground">Render Feature</h1>
          <p className="mt-4 text-lg text-muted-foreground">Coming Soon</p>
        </div>
      </div>
    </FeatureLayout>
  );
}
```

---

### Phase 4: API Routes

#### Step 4.1: Project Files API

**File:** `src/app/api/projects/[id]/files/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/shared/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const projectId = params.id;

    // Verify project ownership
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: { files: true },
    });

    if (!project || project.userId !== userId) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json({ files: project.files });
  } catch (error) {
    console.error('Error fetching project files:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const projectId = params.id;
    const body = await request.json();
    const { name, type, category, url, size } = body;

    // Verify project ownership
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project || project.userId !== userId) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const file = await prisma.projectFile.create({
      data: {
        projectId,
        name,
        type,
        category,
        url,
        size,
      },
    });

    return NextResponse.json({ file });
  } catch (error) {
    console.error('Error creating project file:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
```

**File:** `src/app/api/projects/[id]/files/[fileId]/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/shared/lib/prisma';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; fileId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: projectId, fileId } = params;

    // Verify project ownership
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project || project.userId !== userId) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Delete file
    await prisma.projectFile.delete({
      where: { id: fileId },
    });

    // TODO: Also delete from storage (Vercel Blob, S3, etc.)

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting project file:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
```

---

### Phase 5: Testing & Refinement

#### Testing Checklist

- [ ] Dashboard loads and shows projects
- [ ] Create new project redirects to Project Hub
- [ ] Project Hub shows 4 feature cards
- [ ] Clicking feature card navigates to feature workspace
- [ ] Left nav appears ONLY in feature workspaces
- [ ] Project dropdown switches between features correctly
- [ ] Files section loads project files
- [ ] File preview modal opens on click
- [ ] Import/Export/Save buttons work (or show TODO alerts)
- [ ] User dropdown shows settings options
- [ ] Navigation persists project context across features
- [ ] Auto-save works per feature (if implemented)

---

## Technical Considerations

### 1. State Management

**Feature-specific state:**
- Each feature should manage its own state independently
- Use Zustand stores per feature (existing pattern)
- Example: `siteLayoutStore`, `floorplan2DStore`, `model3DStore`

**Project-wide state:**
- Files list (shared across features)
- Project metadata
- User preferences

---

### 2. File Upload Integration

**Recommended: Vercel Blob Storage**

```typescript
// Example: src/app/api/upload/route.ts
import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const form = await request.formData();
  const file = form.get('file') as File;

  const blob = await put(file.name, file, {
    access: 'public',
  });

  return NextResponse.json({ url: blob.url });
}
```

**Usage in Import modal:**
```typescript
const handleFileUpload = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });

  const { url } = await res.json();

  // Save to database
  await fetch(`/api/projects/${projectId}/files`, {
    method: 'POST',
    body: JSON.stringify({
      name: file.name,
      type: file.name.split('.').pop(),
      category: 'import',
      url,
      size: file.size,
    }),
  });
};
```

---

### 3. Auto-Save Implementation

**Per-feature auto-save:**

```typescript
// Example: src/features/floorplan-2d/hooks/useAutoSave.ts
import { useEffect, useRef } from 'use';
import { useSiteLayoutStore } from '../store/siteLayoutStore';
import { debounce } from 'lodash';

export function useAutoSave(projectId: string) {
  const state = useSiteLayoutStore();
  const saveTimeoutRef = useRef<NodeJS.Timeout>();

  const saveState = async () => {
    try {
      await fetch(`/api/projects/${projectId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          floorplan2dData: state,
        }),
      });
      console.log('Auto-saved');
    } catch (error) {
      console.error('Auto-save failed:', error);
    }
  };

  const debouncedSave = debounce(saveState, 5000);

  useEffect(() => {
    debouncedSave();
    return () => debouncedSave.cancel();
  }, [state]);
}
```

---

### 4. Performance Optimization

**Code splitting:**
```typescript
// Lazy load heavy feature components
import dynamic from 'next/dynamic';

const Floorplan2DEditor = dynamic(
  () => import('@/features/floorplan-2d/components/Floorplan2DEditor'),
  { ssr: false }
);
```

**Memoization:**
```typescript
// In LeftNavigation.tsx
const FileList = React.memo(({ files }) => {
  // ... file list rendering
});
```

---

### 5. Responsive Design

**Left nav on mobile:**
```typescript
const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

// Mobile: Hamburger menu
// Desktop: Persistent sidebar

<aside className={cn(
  'border-r border-border',
  'md:relative md:block',
  'fixed inset-y-0 left-0 z-50',
  isMobileNavOpen ? 'block' : 'hidden'
)}>
```

---

### 6. Keyboard Shortcuts

```typescript
// Example: src/shared/hooks/useKeyboardShortcuts.ts
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function useKeyboardShortcuts(projectId: string) {
  const router = useRouter();

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 's':
            e.preventDefault();
            // Trigger manual save
            break;
          case '1':
            router.push(`/projects/${projectId}/site-analysis`);
            break;
          case '2':
            router.push(`/projects/${projectId}/floorplan-2d`);
            break;
          case '3':
            router.push(`/projects/${projectId}/model-3d`);
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [projectId, router]);
}
```

---

## Implementation Timeline

### Week 1: Foundation
- [ ] Update Prisma schema and migrate
- [ ] Create TypeScript types
- [ ] Set up file upload API

### Week 2: Core Components
- [ ] Build FeatureLayout wrapper
- [ ] Build LeftNavigation component
- [ ] Build ProjectDropdown
- [ ] Build FilesSection

### Week 3: Page Updates
- [ ] Update Dashboard page
- [ ] Update Project Hub page
- [ ] Wrap existing feature pages
- [ ] Create Render placeholder

### Week 4: Integration & Polish
- [ ] Implement file preview modal
- [ ] Add import/export functionality
- [ ] Implement auto-save
- [ ] Testing and bug fixes

---

## Success Criteria

✅ **User Flow:**
- Users can navigate: Dashboard → Project Hub → Features
- Left nav only appears in feature workspaces
- Feature switching works via Project dropdown

✅ **Files Management:**
- Users can upload files
- Files appear in organized folders (Imports/Exports/Renders)
- File preview modal works
- Import to canvas functionality works

✅ **UX Polish:**
- Auto-save works and shows status
- Keyboard shortcuts work
- Responsive design on tablet/desktop
- Loading states and error handling

---

## Next Steps After Implementation

1. **Pages Feature** (deferred for now)
   - Multi-page support within features
   - Page tabs UI
   - Page-specific state management

2. **Advanced File Operations**
   - Bulk upload
   - Drag-and-drop import
   - File versioning
   - Cloud sync

3. **Collaboration Features**
   - Real-time multi-user editing
   - Comments and annotations
   - Share links

4. **Render Tab Development**
   - Integration with rendering engines
   - Material/lighting controls
   - Render queue management

---

## Questions During Implementation?

If you encounter issues or need clarification:

1. **Routing issues:** Check Next.js App Router docs
2. **State management:** Review existing Zustand stores
3. **File uploads:** Consider Vercel Blob or uploadthing
4. **UI components:** Use existing shadcn/ui components

---

**Document Version:** 1.0
**Last Updated:** 2024-12-10
**Author:** Space Kontext Team
