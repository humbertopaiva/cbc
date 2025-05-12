#!/bin/sh

echo "Waiting for PostgreSQL to start..."
# Wait for PostgreSQL to be ready - using postgres environment variables
until PGPASSWORD=$POSTGRES_PASSWORD psql -h "${POSTGRES_HOST:-$DB_HOST}" -U "${POSTGRES_USER:-$DB_USERNAME}" -d "${POSTGRES_DB:-$DB_DATABASE}" -c '\q'; do
  >&2 echo "PostgreSQL is unavailable - sleeping"
  sleep 2
done

echo "Running migrations..."
# Execute as migrações usando TypeORM
npx typeorm migration:run -d dist/typeorm.config.js

echo "Running seeds..."
# Execute os seeds
node dist/src/seeds/seed.js

echo "Starting application..."
# Inicie a aplicação
node dist/src/main.js