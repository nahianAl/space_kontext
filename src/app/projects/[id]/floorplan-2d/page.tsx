'use client';

import { useParams } from 'next/navigation';
import dynamic from 'next/dynamic';

const Floorplan2DTab = dynamic(
  () => import('@/features/project-management/components/Floorplan2DTab'),
  {
    ssr: false,
    loading: () => <div className="p-8 text-center">Loading 2D Editor...</div>,
  }
);

export default function Floorplan2DPage() {
  const params = useParams();
  const projectId = params?.id as string;

  if (!projectId) {
    return <div className="p-8">Loading project ID...</div>;
  }

  return (
    <div className="h-screen w-full">
      <Floorplan2DTab projectId={projectId} />
    </div>
  );
}

