import { EntitlementScope, EntitlementSource, EntitlementStatus } from '@romalearn/contracts';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../database/base.entity';
import { Course } from '../../catalog/entities/course.entity';
import { Program } from '../../catalog/entities/program.entity';
import { User } from '../../users/entities/user.entity';

/**
 * Permissão de acesso a conteúdo. É a *única* coisa que libera uma aula.
 *
 * Desacopla conteúdo de pagamento: uma permissão pode nascer de matrícula
 * gratuita, de uma compra aprovada ou de uma liberação manual do administrador.
 */
@Entity('entitlements')
@Index('idx_entitlements_user_course', ['userId', 'courseId'])
@Index('idx_entitlements_user_program', ['userId', 'programId'])
export class Entitlement extends BaseEntity {
  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => User, (user) => user.entitlements, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'varchar', length: 16 })
  scope: EntitlementScope;

  @Column({ type: 'uuid', nullable: true })
  courseId: string | null;

  @ManyToOne(() => Course, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'courseId' })
  course: Course | null;

  @Column({ type: 'uuid', nullable: true })
  programId: string | null;

  @ManyToOne(() => Program, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'programId' })
  program: Program | null;

  @Column({ type: 'varchar', length: 24 })
  source: EntitlementSource;

  @Column({ type: 'varchar', length: 16, default: EntitlementStatus.ACTIVE })
  status: EntitlementStatus;

  /** Pedido que originou a permissão, quando houve compra. */
  @Column({ type: 'uuid', nullable: true })
  orderId: string | null;

  /** Administrador responsável, quando a liberação foi manual. */
  @Column({ type: 'uuid', nullable: true })
  grantedById: string | null;

  @Column({ type: 'timestamptz' })
  grantedAt: Date;

  /** `null` = acesso vitalício. */
  @Column({ type: 'timestamptz', nullable: true })
  expiresAt: Date | null;

  @Column({ type: 'timestamptz', nullable: true })
  revokedAt: Date | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  revocationReason: string | null;

  isUsable(now = new Date()): boolean {
    if (this.status !== EntitlementStatus.ACTIVE) return false;
    if (this.expiresAt && this.expiresAt.getTime() <= now.getTime()) return false;
    return true;
  }
}
