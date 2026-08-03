import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuditAction, PublicationStatus } from '@romalearn/contracts';
import { In, Repository } from 'typeorm';
import { Course, DEFAULT_COMPLETION_CRITERIA } from '../catalog/entities/course.entity';
import { Lesson, DEFAULT_RULE_BY_TYPE } from '../catalog/entities/lesson.entity';
import { LessonMaterial } from '../catalog/entities/lesson-material.entity';
import { Section } from '../catalog/entities/section.entity';
import { Question, QuestionOption } from '../assessment/entities/question.entity';
import { Quiz } from '../assessment/entities/quiz.entity';
import { DomainErrors } from '../common/errors/domain-error';
import { slugify } from '../common/utils/slug';
import { AuditService } from '../platform/audit.service';
import {
  ReorderDto,
  UpsertCourseDto,
  UpsertLessonDto,
  UpsertMaterialDto,
  UpsertQuizDto,
  UpsertSectionDto,
} from './dto/admin.dto';

export interface Actor {
  id: string;
  email: string;
}

/**
 * Gestão de conteúdo pelo painel.
 *
 * Cobre tudo que é necessário para montar os primeiros cursos sem tocar em
 * código: cursos, partes, aulas, materiais e questionários.
 */
@Injectable()
export class AdminContentService {
  constructor(
    @InjectRepository(Course) private readonly courses: Repository<Course>,
    @InjectRepository(Section) private readonly sections: Repository<Section>,
    @InjectRepository(Lesson) private readonly lessons: Repository<Lesson>,
    @InjectRepository(LessonMaterial) private readonly materials: Repository<LessonMaterial>,
    @InjectRepository(Quiz) private readonly quizzes: Repository<Quiz>,
    @InjectRepository(Question) private readonly questions: Repository<Question>,
    @InjectRepository(QuestionOption) private readonly options: Repository<QuestionOption>,
    private readonly auditService: AuditService,
  ) {}

  // ------------------------------------------------------------------
  // Cursos
  // ------------------------------------------------------------------

  listCourses(): Promise<Course[]> {
    return this.courses.find({ order: { order: 'ASC', title: 'ASC' } });
  }

  async findCourse(id: string): Promise<Course> {
    const course = await this.courses.findOne({ where: { id }, relations: { instructor: true } });
    if (!course) throw DomainErrors.notFound('Curso não encontrado.');
    return course;
  }

  async createCourse(dto: UpsertCourseDto, actor: Actor): Promise<Course> {
    const course = await this.courses.save(
      this.courses.create({
        slug: await this.uniqueCourseSlug(dto.slug ?? dto.title),
        title: dto.title,
        subtitle: dto.subtitle ?? null,
        shortDescription: dto.shortDescription,
        fullDescription: dto.fullDescription ?? '',
        coverImageUrl: dto.coverImageUrl ?? null,
        objectives: dto.objectives ?? [],
        targetAudience: dto.targetAudience ?? [],
        prerequisites: dto.prerequisites ?? [],
        workloadHours: dto.workloadHours ?? 0,
        level: dto.level,
        isFree: dto.isFree ?? false,
        order: dto.order ?? 0,
        instructorId: dto.instructorId ?? null,
        completionCriteria: dto.completionCriteria ?? DEFAULT_COMPLETION_CRITERIA,
        // Um curso nasce como rascunho e só aparece no site ao ser publicado.
        status: PublicationStatus.DRAFT,
      }),
    );

    await this.audit(
      actor,
      AuditAction.CREATE,
      'Course',
      course.id,
      `Curso "${course.title}" criado.`,
    );
    return course;
  }

  async updateCourse(id: string, dto: UpsertCourseDto, actor: Actor): Promise<Course> {
    const course = await this.findCourse(id);

    if (dto.slug && dto.slug !== course.slug) {
      course.slug = await this.uniqueCourseSlug(dto.slug, id);
    }

    Object.assign(course, {
      title: dto.title ?? course.title,
      subtitle: dto.subtitle ?? course.subtitle,
      shortDescription: dto.shortDescription ?? course.shortDescription,
      fullDescription: dto.fullDescription ?? course.fullDescription,
      coverImageUrl: dto.coverImageUrl ?? course.coverImageUrl,
      objectives: dto.objectives ?? course.objectives,
      targetAudience: dto.targetAudience ?? course.targetAudience,
      prerequisites: dto.prerequisites ?? course.prerequisites,
      workloadHours: dto.workloadHours ?? course.workloadHours,
      level: dto.level ?? course.level,
      isFree: dto.isFree ?? course.isFree,
      order: dto.order ?? course.order,
      instructorId: dto.instructorId ?? course.instructorId,
      completionCriteria: dto.completionCriteria ?? course.completionCriteria,
    });

    const saved = await this.courses.save(course);
    await this.audit(actor, AuditAction.UPDATE, 'Course', id, `Curso "${saved.title}" atualizado.`);
    return saved;
  }

  /** Publicar exige conteúdo: um curso vazio nunca vai ao ar. */
  async setCourseStatus(id: string, status: PublicationStatus, actor: Actor): Promise<Course> {
    const course = await this.findCourse(id);

    if (status === PublicationStatus.PUBLISHED) {
      const lessonCount = await this.lessons.count({
        where: { courseId: id, status: PublicationStatus.PUBLISHED },
      });
      if (lessonCount === 0) {
        throw DomainErrors.forbidden(
          'Adicione pelo menos uma aula publicada antes de publicar o curso.',
        );
      }
      course.publishedAt = course.publishedAt ?? new Date();
    }

    course.status = status;
    const saved = await this.courses.save(course);

    await this.audit(
      actor,
      status === PublicationStatus.PUBLISHED ? AuditAction.PUBLISH : AuditAction.UNPUBLISH,
      'Course',
      id,
      `Curso "${course.title}" agora está ${status}.`,
      { status },
    );

    return saved;
  }

  // ------------------------------------------------------------------
  // Partes e aulas
  // ------------------------------------------------------------------

  listSections(courseId: string): Promise<Section[]> {
    return this.sections.find({ where: { courseId }, order: { order: 'ASC' } });
  }

  async createSection(dto: UpsertSectionDto, actor: Actor): Promise<Section> {
    await this.findCourse(dto.courseId);

    const order = dto.order ?? (await this.sections.count({ where: { courseId: dto.courseId } }));
    const section = await this.sections.save(
      this.sections.create({
        courseId: dto.courseId,
        title: dto.title,
        summary: dto.summary ?? null,
        order,
      }),
    );

    await this.audit(
      actor,
      AuditAction.CREATE,
      'Section',
      section.id,
      `Parte "${section.title}" criada.`,
    );
    return section;
  }

  async updateSection(id: string, dto: UpsertSectionDto, actor: Actor): Promise<Section> {
    const section = await this.sections.findOne({ where: { id } });
    if (!section) throw DomainErrors.notFound('Parte não encontrada.');

    section.title = dto.title ?? section.title;
    section.summary = dto.summary ?? section.summary;
    if (dto.order !== undefined) section.order = dto.order;

    const saved = await this.sections.save(section);
    await this.audit(
      actor,
      AuditAction.UPDATE,
      'Section',
      id,
      `Parte "${saved.title}" atualizada.`,
    );
    return saved;
  }

  async deleteSection(id: string, actor: Actor): Promise<void> {
    const section = await this.sections.findOne({ where: { id } });
    if (!section) throw DomainErrors.notFound('Parte não encontrada.');

    await this.sections.delete({ id });
    await this.audit(
      actor,
      AuditAction.DELETE,
      'Section',
      id,
      `Parte "${section.title}" removida.`,
    );
  }

  listLessons(courseId: string): Promise<Lesson[]> {
    return this.lessons.find({ where: { courseId }, order: { order: 'ASC' } });
  }

  async createLesson(dto: UpsertLessonDto, actor: Actor): Promise<Lesson> {
    const section = await this.sections.findOne({ where: { id: dto.sectionId } });
    if (!section) throw DomainErrors.notFound('Parte não encontrada.');

    const order = dto.order ?? (await this.lessons.count({ where: { sectionId: dto.sectionId } }));

    const lesson = await this.lessons.save(
      this.lessons.create({
        courseId: section.courseId,
        sectionId: section.id,
        slug: await this.uniqueLessonSlug(section.courseId, dto.slug ?? dto.title),
        title: dto.title,
        type: dto.type,
        order,
        estimatedMinutes: dto.estimatedMinutes ?? 10,
        // Sem regra explícita, aplica o padrão do tipo de aula.
        completionRule: dto.completionRule ?? DEFAULT_RULE_BY_TYPE[dto.type],
        completionThreshold: dto.completionThreshold ?? null,
        contentMarkdown: dto.contentMarkdown ?? null,
        videoUrl: dto.videoUrl ?? null,
        videoProvider: dto.videoProvider ?? null,
        fileStorageKey: dto.fileStorageKey ?? null,
        activityInstructions: dto.activityInstructions ?? null,
        isPreview: dto.isPreview ?? false,
        status: dto.status ?? PublicationStatus.PUBLISHED,
      }),
    );

    await this.audit(
      actor,
      AuditAction.CREATE,
      'Lesson',
      lesson.id,
      `Aula "${lesson.title}" criada.`,
    );
    return lesson;
  }

  async updateLesson(id: string, dto: UpsertLessonDto, actor: Actor): Promise<Lesson> {
    const lesson = await this.lessons.findOne({ where: { id } });
    if (!lesson) throw DomainErrors.notFound('Aula não encontrada.');

    if (dto.slug && dto.slug !== lesson.slug) {
      lesson.slug = await this.uniqueLessonSlug(lesson.courseId, dto.slug, id);
    }

    Object.assign(lesson, {
      sectionId: dto.sectionId ?? lesson.sectionId,
      title: dto.title ?? lesson.title,
      type: dto.type ?? lesson.type,
      estimatedMinutes: dto.estimatedMinutes ?? lesson.estimatedMinutes,
      completionRule: dto.completionRule ?? lesson.completionRule,
      completionThreshold: dto.completionThreshold ?? lesson.completionThreshold,
      contentMarkdown: dto.contentMarkdown ?? lesson.contentMarkdown,
      videoUrl: dto.videoUrl ?? lesson.videoUrl,
      videoProvider: dto.videoProvider ?? lesson.videoProvider,
      fileStorageKey: dto.fileStorageKey ?? lesson.fileStorageKey,
      activityInstructions: dto.activityInstructions ?? lesson.activityInstructions,
      isPreview: dto.isPreview ?? lesson.isPreview,
      status: dto.status ?? lesson.status,
    });
    if (dto.order !== undefined) lesson.order = dto.order;

    const saved = await this.lessons.save(lesson);
    await this.audit(actor, AuditAction.UPDATE, 'Lesson', id, `Aula "${saved.title}" atualizada.`);
    return saved;
  }

  async deleteLesson(id: string, actor: Actor): Promise<void> {
    const lesson = await this.lessons.findOne({ where: { id } });
    if (!lesson) throw DomainErrors.notFound('Aula não encontrada.');

    await this.lessons.delete({ id });
    await this.audit(actor, AuditAction.DELETE, 'Lesson', id, `Aula "${lesson.title}" removida.`);
  }

  /** Reordenação em lote de partes ou aulas (arrastar e soltar no painel). */
  async reorder(kind: 'sections' | 'lessons', dto: ReorderDto, actor: Actor): Promise<void> {
    const repository = kind === 'sections' ? this.sections : this.lessons;

    for (const item of dto.items) {
      await repository.update({ id: item.id }, { order: item.order });
    }

    await this.audit(
      actor,
      AuditAction.UPDATE,
      kind === 'sections' ? 'Section' : 'Lesson',
      null,
      `Ordenação de ${dto.items.length} itens atualizada.`,
    );
  }

  // ------------------------------------------------------------------
  // Materiais
  // ------------------------------------------------------------------

  listMaterials(lessonId: string): Promise<LessonMaterial[]> {
    return this.materials.find({ where: { lessonId }, order: { order: 'ASC' } });
  }

  async createMaterial(dto: UpsertMaterialDto, actor: Actor): Promise<LessonMaterial> {
    if (!dto.storageKey && !dto.externalUrl) {
      throw DomainErrors.uploadRejected('Informe um arquivo enviado ou um link externo.');
    }

    const material = await this.materials.save(
      this.materials.create({
        lessonId: dto.lessonId,
        title: dto.title,
        description: dto.description ?? null,
        kind: dto.kind,
        storageKey: dto.storageKey ?? null,
        externalUrl: dto.externalUrl ?? null,
        order: dto.order ?? (await this.materials.count({ where: { lessonId: dto.lessonId } })),
      }),
    );

    await this.audit(
      actor,
      AuditAction.CREATE,
      'LessonMaterial',
      material.id,
      `Material "${material.title}" adicionado.`,
    );
    return material;
  }

  async deleteMaterial(id: string, actor: Actor): Promise<void> {
    await this.materials.delete({ id });
    await this.audit(actor, AuditAction.DELETE, 'LessonMaterial', id, 'Material removido.');
  }

  // ------------------------------------------------------------------
  // Questionários
  // ------------------------------------------------------------------

  async getQuiz(lessonId: string): Promise<Quiz | null> {
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

    quiz.questions = questions.map((question) => ({
      ...question,
      options: options.filter((option) => option.questionId === question.id),
    })) as Question[];

    return quiz;
  }

  /**
   * Cria ou substitui integralmente o questionário de uma aula.
   *
   * As tentativas já registradas continuam válidas: guardam a nota e as
   * respostas do momento em que foram enviadas.
   */
  async upsertQuiz(dto: UpsertQuizDto, actor: Actor): Promise<Quiz> {
    const lesson = await this.lessons.findOne({ where: { id: dto.lessonId } });
    if (!lesson) throw DomainErrors.notFound('Aula não encontrada.');

    for (const question of dto.questions) {
      if (!question.options.some((option) => option.isCorrect)) {
        throw DomainErrors.forbidden(
          `A questão "${question.statement.slice(0, 40)}…" precisa de pelo menos uma alternativa correta.`,
        );
      }
    }

    const existing = await this.quizzes.findOne({ where: { lessonId: dto.lessonId } });

    const quiz = await this.quizzes.save(
      this.quizzes.create({
        ...(existing ? { id: existing.id } : {}),
        lessonId: dto.lessonId,
        title: dto.title,
        description: dto.description ?? null,
        passingScore: dto.passingScore,
        maxAttempts: dto.maxAttempts ?? null,
        shuffleQuestions: dto.shuffleQuestions ?? false,
        shuffleOptions: dto.shuffleOptions ?? false,
        showFeedback: dto.showFeedback ?? true,
      }),
    );

    // Substitui as questões: mais simples e previsível que sincronizar.
    await this.questions.delete({ quizId: quiz.id });

    for (const [index, questionDto] of dto.questions.entries()) {
      const question = await this.questions.save(
        this.questions.create({
          quizId: quiz.id,
          statement: questionDto.statement,
          type: questionDto.type,
          order: index,
          explanation: questionDto.explanation ?? null,
        }),
      );

      await this.options.save(
        questionDto.options.map((option, optionIndex) =>
          this.options.create({
            questionId: question.id,
            text: option.text,
            isCorrect: option.isCorrect,
            order: optionIndex,
          }),
        ),
      );
    }

    await this.audit(
      actor,
      existing ? AuditAction.UPDATE : AuditAction.CREATE,
      'Quiz',
      quiz.id,
      `Questionário "${quiz.title}" salvo com ${dto.questions.length} questões.`,
    );

    return quiz;
  }

  // ------------------------------------------------------------------
  // Apoio
  // ------------------------------------------------------------------

  private async uniqueCourseSlug(source: string, ignoreId?: string): Promise<string> {
    const base = slugify(source);
    let candidate = base;
    let counter = 2;

    for (;;) {
      const existing = await this.courses.findOne({ where: { slug: candidate } });
      if (!existing || existing.id === ignoreId) return candidate;
      candidate = `${base}-${counter}`;
      counter += 1;
    }
  }

  private async uniqueLessonSlug(
    courseId: string,
    source: string,
    ignoreId?: string,
  ): Promise<string> {
    const base = slugify(source);
    let candidate = base;
    let counter = 2;

    for (;;) {
      const existing = await this.lessons.findOne({ where: { courseId, slug: candidate } });
      if (!existing || existing.id === ignoreId) return candidate;
      candidate = `${base}-${counter}`;
      counter += 1;
    }
  }

  private audit(
    actor: Actor,
    action: AuditAction,
    entityType: string,
    entityId: string | null,
    summary: string,
    metadata?: Record<string, unknown>,
  ) {
    return this.auditService.record({
      actorId: actor.id,
      actorEmail: actor.email,
      action,
      entityType,
      entityId,
      summary,
      metadata: metadata ?? null,
    });
  }
}
