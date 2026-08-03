# ADR 0001 — Monólito modular em monorepo

**Status:** aceito · **Data:** 2026-01

## Contexto

Precisamos colocar seis cursos no ar com uma equipe pequena. A plataforma tem domínios bem
distintos (conteúdo, aprendizagem, comércio, certificação), o que sugere separação — mas o volume
de tráfego e o tamanho do time não justificam a complexidade operacional de microsserviços.

## Decisão

Um **monólito modular** em monorepo `pnpm`, com módulos NestJS de fronteiras explícitas.

Regras que mantêm as fronteiras utilizáveis no futuro:

- cada módulo expõe serviços; nada acessa repositórios de outro módulo diretamente;
- quando a dependência criaria acoplamento indevido, usa-se o barramento de eventos em processo
  (`DomainEventsService`);
- DTOs e enums ficam em `packages/contracts`, compartilhados entre API e front-end.

## Consequências

**A favor:** uma implantação, uma transação de banco, refatoração barata, ambiente local simples.

**Contra:** escala apenas verticalmente no começo; a disciplina de fronteiras depende de revisão
de código, não do compilador.

**Caminho de saída:** `commerce` é o primeiro candidato a virar serviço. Ele já se comunica com
`learning` por evento e por serviço explícito — a extração troca a chamada em processo por HTTP
ou fila, sem reescrever regra.
