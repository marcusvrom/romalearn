import { OrderStatus } from '@romalearn/contracts';
import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../../database/base.entity';
import { User } from '../../users/entities/user.entity';
import { Coupon } from './coupon.entity';
import { Offer } from './offer.entity';
import { Payment } from './payment.entity';

/**
 * Fotografia da oferta no momento da compra. Preserva o histórico mesmo que
 * a oferta seja alterada ou arquivada depois.
 */
export interface OrderSnapshot {
  offerName: string;
  productName: string;
  productType: string;
  courseId: string | null;
  programId: string | null;
  priceCents: number;
  currency: string;
  accessDurationDays: number | null;
}

@Entity('orders')
@Index('idx_orders_user', ['userId'])
export class Order extends BaseEntity {
  /** Código legível informado ao aluno e ao suporte. */
  @Index('idx_orders_reference', { unique: true })
  @Column({ type: 'varchar', length: 32 })
  reference: string;

  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => User, (user) => user.orders, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'uuid' })
  offerId: string;

  @ManyToOne(() => Offer, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'offerId' })
  offer: Offer;

  @Column({ type: 'varchar', length: 16, default: OrderStatus.PENDING })
  status: OrderStatus;

  /** Todos os valores são calculados no backend a partir da oferta. */
  @Column({ type: 'int' })
  subtotalCents: number;

  @Column({ type: 'int', default: 0 })
  discountCents: number;

  @Column({ type: 'int' })
  totalCents: number;

  @Column({ type: 'varchar', length: 3, default: 'BRL' })
  currency: string;

  @Column({ type: 'uuid', nullable: true })
  couponId: string | null;

  @ManyToOne(() => Coupon, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'couponId' })
  coupon: Coupon | null;

  @Column({ type: 'jsonb' })
  snapshot: OrderSnapshot;

  @Column({ type: 'timestamptz', nullable: true })
  paidAt: Date | null;

  @Column({ type: 'timestamptz', nullable: true })
  expiresAt: Date | null;

  @Column({ type: 'timestamptz', nullable: true })
  cancelledAt: Date | null;

  @Column({ type: 'timestamptz', nullable: true })
  refundedAt: Date | null;

  @OneToMany(() => Payment, (payment) => payment.order)
  payments: Payment[];
}
