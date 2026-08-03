import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LearningModule } from '../learning/learning.module';
import { CatalogController } from './catalog.controller';
import { CatalogService } from './catalog.service';
import { Course } from './entities/course.entity';
import { Instructor } from './entities/instructor.entity';
import { Lesson } from './entities/lesson.entity';
import { LessonMaterial } from './entities/lesson-material.entity';
import { Program, ProgramCourse } from './entities/program.entity';
import { Section } from './entities/section.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Course,
      Section,
      Lesson,
      LessonMaterial,
      Instructor,
      Program,
      ProgramCourse,
    ]),
    // Referência circular controlada: o catálogo consulta permissões de acesso.
    forwardRef(() => LearningModule),
  ],
  controllers: [CatalogController],
  providers: [CatalogService],
  exports: [CatalogService, TypeOrmModule],
})
export class CatalogModule {}
