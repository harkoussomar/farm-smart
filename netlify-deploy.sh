#!/bin/bash
set -e

# Install Netlify CLI if not installed
if ! command -v netlify &> /dev/null; then
    echo "Installing Netlify CLI..."
    npm install -g netlify-cli
fi

# Check if logged in to Netlify
if ! netlify status &> /dev/null; then
    echo "Please login to Netlify:"
    netlify login
fi

# Create and configure .env file for production build
echo "Setting up environment for frontend build..."
echo "VITE_API_URL=https://farm-smart-backend.herokuapp.com/api" > .env.production

# Build the frontend
echo "Building frontend..."
npm run build

# Deploy to Netlify
echo "Deploying to Netlify..."
netlify deploy --prod --dir=public --site=farm-smart

echo "Netlify deployment complete!"
echo "Your site is available at: https://farm-smart.netlify.app"
