# Build stage
FROM node:24-alpine AS build

WORKDIR /app

# Copiar apenas os arquivos necessários para instalar dependências
COPY package*.json ./

# Instalar dependências
RUN npm ci

# Copiar o resto dos arquivos
COPY . .

# Definir variáveis de ambiente para produção
ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}

# Construir a aplicação
RUN npm run build

# Production stage
FROM nginx:stable-alpine AS production

# Copiar a configuração do nginx
COPY --from=build /app/nginx.conf /etc/nginx/conf.d/default.conf

# Copiar os arquivos de build
COPY --from=build /app/dist /usr/share/nginx/html

# Expor a porta 80
EXPOSE 80

# Comando para iniciar o nginx
CMD ["nginx", "-g", "daemon off;"]