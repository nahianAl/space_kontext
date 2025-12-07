-- CreateTable
CREATE TABLE "app"."users" (
    "id" TEXT NOT NULL,
    "clerkId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "imageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app"."user_sessions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app"."projects" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "settings" JSONB,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app"."site_analysis" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "address" TEXT,
    "city" TEXT,
    "country" TEXT,
    "boundaries" JSONB,
    "sunPathData" JSONB,
    "weatherData" JSONB,
    "topographyData" JSONB,
    "contextData" JSONB,
    "analysisResults" JSONB,

    CONSTRAINT "site_analysis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app"."floorplans" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "level" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "data" JSONB NOT NULL,

    CONSTRAINT "floorplans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app"."models_3d" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "floorplanId" TEXT,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "modelData" JSONB NOT NULL,
    "settings" JSONB,

    CONSTRAINT "models_3d_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app"."massings" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "massingData" JSONB NOT NULL,
    "analysis" JSONB,

    CONSTRAINT "massings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app"."files" (
    "id" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "path" TEXT NOT NULL,
    "uploadedBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metadata" JSONB,

    CONSTRAINT "files_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app"."geospatial_cache" (
    "id" TEXT NOT NULL,
    "cacheKey" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "geospatial_cache_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_clerkId_key" ON "app"."users"("clerkId");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "app"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_sessions_token_key" ON "app"."user_sessions"("token");

-- CreateIndex
CREATE UNIQUE INDEX "site_analysis_projectId_key" ON "app"."site_analysis"("projectId");

-- CreateIndex
CREATE UNIQUE INDEX "files_path_key" ON "app"."files"("path");

-- CreateIndex
CREATE UNIQUE INDEX "geospatial_cache_cacheKey_key" ON "app"."geospatial_cache"("cacheKey");

-- AddForeignKey
ALTER TABLE "app"."user_sessions" ADD CONSTRAINT "user_sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "app"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."projects" ADD CONSTRAINT "projects_userId_fkey" FOREIGN KEY ("userId") REFERENCES "app"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."site_analysis" ADD CONSTRAINT "site_analysis_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "app"."projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."floorplans" ADD CONSTRAINT "floorplans_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "app"."projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."models_3d" ADD CONSTRAINT "models_3d_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "app"."projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."models_3d" ADD CONSTRAINT "models_3d_floorplanId_fkey" FOREIGN KEY ("floorplanId") REFERENCES "app"."floorplans"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."massings" ADD CONSTRAINT "massings_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "app"."projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
