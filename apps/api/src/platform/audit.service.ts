import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuditAction } from '@romalearn/contracts';
import { Repository } from 'typeorm';
import { redact } from '../common/logger/app-logger.service';
import { AuditLog } from './entities/audit-log.entity';

export interface AuditInput {
  actorId?: string | null;
  actorEmail?: string | null;
  action: AuditAction;
  entityType: string;
  entityId?: string | null;
  summary: string;
  metadata?: Record<string, unknown> | null;
  ipAddress?: string | null;
  userAgent?: string | null;
}

/**
 * Trilha de auditoria de ações sensíveis.
 *
 * Registrar auditoria nunca pode quebrar a operação principal: falhas são
 * logadas e engolidas. Os metadados passam por `redact()` antes de gravar.
 */
@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);

  constructor(@InjectRepository(AuditLog) private readonly auditLogs: Repository<AuditLog>) {}

  async record(input: AuditInput): Promise<void> {
    try {
      await this.auditLogs.save(
        this.auditLogs.create({
          actorId: input.actorId ?? null,
          actorEmail: input.actorEmail ?? null,
          action: input.action,
          entityType: input.entityType,
          entityId: input.entityId ?? null,
          summary: input.summary.slice(0, 500),
          metadata: input.metadata ? redact(input.metadata) : null,
          ipAddress: input.ipAddress?.slice(0, 64) ?? null,
          userAgent: input.userAgent?.slice(0, 255) ?? null,
        }),
      );
    } catch (error) {
      this.logger.error({
        message: 'falha ao gravar auditoria',
        action: input.action,
        entityType: input.entityType,
        detail: error instanceof Error ? error.message : String(error),
      });
    }
  }
}
