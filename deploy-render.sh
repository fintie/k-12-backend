#!/bin/bash

# K-12 Backend Deployment to Render
echo "🚀 Deploying K-12 Backend to Render"
echo "===================================="

# Check if Render CLI is available (optional)
if command -v render &> /dev/null; then
    echo "✅ Render CLI detected"
else
    echo "ℹ️  Render CLI not found. You can deploy directly from the Render dashboard:"
    echo "   1. Go to https://render.com"
    echo "   2. Connect your GitHub repository"
    echo "   3. Create a new Web Service"
    echo "   4. Set build command: npm install"
    echo "   5. Set start command: npm start"
fi

echo ""
echo "📋 Render Deployment Checklist:"
echo "================================"
echo "1. ✅ Code is pushed to GitHub"
echo "2. 🔧 Environment Variables to set in Render:"
echo "   - NODE_ENV=production"
echo "   - JWT_SECRET=<generate-secure-random-string>"
echo "   - DB_URI=<your-mongodb-atlas-connection-string>"
echo "   - CORS_ORIGIN=<your-ios-app-domain-or-*>"
echo "3. 🗄️  Database: Use MongoDB Atlas (free tier available)"
echo "4. 🌐 Service Type: Web Service"
echo "5. 🏗️  Build Command: npm install"
echo "6. ▶️  Start Command: npm start"
echo ""

echo "🔗 After deployment, update your iOS app with the Render URL"
echo "📱 Your API will be available at: https://your-service-name.onrender.com"
echo ""
echo "🎉 Ready for Render deployment!"