import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import {
  AuditAction,
  CertificateDto,
  CertificateScope,
  CertificateStatus,
  CertificateVerificationDto,
  EnrollmentStatus,
  ProgressStatus,
  PublicationStatus,
  WEB_ROUTES,
} from '@romalearn/contracts';
import { randomBytes } from 'node:crypto';
import { DataSource, Repository } from 'typeorm';
import { AppConfig } from '../config/configuration';
import { Course } from '../catalog/entities/course.entity';
import { Lesson } from '../catalog/entities/lesson.entity';
import { Section } from '../catalog/entities/section.entity';
import { DomainErrors } from '../common/errors/domain-error';
import { Enrollment } from '../learning/entities/enrollment.entity';
import { LessonProgress } from '../learning/entities/lesson-progress.entity';
import { MailService } from '../mail/mail.service';
import { AuditService } from '../platform/audit.service';
import { DomainEventsService } from '../platform/domain-events.service';
import { SettingsService } from '../platform/settings.service';
import { StorageService } from '../storage/storage.service';
import { User } from '../users/entities/user.entity';
import { CertificatePdfService } from './certificate-pdf.service';
import {
  Certificate,
  CertificateEvent,
  CertificateEventType,
  CertificateSnapshot,
} from './entities/certificate.entity';

/** Código público sem caracteres ambíguos (0/O, 1/I). */
const CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

function generateVerificationCode(): string {
  const bytes = randomBytes(12);
  let code = '';
  for (let index = 0; index < 12; index += 1) {
    code += CODE_ALPHABET[bytes[index] % CODE_ALPHABET.length];
    if (index === 3 || index === 7) code += '-';
  }
  return code;
}

@Injectable()
export class CertificatesService implements OnModuleInit {
  private readonly logger = new Logger(CertificatesService.name);

  constructor(
    @InjectRepository(Certificate) private readonly certificates: Repository<Certificate>,
    @InjectRepository(CertificateEvent)
    private readonly certificateEvents: Repository<CertificateEvent>,
    @InjectRepository(Enrollment) private readonly enrollments: Repository<Enrollment>,
    @InjectRepository(LessonProgress) private readonly progress: Repository<LessonProgress>,
    @InjectRepository(Course) private readonly courses: Repository<Course>,
    @InjectRepository(Section) private readonly sections: Repository<Section>,
    @InjectRepository(Lesson) private readonly lessons: Repository<Lesson>,
    @InjectRepository(User) private readonly users: Repository<User>,
    private readonly pdfService: CertificatePdfService,
    private readonly storageService: StorageService,
    private readonly settingsService: SettingsService,
    private readonly mailService: MailService,
    private readonly auditService: AuditService,
    private readonly events: DomainEventsService,
    private readonly dataSource: DataSource,
    private readonly configService: ConfigService<AppConfig, true>,
  ) {}

  /** Emite o certificado assim que a aprendizagem anuncia a conclusão. */
  onModuleInit(): void {
    this.events.on('course.completed', async ({ userId, courseId }) => {
      await this.issueForCourse(userId, courseId);
    });
  }

  // ------------------------------------------------------------------
  // Emissão
  // ------------------------------------------------------------------

  /**
   * Emite (uma única vez) o certificado do curso.
   *
   * A unicidade é garantida por índice no banco: mesmo com chamadas
   * concorrentes, o aluno nunca fica com dois certificados do mesmo curso.
   */
  async issueForCourse(userId: string, courseId: string): Promise<Certificate> {
    const existing = await this.certificates.findOne({ where: { userId, courseId } });
    if (existing) return existing;

    const enrollment = await this.enrollments.findOne({ where: { userId, courseId } });
    if (!enrollment || enrollment.status !== EnrollmentStatus.COMPLETED) {
      throw DomainErrors.courseNotCompleted();
    }

    const course = await this.courses.findOneOrFail({ where: { id: courseId } });
    const user = await this.users.findOneOrFail({ where: { id: userId } });
    const issuer = await this.settingsService.certificateIssuer();

    const completedAt = enrollment.completedAt ?? new Date();
    const issuedAt = new Date();

    const snapshot: CertificateSnapshot = {
      studentName: user.name,
      subjectTitle: course.title,
      subjectSlug: course.slug,
      workloadHours: course.workloadHours,
      issuerName: issuer.issuerName,
      issuerLegalName: issuer.issuerLegalName,
      completedAt: completedAt.toISOString(),
      issuedAt: issuedAt.toISOString(),
      syllabus: await this.syllabusFor(courseId),
    };

    let certificate: Certificate;
    try {
      certificate = await this.certificates.save(
        this.certificates.create({
          verificationCode: generateVerificationCode(),
          userId,
          scope: CertificateScope.COURSE,
          courseId,
          programId: null,
          status: CertificateStatus.ACTIVE,
          studentName: snapshot.studentName,
          subjectTitle: snapshot.subjectTitle,
          workloadHours: snapshot.workloadHours,
          completedAt,
          issuedAt,
          issuerName: snapshot.issuerName,
          snapshot,
        }),
      );
    } catch (error) {
      // Corrida entre duas emissões: a segunda encontra a primeira.
      const concurrent = await this.certificates.findOne({ where: { userId, courseId } });
      if (concurrent) return concurrent;
      throw error;
    }

    await this.certificateEvents.save(
      this.certificateEvents.create({
        certificateId: certificate.id,
        type: CertificateEventType.ISSUED,
        actorId: null,
        reason: 'Emitido automaticamente após a conclusão do curso.',
      }),
    );

    await this.generatePdf(certificate);
    await this.mailService.certificateAvailable(user, course.title, certificate.verificationCode);

    await this.auditService.record({
      actorId: null,
      action: AuditAction.ISSUE_CERTIFICATE,
      entityType: 'Certificate',
      entityId: certificate.id,
      summary: `Certificado emitido para "${course.title}".`,
      metadata: { verificationCode: certificate.verificationCode },
    });

    return certificate;
  }

  /** Reemissão administrativa: mesmo código, novo PDF e nova versão. */
  async reissue(certificateId: string, actorId: string, reason: string): Promise<Certificate> {
    const certificate = await this.findOrFail(certificateId);

    if (certificate.status === CertificateStatus.REVOKED) {
      throw DomainErrors.forbidden('Um certificado revogado não pode ser reemitido.');
    }

    certificate.version += 1;
    await this.certificates.save(certificate);
    await this.generatePdf(certificate, true);

    await this.certificateEvents.save(
      this.certificateEvents.create({
        certificateId: certificate.id,
        type: CertificateEventType.REISSUED,
        actorId,
        reason,
      }),
    );

    await this.auditService.record({
      actorId,
      action: AuditAction.REISSUE_CERTIFICATE,
      entityType: 'Certificate',
      entityId: certificate.id,
      summary: `Certificado ${certificate.verificationCode} reemitido.`,
      metadata: { reason, version: certificate.version },
    });

    return certificate;
  }

  async revoke(certificateId: string, actorId: string, reason: string): Promise<Certificate> {
    const certificate = await this.findOrFail(certificateId);

    certificate.status = CertificateStatus.REVOKED;
    certificate.revokedAt = new Date();
    certificate.revocationReason = reason.slice(0, 255);
    await this.certificates.save(certificate);

    await this.certificateEvents.save(
      this.certificateEvents.create({
        certificateId: certificate.id,
        type: CertificateEventType.REVOKED,
        actorId,
        reason,
      }),
    );

    await this.auditService.record({
      actorId,
      action: AuditAction.REVOKE_CERTIFICATE,
      entityType: 'Certificate',
      entityId: certificate.id,
      summary: `Certificado ${certificate.verificationCode} revogado.`,
      metadata: { reason },
    });

    return certificate;
  }

  // ------------------------------------------------------------------
  // Consulta
  // ------------------------------------------------------------------

  async listForUser(userId: string): Promise<CertificateDto[]> {
    const certificates = await this.certificates.find({
      where: { userId },
      order: { issuedAt: 'DESC' },
    });
    return certificates.map((certificate) => this.toDto(certificate));
  }

  /**
   * Validação pública.
   *
   * Devolve apenas o necessário para conferir a autenticidade: nunca
   * e-mail, telefone, CPF ou identificador interno do aluno.
   */
  async verify(code: string): Promise<CertificateVerificationDto> {
    const normalized = code.trim().toUpperCase();
    const certificate = await this.certificates.findOne({
      where: { verificationCode: normalized },
    });

    if (!certificate) {
      return {
        valid: false,
        verificationCode: normalized,
        status: null,
        studentName: null,
        subjectTitle: null,
        workloadHours: null,
        completedAt: null,
        issuedAt: null,
        issuerName: null,
        revokedAt: null,
        revocationReason: null,
      };
    }

    return {
      valid: certificate.status === CertificateStatus.ACTIVE,
      verificationCode: certificate.verificationCode,
      status: certificate.status,
      studentName: certificate.snapshot.studentName,
      subjectTitle: certificate.snapshot.subjectTitle,
      workloadHours: certificate.snapshot.workloadHours,
      completedAt: certificate.snapshot.completedAt,
      issuedAt: certificate.snapshot.issuedAt,
      issuerName: certificate.snapshot.issuerName,
      revokedAt: certificate.revokedAt?.toISOString() ?? null,
      revocationReason: certificate.revocationReason,
    };
  }

  /** PDF do certificado, gerado sob demanda se ainda não existir. */
  async pdfFor(certificateId: string, requesterId: string, isStaff: boolean): Promise<Buffer> {
    const certificate = await this.findOrFail(certificateId);

    if (!isStaff && certificate.userId !== requesterId) {
      throw DomainErrors.forbidden();
    }
    if (certificate.status === CertificateStatus.REVOKED) {
      throw DomainErrors.certificateRevoked();
    }

    if (
      certificate.pdfStorageKey &&
      (await this.storageService.exists(certificate.pdfStorageKey))
    ) {
      return this.storageService.get(certificate.pdfStorageKey);
    }

    return this.generatePdf(certificate);
  }

  findOrFail(certificateId: string): Promise<Certificate> {
    return this.certificates.findOneOrFail({ where: { id: certificateId } }).catch(() => {
      throw DomainErrors.notFound('Certificado não encontrado.');
    });
  }

  listEvents(certificateId: string): Promise<CertificateEvent[]> {
    return this.certificateEvents.find({
      where: { certificateId },
      order: { createdAt: 'DESC' },
    });
  }

  verificationUrl(code: string): string {
    const app = this.configService.get('app', { infer: true });
    return `${app.webPublicUrl.replace(/\/$/, '')}${WEB_ROUTES.certificateVerification(code)}`;
  }

  toDto(certificate: Certificate): CertificateDto {
    const app = this.configService.get('app', { infer: true });

    return {
      id: certificate.id,
      verificationCode: certificate.verificationCode,
      scope: certificate.scope,
      status: certificate.status,
      studentName: certificate.snapshot.studentName,
      subjectTitle: certificate.snapshot.subjectTitle,
      workloadHours: certificate.snapshot.workloadHours,
      completedAt: certificate.snapshot.completedAt,
      issuedAt: certificate.snapshot.issuedAt,
      issuerName: certificate.snapshot.issuerName,
      verificationUrl: this.verificationUrl(certificate.verificationCode),
      pdfUrl: `${app.apiPublicUrl}/${app.globalPrefix}/certificates/${certificate.id}/pdf`,
    };
  }

  // ------------------------------------------------------------------
  // Apoio
  // ------------------------------------------------------------------

  private async generatePdf(certificate: Certificate, replace = false): Promise<Buffer> {
    const buffer = await this.pdfService.render(
      certificate,
      this.verificationUrl(certificate.verificationCode),
    );

    const key = `certificates/${certificate.id}-v${certificate.version}.pdf`;

    try {
      if (replace && certificate.pdfStorageKey && certificate.pdfStorageKey !== key) {
        await this.storageService.delete(certificate.pdfStorageKey);
      }

      await this.storageService.putGenerated(key, buffer, 'application/pdf');
      await this.certificates.update({ id: certificate.id }, { pdfStorageKey: key });
      certificate.pdfStorageKey = key;
    } catch (error) {
      // Falha no storage não impede o download: o PDF é devolvido em memória.
      this.logger.error({
        message: 'não foi possível guardar o PDF do certificado',
        certificateId: certificate.id,
        detail: error instanceof Error ? error.message : String(error),
      });
    }

    return buffer;
  }

  /** Estrutura concluída, preservada no snapshot para consulta futura. */
  private async syllabusFor(courseId: string): Promise<CertificateSnapshot['syllabus']> {
    const sections = await this.sections.find({ where: { courseId }, order: { order: 'ASC' } });
    const lessons = await this.lessons.find({
      where: { courseId, status: PublicationStatus.PUBLISHED },
      order: { order: 'ASC' },
    });

    return sections.map((section) => ({
      section: section.title,
      lessons: lessons
        .filter((lesson) => lesson.sectionId === section.id)
        .map((lesson) => lesson.title),
    }));
  }

  /** Usado pelo painel para conferir o andamento antes de reemitir. */
  async completedLessonCount(enrollmentId: string): Promise<number> {
    return this.progress.count({
      where: { enrollmentId, status: ProgressStatus.COMPLETED },
    });
  }

  listAll(): Promise<Certificate[]> {
    return this.certificates.find({ order: { issuedAt: 'DESC' }, take: 500 });
  }

  /** Reservado para o certificado de trilha (mesma mecânica do curso). */
  async issueForProgram(userId: string, programId: string): Promise<Certificate | null> {
    return this.certificates.findOne({ where: { userId, programId } });
  }

  get connection(): DataSource {
    return this.dataSource;
  }
}
