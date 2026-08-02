# ADR 0004 — Idempotência no fluxo de pagamento

**Status:** aceito · **Data:** 2026-01

## Contexto

Provedores de pagamento reenviam webhooks. É normal receber o mesmo evento duas, três ou dez
vezes, fora de ordem e em paralelo. Sem proteção, isso vira acesso duplicado, e-mail repetido e
contabilidade errada.

## Decisão

Três camadas independentes de proteção:

1. **Índice único** `(gateway, externalId)` em `webhook_events`. Um evento já processado devolve
   `duplicate` e para ali.
2. **Trava de linha** (`SELECT … FOR UPDATE`) no pedido durante a aprovação, serializando
   webhooks concorrentes do mesmo pedido.
3. **Concessão idempotente** no `EntitlementService`: conceder um acesso existente reaproveita o
   registro em vez de criar outro.

Complementos:

- e-mail de confirmação enviado apenas na primeira aprovação;
- pedido aprovado nunca regride por evento atrasado de recusa;
- valor divergente do cobrado marca o evento como falho e **não** libera acesso;
- assinatura verificada em tempo constante antes de qualquer gravação;
- webhook de assinatura inválida não deixa rastro no banco.

## Consequências

- reprocessar um webhook é seguro, inclusive manualmente pelo painel;
- o reprocessamento consulta o estado atual no provedor em vez de confiar no payload antigo;
- há uma trava de escrita por pedido durante a aprovação — irrelevante no volume atual;
- três testes end-to-end cobrem explicitamente o reenvio do mesmo evento.
