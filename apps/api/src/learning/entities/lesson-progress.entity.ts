import { ProgressStatus } from '@romalearn/contracts';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../database/base.entity';
import { Lesson } from '../../catalog/entities/lesson.entity';
import { User } from '../../users/entities/user.entity';
import { Enrollment } from './enrollment.entity';

const numericToNumber = {
  to: (value: number) => value,
  from: (value: string | null) => (value === null ? 0 : Number(value)),
};

/** Progresso de uma aula específica dentro de uma matrícula. */
@Entity('lesson_progress')
@Index('idx_lesson_progress_unique', ['enrollmentId', 'lessonId'], { unique: true })
export class LessonProgress extends BaseEntity {
  @Column({ type: 'uuid' })
  enrollmentId: string;

  @ManyToOne(() => Enrollment, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'enrollmentId' })
  enrollment: Enrollment;

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

  @Column({ type: 'varchar', length: 16, default: ProgressStatus.NOT_STARTED })
  status: ProgressStatus;

  /** Tempo acumulado de permanência informado pelo player. */
  @Column({ type: 'int', default: 0 })
  secondsSpent: number;

  /** Maior proporção de vídeo assistida (0..1). */
  @Column({ type: 'numeric', precision: 5, scale: 4, default: 0, transformer: numericToNumber })
  watchRatio: number;

  /** Ponto de retomada em segundos. */
  @Column({ type: 'int', default: 0 })
  lastPositionSeconds: number;

  @Column({ type: 'timestamptz', nullable: true })
  completedAt: Date | null;
}
