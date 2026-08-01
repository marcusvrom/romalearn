import { Column, Entity, Index, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { BaseEntity } from '../../database/base.entity';
import { Lesson } from '../../catalog/entities/lesson.entity';
import { Question } from './question.entity';

@Entity('quizzes')
export class Quiz extends BaseEntity {
  @Index('idx_quizzes_lesson', { unique: true })
  @Column({ type: 'uuid' })
  lessonId: string;

  @OneToOne(() => Lesson, (lesson) => lesson.quiz, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'lessonId' })
  lesson: Lesson;

  @Column({ type: 'varchar', length: 200 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  /** Nota mínima para aprovação, de 0 a 100. */
  @Column({ type: 'int', default: 70 })
  passingScore: number;

  /** `null` significa tentativas ilimitadas. */
  @Column({ type: 'int', nullable: true })
  maxAttempts: number | null;

  @Column({ type: 'boolean', default: false })
  shuffleQuestions: boolean;

  @Column({ type: 'boolean', default: false })
  shuffleOptions: boolean;

  /** Mostra ao aluno o gabarito e a explicação após enviar a tentativa. */
  @Column({ type: 'boolean', default: true })
  showFeedback: boolean;

  @OneToMany(() => Question, (question) => question.quiz)
  questions: Question[];
}
