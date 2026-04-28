#!/bin/bash

# Generate a secure JWT secret
echo "🔐 Generating secure JWT secret..."
JWT_SECRET=$(openssl rand -base64 32)
echo "Your JWT_SECRET: $JWT_SECRET"
echo ""
echo "Add this to your Render environment variables:"
echo "JWT_SECRET=$JWT_SECRET"