'use client';

import { useParams } from 'next/navigation';
import MassingTab from '@/features/project-management/components/MassingTab';

export default function MassingPage() {
  const params = useParams();
  const projectId = params?.id as string;

  if (!projectId) {
    return <div className="p-8">Loading project ID...</div>;
  }

  return (
    <div className="h-screen w-full">
      <MassingTab projectId={projectId} />
    </div>
  );
}

