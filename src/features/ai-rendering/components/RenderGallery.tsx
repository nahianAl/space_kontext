'use client';

import { useState } from 'react';
import { Card } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Download, Save, ExternalLink } from 'lucide-react';
import { useRenderStore } from '../store/renderStore';
import { saveToProjectFiles } from '../services/aiRenderingService';

interface RenderGalleryProps {
  projectId: string;
}

export function RenderGallery({ projectId }: RenderGalleryProps) {
  const { jobs } = useRenderStore();
  const [savingImageId, setSavingImageId] = useState<string | null>(null);

  const successfulJobs = jobs.filter(
    (job) => job.status === 'success' && job.resultUrls.length > 0
  );

  if (successfulJobs.length === 0) {
    return (
      <Card className="p-8">
        <div className="text-center">
          <p className="text-muted-foreground">No generated images yet</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Create a prompt above to generate your first AI render
          </p>
        </div>
      </Card>
    );
  }

  const handleSaveToProject = async (imageUrl: string, prompt: string) => {
    const imageId = `${Date.now()}-${imageUrl}`;
    setSavingImageId(imageId);

    try {
      const filename = `render-${Date.now()}.png`;
      const result = await saveToProjectFiles(projectId, imageUrl, filename);

      if (result.success) {
        alert('Image saved to project files!');
      } else {
        alert(`Failed to save: ${result.error}`);
      }
    } catch (error) {
      console.error('Error saving image:', error);
      alert('Failed to save image');
    } finally {
      setSavingImageId(null);
    }
  };

  const handleDownload = async (imageUrl: string, prompt: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `render-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading image:', error);
      alert('Failed to download image');
    }
  };

  return (
    <Card className="p-6">
      <h3 className="mb-4 text-lg font-semibold">Generated Images</h3>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {successfulJobs.flatMap((job) =>
          job.resultUrls.map((url, index) => {
            const imageId = `${job.id}-${index}`;
            const isSaving = savingImageId === imageId;

            return (
              <div key={imageId} className="group relative">
                <div className="overflow-hidden rounded-lg border border-border bg-muted">
                  <img
                    src={url}
                    alt={job.prompt}
                    className="h-auto w-full object-cover transition-transform group-hover:scale-105"
                  />
                </div>

                <div className="mt-2">
                  <p className="line-clamp-2 text-sm text-muted-foreground">
                    {job.prompt}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {job.specifications.image_size} • {job.specifications.output_format}
                  </p>
                </div>

                <div className="mt-2 flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleSaveToProject(url, job.prompt)}
                    disabled={isSaving}
                    className="flex-1"
                  >
                    {isSaving ? (
                      <>Saving...</>
                    ) : (
                      <>
                        <Save className="mr-1 h-3 w-3" />
                        Save to Project
                      </>
                    )}
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDownload(url, job.prompt)}
                  >
                    <Download className="h-3 w-3" />
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.open(url, '_blank')}
                  >
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </Card>
  );
}
