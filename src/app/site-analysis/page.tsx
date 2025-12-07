'use client';

import dynamic from 'next/dynamic';

const SiteAnalysisContent = dynamic(
  () => import('./SiteAnalysisContent'),
  { ssr: false, loading: () => <div className="p-8">Loading site analysis...</div> }
);

export default function SiteAnalysisPage() {
  return <SiteAnalysisContent />;
}
