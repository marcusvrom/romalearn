import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssessmentModule } from '../assessment/assessment.module';
import { ActivitySubmission } from '../assessment/entities/activity-submission.entity';
import { QuizAttempt } from '../assessment/entities/quiz-attempt.entity';
import { CatalogModule } from '../catalog/catalog.module';
import { Course } from '../catalog/entities/course.entity';
import { Lesson } from '../catalog/entities/lesson.entity';
import { LessonMaterial } from '../catalog/entities/lesson-material.entity';
import { ProgramCourse } from '../catalog/entities/program.entity';
import { Section } from '../catalog/entities/section.entity';
import { User } from '../users/entities/user.entity';
import { Enrollment } from './entities/enrollment.entity';
import { Entitlement } from './entities/entitlement.entity';
import { LessonProgress } from './entities/lesson-progress.entity';
import { EnrollmentService } from './enrollment.service';
import { EntitlementService } from './entitlement.service';
import { LearningController } from './learning.controller';
import { ProgressService } from './progress.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Enrollment,
      Entitlement,
      LessonProgress,
      Course,
      Section,
      Lesson,
      LessonMaterial,
      ProgramCourse,
      QuizAttempt,
      ActivitySubmission,
      User,
    ]),
    AssessmentModule,
    // Catálogo e aprendizagem se referenciam: o catálogo consulta permissões
    // e o player consulta a estrutura do curso.
    forwardRef(() => CatalogModule),
  ],
  controllers: [LearningController],
  providers: [EntitlementService, EnrollmentService, ProgressService],
  exports: [EntitlementService, EnrollmentService, ProgressService, TypeOrmModule],
})
export class LearningModule {}
