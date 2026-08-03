import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CourseAccessDto,
  CourseDetailDto,
  CourseSummaryDto,
  ProgramCourseSummaryDto,
  ProgramSummaryDto,
  PublicationStatus,
  SectionOutlineDto,
} from '@romalearn/contracts';
import { In, Repository } from 'typeorm';
import { DomainErrors } from '../common/errors/domain-error';
import { EntitlementService } from '../learning/entitlement.service';
import { Course } from './entities/course.entity';
import { Lesson } from './entities/lesson.entity';
import { Program, ProgramCourse } from './entities/program.entity';
import { calculateProgramWorkload } from './program-workload';
import { Section } from './entities/section.entity';

@Injectable()
export class CatalogService {
  constructor(
    @InjectRepository(Course) private readonly courses: Repository<Course>,
    @InjectRepository(Section) private readonly sections: Repository<Section>,
    @InjectRepository(Lesson) private readonly lessons: Repository<Lesson>,
    @InjectRepository(Program) private readonly programs: Repository<Program>,
    @InjectRepository(ProgramCourse) private readonly programCourses: Repository<ProgramCourse>,
    private readonly entitlementService: EntitlementService,
  ) {}

  /** Catálogo público: apenas cursos publicados. */
  async listPublishedCourses(): Promise<CourseSummaryDto[]> {
    const courses = await this.courses.find({
      where: { status: PublicationStatus.PUBLISHED },
      order: { order: 'ASC', title: 'ASC' },
    });

    return this.toSummaries(courses);
  }

  async findCourseBySlug(slug: string, userId?: string): Promise<CourseDetailDto> {
    const course = await this.courses.findOne({
      where: { slug },
      relations: { instructor: true },
    });

    if (!course || course.status === PublicationStatus.ARCHIVED) {
      throw DomainErrors.notFound('Curso não encontrado.');
    }

    // Rascunhos ficam invisíveis no catálogo público.
    if (course.status !== PublicationStatus.PUBLISHED) {
      throw DomainErrors.notFound('Curso não encontrado.');
    }

    const [summary] = await this.toSummaries([course]);
    const sections = await this.outlineFor(course.id);

    let access: CourseAccessDto | undefined;
    if (userId) {
      const hasAccess = await this.entitlementService.hasCourseAccess(userId, course.id);
      access = {
        hasAccess,
        enrollmentId: null,
        reason: hasAccess ? 'ENTITLED' : 'NOT_ENTITLED',
      };
    }

    return {
      ...summary,
      fullDescription: course.fullDescription,
      objectives: course.objectives ?? [],
      targetAudience: course.targetAudience ?? [],
      prerequisites: course.prerequisites ?? [],
      instructor: course.instructor
        ? {
            name: course.instructor.name,
            title: course.instructor.title,
            bio: course.instructor.bio,
            avatarUrl: course.instructor.avatarUrl,
          }
        : null,
      sections,
      access,
    };
  }

  async listPublishedPrograms(): Promise<ProgramSummaryDto[]> {
    const programs = await this.programs.find({
      where: { status: PublicationStatus.PUBLISHED },
      order: { order: 'ASC' },
    });

    return Promise.all(programs.map((program) => this.toProgramDto(program)));
  }

  async findProgramBySlug(slug: string): Promise<ProgramSummaryDto> {
    const program = await this.programs.findOne({ where: { slug } });
    if (!program || program.status !== PublicationStatus.PUBLISHED) {
      throw DomainErrors.notFound('Trilha não encontrada.');
    }
    return this.toProgramDto(program);
  }

  /** Estrutura de seções e aulas (sem conteúdo — só títulos e metadados). */
  async outlineFor(courseId: string): Promise<SectionOutlineDto[]> {
    const sections = await this.sections.find({
      where: { courseId },
      order: { order: 'ASC' },
    });

    if (sections.length === 0) return [];

    const lessons = await this.lessons.find({
      where: {
        sectionId: In(sections.map((section) => section.id)),
        status: PublicationStatus.PUBLISHED,
      },
      order: { order: 'ASC' },
    });

    return sections.map((section) => ({
      id: section.id,
      title: section.title,
      summary: section.summary,
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
        })),
    }));
  }

  async findCourseEntityBySlug(slug: string): Promise<Course> {
    const course = await this.courses.findOne({ where: { slug } });
    if (!course) throw DomainErrors.notFound('Curso não encontrado.');
    return course;
  }

  private async toSummaries(courses: Course[]): Promise<CourseSummaryDto[]> {
    if (courses.length === 0) return [];

    const courseIds = courses.map((course) => course.id);

    // Contagens em duas consultas agregadas, evitando N+1.
    const sectionCounts = await this.sections
      .createQueryBuilder('section')
      .select('section.courseId', 'courseId')
      .addSelect('COUNT(*)', 'total')
      .where('section.courseId IN (:...courseIds)', { courseIds })
      .groupBy('section.courseId')
      .getRawMany<{ courseId: string; total: string }>();

    const lessonCounts = await this.lessons
      .createQueryBuilder('lesson')
      .select('lesson.courseId', 'courseId')
      .addSelect('COUNT(*)', 'total')
      .where('lesson.courseId IN (:...courseIds)', { courseIds })
      .andWhere('lesson.status = :status', { status: PublicationStatus.PUBLISHED })
      .groupBy('lesson.courseId')
      .getRawMany<{ courseId: string; total: string }>();

    const sectionMap = new Map(sectionCounts.map((row) => [row.courseId, Number(row.total)]));
    const lessonMap = new Map(lessonCounts.map((row) => [row.courseId, Number(row.total)]));

    return courses.map((course) => ({
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
      sectionCount: sectionMap.get(course.id) ?? 0,
      lessonCount: lessonMap.get(course.id) ?? 0,
    }));
  }

  private async toProgramDto(program: Program): Promise<ProgramSummaryDto> {
    const items = await this.programCourses.find({
      where: { programId: program.id },
      relations: { course: true },
      order: { order: 'ASC' },
    });

    // Um curso em rascunho não pode vazar por uma trilha publicada. Isso é
    // especialmente importante para o módulo de IA, ainda sem conteúdo.
    const publishedItems = items.filter(
      (item) => item.course.status === PublicationStatus.PUBLISHED,
    );
    const summaries = await this.toSummaries(publishedItems.map((item) => item.course));
    const summaryById = new Map(summaries.map((course) => [course.id, course]));
    const courses: ProgramCourseSummaryDto[] = publishedItems.flatMap((item) => {
      const summary = summaryById.get(item.courseId);
      if (!summary) return [];

      return [
        {
          ...summary,
          stage: item.stage,
          stageTitle: item.stageTitle,
          stageDescription: item.stageDescription,
          isRequired: item.isRequired,
          alternativeGroup: item.alternativeGroup,
          portfolioOutcome: item.portfolioOutcome,
        },
      ];
    });
    const workload = calculateProgramWorkload(courses);

    return {
      id: program.id,
      slug: program.slug,
      title: program.title,
      shortDescription: program.shortDescription,
      fullDescription: program.fullDescription,
      coverImageUrl: program.coverImageUrl,
      objectives: program.objectives ?? [],
      status: program.status,
      totalWorkloadHours: workload.minimum,
      maximumWorkloadHours: workload.maximum,
      courses,
    };
  }
}
