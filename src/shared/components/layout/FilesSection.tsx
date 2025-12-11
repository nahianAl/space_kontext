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
      if (!res.ok) {
        throw new Error('Failed to load files');
      }
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
