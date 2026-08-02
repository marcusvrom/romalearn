import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ActivityReviewStatus, ActivitySubmissionDto, LessonType } from '@romalearn/contracts';
import { Repository } from 'typeorm';
import { Lesson } from '../catalog/entities/lesson.entity';
import { DomainErrors } from '../common/errors/domain-error';
import { SubmitActivityDto } from '../learning/dto/learning.dto';
import { ActivitySubmission } from './entities/activity-submission.entity';
import { GradingService } from './grading/grading.service';

/**
 * Atividades práticas.
 *
 * O aluno descreve o que fez e a entrega é corrigida contra a rubrica da
 * aula. Reenviar não cria uma entrega nova: atualiza a existente e conta como
 * mais uma tentativa, para que o histórico do aluno continue sendo um só.
 */
@Injectable()
export class ActivityService {
  constructor(
    @InjectRepository(ActivitySubmission)
    private readonly submissions: Repository<ActivitySubmission>,
    @InjectRepository(Lesson) private readonly lessons: Repository<Lesson>,
    private readonly grading: GradingService,
  ) {}

  async submit(
    userId: string,
    lessonId: string,
    dto: SubmitActivityDto,
  ): Promise<ActivitySubmissionDto> {
    const lesson = await this.lessons.findOne({ where: { id: lessonId } });
    if (!lesson) throw DomainErrors.notFound('Aula não encontrada.');

    if (lesson.type !== LessonType.PRACTICAL_ACTIVITY) {
      throw DomainErrors.forbidden('Esta aula não é uma atividade prática.');
    }

    const submission =
      (await this.submissions.findOne({ where: { userId, lessonId } })) ??
      this.submissions.create({ userId, lessonId, attemptNumber: 0 });

    submission.notes = dto.notes;
    submission.submittedAt = new Date();
    submission.attemptNumber = (submission.attemptNumber ?? 0) + 1;

    // Sem rubrica cadastrada, a atividade segue sendo uma declaração do
    // aluno: entregar já basta, como antes.
    if (!lesson.activityRubric) {
      submission.status = ActivityReviewStatus.SUBMITTED;
      return this.toDto(await this.submissions.save(submission), lesson);
    }

    const graded = await this.grading.grade(
      lesson.activityInstructions ?? '',
      lesson.activityRubric,
      dto.notes,
    );

    submission.status = graded.status;
    submission.score = graded.score;
    submission.criteriaResults = graded.criteriaResults;
    submission.strengths = graded.strengths;
    submission.improvements = graded.improvements;
    submission.criticalFailures = graded.criticalFailures;
    submission.gradedBy = graded.gradedBy;
    submission.graderModel = graded.graderModel;
    submission.gradedAt = new Date();

    return this.toDto(await this.submissions.save(submission), lesson);
  }

  findForUser(userId: string, lessonId: string): Promise<ActivitySubmission | null> {
    return this.submissions.findOne({ where: { userId, lessonId } });
  }

  toDto(submission: ActivitySubmission, lesson: Lesson): ActivitySubmissionDto {
    return {
      id: submission.id,
      lessonId: submission.lessonId,
      notes: submission.notes ?? '',
      submittedAt: submission.submittedAt.toISOString(),
      status: submission.status,
      score: submission.score,
      approved: submission.status === ActivityReviewStatus.APPROVED,
      criteria: submission.criteriaResults ?? [],
      strengths: submission.strengths ?? [],
      improvements: submission.improvements ?? [],
      criticalFailures: submission.criticalFailures ?? [],
      gradedBy: submission.gradedBy,
      gradedAt: submission.gradedAt?.toISOString() ?? null,
      attemptNumber: submission.attemptNumber,
      statusMessage: this.grading.statusMessage(submission, lesson.activityRubric),
    };
  }
}
