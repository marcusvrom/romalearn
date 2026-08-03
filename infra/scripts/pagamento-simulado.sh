#!/usr/bin/env bash
#
# Envia um webhook assinado ao gateway de pagamento simulado.
#
# Serve para testar manualmente a liberação de acesso sem precisar de um
# provedor real. A assinatura é a mesma que o provedor enviaria, então o
# fluxo exercitado é exatamente o de produção.
#
# Uso:
#   ./infra/scripts/pagamento-simulado.sh aprovar  <paymentId> <valorEmCentavos>
#   ./infra/scripts/pagamento-simulado.sh recusar  <paymentId>
#   ./infra/scripts/pagamento-simulado.sh expirar  <paymentId>
#   ./infra/scripts/pagamento-simulado.sh cancelar <paymentId>
#
# O <paymentId> aparece na tela de checkout, na resposta da API e na coluna
# "gatewayPaymentId" da tabela payments.

set -euo pipefail

ACAO="${1:-}"
PAYMENT_ID="${2:-}"
VALOR="${3:-}"

RAIZ="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
ARQUIVO_ENV="$RAIZ/.env"

# Lê uma chave do .env sem executar o arquivo: valores com espaço ou acento
# quebrariam um `source`, e um .env não deve ser código executável.
ler_env() {
  local chave="$1" padrao="$2" valor
  [[ -f "$ARQUIVO_ENV" ]] || { echo "$padrao"; return; }

  valor="$(grep -E "^[[:space:]]*${chave}=" "$ARQUIVO_ENV" | tail -n 1 | cut -d '=' -f 2-)"
  valor="${valor%\"}"; valor="${valor#\"}"
  valor="${valor%\'}"; valor="${valor#\'}"

  [[ -n "$valor" ]] && echo "$valor" || echo "$padrao"
}

API_URL="${API_PUBLIC_URL:-$(ler_env API_PUBLIC_URL http://localhost:3333)}"
PREFIXO="${API_GLOBAL_PREFIX:-$(ler_env API_GLOBAL_PREFIX api)}"
SEGREDO="${PAYMENT_FAKE_WEBHOOK_SECRET:-$(ler_env PAYMENT_FAKE_WEBHOOK_SECRET dev-only-webhook-secret-change-me)}"

uso() {
  sed -n '3,17p' "${BASH_SOURCE[0]}" | sed 's/^# \{0,1\}//'
  exit 1
}

[[ -z "$ACAO" || -z "$PAYMENT_ID" ]] && uso

case "$ACAO" in
  aprovar)
    if [[ -z "$VALOR" ]]; then
      echo "Erro: informe o valor em centavos para aprovar (o backend confere)." >&2
      echo "Exemplo: $0 aprovar $PAYMENT_ID 19700" >&2
      exit 1
    fi
    STATUS="APPROVED"
    TIPO="payment.approved"
    ;;
  recusar)
    STATUS="REJECTED"
    TIPO="payment.rejected"
    ;;
  expirar)
    STATUS="EXPIRED"
    TIPO="payment.expired"
    ;;
  cancelar)
    STATUS="CANCELLED"
    TIPO="payment.cancelled"
    ;;
  *)
    echo "Ação desconhecida: $ACAO" >&2
    uso
    ;;
esac

# Identificador único por evento: reenviar o mesmo id testa a idempotência.
EVENTO_ID="manual-$(date +%s)-$RANDOM"

if [[ "$STATUS" == "APPROVED" ]]; then
  CORPO="{\"id\":\"$EVENTO_ID\",\"type\":\"$TIPO\",\"paymentId\":\"$PAYMENT_ID\",\"status\":\"$STATUS\",\"amountCents\":$VALOR}"
else
  CORPO="{\"id\":\"$EVENTO_ID\",\"type\":\"$TIPO\",\"paymentId\":\"$PAYMENT_ID\",\"status\":\"$STATUS\",\"failureReason\":\"Simulacao manual de teste\"}"
fi

ASSINATURA="$(printf '%s' "$CORPO" | openssl dgst -sha256 -hmac "$SEGREDO" | awk '{print $NF}')"

echo "Enviando webhook '$ACAO' para o pagamento $PAYMENT_ID…"

RESPOSTA="$(curl -sS -X POST "$API_URL/$PREFIXO/commerce/webhooks/fake" \
  -H 'Content-Type: application/json' \
  -H "x-romalearn-signature: $ASSINATURA" \
  -d "$CORPO")"

echo "Resposta da API: $RESPOSTA"
echo
echo "Significado:"
echo "  processed        evento aceito e aplicado"
echo "  duplicate        evento já processado antes (idempotência funcionando)"
echo "  amount_mismatch  valor informado diverge do pedido — acesso NÃO liberado"
echo "  unknown_payment  pagamento não encontrado; confira o paymentId"
