import { ActivityGraderKind, ActivityReviewStatus, CriterionResultDto } from '@romalearn/contracts';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../database/base.entity';
import { Lesson } from '../../catalog/entities/lesson.entity';
import { User } from '../../users/entities/user.entity';

/**
 * Envio de uma atividade prática, com o resultado da correção.
 *
 * O aluno descreve o que fez e a entrega é corrigida contra a rubrica da
 * aula. A nota final é sempre recalculada pela API a partir das notas por
 * critério — nem o front-end nem o modelo de linguagem decidem aprovação.
 */
@Entity('activity_submissions')
@Index('idx_activity_submissions_unique', ['userId', 'lessonId'], { unique: true })
export class ActivitySubmission extends BaseEntity {
  @Column({ type: 'uuid' })
  lessonId: string;

  @ManyToOne(() => Lesson, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'lessonId' })
  lesson: Lesson;

  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  /** Relato do aluno sobre a entrega realizada. */
  @Column({ type: 'text', nullable: true })
  notes: string | null;

  /** Reservado para o upload de anexos (evolução prevista). */
  @Column({ type: 'jsonb', default: () => `'[]'::jsonb` })
  attachmentKeys: string[];

  @Column({ type: 'timestamptz' })
  submittedAt: Date;

  @Column({ type: 'varchar', length: 32, default: ActivityReviewStatus.SUBMITTED })
  status: ActivityReviewStatus;

  /** Nota final de 0 a 100, recalculada pela API a partir dos critérios. */
  @Column({
    type: 'numeric',
    precision: 5,
    scale: 2,
    nullable: true,
    transformer: {
      to: (value: number | null) => value,
      from: (value: string | null) => (value === null ? null : Number(value)),
    },
  })
  score: number | null;

  /** Nota e comentário de cada critério da rubrica. */
  @Column({ type: 'jsonb', default: () => `'[]'::jsonb` })
  criteriaResults: CriterionResultDto[];

  @Column({ type: 'jsonb', default: () => `'[]'::jsonb` })
  strengths: string[];

  @Column({ type: 'jsonb', default: () => `'[]'::jsonb` })
  improvements: string[];

  /** Falhas críticas identificadas na entrega, se houver. */
  @Column({ type: 'jsonb', default: () => `'[]'::jsonb` })
  criticalFailures: string[];

  @Column({ type: 'varchar', length: 16, nullable: true })
  gradedBy: ActivityGraderKind | null;

  /**
   * Modelo usado na correção automática, para auditoria e comparação de
   * custo. Nunca guarda credencial: apenas o identificador público.
   */
  @Column({ type: 'varchar', length: 120, nullable: true })
  graderModel: string | null;

  /** Quantas vezes o aluno reenviou esta atividade. */
  @Column({ type: 'int', default: 1 })
  attemptNumber: number;

  @Column({ type: 'timestamptz', nullable: true })
  gradedAt: Date | null;

  /** Preenchido quando alguém da equipe revisa ou refaz a correção. */
  @Column({ type: 'uuid', nullable: true })
  reviewedById: string | null;

  @Column({ type: 'timestamptz', nullable: true })
  reviewedAt: Date | null;

  @Column({ type: 'text', nullable: true })
  reviewFeedback: string | null;
}
