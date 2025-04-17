#!/bin/bash
set -e

# Make sure .env.heroku exists
if [ ! -f .env.heroku ]; then
    echo "Error: .env.heroku file not found!"
    exit 1
fi

# Install Heroku CLI if not installed
if ! command -v heroku &> /dev/null; then
    echo "Installing Heroku CLI..."
    curl https://cli-assets.heroku.com/install.sh | sh
fi

# Check if logged in to Heroku
if ! heroku auth:whoami &> /dev/null; then
    echo "Please login to Heroku:"
    heroku login
fi

# Create Heroku app if it doesn't exist
if ! heroku apps:info --app farm-smart-backend &> /dev/null; then
    echo "Creating Heroku app..."
    heroku create farm-smart-backend
else
    echo "App already exists on Heroku"
fi

# Create SQLite database directory
mkdir -p database
touch database/database.sqlite

# Configure Heroku app
echo "Configuring Heroku app..."
heroku config:set APP_KEY=$(php artisan key:generate --show) --app farm-smart-backend
heroku config:set APP_ENV=production --app farm-smart-backend
heroku config:set APP_DEBUG=false --app farm-smart-backend
heroku config:set LOG_CHANNEL=stderr --app farm-smart-backend
heroku config:set DB_CONNECTION=sqlite --app farm-smart-backend
heroku config:set DB_DATABASE=/app/database/database.sqlite --app farm-smart-backend
heroku config:set HEROKU_APP_NAME=farm-smart-backend --app farm-smart-backend

# Deploy to Heroku
echo "Deploying to Heroku..."
git push heroku main

# Run database migrations
echo "Running database migrations..."
heroku run php artisan migrate --force --app farm-smart-backend

echo "Heroku deployment complete!"
echo "Your API is available at: https://farm-smart-backend.herokuapp.com"
