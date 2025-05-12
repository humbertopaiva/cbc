FROM node:24-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}

# Construir a aplicação
RUN npm run build

# Instalar serve para servir a aplicação
RUN npm install -g serve

# Porta interna
EXPOSE 3000

# Comando para servir a aplicação em produção
CMD ["serve", "-s", "dist", "-l", "3000"]