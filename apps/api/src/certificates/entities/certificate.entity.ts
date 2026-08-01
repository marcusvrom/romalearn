import { CertificateScope, CertificateStatus } from '@romalearn/contracts';
import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../../database/base.entity';
import { Course } from '../../catalog/entities/course.entity';
import { Program } from '../../catalog/entities/program.entity';
import { User } from '../../users/entities/user.entity';

/**
 * Cópia imutável dos dados no momento da emissão. Se o aluno alterar o nome
 * ou o curso mudar a carga horária, o certificado já emitido não muda.
 */
export interface CertificateSnapshot {
  studentName: string;
  subjectTitle: string;
  subjectSlug: string;
  workloadHours: number;
  issuerName: string;
  issuerLegalName: string;
  completedAt: string;
  issuedAt: string;
  /** Estrutura do conteúdo concluído, para consulta posterior. */
  syllabus: { section: string; lessons: string[] }[];
}

@Entity('certificates')
@Index('idx_certificates_user_course', ['userId', 'courseId'], {
  unique: true,
  where: '"courseId" IS NOT NULL',
})
@Index('idx_certificates_user_program', ['userId', 'programId'], {
  unique: true,
  where: '"programId" IS NOT NULL',
})
export class Certificate extends BaseEntity {
  /** Código público curto usado na URL de validação e no QR Code. */
  @Index('idx_certificates_verification_code', { unique: true })
  @Column({ type: 'varchar', length: 24 })
  verificationCode: string;

  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => User, (user) => user.certificates, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'varchar', length: 16 })
  scope: CertificateScope;

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

  @Column({ type: 'varchar', length: 16, default: CertificateStatus.ACTIVE })
  status: CertificateStatus;

  // Campos desnormalizados a partir do snapshot para consulta rápida.
  @Column({ type: 'varchar', length: 160 })
  studentName: string;

  @Column({ type: 'varchar', length: 200 })
  subjectTitle: string;

  @Column({ type: 'int' })
  workloadHours: number;

  @Column({ type: 'timestamptz' })
  completedAt: Date;

  @Column({ type: 'timestamptz' })
  issuedAt: Date;

  @Column({ type: 'varchar', length: 200 })
  issuerName: string;

  @Column({ type: 'jsonb' })
  snapshot: CertificateSnapshot;

  /** Chave do PDF no storage; regerado sob demanda se estiver ausente. */
  @Column({ type: 'varchar', length: 512, nullable: true })
  pdfStorageKey: string | null;

  @Column({ type: 'timestamptz', nullable: true })
  revokedAt: Date | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  revocationReason: string | null;

  /** Incrementado a cada reemissão autorizada. */
  @Column({ type: 'int', default: 1 })
  version: number;

  @OneToMany(() => CertificateEvent, (event) => event.certificate)
  events: CertificateEvent[];
}

export enum CertificateEventType {
  ISSUED = 'ISSUED',
  REISSUED = 'REISSUED',
  REVOKED = 'REVOKED',
  RESTORED = 'RESTORED',
  DOWNLOADED = 'DOWNLOADED',
}

/** Histórico auditável de tudo que aconteceu com o certificado. */
@Entity('certificate_events')
@Index('idx_certificate_events_certificate', ['certificateId'])
export class CertificateEvent extends BaseEntity {
  @Column({ type: 'uuid' })
  certificateId: string;

  @ManyToOne(() => Certificate, (certificate) => certificate.events, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'certificateId' })
  certificate: Certificate;

  @Column({ type: 'varchar', length: 24 })
  type: CertificateEventType;

  @Column({ type: 'uuid', nullable: true })
  actorId: string | null;

  @Column({ type: 'varchar', length: 500, nullable: true })
  reason: string | null;
}
