# ==========================================================================
# Dockerfile para Frontend (React + Vite + Nginx)
# ==========================================================================

# ==========================================================================
# Stage 1: Build
# ==========================================================================
FROM node:20-alpine as build

# Definir diretório de trabalho
WORKDIR /app

# Copiar package.json e package-lock.json
COPY package*.json ./

# Instalar dependências
RUN npm ci

# Copiar o código da aplicação
COPY . .

# Definir variável de ambiente para a API (pode ser sobrescrita)
ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL:-"http://localhost:8000/api/v1"}

# Build da aplicação
RUN npm run build

# ==========================================================================
# Stage 2: Production with Nginx
# ==========================================================================
FROM nginx:alpine as production

# Copiar arquivos buildados do stage anterior
COPY --from=build /app/dist /usr/share/nginx/html

# Copiar configuração customizada do Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expor porta 80
EXPOSE 80

# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:80 || exit 1

# Comando para iniciar o Nginx
CMD ["nginx", "-g", "daemon off;"]
