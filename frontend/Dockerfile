FROM node:24-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}

# Porta interna
EXPOSE 3000

# Comando para servir a aplicação em produção
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "3000"]