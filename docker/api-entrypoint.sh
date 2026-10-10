#!/bin/sh
# Prepara la carpeta de la API antes de encender Apache
API=/var/www/html/scafi-angular/scafi-api
cd "$API" || exit 1

# PHPMailer no viene incluido en el repositorio: se instala con Composer
if [ -f composer.json ] && [ ! -f vendor/phpmailer/phpmailer/src/PHPMailer.php ]; then
  echo "[scafi-api] Instalando PHPMailer con Composer..."
  # Se borra "vendor" para que Composer lo vuelva a crear completo
  rm -rf vendor
  COMPOSER_ALLOW_SUPERUSER=1 composer install --no-interaction --no-dev --prefer-dist \
    || echo "[scafi-api] AVISO: no se pudo instalar PHPMailer; 'recuperar contraseña' no enviará correos."
fi

# Carpetas donde la aplicación guarda fotos y archivos del chat
mkdir -p uploads/chat uploads/usuarios
chmod -R a+rwX uploads 2>/dev/null || true

exec docker-php-entrypoint "$@"
