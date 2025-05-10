FROM minio/minio:latest

USER root

# Identifica qual gerenciador de pacotes está disponível e instala curl
RUN if command -v apt-get &> /dev/null; then \
        apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*; \
    elif command -v apk &> /dev/null; then \
        apk --no-cache add curl; \
    elif command -v yum &> /dev/null; then \
        yum install -y curl && yum clean all; \
    elif command -v dnf &> /dev/null; then \
        dnf install -y curl && dnf clean all; \
    else \
        echo "No package manager found"; \
    fi

# Copiar o script de inicialização
COPY init.sh /usr/local/bin/init.sh
RUN chmod +x /usr/local/bin/init.sh

# Definir o script de inicialização como ponto de entrada
ENTRYPOINT ["/usr/local/bin/init.sh"]

# Comando padrão (será passado para o script de inicialização)
CMD ["server", "/data"]