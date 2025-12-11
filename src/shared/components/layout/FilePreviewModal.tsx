'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';
import { Download, Upload, Trash2 } from 'lucide-react';
import type { ProjectFile } from '@/shared/types/project';

interface FilePreviewModalProps {
  file: ProjectFile;
  onClose: () => void;
  onImport: () => void;
}

export function FilePreviewModal({ file, onClose, onImport }: FilePreviewModalProps) {
  const formatFileSize = (bytes: number): string => {
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
