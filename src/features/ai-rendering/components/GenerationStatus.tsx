'use client';

import { Card } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Loader2, AlertCircle, CheckCircle2, X } from 'lucide-react';
import { useRenderStore } from '../store/renderStore';
import type { RenderJob } from '../types';

function JobItem({ job }: { job: RenderJob }) {
  const { cancelJob } = useRenderStore();

  const getStatusIcon = () => {
    switch (job.status) {
      case 'waiting':
      case 'pending':
        return <Loader2 className="h-5 w-5 animate-spin text-blue-500" />;
      case 'success':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'fail':
        return <AlertCircle className="h-5 w-5 text-destructive" />;
      default:
        return <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />;
    }
  };

  const getStatusText = () => {
    switch (job.status) {
      case 'pending':
        return 'Creating task...';
      case 'waiting':
        return 'Generating...';
      case 'success':
        return 'Complete';
      case 'fail':
        return 'Failed';
      default:
        return 'Processing...';
    }
  };

  return (
    <div className="flex items-start gap-3 rounded-lg border border-border bg-muted/30 p-3">
      <div className="flex-shrink-0 pt-0.5">{getStatusIcon()}</div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{job.prompt}</p>
        <p className="text-xs text-muted-foreground">
          {getStatusText()}
          {job.status === 'success' && job.resultUrls.length > 0 && (
            <span> • {job.resultUrls.length} image(s)</span>
          )}
        </p>

        {job.error && (
          <p className="mt-1 text-xs text-destructive">{job.error}</p>
        )}

        {job.status === 'success' && job.costTime && (
          <p className="mt-1 text-xs text-muted-foreground">
            Generated in {(job.costTime / 1000).toFixed(1)}s
          </p>
        )}
      </div>

      {(job.status === 'waiting' || job.status === 'pending') && (
        <Button
          size="sm"
          variant="ghost"
          onClick={() => cancelJob(job.id)}
          className="flex-shrink-0"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}

export function GenerationStatus() {
  const { jobs, clearCompleted } = useRenderStore();

  if (jobs.length === 0) {
    return null;
  }

  const completedJobs = jobs.filter((j) => j.status === 'success' || j.status === 'fail');
  const activeJobs = jobs.filter((j) => j.status === 'waiting' || j.status === 'pending');

  return (
    <Card className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Generation Queue</h3>
        {completedJobs.length > 0 && (
          <Button size="sm" variant="ghost" onClick={clearCompleted}>
            Clear Completed
          </Button>
        )}
      </div>

      <div className="space-y-3">
        {activeJobs.map((job) => (
          <JobItem key={job.id} job={job} />
        ))}
        {completedJobs.map((job) => (
          <JobItem key={job.id} job={job} />
        ))}
      </div>
    </Card>
  );
}
