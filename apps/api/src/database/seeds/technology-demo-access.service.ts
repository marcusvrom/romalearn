import { INestApplicationContext, Logger } from '@nestjs/common';
import {
  EnrollmentStatus,
  EntitlementScope,
  EntitlementSource,
  EntitlementStatus,
} from '@romalearn/contracts';
import { DataSource } from 'typeorm';
import { Program, ProgramCourse } from '../../catalog/entities/program.entity';
import { Enrollment } from '../../learning/entities/enrollment.entity';
import { Entitlement } from '../../learning/entities/entitlement.entity';
import { User } from '../../users/entities/user.entity';

const FERNANDO_EMAIL = 'trilha@romalearn.local';
const TECHNOLOGY_PROGRAM_SLUG = 'trilha-desenvolvimento-de-software';

/**
 * Prepara Fernando Trilha para testar todo o catálogo técnico.
 *
 * É executado somente pelo seed de demonstração, nunca em produção. Acesso e
 * matrículas são idempotentes para que novos cursos adicionados ao programa
 * apareçam na conta mesmo quando o usuário já existia antes.
 */
export class TechnologyDemoAccessService {
  private readonly logger = new Logger('TechnologyDemoAccess');
  private readonly dataSource: DataSource;

  constructor(app: INestApplicationContext) {
    this.dataSource = app.get(DataSource);
  }

  async run(): Promise<void> {
    const userRepository = this.dataSource.getRepository(User);
    const programRepository = this.dataSource.getRepository(Program);
    const itemRepository = this.dataSource.getRepository(ProgramCourse);
    const entitlementRepository = this.dataSource.getRepository(Entitlement);
    const enrollmentRepository = this.dataSource.getRepository(Enrollment);

    const user = await userRepository.findOne({ where: { email: FERNANDO_EMAIL } });
    if (!user) {
      throw new Error(`Usuário de demonstração não encontrado: ${FERNANDO_EMAIL}`);
    }

    if (user.name !== 'Fernando Trilha') {
      user.name = 'Fernando Trilha';
      await userRepository.save(user);
    }

    const program = await programRepository.findOne({ where: { slug: TECHNOLOGY_PROGRAM_SLUG } });
    if (!program) {
      throw new Error(
        `Trilha técnica não encontrada: ${TECHNOLOGY_PROGRAM_SLUG}. Rode pnpm seed primeiro.`,
      );
    }

    let entitlement = await entitlementRepository.findOne({
      where: { userId: user.id, programId: program.id },
    });

    const entitlementPayload = {
      userId: user.id,
      scope: EntitlementScope.PROGRAM,
      courseId: null,
      programId: program.id,
      source: EntitlementSource.SEED,
      status: EntitlementStatus.ACTIVE,
      orderId: null,
      grantedById: null,
      grantedAt: entitlement?.grantedAt ?? new Date(),
      expiresAt: null,
      revokedAt: null,
      revocationReason: null,
    };

    entitlement = entitlement
      ? await entitlementRepository.save(Object.assign(entitlement, entitlementPayload))
      : await entitlementRepository.save(entitlementRepository.create(entitlementPayload));

    const items = await itemRepository.find({
      where: { programId: program.id },
      order: { order: 'ASC' },
    });

    for (const item of items) {
      let enrollment = await enrollmentRepository.findOne({
        where: { userId: user.id, courseId: item.courseId },
      });

      const enrollmentPayload = {
        userId: user.id,
        courseId: item.courseId,
        status: EnrollmentStatus.ACTIVE,
        source: EntitlementSource.SEED,
        startedAt: enrollment?.startedAt ?? new Date(),
        completedAt: null,
      };

      enrollment = enrollment
        ? await enrollmentRepository.save(Object.assign(enrollment, enrollmentPayload))
        : await enrollmentRepository.save(enrollmentRepository.create(enrollmentPayload));
    }

    this.logger.log(
      `Fernando Trilha recebeu acesso à trilha técnica e ${items.length} matrícula(s) para teste.`,
    );
  }
}
