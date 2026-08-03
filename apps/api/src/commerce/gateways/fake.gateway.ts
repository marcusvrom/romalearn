import { Logger } from '@nestjs/common';
import { PaymentMethod, PaymentStatus } from '@romalearn/contracts';
import { createHmac, randomUUID, timingSafeEqual } from 'node:crypto';
import { DomainErrors } from '../../common/errors/domain-error';
import {
  CreatePaymentInput,
  CreatePaymentResult,
  NormalizedWebhookEvent,
  PaymentGateway,
  WebhookRequest,
} from './payment-gateway.types';

export const FAKE_SIGNATURE_HEADER = 'x-romalearn-signature';

/**
 * Provedor falso para desenvolvimento e testes automatizados.
 *
 * Reproduz fielmente o fluxo real: cria um pagamento pendente e só libera o
 * acesso quando chega um webhook assinado. Nenhum atalho de "aprovar direto".
 */
export class FakePaymentGateway implements PaymentGateway {
  readonly name = 'fake';
  private readonly logger = new Logger('FakeGateway');

  /** Estado dos pagamentos criados, para consulta e reconciliação. */
  private readonly payments = new Map<string, PaymentStatus>();

  constructor(private readonly webhookSecret: string) {}

  supportedMethods(): PaymentMethod[] {
    return [PaymentMethod.PIX, PaymentMethod.CREDIT_CARD, PaymentMethod.BOLETO];
  }

  async createPayment(input: CreatePaymentInput): Promise<CreatePaymentResult> {
    const gatewayPaymentId = `fake_${randomUUID()}`;
    this.payments.set(gatewayPaymentId, PaymentStatus.PENDING);

    this.logger.log({
      message: 'pagamento simulado criado',
      gatewayPaymentId,
      orderReference: input.orderReference,
      method: input.method,
    });

    const isPix = input.method === PaymentMethod.PIX;

    return {
      gatewayPaymentId,
      status: PaymentStatus.PENDING,
      checkoutUrl: isPix ? null : `${input.returnUrl}?pagamento=${gatewayPaymentId}`,
      // Texto claramente identificado como simulação — não é um Pix válido.
      pixQrCode: isPix ? `00020126SIMULACAO-${gatewayPaymentId}5204000053039865802BR` : null,
      pixQrCodeBase64: null,
      expiresAt: input.expiresAt,
      raw: { simulated: true, method: input.method, amountCents: input.amountCents },
    };
  }

  /** Assinatura HMAC do corpo bruto, no mesmo formato dos provedores reais. */
  sign(rawBody: string): string {
    return createHmac('sha256', this.webhookSecret).update(rawBody).digest('hex');
  }

  async parseWebhook(request: WebhookRequest): Promise<NormalizedWebhookEvent> {
    const header = request.headers[FAKE_SIGNATURE_HEADER];
    const received = Array.isArray(header) ? header[0] : header;

    if (!received || !this.verify(request.rawBody, received)) {
      throw DomainErrors.invalidWebhookSignature();
    }

    const body = request.body as {
      id?: string;
      type?: string;
      paymentId?: string;
      status?: string;
      amountCents?: number;
      failureReason?: string;
    };

    if (!body.id || !body.paymentId || !body.status) {
      throw DomainErrors.invalidWebhookSignature();
    }

    const status = this.toStatus(body.status);
    this.payments.set(body.paymentId, status);

    return {
      externalId: body.id,
      eventType: body.type ?? 'payment.updated',
      gatewayPaymentId: body.paymentId,
      status,
      amountCents: body.amountCents ?? null,
      failureReason: body.failureReason ?? null,
      raw: request.body,
    };
  }

  async fetchPaymentStatus(gatewayPaymentId: string): Promise<PaymentStatus> {
    return this.payments.get(gatewayPaymentId) ?? PaymentStatus.PENDING;
  }

  async refund(gatewayPaymentId: string): Promise<void> {
    this.payments.set(gatewayPaymentId, PaymentStatus.REFUNDED);
  }

  private verify(rawBody: string, received: string): boolean {
    const expected = this.sign(rawBody);
    if (expected.length !== received.length) return false;
    // Comparação em tempo constante evita vazar a assinatura por timing.
    return timingSafeEqual(Buffer.from(expected), Buffer.from(received));
  }

  private toStatus(value: string): PaymentStatus {
    const normalized = value.toUpperCase();
    const known = Object.values(PaymentStatus) as string[];
    return known.includes(normalized) ? (normalized as PaymentStatus) : PaymentStatus.PENDING;
  }
}
