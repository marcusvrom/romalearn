import { PaymentMethod, PaymentStatus } from '@romalearn/contracts';
import { FAKE_SIGNATURE_HEADER, FakePaymentGateway } from './fake.gateway';

describe('Gateway de pagamento falso', () => {
  const gateway = new FakePaymentGateway('segredo-de-teste');

  const createInput = {
    orderId: 'pedido-1',
    orderReference: 'RL-TESTE01',
    amountCents: 19_700,
    currency: 'BRL',
    method: PaymentMethod.PIX,
    description: 'Trilha completa',
    payer: { name: 'Maria Souza', email: 'maria@exemplo.com' },
    returnUrl: 'http://localhost:4200/painel/compras',
    notificationUrl: 'http://localhost:3333/api/commerce/webhooks/fake',
    expiresAt: new Date(Date.now() + 3_600_000),
  };

  it('cria o pagamento como pendente — nunca aprovado de imediato', async () => {
    const result = await gateway.createPayment(createInput);

    expect(result.status).toBe(PaymentStatus.PENDING);
    expect(result.gatewayPaymentId).toMatch(/^fake_/);
    expect(result.pixQrCode).toContain('SIMULACAO');
  });

  it('recusa webhook sem assinatura', async () => {
    const body = { id: 'evt-1', paymentId: 'fake_1', status: 'APPROVED' };

    await expect(
      gateway.parseWebhook({
        headers: {},
        rawBody: JSON.stringify(body),
        body,
        query: {},
      }),
    ).rejects.toMatchObject({ code: 'INVALID_WEBHOOK_SIGNATURE' });
  });

  it('recusa webhook com assinatura inválida', async () => {
    const body = { id: 'evt-1', paymentId: 'fake_1', status: 'APPROVED' };
    const rawBody = JSON.stringify(body);

    await expect(
      gateway.parseWebhook({
        headers: { [FAKE_SIGNATURE_HEADER]: 'a'.repeat(64) },
        rawBody,
        body,
        query: {},
      }),
    ).rejects.toMatchObject({ code: 'INVALID_WEBHOOK_SIGNATURE' });
  });

  it('recusa quando o corpo foi alterado depois de assinado', async () => {
    const original = JSON.stringify({ id: 'evt-1', paymentId: 'fake_1', status: 'REJECTED' });
    const signature = gateway.sign(original);
    const tampered = { id: 'evt-1', paymentId: 'fake_1', status: 'APPROVED' };

    await expect(
      gateway.parseWebhook({
        headers: { [FAKE_SIGNATURE_HEADER]: signature },
        rawBody: JSON.stringify(tampered),
        body: tampered,
        query: {},
      }),
    ).rejects.toMatchObject({ code: 'INVALID_WEBHOOK_SIGNATURE' });
  });

  it('aceita webhook assinado corretamente', async () => {
    const body = {
      id: 'evt-2',
      type: 'payment.updated',
      paymentId: 'fake_2',
      status: 'APPROVED',
      amountCents: 19_700,
    };
    const rawBody = JSON.stringify(body);

    const event = await gateway.parseWebhook({
      headers: { [FAKE_SIGNATURE_HEADER]: gateway.sign(rawBody) },
      rawBody,
      body,
      query: {},
    });

    expect(event.externalId).toBe('evt-2');
    expect(event.status).toBe(PaymentStatus.APPROVED);
    expect(event.amountCents).toBe(19_700);
  });
});
