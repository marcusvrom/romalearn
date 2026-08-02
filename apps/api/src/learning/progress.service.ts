import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ActivityReviewStatus,
  CourseProgressDto,
  CoursePlayerDto,
  EnrolledCourseDto,
  EnrollmentStatus,
  EntitlementSource,
  LessonContentDto,
  LessonMaterialDto,
  LessonProgressDto,
  LessonType,
  PlayerSectionDto,
  ProgressStatus,
  PublicationStatus,
} from '@romalearn/contracts';
import { In, Repository } from 'typeorm';
import { ActivityService } from '../assessment/activity.service';
import { ActivitySubmission } from '../assessment/entities/activity-submission.entity';
import { QuizAttempt } from '../assessment/entities/quiz-attempt.entity';
import { QuizService } from '../assessment/quiz.service';
import { CatalogService } from '../catalog/catalog.service';
import { Course } from '../catalog/entities/course.entity';
import { Lesson } from '../catalog/entities/lesson.entity';
import { LessonMaterial } from '../catalog/entities/lesson-material.entity';
import { Section } from '../catalog/entities/section.entity';
import { DomainErrors } from '../common/errors/domain-error';
import { renderMarkdown } from '../common/utils/markdown';
import { MailService } from '../mail/mail.service';
import { DomainEventsService } from '../platform/domain-events.service';
import { StorageService } from '../storage/storage.service';
import { User } from '../users/entities/user.entity';
import {
  CompletionEvidence,
  MAX_HEARTBEAT_SECONDS,
  evaluateCompletion,
  requiredSeconds,
} from './completion-rules';
import { CompleteLessonDto, ProgressHeartbeatDto } from './dto/learning.dto';
import { Enrollment } from './entities/enrollment.entity';
import { LessonProgress } from './entities/lesson-progress.entity';
import { EnrollmentService } from './enrollment.service';
import { EntitlementService } from './entitlement.service';

@Injectable()
export class ProgressService {
  constructor(
    @InjectRepository(LessonProgress) private readonly progress: Repository<LessonProgress>,
    @InjectRepository(Enrollment) private readonly enrollments: Repository<Enrollment>,
    @InjectRepository(Lesson) private readonly lessons: Repository<Lesson>,
    @InjectRepository(Section) private readonly sections: Repository<Section>,
    @InjectRepository(Course) private readonly courses: Repository<Course>,
    @InjectRepository(LessonMaterial) private readonly materials: Repository<LessonMaterial>,
    @InjectRepository(QuizAttempt) private readonly attempts: Repository<QuizAttempt>,
    @InjectRepository(ActivitySubmission)
    private readonly submissions: Repository<ActivitySubmission>,
    @InjectRepository(User) private readonly users: Repository<User>,
    private readonly entitlementService: EntitlementService,
    private readonly enrollmentService: EnrollmentService,
    private readonly catalogService: CatalogService,
    private readonly quizService: QuizService,
    private readonly activityService: ActivityService,
    private readonly storageService: StorageService,
    private readonly mailService: MailService,
    private readonly events: DomainEventsService,
  ) {}

  // ------------------------------------------------------------------
  // Área do aluno
  // ------------------------------------------------------------------

  async listEnrolledCourses(userId: string): Promise<EnrolledCourseDto[]> {
    const enrollments = await this.enrollmentService.listForUser(userId);
    const accessible = await this.entitlementService.accessibleCourseIds(userId);

    const result: EnrolledCourseDto[] = [];
    for (const enrollment of enrollments) {
      // Matrículas cujo acesso foi revogado somem da lista de estudo.
      if (!accessible.has(enrollment.courseId)) continue;

      const progress = await this.computeCourseProgress(userId, enrollment);
      const [summary] = await this.summarize([enrollment.course]);

      result.push({
        enrollmentId: enrollment.id,
        course: summary,
        progress,
        lastAccessedLesson: enrollment.lastAccessedLesson
          ? { id: enrollment.lastAccessedLesson.id, title: enrollment.lastAccessedLesson.title }
          : null,
        lastAccessedAt: enrollment.lastAccessedAt?.toISOString() ?? null,
      });
    }

    return result;
  }

  /** Estrutura completa do curso com estado de cada aula. */
  async getPlayer(userId: string, courseSlug: string): Promise<CoursePlayerDto> {
    const { course, enrollment } = await this.requireAccess(userId, courseSlug);

    const sections = await this.sections.find({
      where: { courseId: course.id },
      order: { order: 'ASC' },
    });
    const lessons = await this.publishedLessons(course.id);
    const progressMap = await this.progressMap(enrollment.id);

    const playerSections: PlayerSectionDto[] = sections.map((section) => ({
      id: section.id,
      title: section.title,
      order: section.order,
      lessons: lessons
        .filter((lesson) => lesson.sectionId === section.id)
        .map((lesson) => ({
          id: lesson.id,
          slug: lesson.slug,
          title: lesson.title,
          type: lesson.type,
          order: lesson.order,
          estimatedMinutes: lesson.estimatedMinutes,
          isPreview: lesson.isPreview,
          status: progressMap.get(lesson.id)?.status ?? ProgressStatus.NOT_STARTED,
          // O aluno com matrícula ativa enxerga todo o curso.
          unlocked: true,
        })),
    }));

    const [summary] = await this.summarize([course]);
    const progress = await this.computeCourseProgress(userId, enrollment);

    return {
      course: summary,
      sections: playerSections,
      progress,
      resumeLessonId: this.pickResumeLesson(lessons, progressMap, enrollment),
    };
  }

  async getLesson(
    userId: string,
    courseSlug: string,
    lessonSlug: string,
  ): Promise<LessonContentDto> {
    const { course, enrollment } = await this.requireAccess(userId, courseSlug);

    const lesson = await this.lessons.findOne({
      where: { courseId: course.id, slug: lessonSlug, status: PublicationStatus.PUBLISHED },
    });
    if (!lesson) throw DomainErrors.notFound('Aula não encontrada.');

    const lessons = await this.publishedLessons(course.id);
    const index = lessons.findIndex((item) => item.id === lesson.id);

    const progress = await this.ensureProgress(enrollment, lesson.id, userId);
    await this.enrollmentService.touch(enrollment.id, lesson.id);

    const materials = await this.materialsFor(lesson.id);
    const quiz = await this.quizService.findForLesson(lesson.id, userId);
    const submission =
      lesson.type === LessonType.PRACTICAL_ACTIVITY
        ? await this.activityService.findForUser(userId, lesson.id)
        : null;

    return {
      id: lesson.id,
      slug: lesson.slug,
      courseId: course.id,
      sectionId: lesson.sectionId,
      title: lesson.title,
      type: lesson.type,
      order: lesson.order,
      estimatedMinutes: lesson.estimatedMinutes,
      completionRule: lesson.completionRule,
      completionThreshold:
        lesson.completionThreshold ??
        (lesson.type === LessonType.RICH_TEXT || lesson.type === LessonType.PDF
          ? requiredSeconds(lesson.completionRule, lesson.estimatedMinutes, null)
          : null),
      // O HTML já chega sanitizado ao front-end.
      contentHtml: lesson.contentMarkdown ? renderMarkdown(lesson.contentMarkdown) : null,
      videoUrl: lesson.videoUrl,
      videoProvider: lesson.videoProvider,
      fileUrl: lesson.fileStorageKey
        ? (await this.storageService.urlFor(lesson.fileStorageKey)).url
        : null,
      activityInstructions: lesson.activityInstructions,
      activityRubric: lesson.activityRubric,
      activitySubmission: submission ? this.activityService.toDto(submission, lesson) : null,
      quiz,
      materials,
      progress: this.toProgressDto(progress),
      previousLessonId: index > 0 ? lessons[index - 1].id : null,
      nextLessonId: index >= 0 && index < lessons.length - 1 ? lessons[index + 1].id : null,
    };
  }

  // ------------------------------------------------------------------
  // Registro de progresso
  // ------------------------------------------------------------------

  /**
   * Salvamento automático do player.
   *
   * O tempo informado é limitado por chamada: um cliente adulterado não
   * consegue "pular" a exigência de permanência enviando valores enormes.
   */
  async heartbeat(
    userId: string,
    lessonId: string,
    dto: ProgressHeartbeatDto,
  ): Promise<LessonProgressDto> {
    const { enrollment } = await this.requireLessonAccess(userId, lessonId);
    const progress = await this.ensureProgress(enrollment, lessonId, userId);

    const increment = Math.min(Math.max(dto.elapsedSeconds, 0), MAX_HEARTBEAT_SECONDS);
    progress.secondsSpent += increment;

    if (dto.positionSeconds !== undefined) progress.lastPositionSeconds = dto.positionSeconds;
    // A proporção assistida só cresce: voltar o vídeo não apaga o avanço.
    if (dto.watchRatio !== undefined) {
      progress.watchRatio = Math.max(progress.watchRatio, Math.min(dto.watchRatio, 1));
    }

    if (progress.status === ProgressStatus.NOT_STARTED) {
      progress.status = ProgressStatus.IN_PROGRESS;
    }

    await this.progress.save(progress);
    await this.enrollmentService.touch(enrollment.id, lessonId);

    return this.toProgressDto(progress);
  }

  /** Conclui a aula somente se a regra do tipo estiver satisfeita. */
  async completeLesson(
    userId: string,
    lessonId: string,
    dto: CompleteLessonDto,
  ): Promise<{ progress: LessonProgressDto; course: CourseProgressDto }> {
    const { lesson, enrollment } = await this.requireLessonAccess(userId, lessonId);
    const progress = await this.ensureProgress(enrollment, lessonId, userId);

    const evidence = await this.collectEvidence(userId, lesson, progress, dto.confirmed ?? false);
    const check = evaluateCompletion(lesson, evidence);

    if (!check.satisfied) throw DomainErrors.lessonRequirementNotMet(check.reason);

    // Concluir de novo não altera a data original.
    if (progress.status !== ProgressStatus.COMPLETED) {
      progress.status = ProgressStatus.COMPLETED;
      progress.completedAt = new Date();
      await this.progress.save(progress);
    }

    const course = await this.evaluateCourseCompletion(userId, enrollment);
    return { progress: this.toProgressDto(progress), course };
  }

  /** Marca a aula como concluída quando a evidência já foi produzida. */
  async completeIfSatisfied(userId: string, lessonId: string): Promise<void> {
    const { lesson, enrollment } = await this.requireLessonAccess(userId, lessonId);
    const progress = await this.ensureProgress(enrollment, lessonId, userId);

    if (progress.status === ProgressStatus.COMPLETED) return;

    const evidence = await this.collectEvidence(userId, lesson, progress, false);
    if (!evaluateCompletion(lesson, evidence).satisfied) return;

    progress.status = ProgressStatus.COMPLETED;
    progress.completedAt = new Date();
    await this.progress.save(progress);

    await this.evaluateCourseCompletion(userId, enrollment);
  }

  // ------------------------------------------------------------------
  // Conclusão do curso
  // ------------------------------------------------------------------

  async computeCourseProgress(userId: string, enrollment: Enrollment): Promise<CourseProgressDto> {
    const course =
      enrollment.course ??
      (await this.courses.findOneOrFail({ where: { id: enrollment.courseId } }));

    const lessons = await this.publishedLessons(course.id);
    const progressMap = await this.progressMap(enrollment.id);

    const completedLessons = lessons.filter(
      (lesson) => progressMap.get(lesson.id)?.status === ProgressStatus.COMPLETED,
    ).length;

    const totalLessons = lessons.length;
    const percentage = totalLessons === 0 ? 0 : Math.round((completedLessons / totalLessons) * 100);

    const criteria = course.completionCriteria;
    const pending: string[] = [];

    if (percentage < criteria.minimumLessonCompletionPercent) {
      const missing = Math.max(
        0,
        Math.ceil((criteria.minimumLessonCompletionPercent / 100) * totalLessons) -
          completedLessons,
      );
      pending.push(missing === 1 ? 'Falta concluir 1 aula.' : `Faltam concluir ${missing} aulas.`);
    }

    if (criteria.requireAllQuizzesPassed) {
      const missingQuizzes = await this.countPendingQuizzes(userId, lessons);
      if (missingQuizzes > 0) {
        pending.push(
          missingQuizzes === 1
            ? 'Falta ser aprovado em 1 questionário.'
            : `Falta ser aprovado em ${missingQuizzes} questionários.`,
        );
      }
    }

    if (criteria.requireAllActivitiesSubmitted) {
      const missingActivities = await this.countPendingActivities(userId, lessons);
      if (missingActivities > 0) {
        pending.push(
          missingActivities === 1
            ? 'Falta enviar 1 atividade prática.'
            : `Faltam enviar ${missingActivities} atividades práticas.`,
        );
      }
    }

    return {
      courseId: course.id,
      completedLessons,
      totalLessons,
      percentage,
      status: enrollment.status,
      completedAt: enrollment.completedAt?.toISOString() ?? null,
      pendingRequirements: pending,
      certificateId: null,
    };
  }

  /**
   * Recalcula a conclusão do curso e, quando os critérios são atendidos,
   * anuncia o evento (que dispara a emissão do certificado).
   */
  private async evaluateCourseCompletion(
    userId: string,
    enrollment: Enrollment,
  ): Promise<CourseProgressDto> {
    const progress = await this.computeCourseProgress(userId, enrollment);

    const satisfied = progress.pendingRequirements.length === 0 && progress.totalLessons > 0;

    if (satisfied && enrollment.status !== EnrollmentStatus.COMPLETED) {
      enrollment.status = EnrollmentStatus.COMPLETED;
      enrollment.completedAt = new Date();
      await this.enrollments.save(enrollment);

      const user = await this.users.findOne({ where: { id: userId } });
      const course = await this.courses.findOne({ where: { id: enrollment.courseId } });
      if (user && course) {
        await this.mailService.courseCompleted(user, course.title);
      }

      await this.events.emit('course.completed', {
        userId,
        courseId: enrollment.courseId,
        enrollmentId: enrollment.id,
      });

      progress.status = EnrollmentStatus.COMPLETED;
      progress.completedAt = enrollment.completedAt.toISOString();
    }

    return progress;
  }

  // ------------------------------------------------------------------
  // Apoio
  // ------------------------------------------------------------------

  /** Verifica permissão e matrícula antes de qualquer leitura de conteúdo. */
  async requireAccess(
    userId: string,
    courseSlug: string,
  ): Promise<{ course: Course; enrollment: Enrollment }> {
    const course = await this.catalogService.findCourseEntityBySlug(courseSlug);

    const hasAccess = await this.entitlementService.hasCourseAccess(userId, course.id);
    if (!hasAccess) throw DomainErrors.noAccessToCourse();

    // A permissão já existe; a matrícula apenas acompanha o estudo.
    const existing = await this.enrollmentService.findByUserAndCourse(userId, course.id);
    const source =
      existing?.source ??
      (course.isFree ? EntitlementSource.FREE_ENROLLMENT : EntitlementSource.PURCHASE);

    const enrollment = await this.enrollmentService.ensureEnrollment(userId, course.id, source);

    if (enrollment.status === EnrollmentStatus.REVOKED) throw DomainErrors.noAccessToCourse();

    enrollment.course = course;
    return { course, enrollment };
  }

  private async requireLessonAccess(
    userId: string,
    lessonId: string,
  ): Promise<{ lesson: Lesson; course: Course; enrollment: Enrollment }> {
    const lesson = await this.lessons.findOne({ where: { id: lessonId } });
    if (!lesson || lesson.status !== PublicationStatus.PUBLISHED) {
      throw DomainErrors.notFound('Aula não encontrada.');
    }

    const course = await this.courses.findOneOrFail({ where: { id: lesson.courseId } });
    const { enrollment } = await this.requireAccess(userId, course.slug);

    return { lesson, course, enrollment };
  }

  private async collectEvidence(
    userId: string,
    lesson: Lesson,
    progress: LessonProgress,
    confirmed: boolean,
  ): Promise<CompletionEvidence> {
    const quizPassed = await this.quizService.hasPassedForLesson(userId, lesson.id);

    const submission =
      lesson.type === LessonType.PRACTICAL_ACTIVITY
        ? await this.submissions.findOne({ where: { userId, lessonId: lesson.id } })
        : null;

    return {
      secondsSpent: progress.secondsSpent,
      watchRatio: progress.watchRatio,
      quizPassed,
      activitySubmitted: lesson.type === LessonType.PRACTICAL_ACTIVITY ? submission !== null : true,
      /*
       * Aprovada conclui; aguardando revisão humana também. Quando a nossa
       * correção automática não consegue decidir, o custo dessa limitação é
       * nosso, não do aluno: ele segue estudando e a equipe revisa depois.
       */
      activityApproved:
        submission !== null &&
        (submission.status === ActivityReviewStatus.APPROVED ||
          submission.status === ActivityReviewStatus.PENDING_HUMAN_REVIEW),
      confirmed,
    };
  }

  private async countPendingQuizzes(userId: string, lessons: Lesson[]): Promise<number> {
    const quizLessons = lessons.filter((lesson) => lesson.type === LessonType.QUIZ);
    if (quizLessons.length === 0) return 0;

    let pending = 0;
    for (const lesson of quizLessons) {
      if (!(await this.quizService.hasPassedForLesson(userId, lesson.id))) pending += 1;
    }
    return pending;
  }

  private async countPendingActivities(userId: string, lessons: Lesson[]): Promise<number> {
    const activityLessons = lessons.filter(
      (lesson) => lesson.type === LessonType.PRACTICAL_ACTIVITY,
    );
    if (activityLessons.length === 0) return 0;

    const submitted = await this.submissions.count({
      where: { userId, lessonId: In(activityLessons.map((lesson) => lesson.id)) },
    });

    return activityLessons.length - submitted;
  }

  private async ensureProgress(
    enrollment: Enrollment,
    lessonId: string,
    userId: string,
  ): Promise<LessonProgress> {
    const existing = await this.progress.findOne({
      where: { enrollmentId: enrollment.id, lessonId },
    });
    if (existing) return existing;

    return this.progress.save(
      this.progress.create({
        enrollmentId: enrollment.id,
        lessonId,
        userId,
        status: ProgressStatus.IN_PROGRESS,
      }),
    );
  }

  private async progressMap(enrollmentId: string): Promise<Map<string, LessonProgress>> {
    const rows = await this.progress.find({ where: { enrollmentId } });
    return new Map(rows.map((row) => [row.lessonId, row]));
  }

  private publishedLessons(courseId: string): Promise<Lesson[]> {
    return this.lessons.find({
      where: { courseId, status: PublicationStatus.PUBLISHED },
      order: { order: 'ASC' },
    });
  }

  private async materialsFor(lessonId: string): Promise<LessonMaterialDto[]> {
    const rows = await this.materials.find({ where: { lessonId }, order: { order: 'ASC' } });

    return Promise.all(
      rows.map(async (material) => {
        // Materiais privados recebem URL assinada e temporária.
        const link = material.storageKey
          ? await this.storageService.urlFor(material.storageKey)
          : { url: material.externalUrl ?? '', expiresAt: null };

        return {
          id: material.id,
          title: material.title,
          description: material.description,
          kind: material.kind,
          url: link.url,
          sizeBytes: material.sizeBytes,
          expiresAt: link.expiresAt?.toISOString() ?? null,
        };
      }),
    );
  }

  /** Retoma a primeira aula não concluída, ou a última acessada. */
  private pickResumeLesson(
    lessons: Lesson[],
    progressMap: Map<string, LessonProgress>,
    enrollment: Enrollment,
  ): string | null {
    if (lessons.length === 0) return null;

    const firstPending = lessons.find(
      (lesson) => progressMap.get(lesson.id)?.status !== ProgressStatus.COMPLETED,
    );
    if (firstPending) return firstPending.id;

    return enrollment.lastAccessedLessonId ?? lessons[lessons.length - 1].id;
  }

  private toProgressDto(progress: LessonProgress): LessonProgressDto {
    return {
      status: progress.status,
      secondsSpent: progress.secondsSpent,
      watchRatio: Number(progress.watchRatio),
      completedAt: progress.completedAt?.toISOString() ?? null,
      lastPositionSeconds: progress.lastPositionSeconds,
    };
  }

  private async summarize(courses: Course[]) {
    // Reaproveita a serialização do catálogo para manter um único formato.
    const summaries = await Promise.all(
      courses.map(async (course) => {
        const outline = await this.catalogService.outlineFor(course.id);
        return {
          id: course.id,
          slug: course.slug,
          title: course.title,
          subtitle: course.subtitle,
          shortDescription: course.shortDescription,
          coverImageUrl: course.coverImageUrl,
          level: course.level,
          workloadHours: course.workloadHours,
          status: course.status,
          isFree: course.isFree,
          order: course.order,
          sectionCount: outline.length,
          lessonCount: outline.reduce((sum, section) => sum + section.lessons.length, 0),
        };
      }),
    );

    return summaries;
  }
}
