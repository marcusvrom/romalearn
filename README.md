# RomaLearn — plataforma de cursos e e-books profissionalizantes

Plataforma educacional em português para quem está começando: do primeiro contato com o
computador ao uso responsável de inteligência artificial na rotina administrativa.

O conteúdo inicial vem dos e-books oficiais da trilha: um módulo gratuito de carreira digital e
cinco módulos pagos (Windows, Word, Excel, PowerPoint e IA para processos administrativos).
O catálogo também inclui uma trilha autoral de Desenvolvimento de Software: Git/GitHub, Lógica,
HTML/CSS e JavaScript, seguida de uma escolha entre Python e Java.

## Sumário

- [O que já funciona](#o-que-já-funciona)
- [Arquitetura](#arquitetura)
- [Requisitos](#requisitos)
- [Executando localmente](#executando-localmente)
- [Migrations e seed](#migrations-e-seed)
- [Credenciais locais](#credenciais-locais)
- [Testes](#testes)
- [Configuração de pagamento, e-mail e armazenamento](#configuração-de-pagamento-e-mail-e-armazenamento)
- [Documentação adicional](#documentação-adicional)

## O que já funciona

| Área                                                          | Situação                                                      |
| ------------------------------------------------------------- | ------------------------------------------------------------- |
| Landing page, catálogo e páginas de curso/trilha              | Funcionando, com SSR e SEO                                    |
| Tema claro/escuro e menu de celular em gaveta                 | Funcionando, com preferência salva no aparelho                |
| Cadastro, login, confirmação de e-mail e recuperação de senha | Funcionando                                                   |
| Matrícula gratuita                                            | Funcionando                                                   |
| Checkout, pagamento e webhooks                                | Funcionando com gateway simulado; adapter Mercado Pago pronto |
| Área do aluno, player, progresso e questionários              | Funcionando                                                   |
| Atividades com rubrica, anexo e correção automática           | Funcionando (regras locais ou provedor de IA)                 |
| Certificados em PDF e validação pública                       | Funcionando                                                   |
| Painel administrativo                                         | Funcionando                                                   |
| E-mails transacionais                                         | Funcionando (console/SMTP)                                    |
| Testes automatizados                                          | 75 unitários + 69 end-to-end                                  |

## Arquitetura

Monólito modular em monorepo `pnpm`, com fronteiras claras entre os domínios para permitir
extrair serviços no futuro sem reescrever regras.

```
apps/
  api/        API NestJS: autenticação, catálogo, aprendizagem, comércio, certificados, admin
  web/        Angular 20 com SSR: site público, área do aluno e painel administrativo
packages/
  contracts/  DTOs, enums e rotas compartilhados entre API e front-end
  ui/         Design system: tokens de estilo e componentes reutilizáveis
infra/        Docker Compose, Dockerfiles e scripts de banco
docs/         Arquitetura, decisões técnicas, operação e testes
```

Princípio central: **nenhuma regra de negócio relevante é decidida no front-end.** Permissão de
acesso, conclusão de aula, nota de questionário, preço e emissão de certificado são sempre
resolvidos pela API.

Detalhes em [`docs/architecture.md`](docs/architecture.md) e nos ADRs em
[`docs/decisions/`](docs/decisions/).

## Requisitos

- Node.js 22 ou superior
- pnpm 10
- Docker e Docker Compose (para PostgreSQL, MinIO e Mailpit)

Sem Docker, é possível usar um PostgreSQL local e trocar os drivers de e-mail e armazenamento
para os modos `console` e `local` (veja abaixo).

## Executando localmente

```bash
# 1. Dependências
pnpm install

# 2. Configuração
cp .env.example .env

# 3. Infraestrutura local (PostgreSQL, MinIO e Mailpit)
pnpm infra:up

# 4. Banco: migrations + dados iniciais
pnpm seed

# 5. Aplicações (API na 3333, front-end na 4200)
pnpm dev
```

Endereços:

| Serviço                         | URL                            |
| ------------------------------- | ------------------------------ |
| Site                            | http://localhost:4200          |
| API                             | http://localhost:3333/api      |
| Documentação da API (Swagger)   | http://localhost:3333/api/docs |
| Caixa de e-mail local (Mailpit) | http://localhost:8025          |
| Console do MinIO                | http://localhost:9001          |

### Sem Docker

Aponte o `.env` para um PostgreSQL existente e troque os drivers:

```bash
MAIL_DRIVER=console      # e-mails aparecem no log, claramente marcados como não enviados
STORAGE_DRIVER=local     # arquivos em apps/api/storage-local, com URLs assinadas
```

## Migrations e seed

Os comandos acima cuidam sozinhos de dois passos que costumam ser esquecidos
depois de um `git pull`: instalam as dependências quando o lockfile mudou e
compilam o pacote `@romalearn/contracts`, do qual a API e o front-end dependem.
Para rodar só isso: `pnpm preparar`.

```bash
pnpm migration:run       # aplica as migrations pendentes
pnpm migration:revert    # desfaz a última migration
pnpm seed                # aplica migrations pendentes e popula os dados iniciais
pnpm seed:demo           # cria as contas de teste manual (fora de produção)
pnpm seed:all            # os dois acima, em sequência
```

O seed é **idempotente**: pode ser executado quantas vezes for necessário. Ele cria o
administrador local, o módulo gratuito, os cinco módulos pagos, a trilha completa, a estrutura de
partes e capítulos extraída dos e-books oficiais, a oferta gratuita, uma oferta de teste em
ambiente sandbox e os questionários de conclusão.

Em produção, o deploy executa automaticamente `pnpm seed:content:prod` depois
das migrations e antes de atualizar os containers. Esse comando usa o
entrypoint compilado `dist/database/seeds/run-content-seed.js` e distribui
catálogo, cursos, aulas, avaliações, produtos e ofertas, mas preserva todas as
contas. A CI executa o mesmo seed duas vezes na imagem runtime para validar sua
presença e idempotência antes da publicação.

O Módulo 5 (IA para Processos Administrativos) fica cadastrado como **rascunho e sem capítulos**:
o e-book ainda não está disponível e o conteúdo não foi inventado.

## Credenciais locais

Válidas **apenas** no ambiente de desenvolvimento, criadas pelo seed a partir do `.env`:

| Perfil                | E-mail                  | Senha          |
| --------------------- | ----------------------- | -------------- |
| Administrador         | `admin@romalearn.local` | `Admin@123456` |
| Aluno de demonstração | `aluno@romalearn.local` | `Aluno@123456` |

O comando `pnpm seed:demo` acrescenta 11 contas para teste manual — aluno recém-cadastrado, em
progresso, concluinte com certificado, certificado revogado, comprador da trilha, pagamento
pendente e recusado, conta suspensa, gestor de conteúdo e suporte. Todas usam a senha
`Senha@123456` e são criadas pelos fluxos reais da aplicação, não por inserções diretas no banco.

Em produção, nenhuma conta de demonstração é criada e o seed avisa para cadastrar o administrador
manualmente com uma senha forte.

Roteiro passo a passo de todos os cenários, incluindo a instalação em uma máquina nova:
[`docs/roteiro-de-testes.md`](docs/roteiro-de-testes.md).

## Testes

```bash
pnpm test          # testes unitários de todos os pacotes
pnpm test:e2e      # integração e end-to-end (exige PostgreSQL)
pnpm lint          # lint de API e front-end
pnpm format:check  # formatação
pnpm build         # build de contratos, API e front-end
```

Os testes end-to-end usam um banco separado (`POSTGRES_TEST_DB`), recriado a cada execução.
Detalhes em [`docs/testing.md`](docs/testing.md).

## Configuração de pagamento, e-mail e armazenamento

Todas as integrações têm contrato próprio e adapter trocável por variável de ambiente. Nenhuma
credencial fica no código.

### Pagamento

| Variável                      | Descrição                                               |
| ----------------------------- | ------------------------------------------------------- |
| `PAYMENT_GATEWAY`             | `fake` (padrão) ou `mercadopago`                        |
| `PAYMENT_FAKE_WEBHOOK_SECRET` | Segredo usado para assinar webhooks do gateway simulado |
| `MERCADOPAGO_ACCESS_TOKEN`    | Token de acesso (use o de sandbox em homologação)       |
| `MERCADOPAGO_WEBHOOK_SECRET`  | Segredo para validar a assinatura dos webhooks          |

O gateway simulado reproduz o fluxo real: cria um pagamento pendente e só libera o acesso quando
chega um webhook assinado corretamente. Veja [`docs/payments.md`](docs/payments.md).

### E-mail

| Variável                               | Descrição                                       |
| -------------------------------------- | ----------------------------------------------- |
| `MAIL_DRIVER`                          | `console` ou `smtp`                             |
| `MAIL_SMTP_HOST` / `MAIL_SMTP_PORT`    | Servidor SMTP (Mailpit local: `localhost:1025`) |
| `MAIL_FROM_NAME` / `MAIL_FROM_ADDRESS` | Remetente                                       |

Com `console`, nenhum e-mail sai da máquina — o log deixa isso explícito.

### Armazenamento

| Variável                                    | Descrição                     |
| ------------------------------------------- | ----------------------------- |
| `STORAGE_DRIVER`                            | `s3` (MinIO/AWS) ou `local`   |
| `STORAGE_ENDPOINT` / `STORAGE_BUCKET`       | Endereço e bucket             |
| `STORAGE_ACCESS_KEY` / `STORAGE_SECRET_KEY` | Credenciais                   |
| `STORAGE_MAX_UPLOAD_BYTES`                  | Limite de tamanho por arquivo |

Arquivos privados são sempre servidos por URL assinada e temporária.

## Documentação adicional

- [`docs/auditoria-edu-qa-cursos-2026-08-03.md`](docs/auditoria-edu-qa-cursos-2026-08-03.md) — parecer de qualidade, jornada aprovada e bloqueios de lançamento
- [`docs/roteiro-de-testes.md`](docs/roteiro-de-testes.md) — **setup em máquina nova e roteiro de testes manuais**
- [`docs/architecture.md`](docs/architecture.md) — visão geral, módulos e entidades
- [`docs/decisions/`](docs/decisions/) — decisões técnicas registradas (ADRs)
- [`docs/operations.md`](docs/operations.md) — implantação, backup e observabilidade
- [`docs/payments.md`](docs/payments.md) — fluxo de pagamento e webhooks
- [`docs/testing.md`](docs/testing.md) — estratégia e execução dos testes
- [`docs/content.md`](docs/content.md) — como cadastrar cursos pelo painel
- [`docs/atividades-corrigidas.md`](docs/atividades-corrigidas.md) — rubricas e correção das atividades
- [`docs/security.md`](docs/security.md) — segurança e privacidade (LGPD)

## Licença e marcas

Microsoft, Windows, Word, Excel e PowerPoint são marcas da Microsoft Corporation. Este material é
independente e não possui vínculo com a Microsoft.
