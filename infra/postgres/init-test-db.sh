#!/bin/sh
# Cria o banco usado pelos testes de integração/e2e ao inicializar o cluster.
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
  CREATE DATABASE ${POSTGRES_DB}_test;
EOSQL
