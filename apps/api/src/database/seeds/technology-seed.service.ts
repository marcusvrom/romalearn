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
import { Course, DEFAULT_COMPLETION_CRITERIA } from '../../catalog/entities/course.entity';
import { Instructor } from '../../catalog/entities/instructor.entity';
import { Lesson, DEFAULT_RULE_BY_TYPE } from '../../catalog/entities/lesson.entity';
import { Section } from '../../catalog/entities/section.entity';
import { Product } from '../../commerce/entities/product.entity';
import { Offer } from '../../commerce/entities/offer.entity';
import { slugify } from '../../common/utils/slug';
import {
  TECHNOLOGY_COURSES,
  TechnologySeedCourse,
  TechnologySeedLesson,
} from './technology-catalog-data';

/**
 * Seed separado para a trilha de tecnologia.
 *
 * Mantém a expansão do catálogo desacoplada dos cursos administrativos e
 * permite evoluir conteúdo, ofertas e ordem sem duplicar registros.
 */
export class TechnologySeedService {
  private readonly logger = new Logger('TechnologySeed');

  constructor(private readonly dataSource: DataSource) {}

  async run(): Promise<void> {
    this.logger.log('Iniciando catálogo de tecnologia…');
    const instructor = await this.resolveInstructor();

    for (const [index, data] of TECHNOLOGY_COURSES.entries()) {
      this.logger.log(`Tecnologia ${index + 1}/${TECHNOLOGY_COURSES.length}: ${data.title}…`);
      const course = await this.upsertCourse(instructor.id, data);
      await this.upsertSections(course, data);
      await this.upsertCommerce(course, data);
    }

    this.logger.log(`${TECHNOLOGY_COURSES.length} cursos de tecnologia disponíveis.`);
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

    for (const [sectionIndex, sectionData] of data.sections.entries()) {
      let section = await sectionRepository.findOne({
        where: { courseId: course.id, title: sectionData.title },
      });

      section = section
        ? await sectionRepository.save(
            Object.assign(section, {
              summary: sectionData.summary,
              order: sectionIndex,
            }),
          )
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

        const payload = {
          courseId: course.id,
          sectionId: section.id,
          slug,
          title: lessonData.title,
          type: lessonData.type,
          order: sectionIndex * 100 + lessonIndex,
          estimatedMinutes: lessonData.estimatedMinutes,
          completionRule: DEFAULT_RULE_BY_TYPE[lessonData.type],
          completionThreshold: this.thresholdFor(lessonData),
          contentMarkdown: this.buildContent(lessonData),
          activityInstructions: lessonData.activityInstructions ?? null,
          activityRubric: null,
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

  private buildContent(lesson: TechnologySeedLesson): string | null {
    if (lesson.type === LessonType.PRACTICAL_ACTIVITY) {
      return (
        `## Atividade prática\n\n${lesson.activityInstructions ?? ''}\n\n` +
        '> Trabalhe em etapas pequenas, registre suas decisões e nunca inclua credenciais ou dados sensíveis.'
      );
    }

    const parts: string[] = [];
    if (lesson.summary) parts.push(`## Neste capítulo\n\n${lesson.summary}`);
    if (lesson.topics?.length) {
      parts.push(`## O que você vai aprender\n\n${lesson.topics.map((topic) => `- ${topic}`).join('\n')}`);
    }
    parts.push(
      '## Prática recomendada\n\n' +
        'Abra seu ambiente de estudos, reproduza os exemplos com calma e registre no GitHub o que aprendeu. ' +
        'Não avance apenas por leitura: altere os exemplos e observe o resultado.',
    );
    return parts.join('\n\n');
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

    offer = offer
      ? await offerRepository.save(Object.assign(offer, offerPayload))
      : await offerRepository.save(offerRepository.create(offerPayload));
  }
}
