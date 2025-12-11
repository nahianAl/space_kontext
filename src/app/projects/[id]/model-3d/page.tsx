'use client';

import { useParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { FeatureLayout } from '@/shared/components/layout/FeatureLayout';

const Model3DTab = dynamic(
  () => import('@/features/project-management/components/Model3DTab'),
  {
    ssr: false,
    loading: () => <div className="p-8 text-center">Loading 3D Viewer...</div>,
  }
);

export default function Model3DPage() {
  const params = useParams();
  const projectId = params?.id as string;

  if (!projectId) {
    return <div className="p-8">Loading project ID...</div>;
  }

  return (
    <FeatureLayout featureType="model-3d">
      <div className="h-screen w-full">
        <Model3DTab projectId={projectId} />
      </div>
    </FeatureLayout>
  );
}

