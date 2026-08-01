import { WebhookEventStatus } from '@romalearn/contracts';
import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from '../../database/base.entity';

/**
 * Registro de todo webhook recebido.
 *
 * A chave única (gateway + externalId) garante idempotência: reprocessar o
 * mesmo evento não duplica pedidos, pagamentos nem matrículas.
 */
@Entity('webhook_events')
@Index('idx_webhook_events_unique', ['gateway', 'externalId'], { unique: true })
export class WebhookEvent extends BaseEntity {
  @Column({ type: 'varchar', length: 32 })
  gateway: string;

  @Column({ type: 'varchar', length: 64 })
  eventType: string;

  /** Identificador do evento no provedor. */
  @Column({ type: 'varchar', length: 128 })
  externalId: string;

  @Column({ type: 'jsonb' })
  payload: Record<string, unknown>;

  @Column({ type: 'varchar', length: 16, default: WebhookEventStatus.RECEIVED })
  status: WebhookEventStatus;

  @Column({ type: 'int', default: 0 })
  attempts: number;

  @Column({ type: 'text', nullable: true })
  lastError: string | null;

  @Column({ type: 'timestamptz' })
  receivedAt: Date;

  @Column({ type: 'timestamptz', nullable: true })
  processedAt: Date | null;
}
