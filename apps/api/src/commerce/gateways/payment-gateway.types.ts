import { PaymentMethod, PaymentStatus } from '@romalearn/contracts';

export interface CreatePaymentInput {
  orderId: string;
  orderReference: string;
  amountCents: number;
  currency: string;
  method: PaymentMethod;
  description: string;
  payer: { name: string; email: string };
  /** Para onde o provedor devolve o comprador após o pagamento. */
  returnUrl: string;
  notificationUrl: string;
  expiresAt: Date;
}

export interface CreatePaymentResult {
  gatewayPaymentId: string;
  status: PaymentStatus;
  checkoutUrl: string | null;
  pixQrCode: string | null;
  pixQrCodeBase64: string | null;
  expiresAt: Date | null;
  raw: Record<string, unknown>;
}

/** Evento normalizado a partir do webhook de qualquer provedor. */
export interface NormalizedWebhookEvent {
  /** Identificador do evento no provedor — base da idempotência. */
  externalId: string;
  eventType: string;
  gatewayPaymentId: string;
  status: PaymentStatus;
  amountCents: number | null;
  failureReason: string | null;
  raw: Record<string, unknown>;
}

export interface WebhookRequest {
  headers: Record<string, string | string[] | undefined>;
  /** Corpo bruto, necessário para conferir a assinatura. */
  rawBody: string;
  body: Record<string, unknown>;
  query: Record<string, unknown>;
}

/**
 * Contrato de todo provedor de pagamento.
 *
 * O restante do sistema não conhece Mercado Pago nem qualquer outro
 * provedor: fala apenas com esta interface.
 */
export interface PaymentGateway {
  readonly name: string;
  /** Métodos que este provedor aceita neste ambiente. */
  supportedMethods(): PaymentMethod[];
  createPayment(input: CreatePaymentInput): Promise<CreatePaymentResult>;
  /**
   * Valida a assinatura e traduz o webhook.
   * Deve lançar quando a assinatura não confere.
   */
  parseWebhook(request: WebhookRequest): Promise<NormalizedWebhookEvent>;
  /** Consulta o estado atual — usada para reconciliação e reprocessamento. */
  fetchPaymentStatus(gatewayPaymentId: string): Promise<PaymentStatus>;
  refund(gatewayPaymentId: string, amountCents: number): Promise<void>;
}

export const PAYMENT_GATEWAY = Symbol('PAYMENT_GATEWAY');
