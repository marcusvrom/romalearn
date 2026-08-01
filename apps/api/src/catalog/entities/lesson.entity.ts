import { LessonCompletionRule, LessonType, PublicationStatus } from '@romalearn/contracts';
import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { BaseEntity } from '../../database/base.entity';
import { Quiz } from '../../assessment/entities/quiz.entity';
import { Course } from './course.entity';
import { LessonMaterial } from './lesson-material.entity';
import { Section } from './section.entity';

/** Regra de conclusão padrão sugerida para cada tipo de aula. */
export const DEFAULT_RULE_BY_TYPE: Record<LessonType, LessonCompletionRule> = {
  [LessonType.RICH_TEXT]: LessonCompletionRule.MINIMUM_TIME,
  [LessonType.VIDEO]: LessonCompletionRule.VIDEO_WATCH_RATIO,
  [LessonType.PDF]: LessonCompletionRule.MINIMUM_TIME,
  [LessonType.DOWNLOAD]: LessonCompletionRule.MANUAL_CONFIRMATION,
  [LessonType.PRACTICAL_ACTIVITY]: LessonCompletionRule.ACTIVITY_SUBMITTED,
  [LessonType.QUIZ]: LessonCompletionRule.QUIZ_PASSED,
};

@Entity('lessons')
@Index('idx_lessons_section_order', ['sectionId', 'order'])
@Index('idx_lessons_course_slug', ['courseId', 'slug'], { unique: true })
export class Lesson extends BaseEntity {
  @Column({ type: 'uuid' })
  courseId: string;

  @ManyToOne(() => Course, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'courseId' })
  course: Course;

  @Column({ type: 'uuid' })
  sectionId: string;

  @ManyToOne(() => Section, (section) => section.lessons, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sectionId' })
  section: Section;

  @Column({ type: 'varchar', length: 160 })
  slug: string;

  @Column({ type: 'varchar', length: 200 })
  title: string;

  @Column({ type: 'varchar', length: 32, default: LessonType.RICH_TEXT })
  type: LessonType;

  @Column({ type: 'int', default: 0 })
  order: number;

  @Column({ type: 'int', default: 10 })
  estimatedMinutes: number;

  @Column({ type: 'varchar', length: 32, default: LessonCompletionRule.MANUAL_CONFIRMATION })
  completionRule: LessonCompletionRule;

  /**
   * Parâmetro da regra: segundos mínimos (MINIMUM_TIME) ou proporção
   * assistida entre 0 e 1 (VIDEO_WATCH_RATIO).
   */
  @Column({
    type: 'numeric',
    precision: 8,
    scale: 2,
    nullable: true,
    transformer: {
      to: (value: number | null) => value,
      from: (value: string | null) => (value === null ? null : Number(value)),
    },
  })
  completionThreshold: number | null;

  /** Markdown bruto; a sanitização acontece na renderização para HTML. */
  @Column({ type: 'text', nullable: true })
  contentMarkdown: string | null;

  @Column({ type: 'varchar', length: 512, nullable: true })
  videoUrl: string | null;

  @Column({ type: 'varchar', length: 32, nullable: true })
  videoProvider: string | null;

  /** Chave no storage para aulas do tipo PDF/DOWNLOAD. */
  @Column({ type: 'varchar', length: 512, nullable: true })
  fileStorageKey: string | null;

  @Column({ type: 'text', nullable: true })
  activityInstructions: string | null;

  /** Aula liberada como amostra na página de vendas. */
  @Column({ type: 'boolean', default: false })
  isPreview: boolean;

  @Column({ type: 'varchar', length: 16, default: PublicationStatus.PUBLISHED })
  status: PublicationStatus;

  @OneToOne(() => Quiz, (quiz) => quiz.lesson)
  quiz: Quiz | null;

  @OneToMany(() => LessonMaterial, (material) => material.lesson)
  materials: LessonMaterial[];
}
