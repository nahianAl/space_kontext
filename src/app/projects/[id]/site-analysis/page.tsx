'use client';

import { useParams } from 'next/navigation';
import dynamic from 'next/dynamic';

const SiteAnalysisTab = dynamic(
  () => import('@/features/project-management/components/SiteAnalysisTab'),
  { ssr: false, loading: () => <div className="p-8">Loading site analysis...</div> }
);

export default function SiteAnalysisPage() {
  const params = useParams();
  const projectId = params?.id as string;

  if (!projectId) {
    return <div className="p-8">Loading project ID...</div>;
  }

  return (
    <div className="h-screen w-full">
      <SiteAnalysisTab projectId={projectId} />
    </div>
  );
}

