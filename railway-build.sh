#!/bin/bash
set -e

# Copy environment file
cp .env.railway .env

# Create SQLite database
mkdir -p database
touch database/database.sqlite
chmod -R 777 database

# Install dependencies
composer install --no-interaction --prefer-dist --optimize-autoloader --no-dev
npm install
npm run build

# Set up Laravel
php artisan key:generate
php artisan storage:link
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Run migrations
php artisan migrate --force
