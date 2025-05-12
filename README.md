# Cubos Movies 🎬

![Cubos Movies Logo](/frontend/public/logo-horizontal.svg)

Uma aplicação web fullstack para gerenciamento de filmes, desenvolvida como parte do desafio técnico da Cubos Tecnologia.

## 🌟 Visão Geral

Cubos Movies é uma plataforma responsiva para cadastro, edição, visualização e exclusão de filmes. A aplicação oferece funcionalidades de autenticação, busca avançada e filtros personalizados.

## ✨ Funcionalidades

### Autenticação e Segurança

- 🔐 Cadastro e login de usuários
- 🔑 Recuperação de senha via email
- 🛡️ Proteção de rotas com JWT

### Gerenciamento de Filmes

- 📝 Cadastro completo de informações de filmes
- 🏷️ Categorização por gêneros
- 📅 Notificação automática por email no dia de lançamento
- 🔍 Busca por texto e filtros avançados
- 📊 Visualização detalhada com métricas

### Upload de Imagens

- 🖼️ Suporte para imagens de pôster e backdrop
- ☁️ Armazenamento na nuvem com AWS S3
- 🔄 Pré-visualização e edição

### Interface

- 📱 Design responsivo para todos os dispositivos
- 🌓 Modo claro e escuro
- 📊 Componentes interativos e dinâmicos

## 🛠️ Tecnologias Utilizadas

### Backend

- **Framework**: NestJS
- **Linguagem**: TypeScript
- **Banco de Dados**: PostgreSQL
- **ORM**: TypeORM
- **API**: GraphQL
- **Autenticação**: JWT, Passport
- **Armazenamento**: AWS S3
- **Email**: Resend API
- **Agendamento**: NestJS Schedule

### Frontend

- **Framework**: React
- **Roteamento**: TanStack Router
- **Gerenciamento de Estado**: React Query, Apollo Client
- **Estilização**: TailwindCSS
- **Formulários**: React Hook Form, Zod
- **UI/UX**: Design System personalizado
- **Animações**: CSS Transitions

## 🚀 Como Executar o Projeto

### Pré-requisitos

- Node.js (v18+)
- npm ou yarn
- PostgreSQL (porta 5433)
- Conta AWS (para o S3)

### Configuração do Backend

1. Clone o repositório:

   ```bash
   git clone https://github.com/humbertopaiva/cbc.git
   cd cbc
   ```

2. Crie um arquivo `.env` na pasta backend com as seguintes variáveis:

   ```env
   # Database
   DB_HOST=localhost
   DB_PORT=5433
   DB_USERNAME=postgres
   DB_PASSWORD=postgres
   DB_DATABASE=cubos_movies

   # JWT
   JWT_SECRET=jwt_super_secreto_123
   JWT_EXPIRATION=1d

   # Email
   RESEND_API_KEY=resend_fake_api_key
   MAIL_FROM=contato@exemplo.com
   FRONTEND_URL=https://cbc-frontend.limei.app/

   # AWS S3
   AWS_REGION=us-east-1
   AWS_ACCESS_KEY=aws_access_fake_key
   AWS_SECRET_KEY=aws_secret_fake_key
   S3_BUCKET=fake-bucket-name

   # App
   NODE_ENV=development
   PORT=4000
   NOTIFICATION_DEV_MODE=true
   ```

3. Instale as dependências e execute o backend:

   ```bash
   cd backend
   npm install
   npm run start:dev
   ```

4. Execute as migrações:

   ```bash
   npm run migration:run
   ```

5. Popule o banco com dados iniciais:

   ```bash
   npm run seed
   ```

### Configuração do Frontend

1. Crie um arquivo `.env` na pasta frontend:

   ```env
   VITE_API_URL=http://localhost:4000/graphql
   ```

2. Instale as dependências e execute o frontend:

   ```bash
   cd frontend
   npm install
   npm run dev -- --port 8080
   ```

3. Acesse o aplicativo em `http://localhost:8080`

## 🐳 Implantação com Docker

### Pré-requisitos

- Docker
- Docker Compose

### Configuração para Docker

1. Crie um arquivo `.env` na raiz do projeto com:

   ```env
   POSTGRES_USER=postgres
   POSTGRES_PASSWORD=postgres
   POSTGRES_DB=cubos_movies
   DB_HOST=postgres
   DB_PORT=5433
   DB_USERNAME=postgres
   DB_PASSWORD=postgres
   DB_DATABASE=cubos_movies

   JWT_SECRET=jwt_super_secreto_123
   JWT_EXPIRATION=1d

   RESEND_API_KEY=resend_fake_api_key
   MAIL_FROM=contato@exemplo.com
   FRONTEND_URL=https://cbc-frontend.limei.app/

   AWS_REGION=us-east-1
   AWS_ACCESS_KEY=aws_access_fake_key
   AWS_SECRET_KEY=aws_secret_fake_key
   S3_BUCKET=fake-bucket-name

   NODE_ENV=development
   BACKEND_PORT=4000
   FRONTEND_PORT=8080
   NOTIFICATION_DEV_MODE=true

   VITE_API_URL=http://localhost:4000/graphql
   ```

2. Inicie os contêineres:

   ```bash
   docker-compose up -d
   ```

3. Acesse:
   - Frontend: http://localhost:8080
   - Produção: https://cbc-frontend.limei.app/
   - GraphQL API: http://localhost:4000/graphql

## 👨‍💻 Autor

Criado com 💜 por Seu Nome - [GitHub](https://github.com/seu-usuario) | [LinkedIn](https://linkedin.com/in/seu-perfil)

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
