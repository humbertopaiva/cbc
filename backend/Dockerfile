FROM node:24-alpine

WORKDIR /app

# Instalar dependências necessárias
RUN apk add --no-cache bash

# Copiar package.json e package-lock.json
COPY package*.json ./

# Instalar dependências
RUN npm install

# Copiar todo o código fonte
COPY . .

# Dar permissão de execução ao script de inicialização
COPY scripts/start.sh ./scripts/start.sh
RUN chmod +x ./scripts/start.sh

# Construir a aplicação
RUN npm run build

# Expor a porta da aplicação
EXPOSE 4000

# Executar o script de inicialização
CMD ["./scripts/start.sh"]