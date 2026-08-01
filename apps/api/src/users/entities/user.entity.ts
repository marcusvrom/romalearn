import { UserRole, UserStatus } from '@romalearn/contracts';
import { Column, DeleteDateColumn, Entity, Index, OneToMany } from 'typeorm';
import { BaseEntity } from '../../database/base.entity';
import { Certificate } from '../../certificates/entities/certificate.entity';
import { Enrollment } from '../../learning/entities/enrollment.entity';
import { Entitlement } from '../../learning/entities/entitlement.entity';
import { Order } from '../../commerce/entities/order.entity';

@Entity('users')
export class User extends BaseEntity {
  @Column({ type: 'varchar', length: 160 })
  name: string;

  /** Sempre gravado em minúsculas para tornar o login case-insensitive. */
  @Index('idx_users_email', { unique: true })
  @Column({ type: 'varchar', length: 254 })
  email: string;

  /** Hash Argon2id. Nunca é serializado nas respostas da API. */
  @Column({ type: 'varchar', length: 255, select: false })
  passwordHash: string;

  @Column({ type: 'varchar', length: 32, nullable: true })
  phone: string | null;

  @Column({ type: 'jsonb', default: () => `'["STUDENT"]'::jsonb` })
  roles: UserRole[];

  @Column({ type: 'varchar', length: 32, default: UserStatus.PENDING_VERIFICATION })
  status: UserStatus;

  @Column({ type: 'timestamptz', nullable: true })
  emailVerifiedAt: Date | null;

  // Registro de aceite versionado (LGPD).
  @Column({ type: 'varchar', length: 32, nullable: true })
  termsAcceptedVersion: string | null;

  @Column({ type: 'timestamptz', nullable: true })
  termsAcceptedAt: Date | null;

  @Column({ type: 'varchar', length: 32, nullable: true })
  privacyAcceptedVersion: string | null;

  @Column({ type: 'timestamptz', nullable: true })
  privacyAcceptedAt: Date | null;

  @Column({ type: 'timestamptz', nullable: true })
  lastLoginAt: Date | null;

  /** Exclusão lógica; a anonimização substitui os dados pessoais. */
  @DeleteDateColumn({ type: 'timestamptz' })
  deletedAt: Date | null;

  @OneToMany(() => Enrollment, (enrollment) => enrollment.user)
  enrollments: Enrollment[];

  @OneToMany(() => Entitlement, (entitlement) => entitlement.user)
  entitlements: Entitlement[];

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];

  @OneToMany(() => Certificate, (certificate) => certificate.user)
  certificates: Certificate[];

  hasRole(role: UserRole): boolean {
    return (this.roles ?? []).includes(role);
  }

  /** Qualquer papel administrativo (usado para expor a área /admin). */
  isStaff(): boolean {
    return (this.roles ?? []).some((role) => role !== UserRole.STUDENT);
  }
}
