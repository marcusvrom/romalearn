import { AttemptStatus } from '@romalearn/contracts';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../database/base.entity';
import { User } from '../../users/entities/user.entity';
import { Quiz } from './quiz.entity';

/** Resposta registrada para uma questão dentro de uma tentativa. */
export interface AttemptAnswer {
  questionId: string;
  selectedOptionIds: string[];
  correct: boolean;
}

@Entity('quiz_attempts')
@Index('idx_quiz_attempts_user_quiz', ['userId', 'quizId'])
@Index('idx_quiz_attempts_number', ['userId', 'quizId', 'attemptNumber'], { unique: true })
export class QuizAttempt extends BaseEntity {
  @Column({ type: 'uuid' })
  quizId: string;

  @ManyToOne(() => Quiz, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'quizId' })
  quiz: Quiz;

  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'int' })
  attemptNumber: number;

  @Column({ type: 'varchar', length: 24, default: AttemptStatus.SUBMITTED })
  status: AttemptStatus;

  /** Nota de 0 a 100 calculada no backend. */
  @Column({ type: 'int', default: 0 })
  score: number;

  @Column({ type: 'boolean', default: false })
  passed: boolean;

  @Column({ type: 'jsonb', default: () => `'[]'::jsonb` })
  answers: AttemptAnswer[];

  @Column({ type: 'timestamptz', nullable: true })
  submittedAt: Date | null;
}
