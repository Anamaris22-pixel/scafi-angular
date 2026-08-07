# Etapa 1: Construcción
FROM node:20 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Etapa 2: Servidor Nginx
FROM nginx:alpine
# IMPORTANTE: Reemplaza "scafi-app-nuevo" en la siguiente ruta por el nombre exacto 
# de la carpeta que se genera dentro de tu carpeta "dist" al hacer el build.
COPY --from=build /app/dist/scafi-app-nuevo /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]