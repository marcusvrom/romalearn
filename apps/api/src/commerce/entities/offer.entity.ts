import { OfferEnvironment, OfferKind, OfferStatus } from '@romalearn/contracts';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../database/base.entity';
import { Product } from './product.entity';

/**
 * Condição comercial de um produto: preço, moeda, janela e duração de acesso.
 *
 * `environment` separa preços reais de preços fictícios de desenvolvimento —
 * ofertas SANDBOX são recusadas quando `NODE_ENV=production`.
 */
@Entity('offers')
export class Offer extends BaseEntity {
  @Index('idx_offers_slug', { unique: true })
  @Column({ type: 'varchar', length: 160 })
  slug: string;

  @Column({ type: 'uuid' })
  productId: string;

  @ManyToOne(() => Product, (product) => product.offers, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'productId' })
  product: Product;

  @Column({ type: 'varchar', length: 200 })
  name: string;

  @Column({ type: 'varchar', length: 16 })
  kind: OfferKind;

  @Column({ type: 'varchar', length: 16, default: OfferStatus.DRAFT })
  status: OfferStatus;

  @Column({ type: 'varchar', length: 16, default: OfferEnvironment.SANDBOX })
  environment: OfferEnvironment;

  /** Valor em centavos — o sistema nunca trabalha com float em dinheiro. */
  @Column({ type: 'int', default: 0 })
  priceCents: number;

  @Column({ type: 'varchar', length: 3, default: 'BRL' })
  currency: string;

  @Column({ type: 'int', nullable: true })
  compareAtPriceCents: number | null;

  @Column({ type: 'int', default: 1 })
  installmentsAllowed: number;

  /** `null` = acesso vitalício ao conteúdo do produto. */
  @Column({ type: 'int', nullable: true })
  accessDurationDays: number | null;

  @Column({ type: 'timestamptz', nullable: true })
  availableFrom: Date | null;

  @Column({ type: 'timestamptz', nullable: true })
  availableUntil: Date | null;

  isAvailable(now = new Date()): boolean {
    if (this.status !== OfferStatus.ACTIVE) return false;
    if (this.availableFrom && this.availableFrom.getTime() > now.getTime()) return false;
    if (this.availableUntil && this.availableUntil.getTime() <= now.getTime()) return false;
    return true;
  }
}
