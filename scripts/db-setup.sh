#!/bin/bash

# Space Kontext Database Setup Script
# This script helps set up the local PostgreSQL database for development

set -e

echo "🏗️  Setting up Space Kontext Database..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

# Check if docker-compose is available
if ! command -v docker-compose &> /dev/null; then
    echo "❌ docker-compose is not installed. Please install docker-compose and try again."
    exit 1
fi

# Create .env.local if it doesn't exist
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local file..."
    cat > .env.local << EOF
# Database Configuration
DATABASE_URL="postgresql://space_kontext:space_kontext_dev@localhost:5432/space_kontext?schema=app"

# Clerk Authentication (Development)
# You need to get these from https://dashboard.clerk.com/
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_placeholder
CLERK_SECRET_KEY=sk_test_placeholder

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
EOF
    echo "✅ Created .env.local file with database configuration"
else
    echo "ℹ️  .env.local already exists, skipping creation"
fi

# Start the database
echo "🐘 Starting PostgreSQL database..."
docker-compose up -d postgres

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
timeout=60
counter=0
while ! docker-compose exec postgres pg_isready -U space_kontext -d space_kontext > /dev/null 2>&1; do
    if [ $counter -eq $timeout ]; then
        echo "❌ Database failed to start within $timeout seconds"
        exit 1
    fi
    sleep 1
    counter=$((counter + 1))
done

echo "✅ Database is ready!"

# Test database connection
echo "🔍 Testing database connection..."
if docker-compose exec postgres psql -U space_kontext -d space_kontext -c "SELECT version();" > /dev/null 2>&1; then
    echo "✅ Database connection successful"
else
    echo "❌ Database connection failed"
    exit 1
fi

# Check PostGIS extension
echo "🗺️  Checking PostGIS extension..."
if docker-compose exec postgres psql -U space_kontext -d space_kontext -c "SELECT PostGIS_version();" > /dev/null 2>&1; then
    echo "✅ PostGIS extension is available"
else
    echo "❌ PostGIS extension is not available"
    exit 1
fi

echo ""
echo "🎉 Database setup complete!"
echo ""
echo "📊 Database Information:"
echo "   Host: localhost"
echo "   Port: 5432"
echo "   Database: space_kontext"
echo "   Username: space_kontext"
echo "   Password: space_kontext_dev"
echo "   Schema: app"
echo ""
echo "🔧 Management Tools:"
echo "   pgAdmin: http://localhost:5050 (admin@spacekontext.local / admin)"
echo ""
echo "📝 Next steps:"
echo "   1. Run 'npm install' to install Prisma dependencies"
echo "   2. Run 'npx prisma generate' to generate Prisma client"
echo "   3. Run 'npx prisma db push' to create database schema"
echo ""
echo "🛑 To stop the database: docker-compose down"
echo "🔄 To restart the database: docker-compose restart postgres"
