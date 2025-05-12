#!/bin/sh

echo "Esperando o PostgreSQL iniciar..."
# Esperar o PostgreSQL estar pronto
sleep 10

echo "Executando migrações..."
npm run migration:run

echo "Executando seeds..."
npm run seed

echo "Iniciando a aplicação..."
npm run start:prod