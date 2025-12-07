-- Initialize Space Kontext Database
-- This script runs when the PostgreSQL container starts for the first time

-- Enable PostGIS extension for geospatial functionality
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS postgis_topology;
CREATE EXTENSION IF NOT EXISTS fuzzystrmatch;
CREATE EXTENSION IF NOT EXISTS postgis_tiger_geocoder;

-- Create additional extensions that might be useful
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Create a schema for our application data
CREATE SCHEMA IF NOT EXISTS app;

-- Set default search path to include our app schema
ALTER DATABASE space_kontext SET search_path TO app, public;

-- Create a read-only user for reporting (optional)
-- CREATE USER space_kontext_readonly WITH PASSWORD 'readonly_password';
-- GRANT CONNECT ON DATABASE space_kontext TO space_kontext_readonly;
-- GRANT USAGE ON SCHEMA app TO space_kontext_readonly;
-- GRANT SELECT ON ALL TABLES IN SCHEMA app TO space_kontext_readonly;
-- ALTER DEFAULT PRIVILEGES IN SCHEMA app GRANT SELECT ON TABLES TO space_kontext_readonly;

-- Log successful initialization
DO $$
BEGIN
    RAISE NOTICE 'Space Kontext database initialized successfully with PostGIS support';
END $$;
