# Operação

## Configuração

Toda a configuração vem de variáveis de ambiente, lidas em um único lugar
(`apps/api/src/config/configuration.ts`). Nenhum outro arquivo acessa `process.env` diretamente.

O `.env.example` documenta todas as variáveis e **não contém segredos reais**. Antes de ir para
produção, gere valores próprios:

```bash
openssl rand -base64 48   # JWT_ACCESS_SECRET
openssl rand -base64 48   # JWT_REFRESH_SECRET
openssl rand -base64 32   # PAYMENT_FAKE_WEBHOOK_SECRET (se mantiver o gateway simulado)
```

Variáveis obrigatórias em produção:

| Variável                                  | Observação                                                       |
| ----------------------------------------- | ---------------------------------------------------------------- |
| `NODE_ENV=production`                     | Ativa cookies seguros, desativa Swagger e recusa ofertas sandbox |
| `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET` | Valores longos e aleatórios                                      |
| `POSTGRES_*`                              | Conexão do banco (`DATABASE_SSL=true` em provedores gerenciados) |
| `CORS_ORIGINS`                            | Somente os domínios reais do site                                |
| `COOKIE_SECURE=true`                      | Exigido com HTTPS                                                |
| `API_PUBLIC_URL`, `WEB_PUBLIC_URL`        | Usados em e-mails, QR Codes e URLs canônicas                     |

## Implantação

### Com Docker

```bash
docker build -f infra/docker/api.Dockerfile -t romalearn-api .
docker build -f infra/docker/web.Dockerfile -t romalearn-web .
```

Ambas as imagens rodam como usuário sem privilégios e expõem `HEALTHCHECK`.

### Ordem de subida

1. PostgreSQL disponível
2. `pnpm migration:run` (ou `pnpm seed` na primeira vez)
3. API (`node dist/main.js`)
4. Front-end SSR (`node dist/web/server/server.mjs`)

O front-end SSR precisa alcançar a API pela rede interna: configure `API_INTERNAL_URL`.

### Proxy reverso

O front-end chama a API em `/api` no mesmo domínio. Configure o proxy para encaminhar `/api` à
API e o restante ao SSR. Assim os cookies `HttpOnly` funcionam sem cross-site.

## Verificações de saúde

| Rota                      | Uso                                             |
| ------------------------- | ----------------------------------------------- |
| `GET /api/health/live`    | O processo está de pé? Não toca em dependências |
| `GET /api/health/ready`   | Dá para receber tráfego? Confere o banco        |
| `GET /api/health/metrics` | Métricas básicas por rota                       |

Use `live` para reiniciar contêineres travados e `ready` para o balanceador.

## Logs

Logs em JSON, uma linha por evento, com `correlationId` propagado por requisição. O cabeçalho
`X-Correlation-Id` é aceito na entrada e devolvido na resposta, permitindo rastrear uma requisição
do navegador até o banco.

```json
{
  "timestamp": "2026-01-15T14:32:10.123Z",
  "level": "log",
  "context": "HTTP",
  "correlationId": "6f3c…",
  "userId": "9a1b…",
  "message": "requisição concluída",
  "method": "POST",
  "route": "/api/learning/lessons/:lessonId/complete",
  "status": 200,
  "durationMs": 34.2
}
```

**Nunca são registrados** senha, hash, token, cookie, cabeçalho de autorização ou dados de cartão.
Metadados de auditoria passam por `redact()` antes de serem gravados.

Em desenvolvimento o formato é legível; em produção, JSON puro para ingestão.

## Auditoria

Ações sensíveis geram registro imutável em `audit_logs` com autor, ação, entidade, data, IP e os
campos essenciais da alteração: criação e publicação de conteúdo, liberação e revogação de acesso,
reembolso, emissão/reemissão/revogação de certificado, mudança de papéis, alteração de
configurações e anonimização de conta.

Consulta pelo painel em `/admin/auditoria`.

## Backup

### PostgreSQL

```bash
# Backup diário
pg_dump -h "$POSTGRES_HOST" -U "$POSTGRES_USER" -d "$POSTGRES_DB" -Fc \
  -f "backup-$(date +%F).dump"

# Restauração
pg_restore -h "$POSTGRES_HOST" -U "$POSTGRES_USER" -d "$POSTGRES_DB" --clean backup-2026-01-15.dump
```

Recomendação mínima: backup diário com retenção de 30 dias, cópia em região diferente da do banco
e **teste de restauração mensal** — backup não testado não é backup.

Provedores gerenciados normalmente oferecem point-in-time recovery; mantenha-o ativo.

### Armazenamento de arquivos

```bash
# MinIO / S3
mc mirror --overwrite local/romalearn s3-backup/romalearn
```

O bucket guarda materiais de apoio e PDFs de certificado. Os PDFs podem ser regerados a partir do
snapshot no banco, mas restaurá-los é mais rápido do que reemitir.

### O que priorizar

1. **PostgreSQL** — insubstituível: contas, progresso, pedidos e certificados;
2. **Bucket de arquivos** — materiais originais não estão em outro lugar;
3. Aplicação — reconstruível a partir do repositório.

## Falhas em webhooks

Eventos de pagamento com falha ficam registrados com o erro e aparecem em `/admin/pedidos`. O
reprocessamento é seguro (consulta o estado atual no provedor e respeita a idempotência).

Monitore `webhooks.failed` no painel: um valor crescente indica problema de integração.

## Escala

O caminho de crescimento, na ordem em que costuma valer a pena:

1. réplica de leitura no PostgreSQL para o catálogo;
2. cache do catálogo público (muda pouco, é lido muito);
3. fila para geração de PDF e envio de e-mail;
4. extração de `commerce` como serviço — as fronteiras já estão desenhadas para isso.
