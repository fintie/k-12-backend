#!/bin/bash

# Simple API Test Script
echo "🧪 Testing K-12 Backend API"
echo "============================"

BASE_URL="http://localhost:5000"

# Test health endpoint
echo "Testing health endpoint..."
HEALTH_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/health")
if [ "$HEALTH_RESPONSE" = "200" ]; then
    echo "✅ Health check passed"
else
    echo "❌ Health check failed (HTTP $HEALTH_RESPONSE)"
fi

# Test API endpoints (these will fail without auth, but should return 401)
echo "Testing auth endpoints..."
REGISTER_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"test123","email":"test@example.com","firstName":"Test","lastName":"User"}')

if [ "$REGISTER_RESPONSE" = "400" ] || [ "$REGISTER_RESPONSE" = "201" ]; then
    echo "✅ Auth endpoints responding"
else
    echo "❌ Auth endpoints not responding (HTTP $REGISTER_RESPONSE)"
fi

echo ""
echo "🎉 API test complete!"
echo "Note: Full testing requires a running MongoDB instance."
echo "For production deployment, use the Railway script: ./deploy.sh"