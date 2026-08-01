import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from '../catalog/entities/course.entity';
import { Lesson } from '../catalog/entities/lesson.entity';
import { Section } from '../catalog/entities/section.entity';
import { Enrollment } from '../learning/entities/enrollment.entity';
import { LessonProgress } from '../learning/entities/lesson-progress.entity';
import { User } from '../users/entities/user.entity';
import { CertificatePdfService } from './certificate-pdf.service';
import { CertificatesController } from './certificates.controller';
import { CertificatesService } from './certificates.service';
import { Certificate, CertificateEvent } from './entities/certificate.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Certificate,
      CertificateEvent,
      Enrollment,
      LessonProgress,
      Course,
      Section,
      Lesson,
      User,
    ]),
  ],
  controllers: [CertificatesController],
  providers: [CertificatesService, CertificatePdfService],
  exports: [CertificatesService, TypeOrmModule],
})
export class CertificatesModule {}
