#!/usr/bin/env bash
# exit on error
set -o errexit

# Install PHP dependencies
composer install --no-interaction --prefer-dist --optimize-autoloader --no-dev

# Install NPM dependencies and build assets
npm install
npm run build

# Setup Laravel application
php artisan storage:link
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Run database migrations
php artisan migrate --force
