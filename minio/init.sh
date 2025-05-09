#!/bin/bash
set -e

# Variáveis de ambiente
MINIO_ROOT_USER=${MINIO_ROOT_USER:-"minio_access_key"}
MINIO_ROOT_PASSWORD=${MINIO_ROOT_PASSWORD:-"minio_secret_key"}
BUCKET_NAME=${BUCKET_NAME:-"cubos-movies"}
MINIO_PORT=${MINIO_PORT:-9000}
CONSOLE_PORT=${CONSOLE_PORT:-9001}

# Iniciar o MinIO em segundo plano
nohup minio server /data --console-address ":${CONSOLE_PORT}" &

# Aguardar até que o MinIO esteja pronto
echo "Waiting for MinIO to be ready..."
until curl -s http://localhost:${MINIO_PORT}/minio/health/live > /dev/null; do
    sleep 1
done

echo "MinIO is ready. Setting up..."

# Baixar o cliente mc se ainda não estiver presente
if ! command -v mc &> /dev/null; then
    echo "Installing MinIO client..."
    curl -sL https://dl.min.io/client/mc/release/linux-amd64/mc > /usr/local/bin/mc
    chmod +x /usr/local/bin/mc
fi

# Configurar o cliente MinIO
mc config host add myminio http://localhost:${MINIO_PORT} ${MINIO_ROOT_USER} ${MINIO_ROOT_PASSWORD}

# Criar o bucket se não existir
mc mb --ignore-existing myminio/${BUCKET_NAME}

# Configurar a política para acesso público de leitura
echo "Setting bucket policy to allow public read access..."
mc anonymous set download myminio/${BUCKET_NAME}

# Configurar CORS
echo "Configuring CORS..."
cat > /tmp/cors.json << EOF
{
  "cors": {
    "allow_origins": ["*"],
    "allow_methods": ["GET", "PUT", "POST", "DELETE"],
    "allow_headers": ["*"],
    "expose_headers": ["ETag", "Content-Length", "Content-Type"],
    "max_age_seconds": 3600
  }
}
EOF

# Aplicar configuração CORS
mc admin config set myminio cors < /tmp/cors.json

# Reiniciar MinIO para aplicar as configurações
echo "Restarting MinIO to apply configurations..."
mc admin service restart myminio

# Aguardar até que o MinIO esteja novamente pronto
echo "Waiting for MinIO to be ready again..."
until curl -s http://localhost:${MINIO_PORT}/minio/health/live > /dev/null; do
    sleep 1
done

echo "MinIO setup completed successfully!"
echo "MinIO server is now running in the foreground..."

# Parar o processo em segundo plano
pkill minio

# Iniciar o MinIO no primeiro plano para manter o container em execução
exec minio server /data --console-address ":${CONSOLE_PORT}"