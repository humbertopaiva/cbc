# 🎬 Cubos Movies

Sistema completo para gerenciar e explorar filmes, com upload para AWS S3, autenticação via JWT e envio de emails com Resend. Projeto fullstack com **NestJS**, **React**, **GraphQL** e **Docker**.

---

## 🧱 Tecnologias

- **Backend**: [NestJS](https://nestjs.com/), [TypeORM](https://typeorm.io/), [PostgreSQL](https://www.postgresql.org/), [GraphQL](https://graphql.org/)
- **Frontend**: [React](https://reactjs.org/), [Vite](https://vitejs.dev/), [Apollo Client](https://www.apollographql.com/docs/react/)
- **Infraestrutura**: [Docker Compose](https://docs.docker.com/compose/), [AWS S3](https://aws.amazon.com/s3/), [Resend](https://resend.com/)

---

## 🚀 Como rodar o projeto

### 1. Clone o repositório

```bash
git clone https://github.com/humbertopaiva/cbc.git
cd cbc
```

### 2. Crie os arquivos `.env`

#### Backend `.env` (em `backend/.env`):

```env
DB_HOST=postgres
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=cubos_movies

JWT_SECRET=sua_chave
JWT_EXPIRATION=1d

AWS_REGION=us-east-1
AWS_ACCESS_KEY=sua_access_key
AWS_SECRET_KEY=sua_secret_key
S3_BUCKET=sua_bucket

RESEND_API_KEY=sua_resend_key
MAIL_FROM=contato@seuemail.com

FRONTEND_URL=http://localhost:3000

NODE_ENV=development
PORT=4000
```

#### Frontend `.env` (em `frontend/.env`):

```env
VITE_API_URL=http://localhost:4000/graphql
```

---

### 3. Suba os containers com Docker

```bash
docker-compose up --build
```

> O frontend estará disponível em [http://localhost:3000](http://localhost:3000)  
> O backend (GraphQL Playground) em [http://localhost:4000/graphql](http://localhost:4000/graphql)

---

## 🛠 Scripts úteis

### Backend

```bash
# Dentro do container ou do diretório backend/
npm run start:dev       # Inicia o servidor em modo desenvolvimento
npm run build           # Compila o projeto
npm run format          # Formata o código
```

### Frontend

```bash
# Dentro do container ou do diretório frontend/
yarn dev                # Inicia o frontend com Vite
yarn build              # Compila o frontend para produção
```

---

## 🗃 Estrutura de pastas

```
cubos-movies/
├── backend/            # API GraphQL com NestJS
│   └── .env            # Variáveis de ambiente (não versionado)
├── frontend/           # Interface com React + Vite
│   └── .env            # Variáveis de ambiente (não versionado)
├── docker-compose.yml  # Orquestração com Docker
```

---

## 📦 Funcionalidades

- [x] Upload de arquivos para AWS S3
- [x] Autenticação JWT
- [x] Criação e envio de senhas por email com Resend
- [x] Interface rápida e moderna com React + Vite
- [x] Banco de dados PostgreSQL integrado com TypeORM
- [x] GraphQL Playground para testes

---

## 🛡️ Segurança

- 🔐 Variáveis sensíveis estão no `.env` e não devem ser versionadas
- 🚫 Certifique-se de adicionar `.env`, `node_modules/` e `dist/` ao `.gitignore`

---

## 👨‍💻 Desenvolvido por

[Humberto Paiva](https://github.com/humbertopaiva) – Fullstack Developer  
Entre em contato no [LinkedIn](https://www.linkedin.com/in/devhumbertopaiva)

---

## 📝 Licença

Este projeto está licenciado sob a Licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
