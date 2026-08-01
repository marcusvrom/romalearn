import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessonType } from '@romalearn/contracts';
import { Repository } from 'typeorm';
import { Lesson } from '../catalog/entities/lesson.entity';
import { DomainErrors } from '../common/errors/domain-error';
import { SubmitActivityDto } from '../learning/dto/learning.dto';
import { ActivitySubmission } from './entities/activity-submission.entity';

/**
 * Atividades práticas.
 *
 * No MVP o aluno confirma a entrega descrevendo o que fez. A entidade já
 * prevê anexos e correção por instrutor, então evoluir não quebra o histórico.
 */
@Injectable()
export class ActivityService {
  constructor(
    @InjectRepository(ActivitySubmission)
    private readonly submissions: Repository<ActivitySubmission>,
    @InjectRepository(Lesson) private readonly lessons: Repository<Lesson>,
  ) {}

  async submit(userId: string, lessonId: string, dto: SubmitActivityDto) {
    const lesson = await this.lessons.findOne({ where: { id: lessonId } });
    if (!lesson) throw DomainErrors.notFound('Aula não encontrada.');

    if (lesson.type !== LessonType.PRACTICAL_ACTIVITY) {
      throw DomainErrors.forbidden('Esta aula não é uma atividade prática.');
    }

    // Reenviar atualiza o relato em vez de criar uma nova entrega.
    const existing = await this.submissions.findOne({ where: { userId, lessonId } });
    if (existing) {
      existing.notes = dto.notes;
      existing.submittedAt = new Date();
      return this.submissions.save(existing);
    }

    return this.submissions.save(
      this.submissions.create({
        userId,
        lessonId,
        notes: dto.notes,
        submittedAt: new Date(),
      }),
    );
  }

  findForUser(userId: string, lessonId: string): Promise<ActivitySubmission | null> {
    return this.submissions.findOne({ where: { userId, lessonId } });
  }
}
