FROM node:18-alpine

WORKDIR /app

# Instalar dependências necessárias para compilação nativa
RUN apk add --no-cache python3 make g++

COPY package*.json ./

# Instalar dependências
RUN npm install

COPY . .

# Compilar a aplicação
RUN npm run build

# Comando para iniciar a aplicação
CMD ["npm", "run", "start:dev"]