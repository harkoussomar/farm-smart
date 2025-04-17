#!/bin/bash
set -e

# Copy environment file for Fly.io
cp .env.fly .env

# Install Fly CLI if not installed
if ! command -v flyctl &> /dev/null; then
    echo "Installing Fly CLI..."
    curl -L https://fly.io/install.sh | sh
    export FLYCTL_INSTALL="/home/$USER/.fly"
    export PATH="$FLYCTL_INSTALL/bin:$PATH"
fi

# Check if user is authenticated with Fly.io
if ! flyctl auth whoami &> /dev/null; then
    echo "Please authenticate with Fly.io:"
    flyctl auth login
fi

# Check if the app exists, if not, create it
if ! flyctl apps list | grep -q "farm-smart"; then
    echo "Creating new Fly.io app..."
    flyctl launch --name farm-smart --no-deploy

    # Create a volume for SQLite persistence
    echo "Creating persistent volume for SQLite..."
    flyctl volumes create sqlite_data --size 1 --region dfw
else
    echo "App already exists on Fly.io"
fi

# Deploy the application
echo "Deploying to Fly.io..."
flyctl deploy --strategy immediate

# Open the app in browser
echo "Deployment complete! Opening app in browser..."
flyctl open
