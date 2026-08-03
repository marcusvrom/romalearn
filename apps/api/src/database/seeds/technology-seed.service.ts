import { Logger } from '@nestjs/common';
import {
  CourseLevel,
  LessonCompletionRule,
  LessonType,
  OfferEnvironment,
  OfferKind,
  OfferStatus,
  ProductType,
  PublicationStatus,
} from '@romalearn/contracts';
import { DataSource } from 'typeorm';
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
import {
  TECHNOLOGY_COURSES,
  TechnologySeedCourse,
  TechnologySeedLesson,
} from './technology-catalog-data';
import {
  buildDidacticContent,
  buildProjectRubric,
  refinementFor,
  TechnologyQuizQuestion,
} from './technology-content-refinements';

const TECHNOLOGY_PROGRAM = {
  slug: 'trilha-desenvolvimento-de-software',
  title: 'Trilha de Desenvolvimento de Software',
  shortDescription:
    'Uma jornada prática dos fundamentos de lógica ao desenvolvimento web e backend com projetos de portfólio.',
  fullDescription:
    'Comece aprendendo a resolver problemas com lógica de programação, organize sua evolução com Git e GitHub, ' +
    'construa interfaces com HTML, CSS e JavaScript e escolha uma especialização inicial em Python ou Java. ' +
    'Cada etapa produz uma evidência prática que pode ser apresentada no portfólio.',
  objectives: [
    'Construir fundamentos sólidos antes de escolher uma linguagem.',
    'Versionar e publicar projetos com clareza profissional.',
    'Desenvolver experiências web responsivas e acessíveis.',
    'Criar aplicações introdutórias em Python ou Java.',
    'Concluir a trilha com projetos demonstráveis no GitHub.',
  ],
};

/** Seed idempotente da trilha técnica e de sua oferta de homologação. */
export class TechnologySeedService {
  private readonly logger = new Logger('TechnologySeed');

  constructor(private readonly dataSource: DataSource) {}

  async run(): Promise<void> {
    this.logger.log('Iniciando catálogo de tecnologia…');
    const instructor = await this.resolveInstructor();
    const courses: Course[] = [];

    for (const [index, data] of TECHNOLOGY_COURSES.entries()) {
      this.logger.log(`Tecnologia ${index + 1}/${TECHNOLOGY_COURSES.length}: ${data.title}…`);
      const course = await this.upsertCourse(instructor.id, data);
      await this.upsertSections(course, data);
      await this.upsertFinalAssessment(course, data);
      await this.upsertCommerce(course, data);
      courses.push(course);
    }

    await this.upsertTechnologyProgram(courses);
    this.logger.log(`${TECHNOLOGY_COURSES.length} cursos e 1 trilha de tecnologia disponíveis.`);
  }

  private async resolveInstructor(): Promise<Instructor> {
    const repository = this.dataSource.getRepository(Instructor);
    const existing = await repository.findOne({ where: { name: 'Equipe RomaLearn' } });
    if (existing) return existing;

    return repository.save(
      repository.create({
        name: 'Equipe RomaLearn',
        title: 'Engenharia de software e produção didática',
        bio: 'Conteúdo criado com foco em fundamentos, prática guiada, projetos e evolução profissional.',
      }),
    );
  }

  private async upsertCourse(instructorId: string, data: TechnologySeedCourse): Promise<Course> {
    const repository = this.dataSource.getRepository(Course);
    let course = await repository.findOne({ where: { slug: data.slug } });

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
      status: PublicationStatus.PUBLISHED,
      publishedAt: course?.publishedAt ?? new Date(),
    };

    course = course
      ? await repository.save(Object.assign(course, payload))
      : await repository.save(repository.create(payload));

    return course;
  }

  private async upsertSections(course: Course, data: TechnologySeedCourse): Promise<void> {
    const sectionRepository = this.dataSource.getRepository(Section);
    const lessonRepository = this.dataSource.getRepository(Lesson);
    const refinement = refinementFor(data.slug);

    for (const [sectionIndex, sectionData] of data.sections.entries()) {
      let section = await sectionRepository.findOne({
        where: { courseId: course.id, title: sectionData.title },
      });

      section = section
        ? await sectionRepository.save(Object.assign(section, { summary: sectionData.summary, order: sectionIndex }))
        : await sectionRepository.save(
            sectionRepository.create({
              courseId: course.id,
              title: sectionData.title,
              summary: sectionData.summary,
              order: sectionIndex,
            }),
          );

      for (const [lessonIndex, lessonData] of sectionData.lessons.entries()) {
        const slug = slugify(lessonData.title);
        let lesson = await lessonRepository.findOne({ where: { courseId: course.id, slug } });
        const isFinalProject = lessonData.type === LessonType.PRACTICAL_ACTIVITY &&
          lessonData.title.toLowerCase().includes('projeto final');

        const payload = {
          courseId: course.id,
          sectionId: section.id,
          slug,
          title: lessonData.title,
          type: lessonData.type,
          order: sectionIndex * 100 + lessonIndex,
          estimatedMinutes: lessonData.estimatedMinutes,
          completionRule: isFinalProject
            ? LessonCompletionRule.ACTIVITY_APPROVED
            : DEFAULT_RULE_BY_TYPE[lessonData.type],
          completionThreshold: this.thresholdFor(lessonData),
          contentMarkdown: this.buildContent(lessonData, data),
          activityInstructions: lessonData.activityInstructions ?? null,
          activityRubric:
            isFinalProject && refinement ? buildProjectRubric(refinement.projectCriteria) : null,
          activityAttachmentPolicy: null,
          activityExample: null,
          isPreview: sectionIndex === 0 && lessonIndex === 0,
          status: PublicationStatus.PUBLISHED,
        };

        lesson = lesson
          ? await lessonRepository.save(Object.assign(lesson, payload))
          : await lessonRepository.save(lessonRepository.create(payload));
      }
    }
  }

  private thresholdFor(lesson: TechnologySeedLesson): number | null {
    if (DEFAULT_RULE_BY_TYPE[lesson.type] !== LessonCompletionRule.MINIMUM_TIME) return null;
    return Math.max(30, Math.round(lesson.estimatedMinutes * 60 * 0.5));
  }

  private buildContent(lesson: TechnologySeedLesson, course: TechnologySeedCourse): string | null {
    if (lesson.type === LessonType.PRACTICAL_ACTIVITY) {
      const refinement = refinementFor(course.slug);
      const isFinalProject = lesson.title.toLowerCase().includes('projeto final');
      const criteria = isFinalProject && refinement
        ? `\n\n## Critérios de entrega\n\n${refinement.projectCriteria.map((item) => `- ${item}`).join('\n')}`
        : '';

      return (
        `## Atividade prática\n\n${lesson.activityInstructions ?? ''}${criteria}\n\n` +
        '## Como entregar\n\nInclua o link do repositório, explique como executar, descreva decisões e registre ' +
        'ao menos uma dificuldade encontrada. Use dados fictícios e nunca envie credenciais.\n\n' +
        '## Antes de enviar\n\n- [ ] Executei o projeto do início ao fim.\n- [ ] Testei um cenário comum e um cenário de erro.\n' +
        '- [ ] Atualizei o README.\n- [ ] Revisei arquivos sensíveis e o histórico do Git.'
      );
    }

    return buildDidacticContent({
      courseTitle: course.title,
      lessonTitle: lesson.title,
      summary: lesson.summary,
      topics: lesson.topics,
    });
  }

  private async upsertFinalAssessment(course: Course, data: TechnologySeedCourse): Promise<void> {
    const refinement = refinementFor(data.slug);
    if (!refinement?.quiz.length) return;

    const sectionRepository = this.dataSource.getRepository(Section);
    const lessonRepository = this.dataSource.getRepository(Lesson);

    const sectionTitle = 'Avaliação e próximos passos';
    let section = await sectionRepository.findOne({ where: { courseId: course.id, title: sectionTitle } });
    const sectionOrder = data.sections.length;
    section = section
      ? await sectionRepository.save(Object.assign(section, {
          summary: 'Revise os fundamentos, valide a compreensão e planeje a continuidade da trilha.',
          order: sectionOrder,
        }))
      : await sectionRepository.save(sectionRepository.create({
          courseId: course.id,
          title: sectionTitle,
          summary: 'Revise os fundamentos, valide a compreensão e planeje a continuidade da trilha.',
          order: sectionOrder,
        }));

    const title = 'Questionário de conclusão';
    const slug = slugify(title);
    let lesson = await lessonRepository.findOne({ where: { courseId: course.id, slug } });
    const payload = {
      courseId: course.id,
      sectionId: section.id,
      slug,
      title,
      type: LessonType.QUIZ,
      order: sectionOrder * 100,
      estimatedMinutes: 10,
      completionRule: LessonCompletionRule.QUIZ_PASSED,
      completionThreshold: 70,
      contentMarkdown: null,
      activityInstructions: null,
      activityRubric: null,
      activityAttachmentPolicy: null,
      activityExample: null,
      isPreview: false,
      status: PublicationStatus.PUBLISHED,
    };

    lesson = lesson
      ? await lessonRepository.save(Object.assign(lesson, payload))
      : await lessonRepository.save(lessonRepository.create(payload));

    await this.upsertQuiz(lesson, refinement.quiz);
  }

  private async upsertQuiz(lesson: Lesson, questions: TechnologyQuizQuestion[]): Promise<void> {
    const quizRepository = this.dataSource.getRepository(Quiz);
    const questionRepository = this.dataSource.getRepository(Question);
    const optionRepository = this.dataSource.getRepository(QuestionOption);

    let quiz = await quizRepository.findOne({ where: { lessonId: lesson.id } });
    const payload = {
      lessonId: lesson.id,
      title: lesson.title,
      description: 'Responda para revisar os fundamentos. Você pode tentar novamente quantas vezes precisar.',
      passingScore: 70,
      maxAttempts: null,
      shuffleQuestions: false,
      shuffleOptions: true,
      showFeedback: true,
    };
    quiz = quiz
      ? await quizRepository.save(Object.assign(quiz, payload))
      : await quizRepository.save(quizRepository.create(payload));

    await questionRepository.delete({ quizId: quiz.id });
    for (const [index, questionData] of questions.entries()) {
      const question = await questionRepository.save(questionRepository.create({
        quizId: quiz.id,
        statement: questionData.statement,
        type: questionData.type,
        order: index,
        explanation: questionData.explanation,
      }));
      await optionRepository.save(questionData.options.map((option, optionIndex) =>
        optionRepository.create({
          questionId: question.id,
          text: option.text,
          isCorrect: option.isCorrect,
          order: optionIndex,
        }),
      ));
    }
  }

  private async upsertTechnologyProgram(courses: Course[]): Promise<void> {
    const programRepository = this.dataSource.getRepository(Program);
    const itemRepository = this.dataSource.getRepository(ProgramCourse);
    const productRepository = this.dataSource.getRepository(Product);
    const offerRepository = this.dataSource.getRepository(Offer);

    let program = await programRepository.findOne({ where: { slug: TECHNOLOGY_PROGRAM.slug } });
    const payload = {
      ...TECHNOLOGY_PROGRAM,
      status: PublicationStatus.PUBLISHED,
      order: 1,
    };
    program = program
      ? await programRepository.save(Object.assign(program, payload))
      : await programRepository.save(programRepository.create(payload));

    for (const [index, course] of courses.entries()) {
      const existing = await itemRepository.findOne({ where: { programId: program.id, courseId: course.id } });
      if (existing) {
        existing.order = index;
        await itemRepository.save(existing);
      } else {
        await itemRepository.save(itemRepository.create({ programId: program.id, courseId: course.id, order: index }));
      }
    }

    const productSlug = 'trilha-desenvolvimento-de-software';
    let product = await productRepository.findOne({ where: { slug: productSlug } });
    const productPayload = {
      slug: productSlug,
      name: TECHNOLOGY_PROGRAM.title,
      description: TECHNOLOGY_PROGRAM.shortDescription,
      type: ProductType.PROGRAM,
      status: PublicationStatus.PUBLISHED,
      courseId: null,
      programId: program.id,
    };
    product = product
      ? await productRepository.save(Object.assign(product, productPayload))
      : await productRepository.save(productRepository.create(productPayload));

    const offerSlug = 'beta-trilha-desenvolvimento-de-software';
    let offer = await offerRepository.findOne({ where: { slug: offerSlug } });
    const offerPayload = {
      slug: offerSlug,
      productId: product.id,
      name: 'Oferta Beta — Trilha Completa',
      kind: OfferKind.ONE_TIME,
      status: OfferStatus.ACTIVE,
      environment: OfferEnvironment.SANDBOX,
      priceCents: 29900,
      currency: 'BRL',
      compareAtPriceCents: 40500,
      installmentsAllowed: 10,
      accessDurationDays: null,
      availableFrom: null,
      availableUntil: null,
    };
    offer
      ? await offerRepository.save(Object.assign(offer, offerPayload))
      : await offerRepository.save(offerRepository.create(offerPayload));
  }

  private async upsertCommerce(course: Course, data: TechnologySeedCourse): Promise<void> {
    const productRepository = this.dataSource.getRepository(Product);
    const offerRepository = this.dataSource.getRepository(Offer);
    const productSlug = `curso-${data.slug}`;

    let product = await productRepository.findOne({ where: { slug: productSlug } });
    const productPayload = {
      slug: productSlug,
      name: data.title,
      description: data.shortDescription,
      type: ProductType.COURSE,
      status: PublicationStatus.PUBLISHED,
      courseId: course.id,
      programId: null,
    };

    product = product
      ? await productRepository.save(Object.assign(product, productPayload))
      : await productRepository.save(productRepository.create(productPayload));

    const offerSlug = data.isFree ? `gratuito-${data.slug}` : `beta-${data.slug}`;
    let offer = await offerRepository.findOne({ where: { slug: offerSlug } });
    const offerPayload = {
      slug: offerSlug,
      productId: product.id,
      name: data.isFree ? 'Acesso gratuito' : 'Oferta Beta',
      kind: data.isFree ? OfferKind.FREE : OfferKind.ONE_TIME,
      status: OfferStatus.ACTIVE,
      environment: OfferEnvironment.SANDBOX,
      priceCents: data.priceCents,
      currency: 'BRL',
      compareAtPriceCents: null,
      installmentsAllowed: data.isFree ? 1 : 6,
      accessDurationDays: null,
      availableFrom: null,
      availableUntil: null,
    };

    offer
      ? await offerRepository.save(Object.assign(offer, offerPayload))
      : await offerRepository.save(offerRepository.create(offerPayload));
  }
}
