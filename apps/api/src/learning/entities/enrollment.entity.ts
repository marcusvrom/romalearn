import { EnrollmentStatus, EntitlementSource } from '@romalearn/contracts';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../database/base.entity';
import { Course } from '../../catalog/entities/course.entity';
import { Lesson } from '../../catalog/entities/lesson.entity';
import { User } from '../../users/entities/user.entity';

/**
 * Vínculo do aluno com um curso: guarda o andamento dos estudos.
 * A *permissão* de acesso vive em `Entitlement` — matrícula e permissão são
 * conceitos distintos para permitir revogar acesso sem apagar o histórico.
 */
@Entity('enrollments')
@Index('idx_enrollments_unique', ['userId', 'courseId'], { unique: true })
export class Enrollment extends BaseEntity {
  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => User, (user) => user.enrollments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'uuid' })
  courseId: string;

  @ManyToOne(() => Course, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'courseId' })
  course: Course;

  @Column({ type: 'varchar', length: 16, default: EnrollmentStatus.ACTIVE })
  status: EnrollmentStatus;

  @Column({ type: 'varchar', length: 24, default: EntitlementSource.FREE_ENROLLMENT })
  source: EntitlementSource;

  @Column({ type: 'timestamptz', nullable: true })
  startedAt: Date | null;

  @Column({ type: 'timestamptz', nullable: true })
  completedAt: Date | null;

  @Column({ type: 'uuid', nullable: true })
  lastAccessedLessonId: string | null;

  @ManyToOne(() => Lesson, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'lastAccessedLessonId' })
  lastAccessedLesson: Lesson | null;

  @Column({ type: 'timestamptz', nullable: true })
  lastAccessedAt: Date | null;
}
