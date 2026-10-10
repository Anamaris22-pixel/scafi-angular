#!/usr/bin/env bash
# Prepara la aplicación Angular ya compilada para servirla con Nginx.
# Uso (desde la carpeta raíz del proyecto):
#     bash docker/preparar-web.sh [carpeta-compilada]
# Por defecto toma scafi-app-nuevo/dist/scafi-app-nuevo
set -euo pipefail

RAIZ="$(cd "$(dirname "$0")/.." && pwd)"
ORIGEN="${1:-$RAIZ/scafi-app-nuevo/dist/scafi-app-nuevo}"
DESTINO="$RAIZ/docker/web-dist"

[ -f "$ORIGEN/index.html" ] || { echo "No encuentro $ORIGEN/index.html. Compila primero: cd scafi-app-nuevo && npm run build"; exit 1; }

rm -rf "$DESTINO"
cp -r "$ORIGEN" "$DESTINO"

# El código llama a la API en http://localhost/scafi-angular/scafi-api/.
# En esta copia se cambia por una ruta relativa, para que Nginx la reenvíe
# al contenedor de PHP. El código fuente no se modifica.
grep -rlZ 'http://localhost/scafi-angular/scafi-api' "$DESTINO" --include='*.js' \
  | xargs -0 -r sed -i 's#http://localhost/scafi-angular/scafi-api#/scafi-angular/scafi-api#g' || true

chmod -R a+rX "$DESTINO"
echo "Listo: aplicación preparada en docker/web-dist"
