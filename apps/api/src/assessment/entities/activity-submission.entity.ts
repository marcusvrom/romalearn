import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../database/base.entity';
import { Lesson } from '../../catalog/entities/lesson.entity';
import { User } from '../../users/entities/user.entity';

/**
 * Envio de uma atividade prática.
 *
 * Hoje é uma confirmação declarada pelo aluno com um relato do que fez.
 * Os campos de arquivo e de revisão já existem para permitir, no futuro,
 * upload de anexos e correção por instrutor sem quebrar o histórico.
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

  /** Reservado para a correção por instrutor (evolução prevista). */
  @Column({ type: 'uuid', nullable: true })
  reviewedById: string | null;

  @Column({ type: 'timestamptz', nullable: true })
  reviewedAt: Date | null;

  @Column({ type: 'text', nullable: true })
  reviewFeedback: string | null;
}
