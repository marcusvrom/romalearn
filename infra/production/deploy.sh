#!/usr/bin/env sh
set -eu

VERSION="${1:?Informe o SHA da versão}"
APP_DIR="/opt/romalearn"
CONFIG_DIR="$APP_DIR/config"
SECRETS_DIR="$APP_DIR/secrets"
BACKUP_DIR="$APP_DIR/backups"
COMPOSE_FILE="$CONFIG_DIR/compose.yml"
VERSION_FILE="$CONFIG_DIR/deploy.env"
PREVIOUS_VERSION=""

mkdir -p "$BACKUP_DIR"

if [ -f "$VERSION_FILE" ]; then
  PREVIOUS_VERSION="$(sed -n 's/^APP_VERSION=//p' "$VERSION_FILE" | head -n 1)"
fi

printf 'APP_VERSION=%s\n' "$VERSION" > "$VERSION_FILE"

compose() {
  docker compose --env-file "$VERSION_FILE" -f "$COMPOSE_FILE" "$@"
}

rollback() {
  if [ -z "$PREVIOUS_VERSION" ]; then
    echo 'Rollback indisponível: não há versão anterior registrada.'
    return 1
  fi

  echo "Rollback para $PREVIOUS_VERSION"
  printf 'APP_VERSION=%s\n' "$PREVIOUS_VERSION" > "$VERSION_FILE"
  compose pull api web
  compose up -d --remove-orphans
}

trap 'echo "Deploy interrompido."' INT TERM

echo "Iniciando deploy da versão $VERSION"

echo 'Garantindo banco e Redis...'
compose up -d postgres redis

echo 'Aguardando PostgreSQL...'
for attempt in $(seq 1 30); do
  if compose exec -T postgres pg_isready -U "$(sed -n 's/^POSTGRES_USER=//p' "$SECRETS_DIR/postgres.env")" >/dev/null 2>&1; then
    break
  fi
  if [ "$attempt" -eq 30 ]; then
    echo 'PostgreSQL não ficou pronto.'
    exit 1
  fi
  sleep 2
done

BACKUP_FILE="$BACKUP_DIR/pre-deploy-$(date -u +%Y%m%dT%H%M%SZ).dump"
echo "Criando backup pré-deploy em $BACKUP_FILE"
POSTGRES_USER="$(sed -n 's/^POSTGRES_USER=//p' "$SECRETS_DIR/postgres.env")"
POSTGRES_DB="$(sed -n 's/^POSTGRES_DB=//p' "$SECRETS_DIR/postgres.env")"
compose exec -T postgres pg_dump -U "$POSTGRES_USER" -d "$POSTGRES_DB" -Fc > "$BACKUP_FILE"
find "$BACKUP_DIR" -type f -name 'pre-deploy-*.dump' -mtime +14 -delete

echo 'Baixando imagens da aplicação...'
compose pull api web

echo 'Executando migrations...'
compose run --rm --no-deps api pnpm migration:run

echo 'Atualizando containers...'
compose up -d --remove-orphans

echo 'Aguardando health check externo...'
HEALTH_OK=0
for attempt in $(seq 1 30); do
  if curl --fail --silent --max-time 10 http://127.0.0.1/api/health/ready >/dev/null 2>&1; then
    HEALTH_OK=1
    break
  fi
  sleep 3
done

if [ "$HEALTH_OK" -ne 1 ]; then
  echo 'Health check falhou. Tentando rollback.'
  rollback || true
  exit 1
fi

docker image prune -f >/dev/null 2>&1 || true

echo "Deploy concluído com sucesso: $VERSION"
