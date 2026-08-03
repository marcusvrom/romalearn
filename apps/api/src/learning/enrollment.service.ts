import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  AuditAction,
  EnrollmentStatus,
  EntitlementScope,
  EntitlementSource,
  PublicationStatus,
} from '@romalearn/contracts';
import { EntityManager, Repository } from 'typeorm';
import { Course } from '../catalog/entities/course.entity';
import { DomainErrors } from '../common/errors/domain-error';
import { MailService } from '../mail/mail.service';
import { AuditService } from '../platform/audit.service';
import { User } from '../users/entities/user.entity';
import { Enrollment } from './entities/enrollment.entity';
import { EntitlementService } from './entitlement.service';

@Injectable()
export class EnrollmentService {
  constructor(
    @InjectRepository(Enrollment) private readonly enrollments: Repository<Enrollment>,
    @InjectRepository(Course) private readonly courses: Repository<Course>,
    @InjectRepository(User) private readonly users: Repository<User>,
    private readonly entitlementService: EntitlementService,
    private readonly mailService: MailService,
    private readonly auditService: AuditService,
  ) {}

  /**
   * Matrícula no módulo gratuito.
   *
   * Cria uma permissão de acesso sem passar por pedido nem pagamento, e é
   * idempotente: repetir a chamada devolve a matrícula existente.
   */
  async enrollFree(userId: string, courseSlug: string): Promise<Enrollment> {
    const course = await this.courses.findOne({ where: { slug: courseSlug } });

    if (!course || course.status !== PublicationStatus.PUBLISHED) {
      throw DomainErrors.notFound('Curso não encontrado.');
    }
    if (!course.isFree) {
      throw DomainErrors.forbidden(
        'Este curso faz parte da trilha paga. Escolha uma oferta para continuar.',
      );
    }

    await this.entitlementService.grant({
      userId,
      scope: EntitlementScope.COURSE,
      courseId: course.id,
      source: EntitlementSource.FREE_ENROLLMENT,
    });

    const enrollment = await this.ensureEnrollment(
      userId,
      course.id,
      EntitlementSource.FREE_ENROLLMENT,
    );

    const user = await this.users.findOne({ where: { id: userId } });
    if (user) {
      await this.mailService.freeEnrollment(user, course.title, course.slug);
      await this.auditService.record({
        actorId: user.id,
        actorEmail: user.email,
        action: AuditAction.GRANT_ACCESS,
        entityType: 'Enrollment',
        entityId: enrollment.id,
        summary: `Matrícula gratuita em "${course.title}".`,
        metadata: { courseSlug: course.slug },
      });
    }

    return enrollment;
  }

  /**
   * Garante que exista uma matrícula ativa para o curso.
   * Chamada tanto pela matrícula gratuita quanto pela liberação de compra.
   */
  async ensureEnrollment(
    userId: string,
    courseId: string,
    source: EntitlementSource,
    manager?: EntityManager,
  ): Promise<Enrollment> {
    const repository = manager ? manager.getRepository(Enrollment) : this.enrollments;

    const existing = await repository.findOne({ where: { userId, courseId } });
    if (existing) {
      // Reativa uma matrícula revogada sem perder o progresso já registrado.
      if (
        existing.status === EnrollmentStatus.REVOKED ||
        existing.status === EnrollmentStatus.EXPIRED
      ) {
        existing.status = EnrollmentStatus.ACTIVE;
        return repository.save(existing);
      }
      return existing;
    }

    return repository.save(
      repository.create({
        userId,
        courseId,
        status: EnrollmentStatus.ACTIVE,
        source,
        startedAt: new Date(),
      }),
    );
  }

  /** Matricula em todos os cursos de uma trilha (usado após a compra). */
  async ensureEnrollmentsForProgram(
    userId: string,
    programId: string,
    source: EntitlementSource,
    manager?: EntityManager,
  ): Promise<Enrollment[]> {
    const courseIds = await this.entitlementService.coursesInProgram(programId);
    const results: Enrollment[] = [];

    for (const courseId of courseIds) {
      results.push(await this.ensureEnrollment(userId, courseId, source, manager));
    }

    return results;
  }

  findByUserAndCourse(userId: string, courseId: string): Promise<Enrollment | null> {
    return this.enrollments.findOne({ where: { userId, courseId } });
  }

  listForUser(userId: string): Promise<Enrollment[]> {
    return this.enrollments.find({
      where: { userId },
      relations: { course: true, lastAccessedLesson: true },
      order: { lastAccessedAt: 'DESC', createdAt: 'DESC' },
    });
  }

  /** Registra a última aula aberta, alimentando o "Continuar estudando". */
  async touch(enrollmentId: string, lessonId: string): Promise<void> {
    await this.enrollments.update(
      { id: enrollmentId },
      { lastAccessedLessonId: lessonId, lastAccessedAt: new Date() },
    );
  }
}
