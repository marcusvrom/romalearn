import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditService } from './audit.service';
import { DomainEventsService } from './domain-events.service';
import { AuditLog } from './entities/audit-log.entity';
import { PlatformSetting } from './entities/platform-setting.entity';
import { SettingsService } from './settings.service';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([AuditLog, PlatformSetting])],
  providers: [AuditService, SettingsService, DomainEventsService],
  exports: [AuditService, SettingsService, DomainEventsService, TypeOrmModule],
})
export class PlatformModule {}
