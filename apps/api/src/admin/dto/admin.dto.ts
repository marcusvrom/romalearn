import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  CourseLevel,
  DiscountType,
  EntitlementScope,
  LessonCompletionRule,
  LessonType,
  MaterialKind,
  OfferEnvironment,
  OfferKind,
  OfferStatus,
  ProductType,
  PublicationStatus,
  QuestionType,
  UserRole,
} from '@romalearn/contracts';
import { Transform, Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';

const upper = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim().toUpperCase() : value;

export class CompletionCriteriaDto {
  @ApiProperty({ minimum: 0, maximum: 100 })
  @IsInt()
  @Min(0)
  @Max(100)
  minimumLessonCompletionPercent: number;

  @ApiProperty()
  @IsBoolean()
  requireAllQuizzesPassed: boolean;

  @ApiProperty()
  @IsBoolean()
  requireAllActivitiesSubmitted: boolean;
}

export class UpsertCourseDto {
  @ApiPropertyOptional({ description: 'Gerado a partir do título quando omitido.' })
  @IsOptional()
  @IsString()
  @MaxLength(160)
  slug?: string;

  @ApiProperty()
  @IsString()
  @MaxLength(200)
  title: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(240)
  subtitle?: string;

  @ApiProperty()
  @IsString()
  @MaxLength(400)
  shortDescription: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  fullDescription?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(512)
  coverImageUrl?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(30)
  @IsString({ each: true })
  objectives?: string[];

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(30)
  @IsString({ each: true })
  targetAudience?: string[];

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(30)
  @IsString({ each: true })
  prerequisites?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(1000)
  workloadHours?: number;

  @ApiPropertyOptional({ enum: CourseLevel })
  @IsOptional()
  @IsEnum(CourseLevel)
  level?: CourseLevel;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isFree?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  order?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  instructorId?: string;

  @ApiPropertyOptional({ type: CompletionCriteriaDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => CompletionCriteriaDto)
  completionCriteria?: CompletionCriteriaDto;
}

export class UpsertSectionDto {
  @ApiProperty()
  @IsUUID()
  courseId: string;

  @ApiProperty()
  @IsString()
  @MaxLength(200)
  title: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  summary?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  order?: number;
}

export class UpsertLessonDto {
  @ApiProperty()
  @IsUUID()
  sectionId: string;

  @ApiProperty()
  @IsString()
  @MaxLength(200)
  title: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(160)
  slug?: string;

  @ApiProperty({ enum: LessonType })
  @IsEnum(LessonType)
  type: LessonType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  order?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(600)
  estimatedMinutes?: number;

  @ApiPropertyOptional({ enum: LessonCompletionRule })
  @IsOptional()
  @IsEnum(LessonCompletionRule)
  completionRule?: LessonCompletionRule;

  @ApiPropertyOptional()
  @IsOptional()
  @Min(0)
  completionThreshold?: number;

  @ApiPropertyOptional({ description: 'Markdown. É sanitizado ao ser servido.' })
  @IsOptional()
  @IsString()
  contentMarkdown?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(512)
  videoUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(32)
  videoProvider?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(512)
  fileStorageKey?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  activityInstructions?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isPreview?: boolean;

  @ApiPropertyOptional({ enum: PublicationStatus })
  @IsOptional()
  @IsEnum(PublicationStatus)
  status?: PublicationStatus;
}

export class ReorderItemDto {
  @ApiProperty()
  @IsUUID()
  id: string;

  @ApiProperty()
  @IsInt()
  @Min(0)
  order: number;
}

export class ReorderDto {
  @ApiProperty({ type: [ReorderItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReorderItemDto)
  items: ReorderItemDto[];
}

export class QuestionOptionDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  id?: string;

  @ApiProperty()
  @IsString()
  text: string;

  @ApiProperty()
  @IsBoolean()
  isCorrect: boolean;
}

export class UpsertQuestionDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  id?: string;

  @ApiProperty()
  @IsString()
  statement: string;

  @ApiProperty({ enum: QuestionType })
  @IsEnum(QuestionType)
  type: QuestionType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  explanation?: string;

  @ApiProperty({ type: [QuestionOptionDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuestionOptionDto)
  options: QuestionOptionDto[];
}

export class UpsertQuizDto {
  @ApiProperty()
  @IsUUID()
  lessonId: string;

  @ApiProperty()
  @IsString()
  @MaxLength(200)
  title: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ minimum: 0, maximum: 100 })
  @IsInt()
  @Min(0)
  @Max(100)
  passingScore: number;

  @ApiPropertyOptional({ description: 'Vazio significa tentativas ilimitadas.' })
  @IsOptional()
  @IsInt()
  @Min(1)
  maxAttempts?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  shuffleQuestions?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  shuffleOptions?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  showFeedback?: boolean;

  @ApiProperty({ type: [UpsertQuestionDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpsertQuestionDto)
  questions: UpsertQuestionDto[];
}

export class UpsertMaterialDto {
  @ApiProperty()
  @IsUUID()
  lessonId: string;

  @ApiProperty()
  @IsString()
  @MaxLength(200)
  title: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ enum: MaterialKind })
  @IsEnum(MaterialKind)
  kind: MaterialKind;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(512)
  storageKey?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(512)
  externalUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  order?: number;
}

export class UpsertProductDto {
  @ApiProperty()
  @IsString()
  @MaxLength(200)
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(160)
  slug?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ enum: ProductType })
  @IsEnum(ProductType)
  type: ProductType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  courseId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  programId?: string;

  @ApiPropertyOptional({ enum: PublicationStatus })
  @IsOptional()
  @IsEnum(PublicationStatus)
  status?: PublicationStatus;
}

export class UpsertOfferDto {
  @ApiProperty()
  @IsUUID()
  productId: string;

  @ApiProperty()
  @IsString()
  @MaxLength(200)
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(160)
  slug?: string;

  @ApiProperty({ enum: OfferKind })
  @IsEnum(OfferKind)
  kind: OfferKind;

  @ApiPropertyOptional({ enum: OfferStatus })
  @IsOptional()
  @IsEnum(OfferStatus)
  status?: OfferStatus;

  @ApiProperty({
    enum: OfferEnvironment,
    description: 'Ofertas SANDBOX não podem ser vendidas em produção.',
  })
  @IsEnum(OfferEnvironment)
  environment: OfferEnvironment;

  @ApiProperty({ description: 'Valor em centavos.' })
  @IsInt()
  @Min(0)
  priceCents: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(0)
  compareAtPriceCents?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(24)
  installmentsAllowed?: number;

  @ApiPropertyOptional({ description: 'Vazio significa acesso vitalício.' })
  @IsOptional()
  @IsInt()
  @Min(1)
  accessDurationDays?: number;
}

export class UpsertCouponDto {
  @ApiProperty()
  @Transform(upper)
  @IsString()
  @MaxLength(40)
  code: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(160)
  description?: string;

  @ApiProperty({ enum: DiscountType })
  @IsEnum(DiscountType)
  discountType: DiscountType;

  @ApiProperty({ description: 'Percentual (0-100) ou valor fixo em centavos.' })
  @IsInt()
  @Min(1)
  discountValue: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  offerId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(1)
  maxRedemptions?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  active?: boolean;
}

export class GrantAccessDto {
  @ApiProperty()
  @IsUUID()
  userId: string;

  @ApiProperty({ enum: EntitlementScope })
  @IsEnum(EntitlementScope)
  scope: EntitlementScope;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  courseId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  programId?: string;

  @ApiProperty({ description: 'Motivo registrado na auditoria.' })
  @IsString()
  @MaxLength(255)
  reason: string;
}

export class RevokeAccessDto {
  @ApiProperty()
  @IsString()
  @MaxLength(255)
  reason: string;
}

export class UpdateUserRolesDto {
  @ApiProperty({ enum: UserRole, isArray: true })
  @IsArray()
  @IsEnum(UserRole, { each: true })
  roles: UserRole[];
}

export class ReasonDto {
  @ApiProperty()
  @IsString()
  @MaxLength(255)
  reason: string;
}

export class UpdateSettingsDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(120)
  platformName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(160)
  legalName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(254)
  supportEmail?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(200)
  certificateIssuer?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(32)
  termsVersion?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(32)
  privacyVersion?: string;

  @ApiPropertyOptional({ description: 'Só habilite quando houver depoimentos reais.' })
  @IsOptional()
  @IsBoolean()
  testimonialsEnabled?: boolean;
}
