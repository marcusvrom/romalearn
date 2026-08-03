import { Logger } from '@nestjs/common';
import { LessonCompletionRule, OfferKind, OfferStatus } from '@romalearn/contracts';
import { DataSource, In } from 'typeorm';
import { Course } from '../../catalog/entities/course.entity';
import { Lesson } from '../../catalog/entities/lesson.entity';
import { Offer } from '../../commerce/entities/offer.entity';
import { Product } from '../../commerce/entities/product.entity';
import { buildProjectRubric, refinementFor } from './technology-content-refinements';

interface CommercialPolicy {
  courseSlug: string;
  isFree: boolean;
  priceCents: number;
}

const COMMERCIAL_POLICIES: CommercialPolicy[] = [
  { courseSlug: 'logica-de-programacao-e-algoritmos', isFree: false, priceCents: 5900 },
  { courseSlug: 'git-e-github-na-pratica', isFree: true, priceCents: 0 },
];

/** Reaplica invariantes comerciais e editoriais após o seed técnico. */
export class TechnologyCatalogStabilizationService {
  private readonly logger = new Logger('TechnologyCatalogStabilization');

  constructor(private readonly dataSource: DataSource) {}

  async run(): Promise<void> {
    for (const policy of COMMERCIAL_POLICIES) await this.applyCommercialPolicy(policy);
    await this.normalizeFinalProjectRubrics();
    this.logger.log('Catálogo técnico estabilizado.');
  }

  private async applyCommercialPolicy(policy: CommercialPolicy): Promise<void> {
    const courseRepository = this.dataSource.getRepository(Course);
    const productRepository = this.dataSource.getRepository(Product);
    const offerRepository = this.dataSource.getRepository(Offer);

    const course = await courseRepository.findOne({ where: { slug: policy.courseSlug } });
    if (!course) throw new Error(`Curso técnico não encontrado: ${policy.courseSlug}`);

    course.isFree = policy.isFree;
    await courseRepository.save(course);

    const product = await productRepository.findOne({
      where: { slug: `curso-${policy.courseSlug}` },
    });
    if (!product) throw new Error(`Produto técnico não encontrado: curso-${policy.courseSlug}`);

    const desiredSlug = policy.isFree
      ? `gratuito-${policy.courseSlug}`
      : `beta-${policy.courseSlug}`;
    const obsoleteSlug = policy.isFree
      ? `beta-${policy.courseSlug}`
      : `gratuito-${policy.courseSlug}`;

    const desired = await offerRepository.findOne({ where: { slug: desiredSlug } });
    const payload = {
      slug: desiredSlug,
      productId: product.id,
      name: policy.isFree ? 'Acesso gratuito' : 'Oferta Beta',
      kind: policy.isFree ? OfferKind.FREE : OfferKind.ONE_TIME,
      status: OfferStatus.ACTIVE,
      priceCents: policy.priceCents,
      currency: 'BRL',
      compareAtPriceCents: null,
      installmentsAllowed: policy.isFree ? 1 : 6,
      accessDurationDays: null,
      availableFrom: null,
      availableUntil: null,
    };
    if (desired) {
      await offerRepository.save(Object.assign(desired, payload));
    } else {
      await offerRepository.save(offerRepository.create(payload));
    }

    const obsolete = await offerRepository.findOne({ where: { slug: obsoleteSlug } });
    if (obsolete && obsolete.status !== OfferStatus.ARCHIVED) {
      obsolete.status = OfferStatus.ARCHIVED;
      await offerRepository.save(obsolete);
    }
  }

  private async normalizeFinalProjectRubrics(): Promise<void> {
    const courseRepository = this.dataSource.getRepository(Course);
    const lessonRepository = this.dataSource.getRepository(Lesson);
    const slugs = [
      'logica-de-programacao-e-algoritmos',
      'git-e-github-na-pratica',
      'html-e-css-do-zero',
      'javascript-fundamentos',
      'python-para-iniciantes',
      'java-fundamentos-e-orientacao-a-objetos',
    ];

    const courses = await courseRepository.find({ where: { slug: In(slugs) } });
    for (const course of courses) {
      const refinement = refinementFor(course.slug);
      if (!refinement) continue;
      const lessons = await lessonRepository.find({ where: { courseId: course.id } });
      const finalProject = lessons.find((lesson) =>
        lesson.title.toLowerCase().includes('projeto final'),
      );
      if (!finalProject) continue;

      finalProject.completionRule = LessonCompletionRule.ACTIVITY_APPROVED;
      finalProject.activityRubric = buildProjectRubric(refinement.projectCriteria);
      await lessonRepository.save(finalProject);
    }
  }
}
