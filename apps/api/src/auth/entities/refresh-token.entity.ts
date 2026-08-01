import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../database/base.entity';
import { User } from '../../users/entities/user.entity';

/**
 * Refresh tokens com rotação por família: ao usar um token emitimos outro e
 * marcamos o anterior. Se um token já rotacionado for reapresentado, toda a
 * família é invalidada (indício de roubo de token).
 */
@Entity('refresh_tokens')
export class RefreshToken extends BaseEntity {
  @Index('idx_refresh_tokens_user')
  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  /** SHA-256 do token — o valor bruto nunca é persistido. */
  @Index('idx_refresh_tokens_hash', { unique: true })
  @Column({ type: 'varchar', length: 128 })
  tokenHash: string;

  @Index('idx_refresh_tokens_family')
  @Column({ type: 'uuid' })
  familyId: string;

  @Column({ type: 'timestamptz' })
  expiresAt: Date;

  @Column({ type: 'timestamptz', nullable: true })
  revokedAt: Date | null;

  @Column({ type: 'varchar', length: 64, nullable: true })
  revokedReason: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  userAgent: string | null;

  @Column({ type: 'varchar', length: 64, nullable: true })
  ipAddress: string | null;
}
