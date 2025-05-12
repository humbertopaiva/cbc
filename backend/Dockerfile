# Build stage
FROM node:24-alpine AS build

WORKDIR /app

# Instalar dependências necessárias para compilação
RUN apk add --no-cache python3 make g++

# Copiar apenas os arquivos necessários para instalar dependências
COPY package*.json ./

# Instalar dependências
RUN npm ci

# Copiar o resto dos arquivos
COPY . .

# Construir a aplicação
RUN npm run build

# Production stage
FROM node:24-alpine AS production

WORKDIR /app

# Instalar cliente PostgreSQL e ferramentas necessárias
RUN apk add --no-cache postgresql-client

# Instalar apenas dependências de produção
COPY package*.json ./
RUN npm ci --only=production

# Copiar os arquivos compilados
COPY --from=build /app/dist ./dist
COPY --from=build /app/src/migrations ./dist/src/migrations
COPY --from=build /app/nest-cli.json .
# Corrigindo o caminho do arquivo de configuração do TypeORM
COPY --from=build /app/typeorm.config.ts ./dist/typeorm.config.js

# Criar script de inicialização
COPY scripts/start.sh .
RUN chmod +x start.sh

# Expor a porta
EXPOSE 4000

# Comando para iniciar a aplicação
CMD ["./start.sh"]