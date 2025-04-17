FROM php:8.2-fpm

# Set working directory
WORKDIR /var/www/html

# Install dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    libpng-dev \
    libpq-dev \
    libjpeg62-turbo-dev \
    libfreetype6-dev \
    locales \
    zip \
    jpegoptim optipng pngquant gifsicle \
    vim \
    unzip \
    git \
    curl \
    libzip-dev \
    libonig-dev \
    nginx \
    nodejs \
    npm

# Clear cache
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# Install extensions
RUN docker-php-ext-install pdo_pgsql pgsql mbstring zip exif pcntl
RUN docker-php-ext-configure gd --with-freetype --with-jpeg
RUN docker-php-ext-install gd

# Install composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Copy existing application directory
COPY . .

# Install application dependencies
RUN composer install --no-interaction --optimize-autoloader --no-dev
RUN npm install
RUN npm run build

# Setup appropriate permissions
RUN chown -R www-data:www-data /var/www/html
RUN chmod -R 755 /var/www/html/storage

# Setup Nginx
COPY nginx.conf /etc/nginx/sites-available/default
RUN ln -sf /dev/stdout /var/log/nginx/access.log \
    && ln -sf /dev/stderr /var/log/nginx/error.log

# Create entrypoint script
RUN echo '#!/bin/bash\n\
php artisan migrate --force\n\
php artisan storage:link\n\
php artisan config:cache\n\
php artisan route:cache\n\
php artisan view:cache\n\
service nginx start\n\
php-fpm\n' > /entrypoint.sh

RUN chmod +x /entrypoint.sh

# Expose port 8080
EXPOSE 8080

# Start servers
ENTRYPOINT ["/entrypoint.sh"]
