# Pagamentos e webhooks

## Princípio

O acesso ao conteúdo pago é liberado **somente** depois de uma confirmação vinda do provedor,
validada por assinatura. Nada que o front-end envie — preço, situação, identificador de pagamento
— influencia essa decisão.

## Fluxo completo

```
1. Aluno escolhe a oferta
2. Faz login ou cria conta
3. Backend cria o pedido (preço vem da oferta persistida)
4. Backend inicia o pagamento no provedor
5. Provedor processa a cobrança
6. Provedor envia o webhook
7. Backend valida a assinatura           ← recusa aqui encerra o fluxo
8. Backend registra o evento com idempotência
9. Pedido e pagamento são atualizados
10. Acesso é liberado (entitlement + matrícula)
11. Aluno recebe e-mail de confirmação
12. Evento aparece no painel administrativo
```

Entre os passos 3 e 10 o pedido fica `PENDING` ou `PROCESSING` e o aluno **não** tem acesso.

## Estados

**Pedido:** `PENDING` · `PROCESSING` · `APPROVED` · `REJECTED` · `CANCELLED` · `EXPIRED` ·
`REFUNDED`

**Pagamento:** os mesmos estados, refletindo a transação no provedor.

Um pedido aprovado nunca regride: eventos atrasados de recusa são ignorados.

## Idempotência

Três camadas garantem que reprocessar um webhook não duplique nada:

1. **Índice único** `(gateway, externalId)` na tabela `webhook_events`. Um evento já processado
   devolve `duplicate` e para por ali.
2. **Trava de linha** (`SELECT ... FOR UPDATE`) no pedido durante a aprovação, serializando
   webhooks concorrentes do mesmo pedido.
3. **Concessão idempotente** no `EntitlementService`: conceder um acesso que já existe reaproveita
   o registro em vez de criar outro.

O e-mail de confirmação também só é enviado na primeira aprovação.

## Conferência de valor

Se o webhook informar um valor diferente do que foi cobrado e o estado for `APPROVED`, o evento é
marcado como falho (`amount_mismatch`) e o acesso **não** é liberado.

## Abstração de provedor

```ts
interface PaymentGateway {
  readonly name: string;
  supportedMethods(): PaymentMethod[];
  createPayment(input: CreatePaymentInput): Promise<CreatePaymentResult>;
  parseWebhook(request: WebhookRequest): Promise<NormalizedWebhookEvent>;
  fetchPaymentStatus(gatewayPaymentId: string): Promise<PaymentStatus>;
  refund(gatewayPaymentId: string, amountCents: number): Promise<void>;
}
```

Nenhum outro módulo conhece Mercado Pago ou qualquer outro provedor.

### Gateway simulado (`fake`)

Padrão em desenvolvimento e nos testes. Reproduz o fluxo real: cria o pagamento como `PENDING` e
só muda de estado com um webhook assinado. O "código Pix" gerado contém a palavra `SIMULACAO` e
não é válido em bancos.

Assinatura: HMAC-SHA256 do corpo bruto, no cabeçalho `x-romalearn-signature`, com
`PAYMENT_FAKE_WEBHOOK_SECRET`.

Aprovando um pagamento manualmente em desenvolvimento:

```bash
SECRET="dev-only-webhook-secret-change-me"
BODY='{"id":"evt-1","type":"payment.approved","paymentId":"fake_XXX","status":"APPROVED","amountCents":19700}'
SIG=$(printf '%s' "$BODY" | openssl dgst -sha256 -hmac "$SECRET" | awk '{print $2}')

curl -X POST http://localhost:3333/api/commerce/webhooks/fake \
  -H "Content-Type: application/json" \
  -H "x-romalearn-signature: $SIG" \
  -d "$BODY"
```

Substitua `fake_XXX` pelo `gatewayPaymentId` devolvido no checkout e `amountCents` pelo total do
pedido.

### Mercado Pago

Adapter implementado, aguardando credenciais. Suporta Pix e cartão.

```bash
PAYMENT_GATEWAY=mercadopago
MERCADOPAGO_ACCESS_TOKEN=       # use o token de sandbox em homologação
MERCADOPAGO_PUBLIC_KEY=
MERCADOPAGO_WEBHOOK_SECRET=
```

Detalhes da implementação:

- envia `X-Idempotency-Key` com o id do pedido — reenviar não gera segunda cobrança;
- valida a assinatura `x-signature` conforme a documentação oficial (manifesto com id do recurso,
  id da requisição e timestamp);
- o webhook do provedor apenas avisa que algo mudou; o estado real é lido da API antes de
  qualquer decisão;
- sem `MERCADOPAGO_ACCESS_TOKEN`, o adapter recusa criar pagamentos com uma mensagem clara em vez
  de falhar de forma obscura.

Dados de cartão nunca chegam ao servidor: a captura é responsabilidade do provedor.

## Ofertas de produção e de teste

Toda oferta declara um `environment`:

- `PRODUCTION` — preço comercial aprovado;
- `SANDBOX` — preço fictício para exercitar o fluxo.

Ofertas `SANDBOX` são **recusadas automaticamente** quando `NODE_ENV=production`. O seed cria
apenas uma oferta sandbox para a trilha, explicitamente nomeada como teste, porque não há preço
comercial aprovado. Produtos de cursos avulsos ficam em rascunho e sem oferta.

## Reembolso

Disponível no painel para pedidos aprovados. Exige motivo, que é registrado na auditoria. O fluxo
estorna no provedor, marca o pedido como `REFUNDED` e revoga os entitlements originados por ele —
o histórico de progresso é preservado.

## Reprocessamento

Eventos com falha aparecem no painel (`/admin/pedidos`) e podem ser reprocessados. O
reprocessamento consulta o estado atual no provedor, em vez de confiar no payload antigo, e passa
pelas mesmas garantias de idempotência.
