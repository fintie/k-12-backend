#!/bin/bash

# K-12 Backend Deployment Script
# This script helps deploy the backend to Railway

echo "🚀 K-12 Backend Deployment Script"
echo "================================="

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI not found. Please install it first:"
    echo "npm install -g @railway/cli"
    echo "Then run: railway login"
    exit 1
fi

# Check if user is logged in to Railway
if ! railway whoami &> /dev/null; then
    echo "❌ Not logged in to Railway. Please run:"
    echo "railway login"
    exit 1
fi

echo "✅ Railway CLI is ready"

# Create new Railway project
echo "📦 Creating Railway project..."
railway init k12-backend-api --yes

# Set environment variables
echo "🔧 Setting up environment variables..."
railway variables set NODE_ENV=production
railway variables set JWT_SECRET=$(openssl rand -base64 32)
railway variables set DB_URI=\$DATABASE_URL
railway variables set CORS_ORIGIN=https://your-ios-app-domain.com

# Deploy
echo "🚀 Deploying to Railway..."
railway up

# Get the deployment URL
echo "📍 Getting deployment URL..."
sleep 5
railway domain

echo ""
echo "✅ Deployment complete!"
echo "📋 Next steps:"
echo "1. Update your iOS app to use the new backend URL"
echo "2. Run the seed script on the deployed instance if needed"
echo "3. Test the API endpoints"
echo ""
echo "🔗 Your backend API will be available at the URL shown above"