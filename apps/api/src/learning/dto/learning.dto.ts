import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class EnrollFreeDto {
  @ApiProperty({ example: 'carreira-digital-e-destaque-profissional' })
  @IsString()
  @MaxLength(160)
  courseSlug: string;
}

/** Batida periódica do player informando a permanência na aula. */
export class ProgressHeartbeatDto {
  @ApiProperty({ description: 'Segundos decorridos desde a última chamada.', example: 30 })
  @IsInt()
  @Min(0)
  @Max(600)
  elapsedSeconds: number;

  @ApiPropertyOptional({ description: 'Posição atual do vídeo, em segundos.' })
  @IsOptional()
  @IsInt()
  @Min(0)
  positionSeconds?: number;

  @ApiPropertyOptional({ description: 'Proporção assistida do vídeo (0 a 1).' })
  @IsOptional()
  @Min(0)
  @Max(1)
  watchRatio?: number;
}

export class CompleteLessonDto {
  @ApiPropertyOptional({
    description: 'Confirmação explícita do aluno para aulas de leitura e download.',
  })
  @IsOptional()
  @IsBoolean()
  confirmed?: boolean;
}

export class SubmitActivityDto {
  @ApiProperty({ description: 'Relato curto do que foi feito na atividade.' })
  @IsString()
  @MaxLength(2000)
  notes: string;
}

export class QuizAnswerDto {
  @ApiProperty()
  @IsUUID()
  questionId: string;

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsUUID(undefined, { each: true })
  selectedOptionIds: string[];
}

export class SubmitQuizDto {
  @ApiProperty({ type: [QuizAnswerDto] })
  @IsArray()
  answers: QuizAnswerDto[];
}
