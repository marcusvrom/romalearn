import { QuestionType } from '@romalearn/contracts';
import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../../database/base.entity';
import { Quiz } from './quiz.entity';

@Entity('questions')
@Index('idx_questions_quiz_order', ['quizId', 'order'])
export class Question extends BaseEntity {
  @Column({ type: 'uuid' })
  quizId: string;

  @ManyToOne(() => Quiz, (quiz) => quiz.questions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'quizId' })
  quiz: Quiz;

  @Column({ type: 'text' })
  statement: string;

  @Column({ type: 'varchar', length: 24, default: QuestionType.SINGLE_CHOICE })
  type: QuestionType;

  @Column({ type: 'int', default: 0 })
  order: number;

  /** Explicação exibida no feedback — reforça o aprendizado após o envio. */
  @Column({ type: 'text', nullable: true })
  explanation: string | null;

  @OneToMany(() => QuestionOption, (option) => option.question)
  options: QuestionOption[];
}

@Entity('question_options')
@Index('idx_question_options_question_order', ['questionId', 'order'])
export class QuestionOption extends BaseEntity {
  @Column({ type: 'uuid' })
  questionId: string;

  @ManyToOne(() => Question, (question) => question.options, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'questionId' })
  question: Question;

  @Column({ type: 'text' })
  text: string;

  /** Nunca é enviado ao aluno antes do envio da tentativa. */
  @Column({ type: 'boolean', default: false })
  isCorrect: boolean;

  @Column({ type: 'int', default: 0 })
  order: number;
}
