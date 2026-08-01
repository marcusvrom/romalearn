import { DiscountType, OfferEnvironment, OfferKind, OfferStatus } from '@romalearn/contracts';
import { Coupon } from './entities/coupon.entity';
import { Offer } from './entities/offer.entity';
import { PricingService } from './pricing.service';

/** Repositórios mínimos em memória — o foco é a regra de preço. */
function buildService(coupons: Partial<Coupon>[] = []) {
  const couponRepository = {
    findOne: async ({ where }: { where: { code: string } }) =>
      (coupons.find((coupon) => coupon.code === where.code) as Coupon) ?? null,
  };
  const offerRepository = { findOne: async () => null };

  return new PricingService(couponRepository as never, offerRepository as never);
}

function buildOffer(patch: Partial<Offer> = {}): Offer {
  return Object.assign(new Offer(), {
    id: 'oferta-1',
    kind: OfferKind.ONE_TIME,
    status: OfferStatus.ACTIVE,
    environment: OfferEnvironment.PRODUCTION,
    priceCents: 19_700,
    currency: 'BRL',
    availableFrom: null,
    availableUntil: null,
    ...patch,
  });
}

describe('Cálculo de preço', () => {
  it('usa o preço da oferta persistida, ignorando o cliente', async () => {
    const price = await buildService().priceFor(buildOffer());

    expect(price.subtotalCents).toBe(19_700);
    expect(price.totalCents).toBe(19_700);
    expect(price.discountCents).toBe(0);
  });

  it('trata oferta gratuita como total zero', async () => {
    const price = await buildService().priceFor(
      buildOffer({ kind: OfferKind.FREE, priceCents: 0 }),
    );
    expect(price.totalCents).toBe(0);
  });

  it('aplica desconto percentual', async () => {
    const service = buildService([
      {
        id: 'c1',
        code: 'BEMVINDO10',
        active: true,
        discountType: DiscountType.PERCENTAGE,
        discountValue: 10,
        maxRedemptions: null,
        redemptions: 0,
        expiresAt: null,
        offerId: null,
      },
    ]);

    const price = await service.priceFor(buildOffer(), 'BEMVINDO10');
    expect(price.discountCents).toBe(1_970);
    expect(price.totalCents).toBe(17_730);
  });

  it('nunca deixa o desconto ultrapassar o valor da oferta', async () => {
    const service = buildService([
      {
        id: 'c2',
        code: 'GIGANTE',
        active: true,
        discountType: DiscountType.FIXED_AMOUNT,
        discountValue: 999_999,
        maxRedemptions: null,
        redemptions: 0,
        expiresAt: null,
        offerId: null,
      },
    ]);

    const price = await service.priceFor(buildOffer(), 'GIGANTE');
    expect(price.totalCents).toBe(0);
    expect(price.discountCents).toBe(19_700);
  });

  it('recusa cupom expirado', async () => {
    const service = buildService([
      {
        id: 'c3',
        code: 'VELHO',
        active: true,
        discountType: DiscountType.PERCENTAGE,
        discountValue: 50,
        maxRedemptions: null,
        redemptions: 0,
        expiresAt: new Date(Date.now() - 1000),
        offerId: null,
      },
    ]);

    await expect(service.priceFor(buildOffer(), 'VELHO')).rejects.toMatchObject({
      code: 'INVALID_COUPON',
    });
  });

  it('recusa cupom que atingiu o limite de usos', async () => {
    const service = buildService([
      {
        id: 'c4',
        code: 'ESGOTADO',
        active: true,
        discountType: DiscountType.PERCENTAGE,
        discountValue: 50,
        maxRedemptions: 5,
        redemptions: 5,
        expiresAt: null,
        offerId: null,
      },
    ]);

    await expect(service.priceFor(buildOffer(), 'ESGOTADO')).rejects.toMatchObject({
      code: 'INVALID_COUPON',
    });
  });

  it('recusa cupom de outra oferta', async () => {
    const service = buildService([
      {
        id: 'c5',
        code: 'OUTRA',
        active: true,
        discountType: DiscountType.PERCENTAGE,
        discountValue: 20,
        maxRedemptions: null,
        redemptions: 0,
        expiresAt: null,
        offerId: 'oferta-diferente',
      },
    ]);

    await expect(service.priceFor(buildOffer(), 'OUTRA')).rejects.toMatchObject({
      code: 'INVALID_COUPON',
    });
  });
});

describe('Disponibilidade da oferta', () => {
  const service = buildService();

  it('recusa oferta em rascunho', () => {
    expect(() =>
      service.assertOfferSellable(buildOffer({ status: OfferStatus.DRAFT }), false),
    ).toThrow();
  });

  it('recusa oferta fora da janela de vendas', () => {
    const future = buildOffer({ availableFrom: new Date(Date.now() + 86_400_000) });
    expect(() => service.assertOfferSellable(future, false)).toThrow();
  });

  it('recusa oferta de sandbox em produção', () => {
    const sandbox = buildOffer({ environment: OfferEnvironment.SANDBOX });

    expect(() => service.assertOfferSellable(sandbox, false)).not.toThrow();
    expect(() => service.assertOfferSellable(sandbox, true)).toThrow();
  });
});
