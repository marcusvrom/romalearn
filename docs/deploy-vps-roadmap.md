# Roadmap de publicação automática na VPS

Este documento descreve as ações manuais necessárias para ativar o deploy da RomaLearn no servidor `169.58.119.107`.

## Visão do fluxo

1. Uma alteração chega à `main` por pull request.
2. O workflow `CI` executa formatação, lint, testes e builds.
3. Somente quando o CI da `main` conclui com sucesso, `Deploy Production` inicia.
4. O GitHub Actions publica duas imagens versionadas no GHCR:
   - `ghcr.io/marcusvrom/romalearn-api:<sha>`
   - `ghcr.io/marcusvrom/romalearn-web:<sha>`
5. A pipeline envia o Compose, Nginx e `deploy.sh` para a VPS.
6. A VPS cria um backup pré-deploy, executa migrations, atualiza containers e verifica `/api/health/ready`.
7. Se o health check falhar, a aplicação tenta retornar à imagem anterior.

## Fase 1 — Primeiro acesso e proteção da VPS

Acesse inicialmente como root usando a credencial fornecida pela Contabo:

```bash
ssh root@169.58.119.107
```

Baixe ou copie `infra/production/bootstrap-vps.sh` para a VPS e execute:

```bash
chmod +x bootstrap-vps.sh
sudo ./bootstrap-vps.sh
```

O script:

- atualiza o Ubuntu;
- instala Docker Engine e Docker Compose;
- cria o usuário `deploy`;
- configura UFW para SSH e HTTP;
- ativa Fail2Ban;
- cria 4 GB de swap;
- prepara `/opt/romalearn`.

Antes de encerrar a sessão root, valide:

```bash
docker version
docker compose version
ufw status
systemctl status fail2ban --no-pager
id deploy
```

## Fase 2 — Chave SSH exclusiva para a pipeline

Na sua máquina local:

```bash
ssh-keygen -t ed25519 -C "github-actions-romalearn" -f romalearn_deploy
```

Não defina senha nessa chave, porque ela será usada de forma não interativa.

Copie o conteúdo de `romalearn_deploy.pub` para:

```text
/home/deploy/.ssh/authorized_keys
```

Na VPS:

```bash
sudo nano /home/deploy/.ssh/authorized_keys
sudo chown deploy:deploy /home/deploy/.ssh/authorized_keys
sudo chmod 600 /home/deploy/.ssh/authorized_keys
```

Teste da sua máquina:

```bash
ssh -i ./romalearn_deploy deploy@169.58.119.107
```

Somente após esse teste funcionar, cadastre a chave privada no GitHub.

## Fase 3 — Criar arquivos secretos na VPS

Os exemplos estão em `infra/production/secrets`.

Na VPS:

```bash
sudo -u deploy cp /caminho/postgres.env.example /opt/romalearn/secrets/postgres.env
sudo -u deploy cp /caminho/api.env.example /opt/romalearn/secrets/api.env
sudo -u deploy cp /caminho/web.env.example /opt/romalearn/secrets/web.env
sudo chmod 600 /opt/romalearn/secrets/*.env
```

Não envie esses arquivos ao GitHub.

Gere segredos independentes:

```bash
openssl rand -base64 48
openssl rand -base64 48
openssl rand -base64 48
```

Use valores diferentes para:

- `POSTGRES_PASSWORD`;
- `JWT_ACCESS_SECRET`;
- `JWT_REFRESH_SECRET`;
- `PAYMENT_FAKE_WEBHOOK_SECRET`.

Para o primeiro deploy sem domínio, use temporariamente:

```dotenv
API_PUBLIC_URL=http://169.58.119.107/api
WEB_PUBLIC_URL=http://169.58.119.107
CORS_ORIGINS=http://169.58.119.107
COOKIE_DOMAIN=
COOKIE_SECURE=false
```

Ao configurar domínio e HTTPS, substitua pelos valores definitivos e altere `COOKIE_SECURE=true`.

## Fase 4 — Permitir que a VPS baixe imagens privadas do GHCR

Crie um Personal Access Token Classic no GitHub com apenas:

```text
read:packages
```

Na VPS, logado como `deploy`:

```bash
echo 'TOKEN_COM_READ_PACKAGES' | docker login ghcr.io -u marcusvrom --password-stdin
```

Valide:

```bash
cat ~/.docker/config.json
```

O arquivo deve pertencer ao usuário `deploy` e ter permissão restrita:

```bash
chmod 600 ~/.docker/config.json
```

Alternativamente, torne os packages da API e do frontend públicos após a primeira publicação. Nesse caso, o login de leitura deixa de ser necessário.

## Fase 5 — Configurar o Environment `production` no GitHub

No repositório:

```text
Settings → Environments → New environment → production
```

Adicione os secrets:

| Nome | Valor |
|---|---|
| `VPS_USER` | `deploy` |
| `VPS_PORT` | `22` |
| `VPS_SSH_KEY` | conteúdo completo da chave privada `romalearn_deploy` |
| `VPS_KNOWN_HOSTS` | saída de `ssh-keyscan -H 169.58.119.107` |

O IP já está definido no workflow como `169.58.119.107` e não precisa ser secret.

Adicione a variável do environment:

| Nome | Valor inicial |
|---|---|
| `PRODUCTION_URL` | `http://169.58.119.107` |

Depois do domínio e HTTPS, atualize essa variável.

Durante a Beta, configure `Required reviewers` para que todo deploy exija aprovação manual.

## Fase 6 — Proteger a branch `main`

Em:

```text
Settings → Branches → Add branch protection rule
```

Para `main`, ative:

- exigir pull request antes do merge;
- exigir o status `Lint, testes e build`;
- exigir branch atualizada antes do merge;
- bloquear push direto;
- impedir bypass, exceto para recuperação administrativa.

O deploy é disparado apenas após o CI da `main` terminar com sucesso.

## Fase 7 — Primeiro deploy controlado

Antes do primeiro merge na `main`, valide na branch de demo:

```bash
pnpm install --frozen-lockfile
pnpm format:check
pnpm lint
pnpm test
pnpm build
pnpm seed
```

Depois, teste localmente as imagens:

```bash
docker build -f apps/api/Dockerfile -t romalearn-api:test .
docker build -f apps/web/Dockerfile -t romalearn-web:test .
```

Faça o merge na `main` e acompanhe:

```text
Actions → CI
Actions → Deploy Production
```

Na VPS, acompanhe:

```bash
docker compose \
  --env-file /opt/romalearn/config/deploy.env \
  -f /opt/romalearn/config/compose.yml ps

docker compose \
  --env-file /opt/romalearn/config/deploy.env \
  -f /opt/romalearn/config/compose.yml logs -f --tail=100 api web nginx
```

Valide externamente:

```bash
curl http://169.58.119.107/healthz
curl http://169.58.119.107/api/health/live
curl http://169.58.119.107/api/health/ready
```

## Fase 8 — Seed inicial

A pipeline não executa seed automaticamente, porque seed pode alterar conteúdo e ofertas de forma ampla.

Depois do primeiro deploy, execute manualmente na VPS:

```bash
cd /opt/romalearn
docker compose \
  --env-file config/deploy.env \
  -f config/compose.yml \
  run --rm api pnpm seed
```

Não execute `seed:demo` em produção pública. Para homologação isolada, ele pode ser usado conscientemente.

## Fase 9 — Domínio, Cloudflare e HTTPS

No Cloudflare:

1. Crie um registro `A` apontando para `169.58.119.107`.
2. Ative proxy.
3. Configure SSL/TLS inicialmente como `Full` e, após instalar certificado de origem, como `Full (strict)`.
4. Atualize `PRODUCTION_URL` no GitHub.
5. Atualize `api.env` e `web.env` na VPS.
6. Altere `COOKIE_SECURE=true`.
7. Libere a porta 443 no UFW quando o proxy estiver configurado para TLS na origem.

A primeira versão do Nginx versionada escuta HTTP para permitir a validação inicial por IP. HTTPS deve ser ativado antes de vendas e autenticação pública definitiva.

## Fase 10 — Backups externos

O deploy cria backup local antes de cada migration e mantém 14 dias. Isso não substitui backup externo.

Configure um job diário para enviar backups ao Cloudflare R2 usando `rclone`:

```text
/opt/romalearn/backups → R2
```

Critério mínimo:

- backup diário do PostgreSQL;
- retenção de 30 dias no R2;
- alerta quando o upload falhar;
- teste mensal de restauração.

## Fase 11 — Monitoramento

Configure pelo menos:

- Uptime Kuma para `/healthz` e `/api/health/ready`;
- alerta de disco acima de 80%;
- alerta de memória acima de 85%;
- alerta de containers reiniciando;
- monitoramento externo a partir do Brasil, pois a VPS está na Europa.

## Rollback manual

Consulte a versão atual:

```bash
cat /opt/romalearn/config/deploy.env
```

Para voltar a um SHA anterior:

```bash
printf 'APP_VERSION=SHA_ANTERIOR\n' > /opt/romalearn/config/deploy.env
cd /opt/romalearn
docker compose --env-file config/deploy.env -f config/compose.yml pull api web
docker compose --env-file config/deploy.env -f config/compose.yml up -d --remove-orphans
```

Migrations destrutivas podem impedir rollback. Mudanças de banco devem seguir o padrão expandir, migrar e somente depois remover.

## Checklist de ativação

- [ ] VPS acessível pelo usuário `deploy` com chave exclusiva.
- [ ] Login no GHCR funcionando na VPS.
- [ ] `postgres.env`, `api.env` e `web.env` criados com permissões 600.
- [ ] Environment `production` criado no GitHub.
- [ ] Secrets de SSH cadastrados.
- [ ] `PRODUCTION_URL` cadastrada.
- [ ] Proteção da `main` ativada.
- [ ] CI verde na branch de demo.
- [ ] Imagens Docker construídas localmente.
- [ ] Primeiro deploy aprovado manualmente.
- [ ] Health checks respondendo.
- [ ] Seed inicial executado conscientemente.
- [ ] Domínio e HTTPS configurados antes da abertura pública.
- [ ] Backup externo e restauração testados.
