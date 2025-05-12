# Cubos Movies 🎬

![Cubos Movies Imagem](https://raw.githubusercontent.com/humbertopaiva/cbc/main/frontend/public/imagem.jpg)

Uma aplicação web fullstack para gerenciamento de filmes, desenvolvida como parte do desafio técnico da Cubos Tecnologia.

## ⭐ Demonstração em Produção


**Acesse o projeto em produção:** [https://cb-front.limei.app](https://cb-front.limei.app)


> 🌟 Esta URL é a versão final e otimizada do projeto para avaliação.

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
- Docker e Docker Compose
- Conta AWS (para o S3) com um bucket configurado para operações de leitura/escrita
- Conta Resend para envio de emails

### Opção 1: Execução com Docker (Recomendada)

1. Clone o repositório:

   ```bash
   git clone https://github.com/humbertopaiva/cbc.git
   cd cbc
   ```

2. Crie um arquivo `.env` na raiz do projeto:

   ```env
   # Database Configuration
   POSTGRES_USER=postgres
   POSTGRES_PASSWORD=postgres
   POSTGRES_DB=cubos_movies
   DB_HOST=postgres
   DB_PORT=5432
   DB_USERNAME=postgres
   DB_PASSWORD=postgres
   DB_DATABASE=cubos_movies

   # Frontend Configuration
   FRONTEND_PORT=3000
   VITE_API_URL=http://localhost:4000/graphql
   FRONTEND_URL=http://localhost:3000

   # Backend Configuration
   BACKEND_PORT=4000
   API_URL=http://localhost:4000/graphql
   PORT=4000

   # JWT Configuration
   JWT_SECRET=sua_chave_secreta_aqui
   JWT_EXPIRATION=1d

   # Email Configuration
   RESEND_API_KEY=sua_chave_resend_aqui
   MAIL_FROM=seu_email_remetente@exemplo.com

   # S3 Configuration
   AWS_REGION=sua_regiao_aws
   AWS_ACCESS_KEY=sua_access_key_aws
   AWS_SECRET_KEY=sua_secret_key_aws
   S3_BUCKET=nome_do_seu_bucket

   # App Configuration
   NODE_ENV=development
   NOTIFICATION_DEV_MODE=true
   ```

   > **⚠️ IMPORTANTE:**
   >
   > - Substitua os valores das credenciais com suas próprias chaves.
   > - É necessário ter uma conta Resend com uma API key válida para o envio de emails.
   > - Configure um bucket S3 na AWS com permissões de leitura/escrita para armazenamento de imagens.

3. Inicie os contêineres Docker:

   ```bash
   docker-compose up -d
   ```

4. Acesse o aplicativo:
   - Frontend: http://localhost:3000
   - API GraphQL: http://localhost:4000/graphql
   - Produção: https://cb-front.limei.app

### Opção 2: Execução Local (Desenvolvimento)

#### Configuração do Backend

1. Configure o PostgreSQL na porta 5432

2. Crie um arquivo `.env` na pasta `backend`:

   ```env
   # Database
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=postgres
   DB_PASSWORD=postgres
   DB_DATABASE=cubos_movies

   # JWT
   JWT_SECRET=sua_chave_secreta_aqui
   JWT_EXPIRATION=1d

   # Email
   RESEND_API_KEY=sua_chave_resend_aqui
   MAIL_FROM=seu_email_remetente@exemplo.com
   FRONTEND_URL=http://localhost:3000

   # AWS S3
   AWS_REGION=sua_regiao_aws
   AWS_ACCESS_KEY=sua_access_key_aws
   AWS_SECRET_KEY=sua_secret_key_aws
   S3_BUCKET=nome_do_seu_bucket

   # App
   NODE_ENV=development
   PORT=4000
   NOTIFICATION_DEV_MODE=true
   ```

3. Instale as dependências e execute o backend:

   ```bash
   cd backend
   npm install
   npm run migration:run
   npm run seed
   npm run start:dev
   ```

#### Configuração do Frontend

1. Crie um arquivo `.env` na pasta `frontend`:

   ```env
   VITE_API_URL=http://localhost:4000/graphql
   ```

2. Instale as dependências e execute o frontend:

   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. Acesse o aplicativo em `http://localhost:3000`

## 🐳 Implantação com Docker

### Pré-requisitos

- Docker
- Docker Compose

### Configuração para Docker

1. Crie um arquivo `.env` na raiz do projeto com:

   ```env
   # Database Configuration
   POSTGRES_USER=postgres
   POSTGRES_PASSWORD=postgres
   POSTGRES_DB=cubos_movies
   DB_HOST=postgres
   DB_PORT=5432
   DB_USERNAME=postgres
   DB_PASSWORD=postgres
   DB_DATABASE=cubos_movies

   # Frontend Configuration
   FRONTEND_PORT=3000
   VITE_API_URL=http://localhost:4000/graphql
   FRONTEND_URL=http://localhost:3000

   # Backend Configuration
   BACKEND_PORT=4000
   API_URL=http://localhost:4000/graphql
   PORT=4000

   # JWT Configuration
   JWT_SECRET=sua_chave_secreta_aqui
   JWT_EXPIRATION=1d

   # Email Configuration
   RESEND_API_KEY=sua_chave_resend_aqui
   MAIL_FROM=seu_email_remetente@exemplo.com

   # S3 Configuration
   AWS_REGION=sua_regiao_aws
   AWS_ACCESS_KEY=sua_access_key_aws
   AWS_SECRET_KEY=sua_secret_key_aws
   S3_BUCKET=nome_do_seu_bucket

   # App Configuration
   NODE_ENV=development
   NOTIFICATION_DEV_MODE=true
   ```

2. Inicie os contêineres:

   ```bash
   docker-compose up -d
   ```

3. Acesse:
   - Frontend: http://localhost:3000
   - API GraphQL: http://localhost:4000/graphql
   - Produção: https://cb-front.limei.app

## 👨‍💻 Autor

Criado com 💜 por Seu Nome - [GitHub](https://github.com/seu-usuario) | [LinkedIn](https://linkedin.com/in/seu-perfil)

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
