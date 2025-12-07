-- Migration script to disable authentication for development
-- This script makes userId optional in the projects table and adds a demo user

-- Make userId optional in projects table
ALTER TABLE app.projects ALTER COLUMN "userId" DROP NOT NULL;

-- Add demo user for development
INSERT INTO app.users (id, "clerkId", email, "firstName", "lastName", "createdAt", "updatedAt") 
VALUES (
  'demo-user', 
  'demo', 
  'demo@spacekontext.com', 
  'Demo', 
  'User',
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Update any existing projects to use the demo user
UPDATE app.projects 
SET "userId" = 'demo-user' 
WHERE "userId" IS NULL;

-- Add comment to track this migration
COMMENT ON COLUMN app.projects."userId" IS 'Made optional for development without authentication - will be re-enabled later';
