FROM node:24-alpine AS build

WORKDIR /app

# Copiar package.json e package-lock.json para aproveitar o cache do Docker
COPY package*.json ./

# Instalar dependências
RUN npm ci

# Copiar o resto dos arquivos
COPY . .

# Definir variáveis de ambiente para a build
ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}

# Construir a aplicação
RUN npm run build

# Usar o serve para servir a aplicação
RUN npm install -g serve

# Expor a porta 80
EXPOSE 80

# Iniciar o serve
CMD ["serve", "-s", "dist", "-l", "80"]