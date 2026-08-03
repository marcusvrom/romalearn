import { Logger } from '@nestjs/common';
import { PaymentMethod, PaymentStatus } from '@romalearn/contracts';
import { createHmac, timingSafeEqual } from 'node:crypto';
import { DomainErrors } from '../../common/errors/domain-error';
import {
  CreatePaymentInput,
  CreatePaymentResult,
  NormalizedWebhookEvent,
  PaymentGateway,
  WebhookRequest,
} from './payment-gateway.types';

export interface MercadoPagoOptions {
  accessToken: string;
  webhookSecret: string;
  /** Sobrescrito nos testes; em produção usa a API oficial. */
  baseUrl?: string;
}

const API_BASE = 'https://api.mercadopago.com';

/** Mapeia os estados do Mercado Pago para o vocabulário da plataforma. */
const STATUS_MAP: Record<string, PaymentStatus> = {
  pending: PaymentStatus.PENDING,
  in_process: PaymentStatus.PROCESSING,
  authorized: PaymentStatus.PROCESSING,
  approved: PaymentStatus.APPROVED,
  rejected: PaymentStatus.REJECTED,
  cancelled: PaymentStatus.CANCELLED,
  refunded: PaymentStatus.REFUNDED,
  charged_back: PaymentStatus.REFUNDED,
};

/**
 * Adapter do Mercado Pago (Pix e cartão).
 *
 * Sem `MERCADOPAGO_ACCESS_TOKEN` configurado, o adapter recusa a criação de
 * pagamentos com uma mensagem clara em vez de falhar de forma obscura. As
 * credenciais vêm sempre do ambiente — nunca do código.
 */
export class MercadoPagoGateway implements PaymentGateway {
  readonly name = 'mercadopago';
  private readonly logger = new Logger('MercadoPagoGateway');
  private readonly baseUrl: string;

  constructor(private readonly options: MercadoPagoOptions) {
    this.baseUrl = options.baseUrl ?? API_BASE;
  }

  get isConfigured(): boolean {
    return Boolean(this.options.accessToken);
  }

  supportedMethods(): PaymentMethod[] {
    return [PaymentMethod.PIX, PaymentMethod.CREDIT_CARD];
  }

  async createPayment(input: CreatePaymentInput): Promise<CreatePaymentResult> {
    if (!this.isConfigured) {
      throw DomainErrors.offerUnavailable();
    }

    const [firstName, ...rest] = input.payer.name.split(' ');

    const response = await fetch(`${this.baseUrl}/v1/payments`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.options.accessToken}`,
        'Content-Type': 'application/json',
        // Chave de idempotência: reenviar não cria uma segunda cobrança.
        'X-Idempotency-Key': input.orderId,
      },
      body: JSON.stringify({
        transaction_amount: input.amountCents / 100,
        description: input.description,
        payment_method_id: input.method === PaymentMethod.PIX ? 'pix' : undefined,
        external_reference: input.orderReference,
        notification_url: input.notificationUrl,
        date_of_expiration: input.expiresAt.toISOString(),
        payer: {
          email: input.payer.email,
          first_name: firstName,
          last_name: rest.join(' ') || firstName,
        },
      }),
    });

    if (!response.ok) {
      const detail = await response.text();
      this.logger.error({
        message: 'falha ao criar pagamento no provedor',
        status: response.status,
        // O corpo de erro do provedor não contém dados do portador.
        detail: detail.slice(0, 500),
      });
      throw DomainErrors.offerUnavailable();
    }

    const payload = (await response.json()) as {
      id: number;
      status: string;
      point_of_interaction?: {
        transaction_data?: { qr_code?: string; qr_code_base64?: string; ticket_url?: string };
      };
      date_of_expiration?: string;
    };

    const transaction = payload.point_of_interaction?.transaction_data;

    return {
      gatewayPaymentId: String(payload.id),
      status: STATUS_MAP[payload.status] ?? PaymentStatus.PENDING,
      checkoutUrl: transaction?.ticket_url ?? null,
      pixQrCode: transaction?.qr_code ?? null,
      pixQrCodeBase64: transaction?.qr_code_base64 ?? null,
      expiresAt: payload.date_of_expiration
        ? new Date(payload.date_of_expiration)
        : input.expiresAt,
      raw: payload as unknown as Record<string, unknown>,
    };
  }

  /**
   * Valida a assinatura `x-signature` conforme a documentação do provedor:
   * o manifesto combina id do recurso, id da requisição e timestamp.
   */
  async parseWebhook(request: WebhookRequest): Promise<NormalizedWebhookEvent> {
    const signature = this.header(request, 'x-signature');
    const requestId = this.header(request, 'x-request-id');
    const dataId = String(
      (request.query['data.id'] as string | undefined) ??
        (request.body as { data?: { id?: string } }).data?.id ??
        '',
    );

    if (!signature || !dataId) throw DomainErrors.invalidWebhookSignature();

    const parts = Object.fromEntries(
      signature.split(',').map((part) => {
        const [key, value] = part.split('=');
        return [key?.trim(), value?.trim()];
      }),
    ) as { ts?: string; v1?: string };

    if (!parts.ts || !parts.v1 || !this.options.webhookSecret) {
      throw DomainErrors.invalidWebhookSignature();
    }

    const manifest = `id:${dataId};request-id:${requestId ?? ''};ts:${parts.ts};`;
    const expected = createHmac('sha256', this.options.webhookSecret)
      .update(manifest)
      .digest('hex');

    if (
      expected.length !== parts.v1.length ||
      !timingSafeEqual(Buffer.from(expected), Buffer.from(parts.v1))
    ) {
      throw DomainErrors.invalidWebhookSignature();
    }

    // O webhook só avisa que algo mudou: o estado real vem da API.
    const payment = await this.fetchPayment(dataId);

    return {
      // Combina recurso e timestamp para identificar o evento unicamente.
      externalId: `${dataId}:${parts.ts}`,
      eventType: String((request.body as { action?: string }).action ?? 'payment.updated'),
      gatewayPaymentId: dataId,
      status: STATUS_MAP[payment.status] ?? PaymentStatus.PENDING,
      amountCents:
        typeof payment.transaction_amount === 'number'
          ? Math.round(payment.transaction_amount * 100)
          : null,
      failureReason: payment.status_detail ?? null,
      raw: payment as unknown as Record<string, unknown>,
    };
  }

  async fetchPaymentStatus(gatewayPaymentId: string): Promise<PaymentStatus> {
    const payment = await this.fetchPayment(gatewayPaymentId);
    return STATUS_MAP[payment.status] ?? PaymentStatus.PENDING;
  }

  async refund(gatewayPaymentId: string, amountCents: number): Promise<void> {
    const response = await fetch(`${this.baseUrl}/v1/payments/${gatewayPaymentId}/refunds`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.options.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount: amountCents / 100 }),
    });

    if (!response.ok) {
      throw new Error(`Falha ao estornar pagamento ${gatewayPaymentId}: ${response.status}`);
    }
  }

  private async fetchPayment(id: string) {
    const response = await fetch(`${this.baseUrl}/v1/payments/${id}`, {
      headers: { Authorization: `Bearer ${this.options.accessToken}` },
    });

    if (!response.ok) {
      throw new Error(`Falha ao consultar pagamento ${id}: ${response.status}`);
    }

    return (await response.json()) as {
      status: string;
      status_detail?: string;
      transaction_amount?: number;
    };
  }

  private header(request: WebhookRequest, name: string): string | undefined {
    const value = request.headers[name];
    return Array.isArray(value) ? value[0] : value;
  }
}
