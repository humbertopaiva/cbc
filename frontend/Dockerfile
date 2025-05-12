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

# Usar a mesma imagem para produção
FROM node:24-alpine

WORKDIR /app

# Copiar package.json e package-lock.json
COPY --from=build /app/package*.json ./

# Copiar o diretório node_modules que contém as dependências
COPY --from=build /app/node_modules ./node_modules

# Copiar arquivos de build
COPY --from=build /app/dist ./dist

# Copiar arquivos de configuração do Vite
COPY --from=build /app/vite.config.js ./

# Expor a porta 80
EXPOSE 80

# Definir variável de ambiente para a porta do preview
ENV PORT=80

# Comando para usar o script "serve" do package.json
CMD ["npm", "run", "start"]