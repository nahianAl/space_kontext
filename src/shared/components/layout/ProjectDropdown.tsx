'use client';

import { useRouter } from 'next/navigation';
import { Map, Square, Box, Palette, Check } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { Button } from '@/shared/components/ui/button';
import type { FeatureType } from '@/shared/types/project';

interface ProjectDropdownProps {
  projectId: string;
  currentFeature: FeatureType;
  isCollapsed: boolean;
}

const features = [
  { id: 'site-analysis' as const, label: 'Site Analysis', icon: Map },
  { id: 'floorplan-2d' as const, label: '2D Editor', icon: Square },
  { id: 'model-3d' as const, label: '3D Model', icon: Box },
  { id: 'render' as const, label: 'Render', icon: Palette },
];

export function ProjectDropdown({ projectId, currentFeature, isCollapsed }: ProjectDropdownProps) {
  const router = useRouter();

  const handleFeatureChange = (featureId: string) => {
    router.push(`/projects/${projectId}/${featureId}` as any);
  };

  return (
    <div className="border-b border-border p-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="w-full justify-start">
            <span className="mr-2">⚡</span>
            {!isCollapsed && <span>Project</span>}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-48">
          {features.map((feature) => {
            const Icon = feature.icon;
            const isActive = feature.id === currentFeature;

            return (
              <DropdownMenuItem
                key={feature.id}
                onClick={() => handleFeatureChange(feature.id)}
              >
                <Icon className="mr-2 h-4 w-4" />
                <span>{feature.label}</span>
                {isActive && <Check className="ml-auto h-4 w-4" />}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
