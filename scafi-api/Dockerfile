# scafi-api/Dockerfile
FROM php:8.2-apache

# Instalar extensiones de MySQL para PHP
RUN docker-php-ext-install mysqli pdo pdo_mysql

# Habilitar el mod_rewrite de Apache (muy común en APIs PHP)
RUN a2enmod rewrite

# Establecer el directorio de trabajo
WORKDIR /var/www/html

# Dar permisos (opcional, dependiendo de tu framework)
RUN chown -R www-data:www-data /var/www/html