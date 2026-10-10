# API de SCAFI: PHP 8.2 con Apache (la misma versión de PHP que en XAMPP)
FROM php:8.2-apache

RUN apt-get update \
 && apt-get install -y --no-install-recommends unzip git \
 && rm -rf /var/lib/apt/lists/* \
 && docker-php-ext-install mysqli pdo_mysql \
 && a2enmod rewrite headers

# Composer, para instalar PHPMailer (recuperación de contraseña)
COPY --from=composer:2 /usr/bin/composer /usr/local/bin/composer

COPY php-scafi.ini /usr/local/etc/php/conf.d/scafi.ini
COPY api-entrypoint.sh /usr/local/bin/api-entrypoint.sh
RUN chmod +x /usr/local/bin/api-entrypoint.sh

WORKDIR /var/www/html/scafi-angular/scafi-api
ENTRYPOINT ["api-entrypoint.sh"]
CMD ["apache2-foreground"]
