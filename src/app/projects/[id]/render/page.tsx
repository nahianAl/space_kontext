'use client';

import { useParams } from 'next/navigation';
import { FeatureLayout } from '@/shared/components/layout/FeatureLayout';
import { ImageUpload } from '@/features/ai-rendering/components/ImageUpload';
import { PromptPanel } from '@/features/ai-rendering/components/PromptPanel';
import { GenerationStatus } from '@/features/ai-rendering/components/GenerationStatus';
import { RenderGallery } from '@/features/ai-rendering/components/RenderGallery';

export default function RenderPage() {
  const params = useParams();
  const projectId = params?.id as string;

  if (!projectId) {
    return (
      <div className="p-8">
        <p className="text-muted-foreground">Loading project...</p>
      </div>
    );
  }

  return (
    <FeatureLayout featureType="render">
      <div className="h-full overflow-auto bg-background">
        {/* Header */}
        <div className="border-b border-border bg-muted/30 px-6 py-4">
          <h1 className="text-2xl font-bold">AI Rendering</h1>
          <p className="text-sm text-muted-foreground">
            Generate architectural visualizations with Gemini 2.5 Flash (Nano Banana)
          </p>
        </div>

        {/* Main Content */}
        <div className="p-6">
          <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-3">
            {/* Left Column: Input & Controls */}
            <div className="space-y-6 lg:col-span-1">
              <ImageUpload />
              <PromptPanel />
              <GenerationStatus />
            </div>

            {/* Right Column: Results Gallery */}
            <div className="lg:col-span-2">
              <RenderGallery projectId={projectId} />
            </div>
          </div>
        </div>
      </div>
    </FeatureLayout>
  );
}
