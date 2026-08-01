import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lesson } from '../catalog/entities/lesson.entity';
import { ActivityService } from './activity.service';
import { ActivitySubmission } from './entities/activity-submission.entity';
import { Question, QuestionOption } from './entities/question.entity';
import { Quiz } from './entities/quiz.entity';
import { QuizAttempt } from './entities/quiz-attempt.entity';
import { QuizService } from './quiz.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Quiz,
      Question,
      QuestionOption,
      QuizAttempt,
      ActivitySubmission,
      Lesson,
    ]),
  ],
  providers: [QuizService, ActivityService],
  exports: [QuizService, ActivityService, TypeOrmModule],
})
export class AssessmentModule {}
