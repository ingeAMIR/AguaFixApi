# Etapa 1: Construcción
FROM node:22-alpine AS builder

WORKDIR /app

# Instalar dependencias
COPY package*.json ./
RUN npm ci

# Copiar código fuente y compilar
COPY . .
RUN npm run build
RUN npm prune --production

# Etapa 2: Imagen final de producción
FROM node:22-alpine

WORKDIR /app

ENV NODE_ENV=production

# Copiar paquetes de producción y archivos compilados
COPY package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/main"]
