# ADR 0002 — Separar conteúdo, produto, oferta e permissão

**Status:** aceito · **Data:** 2026-01

## Contexto

Hoje vendemos a trilha completa e distribuímos um módulo gratuito. Amanhã queremos vender cursos
avulsos, aplicar cupons, criar promoções, liberar acesso manualmente e revogar por reembolso.

O modelo ingênuo — "curso tem preço, compra cria matrícula" — quebra em todos esses casos.

## Decisão

Cinco conceitos separados:

| Conceito             | Papel                                                |
| -------------------- | ---------------------------------------------------- |
| `Course` / `Program` | Conteúdo acadêmico. Não tem preço                    |
| `Product`            | Algo comercializável. Aponta para um curso ou trilha |
| `Offer`              | Preço, moeda, período e condições                    |
| `Order` + `Payment`  | Intenção de compra e transação                       |
| `Entitlement`        | **O que efetivamente libera o conteúdo**             |
| `Enrollment`         | Vínculo de estudo e progresso                        |

`Entitlement` é o único caminho de acesso. Ele pode nascer de matrícula gratuita, compra aprovada
ou liberação manual — para o player, os três são iguais.

## Consequências

- o módulo gratuito cria permissão sem passar por pedido ou pagamento;
- vender cursos avulsos é criar produto e oferta, sem migração de dados;
- reembolso revoga a permissão preservando o histórico de progresso;
- uma trilha concede acesso a todos os seus cursos sem duplicar registros;
- o custo é um `JOIN` a mais e mais tabelas do que o mínimo — pago de bom grado.

## Alternativa descartada

Preço direto no curso e matrícula criada pela compra. Mais simples de começar, mas exigiria
migração dolorosa no primeiro cupom, na primeira cortesia e no primeiro reembolso.
