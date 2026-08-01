import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DiscountType, OfferEnvironment, OfferKind } from '@romalearn/contracts';
import { Repository } from 'typeorm';
import { DomainErrors } from '../common/errors/domain-error';
import { Coupon } from './entities/coupon.entity';
import { Offer } from './entities/offer.entity';

export interface PriceBreakdown {
  subtotalCents: number;
  discountCents: number;
  totalCents: number;
  currency: string;
  coupon: Coupon | null;
}

/**
 * Cálculo de preço — sempre no backend.
 *
 * Nenhum valor enviado pelo front-end é considerado: o preço vem da oferta
 * persistida e o desconto, do cupom validado aqui.
 */
@Injectable()
export class PricingService {
  constructor(
    @InjectRepository(Coupon) private readonly coupons: Repository<Coupon>,
    @InjectRepository(Offer) private readonly offers: Repository<Offer>,
  ) {}

  /**
   * Garante que a oferta pode ser vendida agora.
   * Ofertas de sandbox são recusadas em produção.
   */
  assertOfferSellable(offer: Offer, isProduction: boolean): void {
    if (!offer.isAvailable()) throw DomainErrors.offerUnavailable();

    if (isProduction && offer.environment === OfferEnvironment.SANDBOX) {
      throw DomainErrors.offerUnavailable();
    }
  }

  async priceFor(offer: Offer, couponCode?: string): Promise<PriceBreakdown> {
    const subtotalCents = offer.kind === OfferKind.FREE ? 0 : offer.priceCents;

    if (!couponCode || subtotalCents === 0) {
      return {
        subtotalCents,
        discountCents: 0,
        totalCents: subtotalCents,
        currency: offer.currency,
        coupon: null,
      };
    }

    const coupon = await this.validateCoupon(couponCode, offer);
    const discountCents =
      coupon.discountType === DiscountType.PERCENTAGE
        ? Math.floor((subtotalCents * coupon.discountValue) / 100)
        : coupon.discountValue;

    // O desconto nunca ultrapassa o valor da oferta.
    const applied = Math.min(discountCents, subtotalCents);

    return {
      subtotalCents,
      discountCents: applied,
      totalCents: subtotalCents - applied,
      currency: offer.currency,
      coupon,
    };
  }

  async validateCoupon(code: string, offer: Offer): Promise<Coupon> {
    const coupon = await this.coupons.findOne({ where: { code: code.trim().toUpperCase() } });

    if (!coupon || !coupon.active) throw DomainErrors.invalidCoupon();
    if (coupon.expiresAt && coupon.expiresAt.getTime() <= Date.now()) {
      throw DomainErrors.invalidCoupon('Este cupom já expirou.');
    }
    if (coupon.maxRedemptions !== null && coupon.redemptions >= coupon.maxRedemptions) {
      throw DomainErrors.invalidCoupon('Este cupom atingiu o limite de usos.');
    }
    if (coupon.offerId && coupon.offerId !== offer.id) {
      throw DomainErrors.invalidCoupon('Este cupom não vale para esta oferta.');
    }

    return coupon;
  }

  /** Contabiliza o uso somente quando o pagamento é aprovado. */
  async redeem(couponId: string): Promise<void> {
    await this.coupons.increment({ id: couponId }, 'redemptions', 1);
  }

  async findOfferOrFail(offerId: string): Promise<Offer> {
    const offer = await this.offers.findOne({
      where: { id: offerId },
      relations: { product: true },
    });
    if (!offer) throw DomainErrors.notFound('Oferta não encontrada.');
    return offer;
  }
}
