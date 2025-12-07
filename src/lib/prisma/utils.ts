import { prisma } from './client';
import type { User, Project, SiteAnalysis, Floorplan, Model3D, Massing } from './generated';

// ===========================================
// USER UTILITIES
// ===========================================

/**
 * Create or update user from Clerk data
 */
export async function upsertUser(clerkUser: {
  id: string;
  emailAddresses: Array<{ emailAddress: string }>;
  firstName?: string | null;
  lastName?: string | null;
  imageUrl?: string | null;
}) {
  const email = clerkUser.emailAddresses[0]?.emailAddress;
  if (!email) {
    throw new Error('User email is required');
  }

  return await prisma.user.upsert({
    where: { clerkId: clerkUser.id },
    update: {
      email,
      ...(clerkUser.firstName !== undefined && { firstName: clerkUser.firstName }),
      ...(clerkUser.lastName !== undefined && { lastName: clerkUser.lastName }),
      ...(clerkUser.imageUrl !== undefined && { imageUrl: clerkUser.imageUrl }),
    },
    create: {
      clerkId: clerkUser.id,
      email,
      ...(clerkUser.firstName !== undefined && { firstName: clerkUser.firstName }),
      ...(clerkUser.lastName !== undefined && { lastName: clerkUser.lastName }),
      ...(clerkUser.imageUrl !== undefined && { imageUrl: clerkUser.imageUrl }),
    },
  });
}

/**
 * Get user by Clerk ID
 */
export async function getUserByClerkId(clerkId: string) {
  return await prisma.user.findUnique({
    where: { clerkId },
    include: {
      projects: {
        orderBy: { updatedAt: 'desc' },
        take: 10, // Limit to recent projects
      },
    },
  });
}

// ===========================================
// PROJECT UTILITIES
// ===========================================

/**
 * Create a new project
 */
export async function createProject(data: {
  name: string;
  description?: string;
  userId: string;
  settings?: Record<string, any>;
}) {
  return await prisma.project.create({
    data: {
      name: data.name,
      ...(data.description !== undefined && { description: data.description }),
      userId: data.userId,
      ...(data.settings !== undefined && { settings: data.settings }),
    },
    include: {
      user: true,
      siteAnalysis: true,
      floorplans: true,
      models3D: true,
      massings: true,
    },
  });
}

/**
 * Get project with all related data
 */
export async function getProjectWithData(projectId: string, userId: string) {
  return await prisma.project.findFirst({
    where: { 
      id: projectId,
      userId, // Ensure user owns the project
    },
    include: {
      user: true,
      siteAnalysis: true,
      floorplans: {
        orderBy: { level: 'asc' },
      },
      models3D: {
        orderBy: { createdAt: 'desc' },
      },
      massings: {
        orderBy: { createdAt: 'desc' },
      },
    },
  });
}

/**
 * Get user's projects
 */
export async function getUserProjects(userId: string, limit = 20) {
  return await prisma.project.findMany({
    where: { userId },
    orderBy: { updatedAt: 'desc' },
    take: limit,
    include: {
      siteAnalysis: true,
      _count: {
        select: {
          floorplans: true,
          models3D: true,
          massings: true,
        },
      },
    },
  });
}

// ===========================================
// SITE ANALYSIS UTILITIES
// ===========================================

/**
 * Create or update site analysis
 */
export async function upsertSiteAnalysis(data: {
  projectId: string;
  coordinates: any; // JSON object with site coordinates
  boundary: any; // GeoJSON FeatureCollection (required)
  sunPathData?: any;
  weatherData?: any;
  topographyData?: any;
  contextData?: any;
  analysisResults?: any;
}) {
  return await prisma.siteAnalysis.upsert({
    where: { projectId: data.projectId },
    update: {
      coordinates: data.coordinates,
      boundary: data.boundary,
      sunPathData: data.sunPathData,
      weatherData: data.weatherData,
      topographyData: data.topographyData,
      contextData: data.contextData,
      analysisResults: data.analysisResults,
    },
    create: {
      projectId: data.projectId,
      coordinates: data.coordinates,
      boundary: data.boundary,
      ...(data.sunPathData !== undefined && { sunPathData: data.sunPathData }),
      ...(data.weatherData !== undefined && { weatherData: data.weatherData }),
      ...(data.topographyData !== undefined && { topographyData: data.topographyData }),
      ...(data.contextData !== undefined && { contextData: data.contextData }),
      ...(data.analysisResults !== undefined && { analysisResults: data.analysisResults }),
    },
  });
}

// ===========================================
// FLOORPLAN UTILITIES
// ===========================================

/**
 * Create a new floorplan
 */
export async function createFloorplan(data: {
  projectId: string;
  name: string;
  level: number;
  data: any; // Fabric.js canvas data
}) {
  return await prisma.floorplan.create({
    data,
    include: {
      project: true,
      models3D: true,
    },
  });
}

/**
 * Update floorplan data
 */
export async function updateFloorplan(floorplanId: string, data: any, userId: string) {
  // First verify the user owns the project
  const floorplan = await prisma.floorplan.findFirst({
    where: { id: floorplanId },
    include: { project: true },
  });

  if (!floorplan || floorplan.project.userId !== userId) {
    throw new Error('Floorplan not found or access denied');
  }

  return await prisma.floorplan.update({
    where: { id: floorplanId },
    data: { data },
  });
}

// ===========================================
// 3D MODEL UTILITIES
// ===========================================

/**
 * Create a new 3D model
 */
export async function createModel3D(data: {
  projectId: string;
  floorplanId?: string;
  name: string;
  modelData: any; // Three.js scene data
  settings?: any;
}) {
  return await prisma.model3D.create({
    data,
    include: {
      project: true,
      floorplan: true,
    },
  });
}

// ===========================================
// MASSING UTILITIES
// ===========================================

/**
 * Create a new massing diagram
 */
export async function createMassing(data: {
  projectId: string;
  name: string;
  massingData: any;
  analysis?: any;
}) {
  return await prisma.massing.create({
    data,
    include: {
      project: true,
    },
  });
}

// ===========================================
// GEOSPATIAL CACHE UTILITIES
// ===========================================

/**
 * Get cached geospatial data
 */
export async function getCachedGeospatialData(cacheKey: string) {
  const cached = await prisma.geospatialCache.findUnique({
    where: { cacheKey },
  });

  if (!cached) {
    return null;
  }

  // Check if cache has expired
  if (cached.expiresAt < new Date()) {
    // Delete expired cache
    await prisma.geospatialCache.delete({
      where: { cacheKey },
    });
    return null;
  }

  return cached.data;
}

/**
 * Set cached geospatial data
 */
export async function setCachedGeospatialData(
  cacheKey: string,
  data: any,
  expiresInHours = 24
) {
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + expiresInHours);

  return await prisma.geospatialCache.upsert({
    where: { cacheKey },
    update: {
      data,
      expiresAt,
    },
    create: {
      cacheKey,
      data,
      expiresAt,
    },
  });
}

/**
 * Clear expired cache entries
 */
export async function clearExpiredCache() {
  return await prisma.geospatialCache.deleteMany({
    where: {
      expiresAt: {
        lt: new Date(),
      },
    },
  });
}

// ===========================================
// FILE UTILITIES
// ===========================================

/**
 * Create file record
 */
export async function createFileRecord(data: {
  userId: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  storageUrl: string;
  storagePath: string;
  fileType: string;
  path?: string;
  uploadedBy?: string;
  projectId?: string;
  category?: string;
  metadata?: any;
}) {
  return await prisma.file.create({
    data,
  });
}

/**
 * Get file by path
 */
export async function getFileByPath(path: string) {
  return await prisma.file.findUnique({
    where: { path },
  });
}

/**
 * Delete file record
 */
export async function deleteFileRecord(path: string) {
  return await prisma.file.delete({
    where: { path },
  });
}
