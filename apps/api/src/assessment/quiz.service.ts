import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  AttemptStatus,
  QuestionType,
  QuizAttemptResultDto,
  QuizDto,
  QuizQuestionFeedbackDto,
} from '@romalearn/contracts';
import { In, Repository } from 'typeorm';
import { DomainErrors } from '../common/errors/domain-error';
import { SubmitQuizDto } from '../learning/dto/learning.dto';
import { AttemptAnswer, QuizAttempt } from './entities/quiz-attempt.entity';
import { Question, QuestionOption } from './entities/question.entity';
import { Quiz } from './entities/quiz.entity';

/** Embaralhamento estável por semente, para o aluno ver a mesma ordem ao recarregar. */
function seededShuffle<T>(items: T[], seed: string): T[] {
  let hash = 0;
  for (let index = 0; index < seed.length; index += 1) {
    hash = (hash * 31 + seed.charCodeAt(index)) | 0;
  }

  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    hash = (hash * 1103515245 + 12345) & 0x7fffffff;
    const target = hash % (index + 1);
    [result[index], result[target]] = [result[target], result[index]];
  }
  return result;
}

@Injectable()
export class QuizService {
  constructor(
    @InjectRepository(Quiz) private readonly quizzes: Repository<Quiz>,
    @InjectRepository(Question) private readonly questions: Repository<Question>,
    @InjectRepository(QuestionOption) private readonly options: Repository<QuestionOption>,
    @InjectRepository(QuizAttempt) private readonly attempts: Repository<QuizAttempt>,
  ) {}

  /**
   * Monta o questionário para o aluno.
   *
   * O gabarito (`isCorrect`) e a explicação nunca são enviados antes do
   * envio da tentativa.
   */
  async findForLesson(lessonId: string, userId: string): Promise<QuizDto | null> {
    const quiz = await this.quizzes.findOne({ where: { lessonId } });
    if (!quiz) return null;

    const questions = await this.questions.find({
      where: { quizId: quiz.id },
      order: { order: 'ASC' },
    });
    const options = await this.options.find({
      where: { questionId: In(questions.map((question) => question.id)) },
      order: { order: 'ASC' },
    });

    const attempts = await this.attempts.find({
      where: { quizId: quiz.id, userId },
      order: { attemptNumber: 'ASC' },
    });

    const ordered = quiz.shuffleQuestions
      ? seededShuffle(questions, `${quiz.id}:${userId}`)
      : questions;

    return {
      id: quiz.id,
      title: quiz.title,
      description: quiz.description,
      passingScore: quiz.passingScore,
      maxAttempts: quiz.maxAttempts,
      shuffleQuestions: quiz.shuffleQuestions,
      shuffleOptions: quiz.shuffleOptions,
      showFeedback: quiz.showFeedback,
      questions: ordered.map((question) => {
        const questionOptions = options.filter((option) => option.questionId === question.id);
        const finalOptions = quiz.shuffleOptions
          ? seededShuffle(questionOptions, `${question.id}:${userId}`)
          : questionOptions;

        return {
          id: question.id,
          statement: question.statement,
          type: question.type,
          order: question.order,
          options: finalOptions.map((option) => ({ id: option.id, text: option.text })),
        };
      }),
      attemptsUsed: attempts.length,
      bestScore: attempts.length === 0 ? null : Math.max(...attempts.map((a) => a.score)),
      passed: attempts.some((attempt) => attempt.passed),
    };
  }

  async hasPassedForLesson(userId: string, lessonId: string): Promise<boolean> {
    const quiz = await this.quizzes.findOne({ where: { lessonId } });
    // Aula sem questionário nunca bloqueia a conclusão.
    if (!quiz) return true;

    const passed = await this.attempts.count({ where: { quizId: quiz.id, userId, passed: true } });
    return passed > 0;
  }

  /**
   * Corrige e registra a tentativa.
   *
   * A nota é sempre calculada no backend a partir do gabarito guardado —
   * o cliente envia apenas as opções escolhidas.
   */
  async submitAttempt(
    userId: string,
    quizId: string,
    dto: SubmitQuizDto,
  ): Promise<{ result: QuizAttemptResultDto; lessonId: string }> {
    const quiz = await this.quizzes.findOne({ where: { id: quizId } });
    if (!quiz) throw DomainErrors.notFound('Questionário não encontrado.');

    const previous = await this.attempts.find({ where: { quizId, userId } });
    if (quiz.maxAttempts !== null && previous.length >= quiz.maxAttempts) {
      throw DomainErrors.attemptsExhausted();
    }

    const questions = await this.questions.find({
      where: { quizId },
      order: { order: 'ASC' },
    });
    if (questions.length === 0) {
      throw DomainErrors.notFound('Este questionário ainda não possui questões.');
    }

    const options = await this.options.find({
      where: { questionId: In(questions.map((question) => question.id)) },
    });

    const answersByQuestion = new Map(
      dto.answers.map((answer) => [answer.questionId, answer.selectedOptionIds]),
    );

    const answers: AttemptAnswer[] = [];
    const feedback: QuizQuestionFeedbackDto[] = [];
    let correctCount = 0;

    for (const question of questions) {
      const questionOptions = options.filter((option) => option.questionId === question.id);
      const correctIds = questionOptions
        .filter((option) => option.isCorrect)
        .map((option) => option.id)
        .sort();

      // Ignora ids que não pertencem à questão (payload manipulado).
      const validIds = new Set(questionOptions.map((option) => option.id));
      const selected = (answersByQuestion.get(question.id) ?? [])
        .filter((id) => validIds.has(id))
        .sort();

      // Múltipla escolha exige o conjunto exato: sem acerto parcial.
      const correct =
        question.type === QuestionType.SINGLE_CHOICE
          ? selected.length === 1 && correctIds.includes(selected[0])
          : selected.length === correctIds.length &&
            selected.every((id, index) => id === correctIds[index]);

      if (correct) correctCount += 1;

      answers.push({ questionId: question.id, selectedOptionIds: selected, correct });
      feedback.push({
        questionId: question.id,
        correct,
        selectedOptionIds: selected,
        correctOptionIds: correctIds,
        explanation: question.explanation,
      });
    }

    const score = Math.round((correctCount / questions.length) * 100);
    const passed = score >= quiz.passingScore;
    const attemptNumber = previous.length + 1;

    const attempt = await this.attempts.save(
      this.attempts.create({
        quizId,
        userId,
        attemptNumber,
        status: AttemptStatus.SUBMITTED,
        score,
        passed,
        answers,
        submittedAt: new Date(),
      }),
    );

    return {
      lessonId: quiz.lessonId,
      result: {
        attemptId: attempt.id,
        status: attempt.status,
        score,
        passed,
        passingScore: quiz.passingScore,
        attemptNumber,
        attemptsRemaining:
          quiz.maxAttempts === null ? null : Math.max(0, quiz.maxAttempts - attemptNumber),
        submittedAt: attempt.submittedAt!.toISOString(),
        // Sem feedback configurado, o aluno vê só a nota.
        questions: quiz.showFeedback ? feedback : [],
      },
    };
  }

  listAttempts(userId: string, quizId: string): Promise<QuizAttempt[]> {
    return this.attempts.find({
      where: { userId, quizId },
      order: { attemptNumber: 'DESC' },
    });
  }
}
