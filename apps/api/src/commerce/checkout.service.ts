import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import {
  AuditAction,
  CheckoutResultDto,
  EntitlementScope,
  EntitlementSource,
  OfferKind,
  OrderDto,
  OrderStatus,
  PaymentDto,
  PaymentMethod,
  PaymentStatus,
  ProductType,
  WEB_ROUTES,
} from '@romalearn/contracts';
import { randomBytes } from 'node:crypto';
import { DataSource, Repository } from 'typeorm';
import { AppConfig } from '../config/configuration';
import { DomainErrors } from '../common/errors/domain-error';
import { EnrollmentService } from '../learning/enrollment.service';
import { EntitlementService } from '../learning/entitlement.service';
import { MailService } from '../mail/mail.service';
import { AuditService } from '../platform/audit.service';
import { User } from '../users/entities/user.entity';
import { CheckoutDto } from './dto/commerce.dto';
import { Coupon } from './entities/coupon.entity';
import { Offer } from './entities/offer.entity';
import { Order, OrderSnapshot } from './entities/order.entity';
import { Payment } from './entities/payment.entity';
import { PAYMENT_GATEWAY, PaymentGateway } from './gateways/payment-gateway.types';
import { PricingService } from './pricing.service';

/** Código de pedido legível: RL-AB12CD34. */
function generateReference(): string {
  return `RL-${randomBytes(4).toString('hex').toUpperCase()}`;
}

@Injectable()
export class CheckoutService {
  private readonly logger = new Logger(CheckoutService.name);

  constructor(
    @InjectRepository(Order) private readonly orders: Repository<Order>,
    @InjectRepository(Payment) private readonly payments: Repository<Payment>,
    @InjectRepository(User) private readonly users: Repository<User>,
    private readonly pricingService: PricingService,
    private readonly entitlementService: EntitlementService,
    private readonly enrollmentService: EnrollmentService,
    private readonly mailService: MailService,
    private readonly auditService: AuditService,
    private readonly dataSource: DataSource,
    private readonly configService: ConfigService<AppConfig, true>,
    @Inject(PAYMENT_GATEWAY) private readonly gateway: PaymentGateway,
  ) {}

  /**
   * Cria o pedido e inicia a cobrança.
   *
   * Ofertas gratuitas liberam o acesso na hora. Ofertas pagas ficam
   * PENDENTES até o webhook confirmar — nunca antes.
   */
  async checkout(userId: string, dto: CheckoutDto): Promise<CheckoutResultDto> {
    const user = await this.users.findOneOrFail({ where: { id: userId } });
    const offer = await this.pricingService.findOfferOrFail(dto.offerId);
    const isProduction = this.configService.get('isProduction', { infer: true });

    this.pricingService.assertOfferSellable(offer, isProduction);

    const product = offer.product;
    if (!product) throw DomainErrors.offerUnavailable();

    // Já tem acesso? Não deixa comprar de novo.
    if (await this.alreadyOwns(userId, product.courseId, product.programId)) {
      throw DomainErrors.alreadyOwned();
    }

    const price = await this.pricingService.priceFor(offer, dto.couponCode);

    const snapshot: OrderSnapshot = {
      offerName: offer.name,
      productName: product.name,
      productType: product.type,
      courseId: product.courseId,
      programId: product.programId,
      priceCents: price.subtotalCents,
      currency: price.currency,
      accessDurationDays: offer.accessDurationDays,
    };

    const paymentConfig = this.configService.get('payment', { infer: true });
    const expiresAt = new Date(Date.now() + paymentConfig.expirationMinutes * 60_000);

    const order = await this.orders.save(
      this.orders.create({
        reference: generateReference(),
        userId,
        offerId: offer.id,
        status: OrderStatus.PENDING,
        subtotalCents: price.subtotalCents,
        discountCents: price.discountCents,
        totalCents: price.totalCents,
        currency: price.currency,
        couponId: price.coupon?.id ?? null,
        snapshot,
        expiresAt,
      }),
    );

    // Oferta gratuita (ou 100% de desconto): sem gateway, acesso imediato.
    if (offer.kind === OfferKind.FREE || price.totalCents === 0) {
      await this.approveOrder(order.id, null);
      const refreshed = await this.findOrderOrFail(order.id);
      return { order: this.toOrderDto(refreshed), payment: null, accessGranted: true };
    }

    const app = this.configService.get('app', { infer: true });

    const created = await this.gateway.createPayment({
      orderId: order.id,
      orderReference: order.reference,
      amountCents: price.totalCents,
      currency: price.currency,
      method: dto.method,
      description: `${product.name} — ${offer.name}`,
      payer: { name: user.name, email: user.email },
      returnUrl: `${app.webPublicUrl}${WEB_ROUTES.purchases}`,
      notificationUrl: `${app.apiPublicUrl}/${app.globalPrefix}/commerce/webhooks/${this.gateway.name}`,
      expiresAt,
    });

    const payment = await this.payments.save(
      this.payments.create({
        orderId: order.id,
        status: created.status,
        method: dto.method,
        amountCents: price.totalCents,
        currency: price.currency,
        gateway: this.gateway.name,
        gatewayPaymentId: created.gatewayPaymentId,
        checkoutUrl: created.checkoutUrl,
        pixQrCode: created.pixQrCode,
        pixQrCodeBase64: created.pixQrCodeBase64,
        gatewayPayload: created.raw,
        expiresAt: created.expiresAt,
      }),
    );

    await this.orders.update({ id: order.id }, { status: OrderStatus.PROCESSING });

    await this.auditService.record({
      actorId: userId,
      actorEmail: user.email,
      action: AuditAction.CREATE,
      entityType: 'Order',
      entityId: order.id,
      summary: `Pedido ${order.reference} criado para "${product.name}".`,
      metadata: { offerId: offer.id, totalCents: price.totalCents, method: dto.method },
    });

    const refreshed = await this.findOrderOrFail(order.id);
    return {
      order: this.toOrderDto(refreshed),
      payment: this.toPaymentDto(payment),
      accessGranted: false,
    };
  }

  /**
   * Aprova o pedido e libera o acesso — ponto único de concessão por compra.
   *
   * É idempotente: chamar duas vezes (webhook repetido) não duplica
   * permissões, matrículas nem e-mails.
   */
  async approveOrder(orderId: string, paymentId: string | null): Promise<void> {
    const newlyApproved = await this.dataSource.transaction(async (manager) => {
      const orderRepository = manager.getRepository(Order);

      // Trava a linha para serializar webhooks simultâneos do mesmo pedido.
      const order = await orderRepository
        // Alias curto: `order` é palavra reservada no PostgreSQL.
        .createQueryBuilder('o')
        .setLock('pessimistic_write')
        .where('o.id = :orderId', { orderId })
        .getOne();

      if (!order) throw DomainErrors.notFound('Pedido não encontrado.');
      if (order.status === OrderStatus.APPROVED) {
        this.logger.log({ message: 'pedido já aprovado — nada a fazer', orderId });
        return false;
      }

      order.status = OrderStatus.APPROVED;
      order.paidAt = order.paidAt ?? new Date();
      await orderRepository.save(order);

      if (paymentId) {
        await manager
          .getRepository(Payment)
          .update({ id: paymentId }, { status: PaymentStatus.APPROVED, approvedAt: new Date() });
      }

      const expiresAt = order.snapshot.accessDurationDays
        ? new Date(Date.now() + order.snapshot.accessDurationDays * 86_400_000)
        : null;

      const source =
        order.totalCents === 0 ? EntitlementSource.FREE_ENROLLMENT : EntitlementSource.PURCHASE;

      if (order.snapshot.productType === ProductType.PROGRAM && order.snapshot.programId) {
        await this.entitlementService.grant(
          {
            userId: order.userId,
            scope: EntitlementScope.PROGRAM,
            programId: order.snapshot.programId,
            source,
            orderId: order.id,
            expiresAt,
          },
          manager,
        );
        await this.enrollmentService.ensureEnrollmentsForProgram(
          order.userId,
          order.snapshot.programId,
          source,
          manager,
        );
      } else if (order.snapshot.courseId) {
        await this.entitlementService.grant(
          {
            userId: order.userId,
            scope: EntitlementScope.COURSE,
            courseId: order.snapshot.courseId,
            source,
            orderId: order.id,
            expiresAt,
          },
          manager,
        );
        await this.enrollmentService.ensureEnrollment(
          order.userId,
          order.snapshot.courseId,
          source,
          manager,
        );
      }

      if (order.couponId) {
        await manager.getRepository(Coupon).increment({ id: order.couponId }, 'redemptions', 1);
      }

      return true;
    });

    // Webhook repetido: o acesso já foi concedido, não reenvia e-mail.
    if (!newlyApproved) return;

    // E-mail e auditoria fora da transação: não devem travar a liberação.
    const order = await this.findOrderOrFail(orderId);
    const user = await this.users.findOne({ where: { id: order.userId } });

    if (user) {
      await this.mailService.paymentApproved(user, {
        productName: order.snapshot.productName,
        totalCents: order.totalCents,
        currency: order.currency,
        reference: order.reference,
      });
    }

    await this.auditService.record({
      actorId: null,
      action: AuditAction.GRANT_ACCESS,
      entityType: 'Order',
      entityId: order.id,
      summary: `Acesso liberado pelo pedido ${order.reference}.`,
      metadata: { productName: order.snapshot.productName },
    });
  }

  /** Marca o pedido como não concluído e avisa o aluno. */
  async failOrder(
    orderId: string,
    status: OrderStatus.REJECTED | OrderStatus.EXPIRED | OrderStatus.CANCELLED,
    paymentId: string | null,
    reason: string | null,
  ): Promise<void> {
    const order = await this.findOrderOrFail(orderId);

    // Um pedido aprovado nunca regride por um evento atrasado.
    if (order.status === OrderStatus.APPROVED || order.status === OrderStatus.REFUNDED) return;
    if (order.status === status) return;

    await this.orders.update(
      { id: orderId },
      { status, cancelledAt: status === OrderStatus.CANCELLED ? new Date() : order.cancelledAt },
    );

    if (paymentId) {
      const paymentStatus = {
        [OrderStatus.REJECTED]: PaymentStatus.REJECTED,
        [OrderStatus.EXPIRED]: PaymentStatus.EXPIRED,
        [OrderStatus.CANCELLED]: PaymentStatus.CANCELLED,
      }[status];

      await this.payments.update(
        { id: paymentId },
        { status: paymentStatus, failureReason: reason?.slice(0, 255) ?? null },
      );
    }

    const user = await this.users.findOne({ where: { id: order.userId } });
    if (user) {
      await this.mailService.paymentFailed(user, {
        productName: order.snapshot.productName,
        reference: order.reference,
        reason: status,
      });
    }
  }

  /** Reembolso: devolve o valor e revoga o acesso concedido pelo pedido. */
  async refundOrder(orderId: string, actorId: string, reason: string): Promise<void> {
    const order = await this.findOrderOrFail(orderId);
    if (order.status !== OrderStatus.APPROVED) {
      throw DomainErrors.forbidden('Somente pedidos aprovados podem ser reembolsados.');
    }

    const payment = order.payments?.find((item) => item.status === PaymentStatus.APPROVED);
    if (payment?.gatewayPaymentId) {
      await this.gateway.refund(payment.gatewayPaymentId, payment.amountCents);
      await this.payments.update({ id: payment.id }, { status: PaymentStatus.REFUNDED });
    }

    await this.orders.update(
      { id: orderId },
      { status: OrderStatus.REFUNDED, refundedAt: new Date() },
    );
    await this.entitlementService.revokeByOrder(orderId, reason);

    await this.auditService.record({
      actorId,
      action: AuditAction.REFUND,
      entityType: 'Order',
      entityId: orderId,
      summary: `Pedido ${order.reference} reembolsado e acesso revogado.`,
      metadata: { reason },
    });
  }

  async listOrders(userId: string): Promise<OrderDto[]> {
    const orders = await this.orders.find({
      where: { userId },
      relations: { payments: true, coupon: true },
      order: { createdAt: 'DESC' },
    });
    return orders.map((order) => this.toOrderDto(order));
  }

  async findOrderOrFail(orderId: string): Promise<Order> {
    const order = await this.orders.findOne({
      where: { id: orderId },
      relations: { payments: true, coupon: true },
    });
    if (!order) throw DomainErrors.notFound('Pedido não encontrado.');
    return order;
  }

  private async alreadyOwns(
    userId: string,
    courseId: string | null,
    programId: string | null,
  ): Promise<boolean> {
    const accessible = await this.entitlementService.accessibleCourseIds(userId);

    if (courseId) return accessible.has(courseId);

    if (programId) {
      const courseIds = await this.entitlementService.coursesInProgram(programId);
      return courseIds.length > 0 && courseIds.every((id) => accessible.has(id));
    }

    return false;
  }

  toOrderDto(order: Order): OrderDto {
    const payment = order.payments?.slice().sort((a, b) => +b.createdAt - +a.createdAt)[0] ?? null;

    return {
      id: order.id,
      reference: order.reference,
      status: order.status,
      offerId: order.offerId,
      productName: order.snapshot.productName,
      subtotalCents: order.subtotalCents,
      discountCents: order.discountCents,
      totalCents: order.totalCents,
      currency: order.currency,
      couponCode: order.coupon?.code ?? null,
      createdAt: order.createdAt.toISOString(),
      paidAt: order.paidAt?.toISOString() ?? null,
      payment: payment ? this.toPaymentDto(payment) : null,
    };
  }

  toPaymentDto(payment: Payment): PaymentDto {
    return {
      id: payment.id,
      status: payment.status,
      method: payment.method ?? PaymentMethod.NONE,
      amountCents: payment.amountCents,
      currency: payment.currency,
      gateway: payment.gateway,
      gatewayPaymentId: payment.gatewayPaymentId,
      checkoutUrl: payment.checkoutUrl,
      pixQrCode: payment.pixQrCode,
      pixQrCodeBase64: payment.pixQrCodeBase64,
      expiresAt: payment.expiresAt?.toISOString() ?? null,
      createdAt: payment.createdAt.toISOString(),
    };
  }

  offerById(offerId: string): Promise<Offer> {
    return this.pricingService.findOfferOrFail(offerId);
  }
}
