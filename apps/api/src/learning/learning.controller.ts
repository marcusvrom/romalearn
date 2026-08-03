import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  ActivitySubmissionDto,
  CoursePlayerDto,
  EnrolledCourseDto,
  LessonContentDto,
  LessonProgressDto,
  QuizAttemptResultDto,
} from '@romalearn/contracts';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ActivityService } from '../assessment/activity.service';
import { QuizService } from '../assessment/quiz.service';
import {
  CompleteLessonDto,
  ProgressHeartbeatDto,
  SubmitActivityDto,
  SubmitQuizDto,
} from './dto/learning.dto';
import { ProgressService } from './progress.service';

/**
 * Teto absoluto do upload de entrega, aplicado pelo interceptor.
 *
 * Cada aula define um limite próprio e menor; este valor existe para que um
 * arquivo enorme seja rejeitado durante o recebimento, sem chegar a ocupar
 * memória do processo.
 */
const MAX_ACTIVITY_UPLOAD_BYTES = 5 * 1024 * 1024;

/**
 * Área autenticada de estudo. Toda rota aqui valida a permissão de acesso
 * ao curso antes de devolver qualquer conteúdo.
 */
@ApiTags('Aprendizagem')
@Controller('learning')
export class LearningController {
  constructor(
    private readonly progressService: ProgressService,
    private readonly quizService: QuizService,
    private readonly activityService: ActivityService,
  ) {}

  @Get('courses')
  @ApiOperation({ summary: 'Cursos em que o aluno está matriculado.' })
  listCourses(@CurrentUser('id') userId: string): Promise<EnrolledCourseDto[]> {
    return this.progressService.listEnrolledCourses(userId);
  }

  @Get('courses/:courseSlug/player')
  @ApiOperation({ summary: 'Estrutura do curso com o progresso do aluno.' })
  player(
    @CurrentUser('id') userId: string,
    @Param('courseSlug') courseSlug: string,
  ): Promise<CoursePlayerDto> {
    return this.progressService.getPlayer(userId, courseSlug);
  }

  @Get('courses/:courseSlug/lessons/:lessonSlug')
  @ApiOperation({ summary: 'Conteúdo de uma aula liberada para o aluno.' })
  lesson(
    @CurrentUser('id') userId: string,
    @Param('courseSlug') courseSlug: string,
    @Param('lessonSlug') lessonSlug: string,
  ): Promise<LessonContentDto> {
    return this.progressService.getLesson(userId, courseSlug, lessonSlug);
  }

  @Post('lessons/:lessonId/progress')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Salva automaticamente a permanência na aula.' })
  heartbeat(
    @CurrentUser('id') userId: string,
    @Param('lessonId') lessonId: string,
    @Body() dto: ProgressHeartbeatDto,
  ): Promise<LessonProgressDto> {
    return this.progressService.heartbeat(userId, lessonId, dto);
  }

  @Post('lessons/:lessonId/complete')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Conclui a aula se a regra do tipo for atendida.' })
  complete(
    @CurrentUser('id') userId: string,
    @Param('lessonId') lessonId: string,
    @Body() dto: CompleteLessonDto,
  ) {
    return this.progressService.completeLesson(userId, lessonId, dto);
  }

  @Post('lessons/:lessonId/activity')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(
    FileInterceptor('arquivo', {
      // O teto entra aqui, antes de o arquivo ser lido inteiro na memória.
      // A política da aula, mais restritiva, é conferida logo depois.
      limits: { fileSize: MAX_ACTIVITY_UPLOAD_BYTES, files: 1 },
    }),
  )
  @ApiOperation({ summary: 'Envia a entrega de uma atividade prática, com anexo opcional.' })
  @ApiConsumes('multipart/form-data', 'application/json')
  submitActivity(
    @CurrentUser('id') userId: string,
    @Param('lessonId') lessonId: string,
    @Body() dto: SubmitActivityDto,
    @UploadedFile() arquivo?: Express.Multer.File,
  ): Promise<ActivitySubmissionDto> {
    return this.activityService.submit(userId, lessonId, dto, arquivo);
  }

  @Post('quizzes/:quizId/attempts')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Envia uma tentativa de questionário e recebe a nota.' })
  async submitQuiz(
    @CurrentUser('id') userId: string,
    @Param('quizId') quizId: string,
    @Body() dto: SubmitQuizDto,
  ): Promise<QuizAttemptResultDto> {
    const { result, lessonId } = await this.quizService.submitAttempt(userId, quizId, dto);

    // Aprovação no questionário pode concluir a aula automaticamente.
    if (result.passed) await this.progressService.completeIfSatisfied(userId, lessonId);

    return result;
  }
}
