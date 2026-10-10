# Despliegue de SCAFI con Docker

SCAFI se ejecuta en tres contenedores definidos en `docker-compose.yml`:

| Contenedor  | Imagen                         | Función                                                        |
|-------------|--------------------------------|----------------------------------------------------------------|
| `scafi-db`  | `mariadb:10.11`                | Base de datos. Se carga sola con `scafi_base_datos.sql`.        |
| `scafi-api` | `php:8.2-apache` (`docker/api.Dockerfile`) | API en PHP. Instala PHPMailer con Composer al iniciar. |
| `scafi-web` | `nginx:alpine`                 | Sirve la aplicación Angular y reenvía `/scafi-angular/scafi-api/` a la API. |

La base de datos y la API no se publican fuera de Docker; solo se publica la web.

## Requisitos

- Docker y Docker Compose (v2)
- Node.js 22 o superior (solo para compilar Angular)

## Pasos

Desde la carpeta raíz del proyecto:

```bash
# 1. Compilar la aplicación Angular
cd scafi-app-nuevo
npm install
npm run build
cd ..

# 2. Preparar la carpeta que sirve Nginx
bash docker/preparar-web.sh

# 3. Encender los contenedores
docker compose up -d
```

Abrir en el navegador: <http://localhost:4200>

Para usar otro puerto: `SCAFI_PUERTO=8080 docker compose up -d`

> Si el equipo donde corre Docker tiene pocos recursos, el paso 1 se puede hacer
> en otro computador y copiar la carpeta `scafi-app-nuevo/dist/scafi-app-nuevo`.
> Luego: `bash docker/preparar-web.sh ruta/de/la/carpeta`

## Comandos útiles

| Acción                         | Comando                                    |
|--------------------------------|--------------------------------------------|
| Ver contenedores               | `docker compose ps`                        |
| Ver registros                  | `docker compose logs -f`                   |
| Apagar                         | `docker compose down`                      |
| Encender de nuevo              | `docker compose up -d`                     |
| Reiniciar la base desde el SQL | `docker compose down -v && docker compose up -d` |

## Notas

- Los datos de la base quedan en el volumen `scafi_datos`; no se pierden al apagar.
- La base de Docker es independiente de la de XAMPP.
- Entorno donde se probó: Ubuntu Server 26.04 en VirtualBox, Docker 29, Docker Compose 2.40.
