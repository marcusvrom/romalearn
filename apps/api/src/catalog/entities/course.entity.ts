import { CourseLevel, PublicationStatus } from '@romalearn/contracts';
import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../../database/base.entity';
import { Instructor } from './instructor.entity';
import { Section } from './section.entity';

/**
 * Critérios de conclusão configuráveis por curso. O backend é a única
 * autoridade sobre "curso concluído" — o front apenas exibe o resultado.
 */
export interface CourseCompletionCriteria {
  /** Percentual mínimo de aulas concluídas (0..100). */
  minimumLessonCompletionPercent: number;
  /** Exige aprovação em todos os questionários obrigatórios. */
  requireAllQuizzesPassed: boolean;
  /** Exige envio de todas as atividades práticas. */
  requireAllActivitiesSubmitted: boolean;
}

export const DEFAULT_COMPLETION_CRITERIA: CourseCompletionCriteria = {
  minimumLessonCompletionPercent: 100,
  requireAllQuizzesPassed: true,
  requireAllActivitiesSubmitted: true,
};

@Entity('courses')
export class Course extends BaseEntity {
  @Index('idx_courses_slug', { unique: true })
  @Column({ type: 'varchar', length: 160 })
  slug: string;

  @Column({ type: 'varchar', length: 200 })
  title: string;

  @Column({ type: 'varchar', length: 240, nullable: true })
  subtitle: string | null;

  @Column({ type: 'varchar', length: 400 })
  shortDescription: string;

  @Column({ type: 'text', default: '' })
  fullDescription: string;

  @Column({ type: 'varchar', length: 512, nullable: true })
  coverImageUrl: string | null;

  @Column({ type: 'jsonb', default: () => `'[]'::jsonb` })
  objectives: string[];

  @Column({ type: 'jsonb', default: () => `'[]'::jsonb` })
  targetAudience: string[];

  @Column({ type: 'jsonb', default: () => `'[]'::jsonb` })
  prerequisites: string[];

  /** Carga horária declarada no certificado. */
  @Column({ type: 'int', default: 0 })
  workloadHours: number;

  @Column({ type: 'varchar', length: 24, default: CourseLevel.BEGINNER })
  level: CourseLevel;

  @Column({ type: 'varchar', length: 16, default: PublicationStatus.DRAFT })
  status: PublicationStatus;

  /**
   * Marca o conteúdo como porta de entrada gratuita. Continua exigindo
   * matrícula: o acesso é sempre concedido por um entitlement.
   */
  @Column({ type: 'boolean', default: false })
  isFree: boolean;

  @Column({ type: 'int', default: 0 })
  order: number;

  @Column({
    type: 'jsonb',
    default: () => `'${JSON.stringify(DEFAULT_COMPLETION_CRITERIA)}'::jsonb`,
  })
  completionCriteria: CourseCompletionCriteria;

  @Column({ type: 'uuid', nullable: true })
  instructorId: string | null;

  @ManyToOne(() => Instructor, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'instructorId' })
  instructor: Instructor | null;

  @Column({ type: 'timestamptz', nullable: true })
  publishedAt: Date | null;

  @OneToMany(() => Section, (section) => section.course, { cascade: false })
  sections: Section[];
}
