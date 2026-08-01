import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../database/base.entity';
import { User } from '../../users/entities/user.entity';

export enum VerificationTokenType {
  EMAIL_VERIFICATION = 'EMAIL_VERIFICATION',
  PASSWORD_RESET = 'PASSWORD_RESET',
}

/** Token de uso único enviado por e-mail (confirmação de cadastro / senha). */
@Entity('verification_tokens')
export class VerificationToken extends BaseEntity {
  @Index('idx_verification_tokens_user')
  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'varchar', length: 32 })
  type: VerificationTokenType;

  /** SHA-256 do token enviado ao usuário. */
  @Index('idx_verification_tokens_hash', { unique: true })
  @Column({ type: 'varchar', length: 128 })
  tokenHash: string;

  @Column({ type: 'timestamptz' })
  expiresAt: Date;

  @Column({ type: 'timestamptz', nullable: true })
  usedAt: Date | null;
}
