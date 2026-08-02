import { Logger } from '@nestjs/common';
import {
  CourseLevel,
  EntitlementScope,
  EntitlementSource,
  LessonCompletionRule,
  LessonType,
  OfferEnvironment,
  OfferKind,
  OfferStatus,
  ProductType,
  PublicationStatus,
  UserRole,
  UserStatus,
} from '@romalearn/contracts';
import * as argon2 from 'argon2';
import { DataSource, In } from 'typeorm';
import { Question, QuestionOption } from '../../assessment/entities/question.entity';
import { Quiz } from '../../assessment/entities/quiz.entity';
import { Course, DEFAULT_COMPLETION_CRITERIA } from '../../catalog/entities/course.entity';
import { Instructor } from '../../catalog/entities/instructor.entity';
import { Lesson, DEFAULT_RULE_BY_TYPE } from '../../catalog/entities/lesson.entity';
import { Program, ProgramCourse } from '../../catalog/entities/program.entity';
import { Section } from '../../catalog/entities/section.entity';
import { Offer } from '../../commerce/entities/offer.entity';
import { Product } from '../../commerce/entities/product.entity';
import { slugify } from '../../common/utils/slug';
import { Entitlement } from '../../learning/entities/entitlement.entity';
import { Enrollment } from '../../learning/entities/enrollment.entity';
import { PlatformSetting, SETTING_KEYS } from '../../platform/entities/platform-setting.entity';
import { User } from '../../users/entities/user.entity';
import {
  SEED_COURSES,
  SEED_INSTRUCTOR,
  SEED_PROGRAM,
  SeedCourse,
  SeedLesson,
} from './catalog-data';
import { renderActivityContent, renderLessonContent } from './content/render-content';

export interface SeedOptions {
  adminEmail: string;
  adminPassword: string;
  adminName: string;
  demoStudent: boolean;
  demoStudentEmail: string;
  demoStudentPassword: string;
  /** Bloqueia dados de demonstração fora do ambiente local. */
  isProduction: boolean;
}

/**
 * Seed idempotente.
 *
 * Pode ser executado quantas vezes for necessário: registros existentes são
 * atualizados pelo `slug`/`email`, nunca duplicados.
 */
export class SeedService {
  private readonly logger = new Logger('Seed');

  constructor(private readonly dataSource: DataSource) {}

  async run(options: SeedOptions): Promise<void> {
    this.logger.log('Iniciando seed…');

    await this.seedSettings();
    const instructor = await this.seedInstructor();
    const courses = await this.seedCourses(instructor.id);
    const program = await this.seedProgram(courses);
    await this.seedCommerce(courses, program);
    const admin = await this.seedAdmin(options);
    await this.seedDemoStudent(options, courses);

    this.logger.log(
      `Seed concluído. Administrador local: ${admin.email} — ` +
        `${courses.size} cursos e 1 trilha disponíveis.`,
    );
  }

  // ------------------------------------------------------------------
  // Configurações institucionais
  // ------------------------------------------------------------------

  private async seedSettings(): Promise<void> {
    const repository = this.dataSource.getRepository(PlatformSetting);

    // Depoimentos permanecem desligados: só devem aparecer se forem reais.
    await this.upsertSetting(
      repository,
      SETTING_KEYS.TESTIMONIALS_ENABLED,
      false,
      'Exibir depoimentos na landing page',
    );
  }

  private async upsertSetting(
    repository: ReturnType<DataSource['getRepository']>,
    key: string,
    value: unknown,
    description: string,
  ): Promise<void> {
    const existing = await repository.findOne({ where: { key } });
    if (existing) return;
    await repository.save(repository.create({ key, value, description }));
  }

  // ------------------------------------------------------------------
  // Catálogo
  // ------------------------------------------------------------------

  private async seedInstructor(): Promise<Instructor> {
    const repository = this.dataSource.getRepository(Instructor);

    const existing = await repository.findOne({ where: { name: SEED_INSTRUCTOR.name } });
    if (existing) return existing;

    return repository.save(
      repository.create({
        name: SEED_INSTRUCTOR.name,
        title: SEED_INSTRUCTOR.title,
        bio: SEED_INSTRUCTOR.bio,
      }),
    );
  }

  private async seedCourses(instructorId: string): Promise<Map<string, Course>> {
    const courseRepository = this.dataSource.getRepository(Course);
    const result = new Map<string, Course>();

    for (const data of SEED_COURSES) {
      let course = await courseRepository.findOne({ where: { slug: data.slug } });

      const payload = {
        slug: data.slug,
        title: data.title,
        subtitle: data.subtitle,
        shortDescription: data.shortDescription,
        fullDescription: data.fullDescription,
        objectives: data.objectives,
        targetAudience: data.targetAudience,
        prerequisites: data.prerequisites,
        workloadHours: data.workloadHours,
        level: data.level ?? CourseLevel.BEGINNER,
        isFree: data.isFree,
        order: data.order,
        instructorId,
        completionCriteria: DEFAULT_COMPLETION_CRITERIA,
        // Sem conteúdo cadastrado, o curso permanece como rascunho.
        status: data.sections.length > 0 ? PublicationStatus.PUBLISHED : PublicationStatus.DRAFT,
        publishedAt: data.sections.length > 0 ? new Date() : null,
      };

      course = course
        ? await courseRepository.save(Object.assign(course, payload))
        : await courseRepository.save(courseRepository.create(payload));

      await this.seedSections(course, data);
      result.set(data.slug, course);
    }

    return result;
  }

  private async seedSections(course: Course, data: SeedCourse): Promise<void> {
    const sectionRepository = this.dataSource.getRepository(Section);
    const lessonRepository = this.dataSource.getRepository(Lesson);

    const slugsDoMaterial = new Set(
      data.sections.flatMap((section) => section.lessons.map((lesson) => slugify(lesson.title))),
    );

    for (const [sectionIndex, sectionData] of data.sections.entries()) {
      let section = await sectionRepository.findOne({
        where: { courseId: course.id, title: sectionData.title },
      });

      const sectionPayload = {
        courseId: course.id,
        title: sectionData.title,
        summary: sectionData.summary,
        order: sectionIndex,
      };

      section = section
        ? await sectionRepository.save(Object.assign(section, sectionPayload))
        : await sectionRepository.save(sectionRepository.create(sectionPayload));

      for (const [lessonIndex, lessonData] of sectionData.lessons.entries()) {
        const slug = slugify(lessonData.title);

        let lesson = await lessonRepository.findOne({
          where: { courseId: course.id, slug },
        });

        const lessonPayload = {
          courseId: course.id,
          sectionId: section.id,
          slug,
          title: lessonData.title,
          type: lessonData.type,
          // Ordena global e continuamente dentro do curso.
          order: sectionIndex * 100 + lessonIndex,
          estimatedMinutes: lessonData.estimatedMinutes,
          // Atividade com rubrica exige aprovação; sem rubrica, basta entregar.
          completionRule:
            lessonData.type === LessonType.PRACTICAL_ACTIVITY && lessonData.rubric
              ? LessonCompletionRule.ACTIVITY_APPROVED
              : DEFAULT_RULE_BY_TYPE[lessonData.type],
          completionThreshold: this.thresholdFor(lessonData),
          contentMarkdown: this.buildContent(lessonData, data),
          activityInstructions: lessonData.activityInstructions ?? null,
          activityRubric: lessonData.rubric ?? null,
          activityAttachmentPolicy: lessonData.attachmentPolicy ?? null,
          activityExample: lessonData.example ?? null,
          // O primeiro capítulo de cada curso fica liberado como amostra.
          isPreview: sectionIndex === 0 && lessonIndex === 0,
          status: PublicationStatus.PUBLISHED,
        };

        lesson = lesson
          ? await lessonRepository.save(Object.assign(lesson, lessonPayload))
          : await lessonRepository.save(lessonRepository.create(lessonPayload));

        if (lessonData.type === LessonType.QUIZ && lessonData.questions) {
          await this.seedQuiz(lesson, lessonData);
        }
      }
    }

    await this.archiveRemovedLessons(course, slugsDoMaterial);
  }

  /**
   * Arquiva aulas que saíram do material oficial.
   *
   * Quando um capítulo é reescrito ou dividido, a aula antiga continuaria no
   * banco e seguiria contando no progresso do curso — um aluno nunca
   * chegaria a 100%. Arquivar em vez de excluir preserva o histórico de quem
   * já estudou aquela aula.
   */
  private async archiveRemovedLessons(course: Course, slugsAtuais: Set<string>): Promise<void> {
    const existentes = await this.dataSource.getRepository(Lesson).find({
      where: { courseId: course.id, status: PublicationStatus.PUBLISHED },
    });

    const removidas = existentes.filter((lesson) => !slugsAtuais.has(lesson.slug));
    if (removidas.length === 0) return;

    await this.dataSource
      .getRepository(Lesson)
      .update(
        { id: In(removidas.map((lesson) => lesson.id)) },
        { status: PublicationStatus.ARCHIVED },
      );

    this.logger.log(
      `Curso "${course.title}": ${removidas.length} aula(s) fora do material foram arquivadas.`,
    );
  }

  /** Metade do tempo estimado como permanência mínima em aulas de leitura. */
  private thresholdFor(lesson: SeedLesson): number | null {
    if (DEFAULT_RULE_BY_TYPE[lesson.type] !== LessonCompletionRule.MINIMUM_TIME) return null;
    return Math.max(30, Math.round(lesson.estimatedMinutes * 60 * 0.5));
  }

  /**
   * Monta o conteúdo da aula a partir dos dados oficiais do e-book.
   *
   * Quando o capítulo já foi transcrito em blocos estruturados, usa esse
   * conteúdo. Caso contrário, cai no texto mínimo — resumo, tópicos e
   * encaminhamento ao e-book — em vez de inventar material didático.
   */
  private buildContent(lesson: SeedLesson, course: SeedCourse): string | null {
    if (lesson.type === LessonType.QUIZ) return null;

    if (lesson.type === LessonType.PRACTICAL_ACTIVITY) {
      if (lesson.rubric && lesson.rubricReference) {
        return renderActivityContent(
          lesson.activityInstructions ?? '',
          lesson.rubric,
          lesson.rubricReference,
          lesson.example,
        );
      }

      return (
        `## Atividade prática\n\n${lesson.activityInstructions ?? ''}\n\n` +
        '> Use sempre dados fictícios ou autorizados. Guarde a entrega em uma pasta de estudos.\n\n' +
        'Quando terminar, descreva no campo abaixo o que você fez e o que ainda ficou com dúvida.'
      );
    }

    if (lesson.content) return renderLessonContent(lesson.content);

    const parts: string[] = [];

    if (lesson.summary) {
      parts.push(`## Neste capítulo\n\n${lesson.summary}`);
    }

    if (lesson.topics?.length) {
      parts.push(
        `## O que você vai encontrar\n\n${lesson.topics.map((topic) => `- ${topic}`).join('\n')}`,
      );
    }

    if (course.ebookTitle) {
      parts.push(
        '## Material oficial\n\n' +
          `O conteúdo completo deste capítulo está no e-book **${course.ebookTitle}**, ` +
          'disponível em "Materiais de apoio" nesta aula. Leia o capítulo com calma e faça a ' +
          'atividade correspondente antes de avançar.',
      );
    }

    return parts.join('\n\n');
  }

  private async seedQuiz(lesson: Lesson, data: SeedLesson): Promise<void> {
    const quizRepository = this.dataSource.getRepository(Quiz);
    const questionRepository = this.dataSource.getRepository(Question);
    const optionRepository = this.dataSource.getRepository(QuestionOption);

    let quiz = await quizRepository.findOne({ where: { lessonId: lesson.id } });

    const payload = {
      lessonId: lesson.id,
      title: data.title,
      description:
        'Responda para conferir sua compreensão. Você pode tentar novamente quantas vezes precisar.',
      passingScore: data.passingScore ?? 70,
      // Tentativas ilimitadas: o objetivo é aprender, não reprovar.
      maxAttempts: null,
      shuffleQuestions: false,
      shuffleOptions: true,
      showFeedback: true,
    };

    quiz = quiz
      ? await quizRepository.save(Object.assign(quiz, payload))
      : await quizRepository.save(quizRepository.create(payload));

    // Regrava as questões para manter o seed idempotente.
    await questionRepository.delete({ quizId: quiz.id });

    for (const [index, questionData] of (data.questions ?? []).entries()) {
      const question = await questionRepository.save(
        questionRepository.create({
          quizId: quiz.id,
          statement: questionData.statement,
          type: questionData.type,
          order: index,
          explanation: questionData.explanation,
        }),
      );

      await optionRepository.save(
        questionData.options.map((option, optionIndex) =>
          optionRepository.create({
            questionId: question.id,
            text: option.text,
            isCorrect: option.isCorrect,
            order: optionIndex,
          }),
        ),
      );
    }
  }

  private async seedProgram(courses: Map<string, Course>): Promise<Program> {
    const programRepository = this.dataSource.getRepository(Program);
    const itemRepository = this.dataSource.getRepository(ProgramCourse);

    let program = await programRepository.findOne({ where: { slug: SEED_PROGRAM.slug } });

    const payload = {
      slug: SEED_PROGRAM.slug,
      title: SEED_PROGRAM.title,
      shortDescription: SEED_PROGRAM.shortDescription,
      fullDescription: SEED_PROGRAM.fullDescription,
      objectives: SEED_PROGRAM.objectives,
      status: PublicationStatus.PUBLISHED,
      order: 0,
    };

    program = program
      ? await programRepository.save(Object.assign(program, payload))
      : await programRepository.save(programRepository.create(payload));

    for (const [index, slug] of SEED_PROGRAM.courseSlugs.entries()) {
      const course = courses.get(slug);
      if (!course) continue;

      const existing = await itemRepository.findOne({
        where: { programId: program.id, courseId: course.id },
      });

      if (existing) {
        existing.order = index;
        await itemRepository.save(existing);
      } else {
        await itemRepository.save(
          itemRepository.create({ programId: program.id, courseId: course.id, order: index }),
        );
      }
    }

    return program;
  }

  // ------------------------------------------------------------------
  // Produtos e ofertas
  // ------------------------------------------------------------------

  private async seedCommerce(courses: Map<string, Course>, program: Program): Promise<void> {
    const productRepository = this.dataSource.getRepository(Product);
    const offerRepository = this.dataSource.getRepository(Offer);

    const freeCourse = [...courses.values()].find((course) => course.isFree);

    // Produto gratuito — porta de entrada.
    if (freeCourse) {
      const freeProduct = await this.upsertProduct(productRepository, {
        slug: 'modulo-gratuito-carreira-digital',
        name: freeCourse.title,
        description: freeCourse.shortDescription,
        type: ProductType.COURSE,
        courseId: freeCourse.id,
        programId: null,
        status: PublicationStatus.PUBLISHED,
      });

      await this.upsertOffer(offerRepository, {
        slug: 'oferta-gratuita-modulo-extra',
        productId: freeProduct.id,
        name: 'Acesso gratuito',
        kind: OfferKind.FREE,
        status: OfferStatus.ACTIVE,
        // Gratuito não depende de preço aprovado: vale em qualquer ambiente.
        environment: OfferEnvironment.PRODUCTION,
        priceCents: 0,
        compareAtPriceCents: null,
        installmentsAllowed: 1,
        accessDurationDays: null,
      });
    }

    // Produto da trilha completa.
    const programProduct = await this.upsertProduct(productRepository, {
      slug: 'trilha-completa',
      name: program.title,
      description: program.shortDescription,
      type: ProductType.PROGRAM,
      courseId: null,
      programId: program.id,
      status: PublicationStatus.PUBLISHED,
    });

    /*
     * Não existe preço comercial aprovado para a trilha, então criamos apenas
     * uma oferta de SANDBOX, explicitamente identificada como teste. Ela é
     * recusada automaticamente quando NODE_ENV=production.
     */
    await this.upsertOffer(offerRepository, {
      slug: 'oferta-sandbox-trilha-completa',
      productId: programProduct.id,
      name: 'Trilha completa — oferta de teste (sandbox)',
      kind: OfferKind.ONE_TIME,
      status: OfferStatus.ACTIVE,
      environment: OfferEnvironment.SANDBOX,
      // Valor fictício, exclusivo para exercitar o fluxo de pagamento.
      priceCents: 19_700,
      compareAtPriceCents: null,
      installmentsAllowed: 12,
      accessDurationDays: null,
    });

    // Produtos por curso já ficam prontos, mas em rascunho e sem oferta:
    // vender curso avulso depende de preço comercial aprovado.
    for (const course of courses.values()) {
      if (course.isFree) continue;

      await this.upsertProduct(productRepository, {
        slug: `curso-${course.slug}`,
        name: course.title,
        description: course.shortDescription,
        type: ProductType.COURSE,
        courseId: course.id,
        programId: null,
        status: PublicationStatus.DRAFT,
      });
    }
  }

  private async upsertProduct(
    repository: ReturnType<DataSource['getRepository']>,
    payload: Record<string, unknown>,
  ): Promise<Product> {
    const existing = await repository.findOne({ where: { slug: payload.slug as string } });
    const entity = existing
      ? Object.assign(existing, payload)
      : repository.create(payload as object);
    return repository.save(entity) as Promise<Product>;
  }

  private async upsertOffer(
    repository: ReturnType<DataSource['getRepository']>,
    payload: Record<string, unknown>,
  ): Promise<Offer> {
    const existing = await repository.findOne({ where: { slug: payload.slug as string } });
    const entity = existing
      ? Object.assign(existing, payload)
      : repository.create(payload as object);
    return repository.save(entity) as Promise<Offer>;
  }

  // ------------------------------------------------------------------
  // Contas
  // ------------------------------------------------------------------

  private async seedAdmin(options: SeedOptions): Promise<User> {
    const repository = this.dataSource.getRepository(User);
    const email = options.adminEmail.toLowerCase();

    const existing = await repository.findOne({ where: { email } });
    if (existing) {
      // Não sobrescreve a senha de um administrador já existente.
      if (!existing.roles.includes(UserRole.ADMIN)) {
        existing.roles = [...existing.roles, UserRole.ADMIN];
        return repository.save(existing);
      }
      return existing;
    }

    if (options.isProduction) {
      this.logger.warn(
        'Nenhum administrador encontrado. Em produção, crie a conta manualmente com uma senha forte.',
      );
    }

    return repository.save(
      repository.create({
        name: options.adminName,
        email,
        passwordHash: await argon2.hash(options.adminPassword, { type: argon2.argon2id }),
        roles: [UserRole.ADMIN],
        status: UserStatus.ACTIVE,
        emailVerifiedAt: new Date(),
        termsAcceptedVersion: 'seed',
        termsAcceptedAt: new Date(),
        privacyAcceptedVersion: 'seed',
        privacyAcceptedAt: new Date(),
      }),
    );
  }

  /** Aluno de demonstração matriculado no módulo gratuito — só fora de produção. */
  private async seedDemoStudent(options: SeedOptions, courses: Map<string, Course>): Promise<void> {
    if (!options.demoStudent || options.isProduction) return;

    const userRepository = this.dataSource.getRepository(User);
    const email = options.demoStudentEmail.toLowerCase();

    let student = await userRepository.findOne({ where: { email } });
    if (!student) {
      student = await userRepository.save(
        userRepository.create({
          name: 'Aluno de Demonstração',
          email,
          passwordHash: await argon2.hash(options.demoStudentPassword, { type: argon2.argon2id }),
          roles: [UserRole.STUDENT],
          status: UserStatus.ACTIVE,
          emailVerifiedAt: new Date(),
          termsAcceptedVersion: 'seed',
          termsAcceptedAt: new Date(),
          privacyAcceptedVersion: 'seed',
          privacyAcceptedAt: new Date(),
        }),
      );
    }

    const freeCourse = [...courses.values()].find((course) => course.isFree);
    if (!freeCourse) return;

    const entitlementRepository = this.dataSource.getRepository(Entitlement);
    const enrollmentRepository = this.dataSource.getRepository(Enrollment);

    const hasEntitlement = await entitlementRepository.findOne({
      where: { userId: student.id, courseId: freeCourse.id },
    });

    if (!hasEntitlement) {
      await entitlementRepository.save(
        entitlementRepository.create({
          userId: student.id,
          scope: EntitlementScope.COURSE,
          courseId: freeCourse.id,
          source: EntitlementSource.SEED,
          grantedAt: new Date(),
        }),
      );
    }

    const hasEnrollment = await enrollmentRepository.findOne({
      where: { userId: student.id, courseId: freeCourse.id },
    });

    if (!hasEnrollment) {
      await enrollmentRepository.save(
        enrollmentRepository.create({
          userId: student.id,
          courseId: freeCourse.id,
          source: EntitlementSource.SEED,
          startedAt: new Date(),
        }),
      );
    }
  }
}
