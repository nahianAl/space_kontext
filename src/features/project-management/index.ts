/**
 * Public API for project-management feature
 * Exports project store, service, and selection dialog components
 * Provides project CRUD operations and project selection UI
 */
export { useProjectStore } from './store/projectStore';
export { ProjectService } from './services/projectService';
export { ProjectSelectionDialog } from './components/ProjectSelectionDialog';
export type { Project } from './store/projectStore';
