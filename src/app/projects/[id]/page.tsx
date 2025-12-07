'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Map, Square, Box, Layers } from 'lucide-react';

interface Project {
  id: string;
  name: string;
}

export default function ProjectWorkspace() {
  const params = useParams();
  const router = useRouter();
  const projectId = params?.id as string;
  const [project, setProject] = useState<Project | null>(null);

  const loadProject = useCallback(async () => {
    try {
      if (!projectId) {
        console.warn('No project ID provided');
        return;
      }
      
      const res = await fetch(`/api/projects/${projectId}`);
      
      if (!res.ok) {
        throw new Error(`Failed to fetch project: ${res.status}`);
      }
      
      const data = await res.json();
      if (data.success && data.project) {
        setProject(data.project);
      } else {
        throw new Error('Invalid project data received');
      }
    } catch (error) {
      console.error('Failed to load project:', error);
      setProject({ id: projectId, name: `Project (${projectId})` });
    }
  }, [projectId]);

  useEffect(() => {
    if (projectId) {
      loadProject();
    }
  }, [projectId, loadProject]);

  if (!projectId) {
    return <div className="p-8">Loading project ID...</div>;
  }
  if (!project) {
    return <div className="p-8">Loading project...</div>;
  }

  const features = [
    {
      id: 'site-analysis',
      title: 'Site Analysis',
      description: 'Real-world geospatial data integration with sun path, weather, topography, and context buildings.',
      icon: Map,
      href: `/projects/${projectId}/site-analysis`,
      color: 'bg-architectural-blue/10 text-architectural-blue',
    },
    {
      id: 'floorplan-2d',
      title: '2D Floorplan Editor',
      description: 'Professional floorplan drawing with intuitive tools, object library, and multi-floor support.',
      icon: Square,
      href: `/projects/${projectId}/floorplan-2d`,
      color: 'bg-architectural-green/10 text-architectural-green',
    },
    {
      id: 'model-3d',
      title: '3D Model Generation',
      description: 'Automatic 3D generation from 2D floorplans with sun simulation and realistic shadows.',
      icon: Box,
      href: `/projects/${projectId}/model-3d`,
      color: 'bg-architectural-sun/10 text-architectural-sun',
    },
    {
      id: 'massing',
      title: 'Massing Diagrams',
      description: 'Quick volumetric studies with primitive shapes and comprehensive analysis tools.',
      icon: Layers,
      href: `/projects/${projectId}/massing`,
      color: 'bg-architectural-neutral-500/10 text-architectural-neutral-500',
    },
  ];

  return (
    <div className="min-h-screen p-8 bg-background">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{project.name}</h1>
          <p className="text-muted-foreground">Select a feature to begin designing</p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={feature.id} 
                className="architectural-card hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => router.push(feature.href as any)}
              >
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <div className={`h-12 w-12 rounded-lg ${feature.color} flex items-center justify-center flex-shrink-0`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
                      <CardDescription className="mt-2">
                        {feature.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button 
                    className="w-full" 
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(feature.href as any);
                    }}
                  >
                    Open {feature.title}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
