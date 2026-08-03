import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntitlementScope, EntitlementSource, EntitlementStatus } from '@romalearn/contracts';
import { EntityManager, In, Repository } from 'typeorm';
import { Course } from '../catalog/entities/course.entity';
import { ProgramCourse } from '../catalog/entities/program.entity';
import { Entitlement } from './entities/entitlement.entity';

export interface GrantInput {
  userId: string;
  scope: EntitlementScope;
  courseId?: string | null;
  programId?: string | null;
  source: EntitlementSource;
  orderId?: string | null;
  grantedById?: string | null;
  expiresAt?: Date | null;
}

/**
 * Decide quem pode abrir cada conteúdo.
 *
 * Nenhuma outra parte do sistema pode liberar uma aula: o player, o download
 * de materiais e a emissão de certificado passam obrigatoriamente por aqui.
 */
@Injectable()
export class EntitlementService {
  constructor(
    @InjectRepository(Entitlement) private readonly entitlements: Repository<Entitlement>,
    @InjectRepository(ProgramCourse) private readonly programCourses: Repository<ProgramCourse>,
  ) {}

  /**
   * Concede acesso de forma idempotente.
   *
   * Reprocessar o mesmo webhook ou repetir a matrícula gratuita reaproveita a
   * permissão existente em vez de criar outra.
   */
  async grant(input: GrantInput, manager?: EntityManager): Promise<Entitlement> {
    const repository = manager ? manager.getRepository(Entitlement) : this.entitlements;

    const existing = await repository.findOne({
      where: {
        userId: input.userId,
        scope: input.scope,
        ...(input.courseId ? { courseId: input.courseId } : {}),
        ...(input.programId ? { programId: input.programId } : {}),
      },
    });

    if (existing) {
      // Uma nova concessão reativa um acesso que havia sido revogado.
      if (existing.status !== EntitlementStatus.ACTIVE) {
        existing.status = EntitlementStatus.ACTIVE;
        existing.revokedAt = null;
        existing.revocationReason = null;
        existing.grantedAt = new Date();
        existing.source = input.source;
        existing.orderId = input.orderId ?? existing.orderId;
        existing.expiresAt = input.expiresAt ?? null;
        return repository.save(existing);
      }
      return existing;
    }

    return repository.save(
      repository.create({
        userId: input.userId,
        scope: input.scope,
        courseId: input.courseId ?? null,
        programId: input.programId ?? null,
        source: input.source,
        status: EntitlementStatus.ACTIVE,
        orderId: input.orderId ?? null,
        grantedById: input.grantedById ?? null,
        grantedAt: new Date(),
        expiresAt: input.expiresAt ?? null,
      }),
    );
  }

  async revoke(entitlementId: string, reason: string): Promise<void> {
    await this.entitlements.update(
      { id: entitlementId },
      {
        status: EntitlementStatus.REVOKED,
        revokedAt: new Date(),
        revocationReason: reason.slice(0, 255),
      },
    );
  }

  /** Revoga tudo que veio de um pedido — usado em reembolso/estorno. */
  async revokeByOrder(orderId: string, reason: string): Promise<void> {
    await this.entitlements.update(
      { orderId, status: EntitlementStatus.ACTIVE },
      {
        status: EntitlementStatus.REVOKED,
        revokedAt: new Date(),
        revocationReason: reason.slice(0, 255),
      },
    );
  }

  /**
   * O acesso a um curso pode vir de uma permissão direta ou da trilha que
   * contém aquele curso.
   */
  async hasCourseAccess(userId: string, courseId: string): Promise<boolean> {
    const accessible = await this.accessibleCourseIds(userId);
    return accessible.has(courseId);
  }

  /** Conjunto de cursos liberados para o usuário, direta ou indiretamente. */
  async accessibleCourseIds(userId: string): Promise<Set<string>> {
    const active = await this.entitlements.find({
      where: { userId, status: EntitlementStatus.ACTIVE },
    });

    const now = new Date();
    const usable = active.filter((entitlement) => entitlement.isUsable(now));

    const courseIds = new Set<string>();
    const programIds: string[] = [];

    for (const entitlement of usable) {
      if (entitlement.scope === EntitlementScope.COURSE && entitlement.courseId) {
        courseIds.add(entitlement.courseId);
      }
      if (entitlement.scope === EntitlementScope.PROGRAM && entitlement.programId) {
        programIds.push(entitlement.programId);
      }
    }

    if (programIds.length > 0) {
      const items = await this.programCourses.find({ where: { programId: In(programIds) } });
      for (const item of items) courseIds.add(item.courseId);
    }

    return courseIds;
  }

  listForUser(userId: string): Promise<Entitlement[]> {
    return this.entitlements.find({
      where: { userId },
      relations: { course: true, program: true },
      order: { grantedAt: 'DESC' },
    });
  }

  /** Cursos que o acesso a uma trilha libera. */
  async coursesInProgram(programId: string): Promise<string[]> {
    const items = await this.programCourses.find({
      where: { programId },
      order: { order: 'ASC' },
    });
    return items.map((item) => item.courseId);
  }

  /** Um curso gratuito ainda exige permissão — mas ela é criada na hora. */
  isFreeCourse(course: Pick<Course, 'isFree'>): boolean {
    return course.isFree;
  }
}
