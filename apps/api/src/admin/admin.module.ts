import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfig } from '../config/configuration';
import { AssessmentModule } from '../assessment/assessment.module';
import { CatalogModule } from '../catalog/catalog.module';
import { CertificatesModule } from '../certificates/certificates.module';
import { CommerceModule } from '../commerce/commerce.module';
import { LearningModule } from '../learning/learning.module';
import { UsersModule } from '../users/users.module';
import { AdminContentService } from './admin-content.service';
import { AdminController } from './admin.controller';
import { AdminOperationsService } from './admin-operations.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([]),
    // Uploads ficam em memória e passam pela validação do StorageService.
    MulterModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService<AppConfig, true>) => {
        const storage = configService.get('storage', { infer: true });
        return { limits: { fileSize: storage.maxUploadBytes, files: 1 } };
      },
    }),
    CatalogModule,
    LearningModule,
    AssessmentModule,
    CommerceModule,
    CertificatesModule,
    UsersModule,
  ],
  controllers: [AdminController],
  providers: [AdminContentService, AdminOperationsService],
  exports: [AdminContentService, AdminOperationsService],
})
export class AdminModule {}
