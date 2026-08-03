import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from '../../database/base.entity';

/** Registro de ações sensíveis. Somente inserção — nunca é editado. */
@Entity('audit_logs')
@Index('idx_audit_logs_entity', ['entityType', 'entityId'])
@Index('idx_audit_logs_created', ['createdAt'])
export class AuditLog extends BaseEntity {
  @Column({ type: 'uuid', nullable: true })
  actorId: string | null;

  @Column({ type: 'varchar', length: 254, nullable: true })
  actorEmail: string | null;

  @Column({ type: 'varchar', length: 40 })
  action: string;

  @Column({ type: 'varchar', length: 60 })
  entityType: string;

  @Column({ type: 'varchar', length: 64, nullable: true })
  entityId: string | null;

  /** Frase curta em português descrevendo o que mudou. */
  @Column({ type: 'varchar', length: 500 })
  summary: string;

  /** Campos essenciais da alteração. Nunca recebe senha, token ou segredo. */
  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, unknown> | null;

  @Column({ type: 'varchar', length: 64, nullable: true })
  ipAddress: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  userAgent: string | null;
}
