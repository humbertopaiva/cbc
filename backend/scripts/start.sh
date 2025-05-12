#!/bin/sh

echo "Waiting for PostgreSQL to start..."
# Wait for PostgreSQL to be ready - using postgres environment variables
until PGPASSWORD=$POSTGRES_PASSWORD psql -h "$POSTGRES_HOST" -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c '\q'; do
  >&2 echo "PostgreSQL is unavailable - sleeping"
  sleep 2
done

echo "Running migrations..."
# Verificando se o arquivo existe antes de executar
if [ -f "dist/typeorm.config.js" ]; then
  npx typeorm migration:run -d dist/typeorm.config.js
else
  echo "Error: dist/typeorm.config.js not found!"
  exit 1
fi

echo "Running seeds..."
node dist/src/seeds/seed.js

echo "Starting application..."
node dist/src/main.js