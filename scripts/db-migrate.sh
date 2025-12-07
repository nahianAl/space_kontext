#!/bin/bash

# Database Migration Script for Space Kontext
# This script handles database migrations and schema updates

set -e

echo "🔄 Running database migrations..."

# Check if database is running
if ! docker-compose exec postgres pg_isready -U space_kontext -d space_kontext > /dev/null 2>&1; then
    echo "❌ Database is not running. Please start it with: docker-compose up -d postgres"
    exit 1
fi

# Generate Prisma client
echo "📦 Generating Prisma client..."
npx prisma generate

# Push schema to database
echo "🚀 Pushing schema to database..."
npx prisma db push

# Run any pending migrations
echo "📋 Running migrations..."
npx prisma migrate deploy

echo "✅ Database migrations completed successfully!"
echo ""
echo "📊 Database status:"
npx prisma db status
