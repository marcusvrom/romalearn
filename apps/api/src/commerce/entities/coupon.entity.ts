import { DiscountType } from '@romalearn/contracts';
import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from '../../database/base.entity';

@Entity('coupons')
export class Coupon extends BaseEntity {
  /** Sempre armazenado em maiúsculas. */
  @Index('idx_coupons_code', { unique: true })
  @Column({ type: 'varchar', length: 40 })
  code: string;

  @Column({ type: 'varchar', length: 160, default: '' })
  description: string;

  @Column({ type: 'varchar', length: 16 })
  discountType: DiscountType;

  /** Percentual (0..100) ou valor fixo em centavos, conforme `discountType`. */
  @Column({ type: 'int' })
  discountValue: number;

  /** Restringe o cupom a uma oferta; `null` vale para qualquer oferta paga. */
  @Column({ type: 'uuid', nullable: true })
  offerId: string | null;

  @Column({ type: 'int', nullable: true })
  maxRedemptions: number | null;

  @Column({ type: 'int', default: 0 })
  redemptions: number;

  @Column({ type: 'timestamptz', nullable: true })
  expiresAt: Date | null;

  @Column({ type: 'boolean', default: true })
  active: boolean;
}
