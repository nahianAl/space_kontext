'use client';

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
