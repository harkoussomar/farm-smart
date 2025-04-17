#!/bin/bash
set -e

# Copy environment file
cp .env.railway .env

# Install dependencies
composer install --no-interaction --prefer-dist --optimize-autoloader --no-dev
npm install
npm run build

# Set up Laravel
php artisan storage:link
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Run migrations
php artisan migrate --force
