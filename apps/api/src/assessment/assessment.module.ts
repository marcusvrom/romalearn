import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lesson } from '../catalog/entities/lesson.entity';
import { AppConfig } from '../config/configuration';
import { ActivityService } from './activity.service';
import { ActivitySubmission } from './entities/activity-submission.entity';
import { Question, QuestionOption } from './entities/question.entity';
import { Quiz } from './entities/quiz.entity';
import { QuizAttempt } from './entities/quiz-attempt.entity';
import { ACTIVITY_GRADER, ActivityGrader } from './grading/activity-grader';
import { GradingService } from './grading/grading.service';
import { LlmActivityGrader } from './grading/llm.grader';
import { RulesActivityGrader } from './grading/rules.grader';
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
  providers: [
    {
      provide: ACTIVITY_GRADER,
      inject: [ConfigService],
      useFactory: (configService: ConfigService<AppConfig, true>): ActivityGrader => {
        const grading = configService.get('activityGrading', { infer: true });

        // Sem chave configurada não há como usar o provedor: cair no corretor
        // determinístico é melhor do que falhar em toda entrega.
        if (grading.driver === 'llm' && grading.apiKey) {
          return new LlmActivityGrader({
            baseUrl: grading.baseUrl,
            model: grading.model,
            apiKey: grading.apiKey,
            maxInputChars: grading.maxInputChars,
            maxOutputTokens: grading.maxOutputTokens,
            timeoutMs: grading.timeoutMs,
          });
        }

        return new RulesActivityGrader();
      },
    },
    GradingService,
    QuizService,
    ActivityService,
  ],
  exports: [QuizService, ActivityService, GradingService, TypeOrmModule],
})
export class AssessmentModule {}
