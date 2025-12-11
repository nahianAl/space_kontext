'use client';

import { ReactNode } from 'react';
import { useParams } from 'next/navigation';
import { LeftNavigation } from './LeftNavigation';
import type { FeatureType } from '@/shared/types/project';

interface FeatureLayoutProps {
  children: ReactNode;
  featureType: FeatureType;
}

export function FeatureLayout({ children, featureType }: FeatureLayoutProps) {
  const params = useParams();
  const projectId = params?.id as string;

  if (!projectId) {
    return <div className="p-8">Loading project ID...</div>;
  }

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
