FROM php:7.1-apache
MAINTAINER Kliptonize <koen@ebro.me>

# Install needed dependencies
RUN apt-get update && rm -rf /var/lib/apt/lists/*

# Activate mod_rewrite
RUN a2enmod rewrite

# Copy App
COPY index.html /var/www/html/
COPY .htaccess /var/www/html/

COPY application /var/www/html/application
COPY assets /var/www/html/assets

# Expose the default port
EXPOSE 80