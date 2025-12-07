// Export Prisma client and utilities
export { prisma, disconnectPrisma, checkDatabaseHealth } from './client';
export * from './utils';

// Re-export Prisma types for convenience
export type {
  User,
  Project,
  SiteAnalysis,
  Floorplan,
  Model3D,
  Massing,
  File,
  GeospatialCache,
  UserSession,
} from './generated';
