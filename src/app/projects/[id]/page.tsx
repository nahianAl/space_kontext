'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Map, Square, Box, Palette, ArrowLeft } from 'lucide-react';

interface Project {
  id: string;
  name: string;
}

const features = [
  {
    id: 'site-analysis',
    title: 'Site Analysis',
    description: 'Real-world geospatial data integration with sun path, weather, topography, and context buildings.',
    icon: Map,
    color: 'bg-architectural-blue/10 text-architectural-blue',
  },
  {
    id: 'floorplan-2d',
    title: '2D Floorplan Editor',
    description: 'Professional floorplan drawing with intuitive tools, object library, and multi-floor support.',
    icon: Square,
    color: 'bg-architectural-green/10 text-architectural-green',
  },
  {
    id: 'model-3d',
    title: '3D Model Generation',
    description: 'Automatic 3D generation from 2D floorplans with sun simulation and realistic shadows.',
    icon: Box,
    color: 'bg-architectural-sun/10 text-architectural-sun',
  },
  {
    id: 'render',
    title: 'AI Rendering',
    description: 'Generate architectural visualizations with AI using Gemini 2.5 Flash (Nano Banana).',
    icon: Palette,
    color: 'bg-architectural-neutral-500/10 text-architectural-neutral-500',
  },
];

export default function ProjectHub() {
  const params = useParams();
  const router = useRouter();
  const projectId = params?.id as string;
  const [project, setProject] = useState<Project | null>(null);

  const loadProject = useCallback(async () => {
    try {
      if (!projectId) return;

      const res = await fetch(`/api/projects/${projectId}`);
      if (!res.ok) throw new Error(`Failed to fetch project: ${res.status}`);

      const data = await res.json();
      if (data.success && data.project) {
        setProject(data.project);
      }
    } catch (error) {
      console.error('Failed to load project:', error);
      setProject({ id: projectId, name: `Project (${projectId})` });
    }
  }, [projectId]);

  useEffect(() => {
    if (projectId) loadProject();
  }, [projectId, loadProject]);

  if (!project) return <div className="p-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-muted/30 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => router.push('/dashboard')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
            <h1 className="text-2xl font-bold">{project.name}</h1>
          </div>
          <div className="h-10 w-10 rounded-full bg-architectural-neutral-500/20" />
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-6xl p-8">
        <h2 className="mb-6 text-xl text-muted-foreground">Select a feature to begin designing</h2>

        {/* Features Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <Card
                key={feature.id}
                className="architectural-card cursor-pointer transition-shadow hover:shadow-lg"
                onClick={() => router.push(`/projects/${projectId}/${feature.id}` as any)}
              >
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg ${feature.color}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
                      <CardDescription className="mt-2">{feature.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button
                    className="w-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/projects/${projectId}/${feature.id}` as any);
                    }}
                  >
                    Open {feature.title}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </main>
    </div>
  );
}
