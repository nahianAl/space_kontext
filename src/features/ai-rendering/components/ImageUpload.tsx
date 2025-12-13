'use client';

import { useCallback } from 'react';
import { Upload, X } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Card } from '@/shared/components/ui/card';
import { useRenderStore } from '../store/renderStore';

export function ImageUpload() {
  const { sourceImage, sourceImagePreview, setSourceImage, uploadProgress } = useRenderStore();

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith('image/')) {
        setSourceImage(file);
      }
    },
    [setSourceImage]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }, []);

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        setSourceImage(file);
      }
    },
    [setSourceImage]
  );

  const handleClear = useCallback(() => {
    setSourceImage(null);
  }, [setSourceImage]);

  return (
    <Card className="p-6">
      <h3 className="mb-4 text-lg font-semibold">
        Source Image <span className="text-destructive">*</span>
      </h3>

      {!sourceImagePreview ? (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="relative flex min-h-[200px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/10 p-8 transition-colors hover:border-muted-foreground/50 hover:bg-muted/20"
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleFileInput}
            className="absolute inset-0 cursor-pointer opacity-0"
          />
          <Upload className="mb-4 h-12 w-12 text-muted-foreground" />
          <p className="text-center text-sm text-muted-foreground">
            Drag & drop an image or click to browse
          </p>
          <p className="mt-2 text-center text-xs text-muted-foreground">
            Supports: PNG, JPEG, WebP
          </p>
        </div>
      ) : (
        <div className="relative">
          <div className="relative overflow-hidden rounded-lg border border-border">
            <img
              src={sourceImagePreview}
              alt="Source preview"
              className="h-auto w-full object-contain"
              style={{ maxHeight: '400px' }}
            />
          </div>
          <Button
            size="sm"
            variant="destructive"
            className="absolute right-2 top-2"
            onClick={handleClear}
          >
            <X className="h-4 w-4" />
          </Button>
          {sourceImage && (
            <p className="mt-2 text-xs text-muted-foreground">
              {sourceImage.name} ({(sourceImage.size / 1024).toFixed(1)} KB)
            </p>
          )}
        </div>
      )}

      <p className="mt-4 text-xs text-destructive font-medium">
        * Required: Upload an image to edit with AI. Your prompt will describe how to transform this image.
      </p>
    </Card>
  );
}
