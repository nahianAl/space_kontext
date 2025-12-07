/**
 * Project selection dialog component
 * Provides UI for creating, selecting, and managing projects
 * Handles project creation, listing, and selection with form validation
 */
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { useProjectStore } from '../store/projectStore';
import { ProjectService } from '../services/projectService';

interface ProjectSelectionDialogProps {
  onProjectSelected: (projectId: string) => void;
  onCancel: () => void;
}

export function ProjectSelectionDialog({
  onProjectSelected,
  onCancel,
}: ProjectSelectionDialogProps) {
  const [newProjectName, setNewProjectName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const { projects, setProjects, addProject, setLoading, setError } = useProjectStore();

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const fetchedProjects = await ProjectService.fetchAll();
      setProjects(fetchedProjects);
    } catch (error) {
      setError('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async () => {
    if (!newProjectName.trim()) return;

    try {
      setIsCreating(true);
      const project = await ProjectService.create(newProjectName.trim());
      addProject(project);
      onProjectSelected(project.id);
    } catch (error) {
      setError('Failed to create project');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md max-h-[80vh] overflow-y-auto">
        <CardHeader>
          <CardTitle>Select or Create Project</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Create New Project */}
          <div className="space-y-2">
            <Label htmlFor="project-name">Create New Project</Label>
            <div className="flex gap-2">
              <Input
                id="project-name"
                placeholder="Enter project name"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') handleCreateProject();
                }}
              />
              <Button
                onClick={handleCreateProject}
                disabled={isCreating || !newProjectName.trim()}
              >
                {isCreating ? 'Creating...' : 'Create'}
              </Button>
            </div>
          </div>

          {/* Existing Projects */}
          {projects.length > 0 && (
            <div className="space-y-2">
              <Label>Or Select Existing Project</Label>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {projects.map((project) => (
                  <Button
                    key={project.id}
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => onProjectSelected(project.id)}
                  >
                    <div className="flex flex-col items-start">
                      <span className="font-medium">{project.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(project.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          )}

          <Button variant="ghost" onClick={onCancel} className="w-full">
            Cancel
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
