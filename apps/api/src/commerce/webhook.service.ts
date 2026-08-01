import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderStatus, PaymentStatus, WebhookEventStatus } from '@romalearn/contracts';
import { Repository } from 'typeorm';
import { DomainErrors } from '../common/errors/domain-error';
import { CheckoutService } from './checkout.service';
import { Payment } from './entities/payment.entity';
import { WebhookEvent } from './entities/webhook-event.entity';
import {
  NormalizedWebhookEvent,
  PAYMENT_GATEWAY,
  PaymentGateway,
  WebhookRequest,
} from './gateways/payment-gateway.types';

@Injectable()
export class WebhookService {
  private readonly logger = new Logger(WebhookService.name);

  constructor(
    @InjectRepository(WebhookEvent) private readonly events: Repository<WebhookEvent>,
    @InjectRepository(Payment) private readonly payments: Repository<Payment>,
    private readonly checkoutService: CheckoutService,
    @Inject(PAYMENT_GATEWAY) private readonly gateway: PaymentGateway,
  ) {}

  /**
   * Recebe um webhook do provedor.
   *
   * Ordem obrigatória: validar assinatura → registrar com idempotência →
   * processar. Reprocessar o mesmo evento nunca duplica efeitos.
   */
  async handle(gatewayName: string, request: WebhookRequest): Promise<{ status: string }> {
    if (gatewayName !== this.gateway.name) {
      throw DomainErrors.notFound('Provedor de pagamento desconhecido.');
    }

    // Assinatura inválida: nada é gravado.
    const normalized = await this.gateway.parseWebhook(request);

    const existing = await this.events.findOne({
      where: { gateway: gatewayName, externalId: normalized.externalId },
    });

    if (existing && existing.status === WebhookEventStatus.PROCESSED) {
      this.logger.log({
        message: 'webhook repetido ignorado',
        gateway: gatewayName,
        externalId: normalized.externalId,
      });
      return { status: 'duplicate' };
    }

    const event =
      existing ??
      (await this.events.save(
        this.events.create({
          gateway: gatewayName,
          eventType: normalized.eventType,
          externalId: normalized.externalId,
          payload: normalized.raw,
          status: WebhookEventStatus.RECEIVED,
          receivedAt: new Date(),
        }),
      ));

    return this.process(event, normalized);
  }

  /** Reprocessamento seguro de um evento que falhou (painel administrativo). */
  async replay(eventId: string): Promise<{ status: string }> {
    const event = await this.events.findOne({ where: { id: eventId } });
    if (!event) throw DomainErrors.notFound('Evento não encontrado.');

    if (event.status === WebhookEventStatus.PROCESSED) {
      return { status: 'duplicate' };
    }

    const payload = event.payload as {
      paymentId?: string;
      id?: string;
      status?: string;
    };

    const gatewayPaymentId = payload.paymentId ?? payload.id;
    if (!gatewayPaymentId) {
      throw DomainErrors.notFound('Evento sem identificador de pagamento.');
    }

    // Consulta o provedor: o estado atual vale mais que o payload antigo.
    const status = await this.gateway.fetchPaymentStatus(String(gatewayPaymentId));

    return this.process(event, {
      externalId: event.externalId,
      eventType: event.eventType,
      gatewayPaymentId: String(gatewayPaymentId),
      status,
      amountCents: null,
      failureReason: null,
      raw: event.payload,
    });
  }

  private async process(
    event: WebhookEvent,
    normalized: NormalizedWebhookEvent,
  ): Promise<{ status: string }> {
    event.attempts += 1;

    try {
      const payment = await this.payments.findOne({
        where: { gateway: event.gateway, gatewayPaymentId: normalized.gatewayPaymentId },
        relations: { order: true },
      });

      if (!payment) {
        // Pagamento desconhecido: registra para investigação e não falha o provedor.
        event.status = WebhookEventStatus.FAILED;
        event.lastError = 'Pagamento não encontrado para o identificador informado.';
        await this.events.save(event);
        return { status: 'unknown_payment' };
      }

      // O valor informado precisa bater com o que foi cobrado.
      if (
        normalized.amountCents !== null &&
        normalized.amountCents !== payment.amountCents &&
        normalized.status === PaymentStatus.APPROVED
      ) {
        event.status = WebhookEventStatus.FAILED;
        event.lastError = 'Valor do webhook diverge do valor do pagamento.';
        await this.events.save(event);
        return { status: 'amount_mismatch' };
      }

      payment.status = normalized.status;
      payment.gatewayPayload = normalized.raw;
      await this.payments.save(payment);

      switch (normalized.status) {
        case PaymentStatus.APPROVED:
          await this.checkoutService.approveOrder(payment.orderId, payment.id);
          break;
        case PaymentStatus.REJECTED:
          await this.checkoutService.failOrder(
            payment.orderId,
            OrderStatus.REJECTED,
            payment.id,
            normalized.failureReason,
          );
          break;
        case PaymentStatus.EXPIRED:
          await this.checkoutService.failOrder(
            payment.orderId,
            OrderStatus.EXPIRED,
            payment.id,
            normalized.failureReason,
          );
          break;
        case PaymentStatus.CANCELLED:
          await this.checkoutService.failOrder(
            payment.orderId,
            OrderStatus.CANCELLED,
            payment.id,
            normalized.failureReason,
          );
          break;
        default:
          // PENDING/PROCESSING/REFUNDED só atualizam o pagamento.
          break;
      }

      event.status = WebhookEventStatus.PROCESSED;
      event.processedAt = new Date();
      event.lastError = null;
      await this.events.save(event);

      return { status: 'processed' };
    } catch (error) {
      event.status = WebhookEventStatus.FAILED;
      event.lastError = error instanceof Error ? error.message : String(error);
      await this.events.save(event);

      this.logger.error({
        message: 'falha ao processar webhook',
        gateway: event.gateway,
        externalId: event.externalId,
        detail: event.lastError,
      });

      // Devolve 200 com estado de falha: o provedor não deve entrar em
      // laço de reenvio; o reprocessamento é feito pelo painel.
      return { status: 'failed' };
    }
  }

  list(): Promise<WebhookEvent[]> {
    return this.events.find({ order: { receivedAt: 'DESC' }, take: 200 });
  }
}
