#!/bin/bash

echo "🔧 Clearing authentication state..."

# Clear any potential Clerk session files
rm -rf .next/cache
rm -rf .next/static

echo "✅ Cleared Next.js cache"
echo "📝 Please also clear your browser cookies for localhost:3000"
echo "🚀 Starting development server..."

npm run dev
