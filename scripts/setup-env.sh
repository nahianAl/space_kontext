#!/bin/bash

# Environment Setup Script for Space Kontext
# This script creates the necessary environment files for local development

echo "🔧 Setting up environment for local development..."

# Create .env.local if it doesn't exist
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local file..."
    cat > .env.local << EOF
# Database Configuration
DATABASE_URL="postgresql://space_kontext:space_kontext_dev@localhost:5432/space_kontext?schema=app"

# Clerk Authentication (Development - Placeholder keys)
# You need to get real keys from https://dashboard.clerk.com/
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_placeholder_key_for_development
CLERK_SECRET_KEY=sk_test_placeholder_key_for_development

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
EOF
    echo "✅ Created .env.local file with placeholder values"
else
    echo "ℹ️  .env.local already exists, skipping creation"
fi

echo ""
echo "🔑 To enable authentication, you need to:"
echo "   1. Go to https://dashboard.clerk.com/"
echo "   2. Create a new application"
echo "   3. Copy your API keys"
echo "   4. Update .env.local with your real keys"
echo ""
echo "📊 Current environment setup:"
echo "   - Database: Local PostgreSQL with Docker"
echo "   - Authentication: Clerk (placeholder keys)"
echo "   - App URL: http://localhost:3000"
echo ""
echo "🚀 You can now run: npm run dev"
