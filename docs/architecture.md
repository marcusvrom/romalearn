# Arquitetura

## Visão geral

RomaLearn é um **monólito modular** distribuído em um monorepo `pnpm`. A escolha é deliberada:
com um único produto e uma equipe pequena, microsserviços custariam mais do que entregariam. As
fronteiras entre domínios, porém, estão desenhadas para que qualquer módulo possa ser extraído
depois sem reescrever regras.

```
┌──────────────────────────────┐        ┌──────────────────────────────┐
│  apps/web (Angular 20 + SSR) │──HTTP──▶│  apps/api (NestJS)           │
│  site · aluno · admin        │◀───────│  regras de negócio           │
└──────────────────────────────┘        └───────────┬──────────────────┘
                ▲                                   │
                │ packages/contracts (DTOs e enums)  │
                └───────────────────────────────────┤
                                                    ▼
                        ┌───────────────┬───────────────┬──────────────┐
                        │  PostgreSQL   │  S3 / MinIO   │  SMTP        │
                        └───────────────┴───────────────┴──────────────┘
```

## Regra fundamental

**A API é a única autoridade.** O front-end nunca decide:

| Decisão                            | Onde é tomada                                                 |
| ---------------------------------- | ------------------------------------------------------------- |
| Se o aluno pode abrir uma aula     | `EntitlementService`                                          |
| Se uma aula pode ser concluída     | `completion-rules.ts`, avaliado no `ProgressService`          |
| Nota de um questionário            | `QuizService` (gabarito nunca sai do servidor antes do envio) |
| Preço e desconto de um pedido      | `PricingService`                                              |
| Se um pagamento foi aprovado       | `WebhookService`, só com assinatura válida                    |
| Se um certificado pode ser emitido | `CertificatesService`                                         |

Os guards do Angular apenas levam o usuário à tela certa. Se alguém contorná-los, a API continua
recusando — nenhum dado protegido depende de esconder botões.

## Módulos da API

| Módulo         | Responsabilidade                                                         |
| -------------- | ------------------------------------------------------------------------ |
| `auth`         | Cadastro, login, cookies de sessão, rotação de refresh, tokens de e-mail |
| `users`        | Perfil, papéis, anonimização (LGPD)                                      |
| `catalog`      | Cursos, partes, aulas, materiais e trilhas                               |
| `learning`     | Permissões de acesso, matrículas e progresso                             |
| `assessment`   | Questionários, tentativas e atividades práticas                          |
| `commerce`     | Produtos, ofertas, cupons, pedidos, pagamentos e webhooks                |
| `certificates` | Emissão, PDF, validação pública, revogação                               |
| `admin`        | Painel administrativo e auditoria                                        |
| `mail`         | E-mails transacionais (contrato + adapters)                              |
| `storage`      | Armazenamento de arquivos (contrato + adapters)                          |
| `platform`     | Configurações institucionais, auditoria e eventos de domínio             |
| `health`       | Liveness, readiness e métricas                                           |

### Comunicação entre módulos

Módulos se enxergam por serviços exportados. Quando isso criaria acoplamento indevido, usa-se o
barramento de eventos em processo (`DomainEventsService`):

```
learning: "curso concluído"  ──▶  certificates: emite o certificado
```

`learning` não conhece `certificates`. Trocar o barramento por uma fila é uma mudança local.

## Modelo de dados

### Separação entre conteúdo, produto e permissão

Esta é a decisão estrutural mais importante do sistema:

```
Course / Program   →  conteúdo acadêmico
Product            →  algo comercializável (aponta para um curso ou trilha)
Offer              →  preço, moeda, período e condições
Order              →  intenção de compra (com fotografia da oferta)
Payment            →  transação no provedor
Entitlement        →  o que efetivamente libera o conteúdo
Enrollment         →  vínculo de estudo e progresso
```

Consequências práticas:

- o módulo gratuito cria um `Entitlement` **sem** passar por pedido ou pagamento;
- a trilha é vendida hoje, cursos avulsos podem ser vendidos amanhã sem migração;
- reembolsar revoga o `Entitlement` sem apagar o histórico do `Enrollment`;
- um administrador libera acesso manualmente criando o mesmo `Entitlement` de uma compra.

### Entidades principais

| Grupo        | Entidades                                                                                 |
| ------------ | ----------------------------------------------------------------------------------------- |
| Identidade   | `User`, `RefreshToken`, `VerificationToken`                                               |
| Catálogo     | `Course`, `Section`, `Lesson`, `LessonMaterial`, `Program`, `ProgramCourse`, `Instructor` |
| Avaliação    | `Quiz`, `Question`, `QuestionOption`, `QuizAttempt`, `ActivitySubmission`                 |
| Aprendizagem | `Enrollment`, `Entitlement`, `LessonProgress`                                             |
| Comércio     | `Product`, `Offer`, `Coupon`, `Order`, `Payment`, `WebhookEvent`                          |
| Certificados | `Certificate`, `CertificateEvent`                                                         |
| Plataforma   | `AuditLog`, `PlatformSetting`                                                             |

São 29 tabelas, criadas por uma migration versionada. `synchronize` está desligado: o schema só
muda por migration.

## Conclusão de aula

Cada tipo de aula tem uma regra própria, avaliada no servidor:

| Tipo              | Regra padrão          | O que é exigido                                        |
| ----------------- | --------------------- | ------------------------------------------------------ |
| Texto/Markdown    | `MINIMUM_TIME`        | Tempo mínimo de permanência (metade do tempo estimado) |
| Vídeo             | `VIDEO_WATCH_RATIO`   | Proporção assistida (90% por padrão)                   |
| PDF               | `MINIMUM_TIME`        | Tempo mínimo de permanência                            |
| Download          | `MANUAL_CONFIRMATION` | Confirmação explícita do aluno                         |
| Atividade prática | `ACTIVITY_SUBMITTED`  | Envio da confirmação com relato                        |
| Questionário      | `QUIZ_PASSED`         | Tentativa aprovada                                     |

O player envia batidas periódicas de progresso, mas cada chamada aceita no máximo 120 segundos —
um cliente adulterado não consegue "pular" a exigência enviando valores enormes.

A conclusão do **curso** usa critérios configuráveis por curso (percentual de aulas, aprovação em
todos os questionários, envio de todas as atividades). Quando os critérios são atendidos, a
matrícula é marcada como concluída e o evento dispara a emissão do certificado.

## Certificados

- emissão **idempotente**, garantida por índice único no banco: mesmo com chamadas concorrentes
  o aluno nunca fica com dois certificados do mesmo curso;
- `snapshot` imutável: alterar o nome do aluno ou a carga horária do curso não muda certificados
  já emitidos;
- código público de validação sem caracteres ambíguos (sem `0`/`O`, `1`/`I`);
- PDF gerado com PDFKit e QR Code apontando para a página pública de validação;
- a validação pública devolve apenas nome, curso, carga horária, datas, emissor e situação —
  nunca e-mail, telefone, CPF ou identificadores internos.

## Front-end

Angular 20 com componentes standalone e sinais. Renderização definida por rota em
`app.routes.server.ts`:

| Rotas                                                 | Modo                                           |
| ----------------------------------------------------- | ---------------------------------------------- |
| Home, termos, privacidade, suporte                    | Pré-renderizadas no build                      |
| Catálogo, curso, trilha, validação de certificado     | SSR sob demanda (conteúdo muda sem novo build) |
| Login, checkout, área do aluno, painel administrativo | Apenas no navegador                            |

A área do aluno e o painel administrativo são marcados como `noindex` e bloqueados no
`robots.txt`.

O design system (`packages/ui`) concentra tokens de cor, tipografia, espaçamento, bordas e
sombras, além dos estados de interface (carregando, vazio, erro, sucesso, bloqueado). Trocar a
identidade visual é editar `packages/ui/styles/tokens.scss`; trocar nome, e-mail e URLs é editar
`platform.config.ts` (e as variáveis de ambiente correspondentes).

## Onde as coisas ficam

| Preciso mudar…                   | Vá em…                                              |
| -------------------------------- | --------------------------------------------------- |
| Cores, tipografia, espaçamento   | `packages/ui/styles/tokens.scss`                    |
| Nome da plataforma, e-mail, URLs | `.env` + `apps/web/src/app/core/platform.config.ts` |
| Formato de uma resposta da API   | `packages/contracts/src/dto.ts`                     |
| Regra de conclusão de aula       | `apps/api/src/learning/completion-rules.ts`         |
| Regra de acesso a conteúdo       | `apps/api/src/learning/entitlement.service.ts`      |
| Provedor de pagamento            | `apps/api/src/commerce/gateways/`                   |
| Conteúdo dos cursos              | Painel administrativo (`/admin/cursos`) ou o seed   |
