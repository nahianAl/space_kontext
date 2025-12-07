/**
 * Project service for API operations
 * Provides methods for fetching, creating, updating, and deleting projects
 * Handles HTTP requests to the projects API endpoints
 */
import type { Project } from '../store/projectStore';

export class ProjectService {
  static async fetchAll(): Promise<Project[]> {
    const response = await fetch('/api/projects');
    if (!response.ok) throw new Error('Failed to fetch projects');
    const data = await response.json();
    return data.projects;
  }

  static async create(name: string): Promise<Project> {
    const response = await fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
    if (!response.ok) throw new Error('Failed to create project');
    const data = await response.json();
    return data.project;
  }

  static async delete(id: string): Promise<void> {
    const response = await fetch(`/api/projects/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete project');
  }
}
