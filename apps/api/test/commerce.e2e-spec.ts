import { EntitlementStatus, OrderStatus, PaymentMethod, PaymentStatus } from '@romalearn/contracts';
import { Repository } from 'typeorm';
import { Offer } from '../src/commerce/entities/offer.entity';
import { Order } from '../src/commerce/entities/order.entity';
import { Entitlement } from '../src/learning/entities/entitlement.entity';
import { Enrollment } from '../src/learning/entities/enrollment.entity';
import { ApiClient, PAID_COURSE_SLUG, SANDBOX_OFFER_SLUG, Session } from './helpers/api-client';
import { TestContext, closeTestApp, createTestApp } from './helpers/test-app';

describe('Comércio, pagamentos e webhooks (e2e)', () => {
  let context: TestContext;
  let api: ApiClient;
  let buyer: Session;
  let admin: Session;
  let offer: Offer;
  let orders: Repository<Order>;
  let entitlements: Repository<Entitlement>;
  let enrollments: Repository<Enrollment>;

  beforeAll(async () => {
    context = await createTestApp();
    api = new ApiClient(context.app);

    orders = context.dataSource.getRepository(Order);
    entitlements = context.dataSource.getRepository(Entitlement);
    enrollments = context.dataSource.getRepository(Enrollment);

    offer = await context.dataSource
      .getRepository(Offer)
      .findOneOrFail({ where: { slug: SANDBOX_OFFER_SLUG } });

    buyer = await api.register('comprador@exemplo.com');
    admin = await api.login('admin@teste.local', 'AdminTeste@123');
  });

  afterAll(async () => closeTestApp(context));

  describe('Catálogo comercial', () => {
    it('publica a oferta de teste identificada como sandbox', async () => {
      const response = await api.get('/commerce/products').expect(200);

      const program = response.body.find((product: { type: string }) => product.type === 'PROGRAM');
      expect(program.offers[0].environment).toBe('SANDBOX');
      expect(program.offers[0].name).toContain('teste');
    });

    it('não expõe ofertas de cursos avulsos sem preço aprovado', async () => {
      const response = await api.get('/commerce/products').expect(200);

      const slugs = response.body.map((product: { slug: string }) => product.slug);
      // Produtos por curso existem, mas ficam em rascunho até haver preço.
      expect(slugs).not.toContain(`curso-${PAID_COURSE_SLUG}`);
    });
  });

  describe('Criação do pedido', () => {
    it('exige autenticação', async () => {
      await api
        .post('/commerce/checkout', { offerId: offer.id, method: PaymentMethod.PIX })
        .expect(401);
    });

    it('cria o pedido com o preço vindo do backend', async () => {
      const response = await api
        .post(
          '/commerce/checkout',
          // O cliente tenta impor outro preço — deve ser ignorado.
          { offerId: offer.id, method: PaymentMethod.PIX, totalCents: 1 },
          buyer,
        )
        .expect(400);

      // `forbidNonWhitelisted` recusa campos desconhecidos.
      expect(response.body.error).toBe('VALIDATION_ERROR');
    });

    it('inicia o pagamento como pendente, sem liberar acesso', async () => {
      const response = await api
        .post('/commerce/checkout', { offerId: offer.id, method: PaymentMethod.PIX }, buyer)
        .expect(201);

      expect(response.body.accessGranted).toBe(false);
      expect(response.body.order.totalCents).toBe(offer.priceCents);
      expect(response.body.payment.status).toBe(PaymentStatus.PENDING);
      expect(response.body.payment.pixQrCode).toContain('SIMULACAO');

      // Acesso continua bloqueado.
      await api.get(`/learning/courses/${PAID_COURSE_SLUG}/player`, buyer).expect(403);
    });

    it('recusa oferta inexistente', async () => {
      await api
        .post(
          '/commerce/checkout',
          { offerId: '00000000-0000-4000-8000-000000000000', method: PaymentMethod.PIX },
          buyer,
        )
        .expect(404);
    });
  });

  describe('Webhook de pagamento', () => {
    let orderId: string;
    let gatewayPaymentId: string;

    beforeAll(async () => {
      const checkout = await api.post(
        '/commerce/checkout',
        { offerId: offer.id, method: PaymentMethod.PIX },
        buyer,
      );
      orderId = checkout.body.order.id;
      gatewayPaymentId = checkout.body.payment.gatewayPaymentId;
    });

    it('recusa webhook sem assinatura válida', async () => {
      const response = await api
        .webhookUnsigned({ id: 'evt-falso', paymentId: gatewayPaymentId, status: 'APPROVED' })
        .expect(401);

      expect(response.body.error).toBe('INVALID_WEBHOOK_SIGNATURE');

      // Nada mudou: o pedido continua pendente.
      const order = await orders.findOneOrFail({ where: { id: orderId } });
      expect(order.status).not.toBe(OrderStatus.APPROVED);
    });

    it('recusa quando o valor do webhook diverge do pedido', async () => {
      const response = await api
        .webhook({
          id: 'evt-valor-errado',
          paymentId: gatewayPaymentId,
          status: 'APPROVED',
          amountCents: 1,
        })
        .expect(200);

      expect(response.body.status).toBe('amount_mismatch');

      const order = await orders.findOneOrFail({ where: { id: orderId } });
      expect(order.status).not.toBe(OrderStatus.APPROVED);
    });

    it('libera o acesso apenas com a confirmação assinada', async () => {
      const response = await api
        .webhook({
          id: 'evt-aprovado-1',
          type: 'payment.approved',
          paymentId: gatewayPaymentId,
          status: 'APPROVED',
          amountCents: offer.priceCents,
        })
        .expect(200);

      expect(response.body.status).toBe('processed');

      const order = await orders.findOneOrFail({ where: { id: orderId } });
      expect(order.status).toBe(OrderStatus.APPROVED);
      expect(order.paidAt).toBeTruthy();

      // Agora o aluno acessa todos os cursos da trilha.
      const player = await api
        .get(`/learning/courses/${PAID_COURSE_SLUG}/player`, buyer)
        .expect(200);
      expect(player.body.sections.length).toBeGreaterThan(0);
    });

    it('não duplica pedidos, matrículas nem permissões ao repetir o webhook', async () => {
      const entitlementsBefore = await entitlements.count({ where: { userId: buyer.userId } });
      const enrollmentsBefore = await enrollments.count({ where: { userId: buyer.userId } });
      const ordersBefore = await orders.count({ where: { userId: buyer.userId } });

      // O mesmo evento chega mais duas vezes.
      const first = await api
        .webhook({
          id: 'evt-aprovado-1',
          type: 'payment.approved',
          paymentId: gatewayPaymentId,
          status: 'APPROVED',
          amountCents: offer.priceCents,
        })
        .expect(200);
      const second = await api
        .webhook({
          id: 'evt-aprovado-1',
          type: 'payment.approved',
          paymentId: gatewayPaymentId,
          status: 'APPROVED',
          amountCents: offer.priceCents,
        })
        .expect(200);

      expect(first.body.status).toBe('duplicate');
      expect(second.body.status).toBe('duplicate');

      expect(await entitlements.count({ where: { userId: buyer.userId } })).toBe(
        entitlementsBefore,
      );
      expect(await enrollments.count({ where: { userId: buyer.userId } })).toBe(enrollmentsBefore);
      expect(await orders.count({ where: { userId: buyer.userId } })).toBe(ordersBefore);
    });

    it('não regride um pedido aprovado por um evento atrasado', async () => {
      await api
        .webhook({
          id: 'evt-recusa-atrasada',
          paymentId: gatewayPaymentId,
          status: 'REJECTED',
          failureReason: 'evento fora de ordem',
        })
        .expect(200);

      const order = await orders.findOneOrFail({ where: { id: orderId } });
      expect(order.status).toBe(OrderStatus.APPROVED);
    });

    it('impede comprar de novo o que já foi liberado', async () => {
      const response = await api
        .post('/commerce/checkout', { offerId: offer.id, method: PaymentMethod.PIX }, buyer)
        .expect(409);

      expect(response.body.error).toBe('ALREADY_OWNED');
    });
  });

  describe('Pagamento recusado', () => {
    it('marca o pedido como recusado e não libera acesso', async () => {
      const other = await api.register('recusado@exemplo.com');

      const checkout = await api.post(
        '/commerce/checkout',
        { offerId: offer.id, method: PaymentMethod.CREDIT_CARD },
        other,
      );

      await api
        .webhook({
          id: 'evt-recusado',
          paymentId: checkout.body.payment.gatewayPaymentId,
          status: 'REJECTED',
          failureReason: 'saldo insuficiente',
        })
        .expect(200);

      const order = await orders.findOneOrFail({ where: { id: checkout.body.order.id } });
      expect(order.status).toBe(OrderStatus.REJECTED);

      await api.get(`/learning/courses/${PAID_COURSE_SLUG}/player`, other).expect(403);
    });
  });

  describe('Cupons', () => {
    it('aplica desconto criado pelo administrador', async () => {
      await api
        .post(
          '/admin/coupons',
          {
            code: 'TESTE20',
            discountType: 'PERCENTAGE',
            discountValue: 20,
            description: 'Cupom de teste',
          },
          admin,
        )
        .expect(201);

      const response = await api
        .post('/commerce/coupons/validate', { code: 'TESTE20', offerId: offer.id }, buyer)
        .expect(200);

      expect(response.body.discountCents).toBe(Math.floor(offer.priceCents * 0.2));
      expect(response.body.totalCents).toBe(offer.priceCents - response.body.discountCents);
    });

    it('recusa cupom inexistente', async () => {
      await api
        .post('/commerce/coupons/validate', { code: 'NAOEXISTE', offerId: offer.id }, buyer)
        .expect(400);
    });
  });

  describe('Operações administrativas', () => {
    it('permite liberação manual de acesso com motivo auditado', async () => {
      const student = await api.register('liberado@exemplo.com');
      const course = await api.get(`/catalog/courses/${PAID_COURSE_SLUG}`);

      await api.get(`/learning/courses/${PAID_COURSE_SLUG}/player`, student).expect(403);

      await api
        .post(
          '/admin/entitlements/grant',
          {
            userId: student.userId,
            scope: 'COURSE',
            courseId: course.body.id,
            reason: 'Cortesia concedida durante o teste.',
          },
          admin,
        )
        .expect(201);

      await api.get(`/learning/courses/${PAID_COURSE_SLUG}/player`, student).expect(200);

      const logs = await api.get('/admin/audit-logs', admin).expect(200);
      expect(logs.body.items.some((log: { action: string }) => log.action === 'GRANT_ACCESS')).toBe(
        true,
      );
    });

    it('revoga o acesso e bloqueia o conteúdo novamente', async () => {
      const student = await api.register('revogado@exemplo.com');
      const course = await api.get(`/catalog/courses/${PAID_COURSE_SLUG}`);

      const granted = await api.post(
        '/admin/entitlements/grant',
        {
          userId: student.userId,
          scope: 'COURSE',
          courseId: course.body.id,
          reason: 'Acesso temporário de teste.',
        },
        admin,
      );

      await api.get(`/learning/courses/${PAID_COURSE_SLUG}/player`, student).expect(200);

      await api
        .post(
          `/admin/entitlements/${granted.body.id}/revoke`,
          { reason: 'Período de cortesia encerrado.' },
          admin,
        )
        .expect(204);

      await api.get(`/learning/courses/${PAID_COURSE_SLUG}/player`, student).expect(403);
    });

    it('reembolsa o pedido e revoga o acesso concedido por ele', async () => {
      const student = await api.register('reembolso@exemplo.com');

      const checkout = await api.post(
        '/commerce/checkout',
        { offerId: offer.id, method: PaymentMethod.PIX },
        student,
      );

      await api
        .webhook({
          id: 'evt-reembolso-aprovacao',
          paymentId: checkout.body.payment.gatewayPaymentId,
          status: 'APPROVED',
          amountCents: offer.priceCents,
        })
        .expect(200);

      await api.get(`/learning/courses/${PAID_COURSE_SLUG}/player`, student).expect(200);

      await api
        .post(
          `/admin/orders/${checkout.body.order.id}/refund`,
          { reason: 'Solicitação de reembolso do aluno.' },
          admin,
        )
        .expect(201);

      const order = await orders.findOneOrFail({ where: { id: checkout.body.order.id } });
      expect(order.status).toBe(OrderStatus.REFUNDED);

      const revoked = await entitlements.find({ where: { orderId: order.id } });
      expect(revoked.every((item) => item.status === EntitlementStatus.REVOKED)).toBe(true);

      await api.get(`/learning/courses/${PAID_COURSE_SLUG}/player`, student).expect(403);
    });

    it('registra os webhooks recebidos para auditoria', async () => {
      const response = await api.get('/admin/webhooks', admin).expect(200);

      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toHaveProperty('externalId');
      expect(response.body[0]).toHaveProperty('status');
    });
  });
});
