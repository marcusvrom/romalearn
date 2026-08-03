import { PaymentMethod, PaymentStatus } from '@romalearn/contracts';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../database/base.entity';
import { Order } from './order.entity';

@Entity('payments')
@Index('idx_payments_order', ['orderId'])
@Index('idx_payments_gateway_ref', ['gateway', 'gatewayPaymentId'], {
  unique: true,
  where: '"gatewayPaymentId" IS NOT NULL',
})
export class Payment extends BaseEntity {
  @Column({ type: 'uuid' })
  orderId: string;

  @ManyToOne(() => Order, (order) => order.payments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'orderId' })
  order: Order;

  @Column({ type: 'varchar', length: 16, default: PaymentStatus.PENDING })
  status: PaymentStatus;

  @Column({ type: 'varchar', length: 16, default: PaymentMethod.NONE })
  method: PaymentMethod;

  @Column({ type: 'int' })
  amountCents: number;

  @Column({ type: 'varchar', length: 3, default: 'BRL' })
  currency: string;

  @Column({ type: 'varchar', length: 32 })
  gateway: string;

  /** Identificador do pagamento no provedor. */
  @Column({ type: 'varchar', length: 128, nullable: true })
  gatewayPaymentId: string | null;

  @Column({ type: 'varchar', length: 1024, nullable: true })
  checkoutUrl: string | null;

  @Column({ type: 'text', nullable: true })
  pixQrCode: string | null;

  @Column({ type: 'text', nullable: true })
  pixQrCodeBase64: string | null;

  /**
   * Última carga recebida do provedor, para auditoria e suporte.
   * Dados sensíveis de cartão nunca chegam aqui: a API não recebe PAN/CVV.
   */
  @Column({ type: 'jsonb', nullable: true })
  gatewayPayload: Record<string, unknown> | null;

  @Column({ type: 'timestamptz', nullable: true })
  expiresAt: Date | null;

  @Column({ type: 'timestamptz', nullable: true })
  approvedAt: Date | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  failureReason: string | null;
}
