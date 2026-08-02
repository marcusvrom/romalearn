import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ActivityAttachmentDto,
  ActivityReviewStatus,
  ActivitySubmissionDto,
  LessonType,
} from '@romalearn/contracts';
import { Repository } from 'typeorm';
import { Lesson } from '../catalog/entities/lesson.entity';
import { DomainErrors } from '../common/errors/domain-error';
import { SubmitActivityDto } from '../learning/dto/learning.dto';
import { StorageService } from '../storage/storage.service';
import { inspectAttachment } from './attachments/attachment-inspector';
import { ActivitySubmission } from './entities/activity-submission.entity';
import { GradingService } from './grading/grading.service';

/** Arquivo recebido no multipart, já em memória. */
export interface UploadedActivityFile {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
}

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
    private readonly storage: StorageService,
  ) {}

  async submit(
    userId: string,
    lessonId: string,
    dto: SubmitActivityDto,
    file?: UploadedActivityFile,
  ): Promise<ActivitySubmissionDto> {
    const lesson = await this.lessons.findOne({ where: { id: lessonId } });
    if (!lesson) throw DomainErrors.notFound('Aula não encontrada.');

    if (lesson.type !== LessonType.PRACTICAL_ACTIVITY) {
      throw DomainErrors.forbidden('Esta aula não é uma atividade prática.');
    }

    const submission =
      (await this.submissions.findOne({ where: { userId, lessonId } })) ??
      this.submissions.create({ userId, lessonId, attemptNumber: 0 });

    const politica = lesson.activityAttachmentPolicy;
    let textoDoArquivo = '';

    if (politica) {
      if (file) {
        // O arquivo é inspecionado antes de qualquer gravação: nada entra no
        // storage sem passar pelas verificações.
        const inspecao = inspectAttachment(file.buffer, file.originalname, politica);
        if (!inspecao.accepted) {
          throw DomainErrors.uploadRejected(inspecao.rejection ?? 'Arquivo recusado.');
        }

        const armazenado = await this.storage.upload({
          buffer: file.buffer,
          originalName: file.originalname,
          mimeType: file.mimetype,
          folder: `submissions/${lessonId}`,
          category: 'submission',
        });

        submission.attachmentKey = armazenado.key;
        submission.attachmentName = file.originalname.slice(0, 255);
        submission.attachmentSizeBytes = file.buffer.length;
        submission.attachmentUploadedAt = new Date();
        submission.attachmentChecks = inspecao.checks;
        textoDoArquivo = inspecao.text;
      } else if (politica.required && !submission.attachmentKey) {
        throw DomainErrors.uploadRejected(
          `Esta atividade pede o envio de um arquivo ${politica.extensions.join(' ou ')}.`,
        );
      }
    }

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
      textoDoArquivo,
      lesson.activityExample?.goodReport,
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

  async toDto(submission: ActivitySubmission, lesson: Lesson): Promise<ActivitySubmissionDto> {
    const attachment = await this.describeAttachment(submission);

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
      attachment,
      statusMessage: this.grading.statusMessage(submission, lesson.activityRubric),
    };
  }

  /**
   * Descreve o anexo com uma URL assinada e temporária.
   *
   * O arquivo do aluno nunca ganha endereço público: quem tem o link também
   * precisa que ele ainda esteja válido.
   */
  private async describeAttachment(
    submission: ActivitySubmission,
  ): Promise<ActivityAttachmentDto | null> {
    if (!submission.attachmentKey) return null;

    const { url } = await this.storage.urlFor(submission.attachmentKey);

    return {
      filename: submission.attachmentName ?? 'arquivo',
      sizeBytes: submission.attachmentSizeBytes ?? 0,
      uploadedAt: (submission.attachmentUploadedAt ?? submission.submittedAt).toISOString(),
      url,
      checks: submission.attachmentChecks ?? [],
    };
  }
}
