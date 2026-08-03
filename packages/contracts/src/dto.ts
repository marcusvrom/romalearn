/**
 * Contratos de transporte (respostas da API) usados pelo front-end.
 *
 * Regra: estes tipos descrevem o *formato* dos dados. Nenhuma regra de negócio
 * relevante (permissão, aprovação, conclusão) deve ser reimplementada no
 * front-end a partir deles — a API é sempre a fonte da verdade.
 */
import type {
  ActivityGraderKind,
  ActivityReviewStatus,
  AttemptStatus,
  CertificateScope,
  CertificateStatus,
  CourseLevel,
  DiscountType,
  EnrollmentStatus,
  EntitlementScope,
  LessonCompletionRule,
  LessonType,
  MaterialKind,
  OfferEnvironment,
  OfferKind,
  OfferStatus,
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
  ProductType,
  ProgressStatus,
  PublicationStatus,
  QuestionType,
  UserRole,
  UserStatus,
  WebhookEventStatus,
} from './enums';

// ---------------------------------------------------------------------------
// Genéricos
// ---------------------------------------------------------------------------

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiErrorResponse {
  statusCode: number;
  /** Código estável para o front-end reagir sem depender da mensagem. */
  error: string;
  /** Mensagem em português, pronta para exibição. */
  message: string;
  correlationId?: string;
  details?: Record<string, string[]>;
}

// ---------------------------------------------------------------------------
// Usuários e autenticação
// ---------------------------------------------------------------------------

export interface UserDto {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  roles: UserRole[];
  status: UserStatus;
  emailVerifiedAt: string | null;
  termsAcceptedVersion: string | null;
  termsAcceptedAt: string | null;
  createdAt: string;
}

export interface AuthSessionDto {
  user: UserDto;
  /** Presente apenas quando o cliente solicita tokens no corpo (ex.: testes). */
  accessToken?: string;
  refreshToken?: string;
  expiresIn?: number;
}

// ---------------------------------------------------------------------------
// Catálogo
// ---------------------------------------------------------------------------

export interface InstructorDto {
  name: string;
  title: string | null;
  bio: string | null;
  avatarUrl: string | null;
}

export interface CourseSummaryDto {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  shortDescription: string;
  coverImageUrl: string | null;
  level: CourseLevel;
  workloadHours: number;
  status: PublicationStatus;
  isFree: boolean;
  order: number;
  lessonCount: number;
  sectionCount: number;
}

export interface CourseDetailDto extends CourseSummaryDto {
  fullDescription: string;
  objectives: string[];
  targetAudience: string[];
  prerequisites: string[];
  instructor: InstructorDto | null;
  sections: SectionOutlineDto[];
  /** Preenchido apenas para usuários autenticados. */
  access?: CourseAccessDto;
}

export interface SectionOutlineDto {
  id: string;
  title: string;
  summary: string | null;
  order: number;
  lessons: LessonOutlineDto[];
}

export interface LessonOutlineDto {
  id: string;
  slug: string;
  title: string;
  type: LessonType;
  order: number;
  estimatedMinutes: number;
  /** Amostra liberada mesmo sem permissão de acesso. */
  isPreview: boolean;
}

export interface CourseAccessDto {
  hasAccess: boolean;
  enrollmentId: string | null;
  reason: 'ENTITLED' | 'PREVIEW_ONLY' | 'NOT_ENTITLED' | 'REVOKED';
}

export interface ProgramSummaryDto {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  coverImageUrl: string | null;
  objectives: string[];
  status: PublicationStatus;
  /** Menor carga possível quando a trilha contém rotas alternativas. */
  totalWorkloadHours: number;
  /** Maior carga possível; igual ao total quando não existem alternativas. */
  maximumWorkloadHours: number;
  courses: ProgramCourseSummaryDto[];
}

/** Curso dentro de uma trilha, com o papel pedagógico que exerce naquela jornada. */
export interface ProgramCourseSummaryDto extends CourseSummaryDto {
  stage: number;
  stageTitle: string;
  stageDescription: string;
  isRequired: boolean;
  alternativeGroup: string | null;
  portfolioOutcome: string;
}

// ---------------------------------------------------------------------------
// Player e progresso
// ---------------------------------------------------------------------------

export interface LessonMaterialDto {
  id: string;
  title: string;
  description: string | null;
  kind: MaterialKind;
  /** URL assinada e temporária para arquivos privados. */
  url: string;
  sizeBytes: number | null;
  expiresAt: string | null;
}

export interface LessonContentDto {
  id: string;
  slug: string;
  courseId: string;
  sectionId: string;
  title: string;
  type: LessonType;
  order: number;
  estimatedMinutes: number;
  completionRule: LessonCompletionRule;
  /** Parâmetro da regra: segundos mínimos ou proporção do vídeo (0..1). */
  completionThreshold: number | null;
  /** HTML já sanitizado pelo backend (RICH_TEXT). */
  contentHtml: string | null;
  videoUrl: string | null;
  videoProvider: string | null;
  fileUrl: string | null;
  activityInstructions: string | null;
  /** Rubrica da atividade prática, exibida antes do envio. */
  activityRubric: ActivityRubricDto | null;
  /** Regras do anexo, quando a atividade pede um arquivo. */
  activityAttachmentPolicy: ActivityAttachmentPolicyDto | null;
  /** Última entrega do aluno nesta aula, já corrigida. */
  activitySubmission: ActivitySubmissionDto | null;
  quiz: QuizDto | null;
  materials: LessonMaterialDto[];
  progress: LessonProgressDto;
  previousLessonId: string | null;
  nextLessonId: string | null;
}

export interface LessonProgressDto {
  status: ProgressStatus;
  secondsSpent: number;
  watchRatio: number;
  completedAt: string | null;
  lastPositionSeconds: number;
}

export interface CoursePlayerDto {
  course: CourseSummaryDto;
  sections: PlayerSectionDto[];
  progress: CourseProgressDto;
  /** Aula sugerida pelo botão "Continuar estudando". */
  resumeLessonId: string | null;
}

export interface PlayerSectionDto {
  id: string;
  title: string;
  order: number;
  lessons: PlayerLessonDto[];
}

export interface PlayerLessonDto extends LessonOutlineDto {
  status: ProgressStatus;
  /** Falso quando o aluno não possui permissão para abrir a aula. */
  unlocked: boolean;
}

export interface CourseProgressDto {
  courseId: string;
  completedLessons: number;
  totalLessons: number;
  percentage: number;
  status: EnrollmentStatus;
  completedAt: string | null;
  /** Critérios pendentes para concluir o curso, em linguagem simples. */
  pendingRequirements: string[];
  certificateId: string | null;
}

export interface EnrolledCourseDto {
  enrollmentId: string;
  course: CourseSummaryDto;
  progress: CourseProgressDto;
  lastAccessedLesson: { id: string; title: string } | null;
  lastAccessedAt: string | null;
}

// ---------------------------------------------------------------------------
// Questionários
// ---------------------------------------------------------------------------

/** Política de anexo de uma atividade prática. */
export interface ActivityAttachmentPolicyDto {
  /** Quando verdadeiro, a entrega sem arquivo é recusada. */
  required: boolean;
  maxBytes: number;
  /** Extensões aceitas, em minúsculas e com ponto: [".docx"]. */
  extensions: string[];
  /** Explicação curta do que o aluno deve enviar. */
  hint: string;
}

/** Uma verificação automática feita no arquivo entregue. */
export interface AttachmentCheckDto {
  label: string;
  passed: boolean;
}

/** Arquivo entregue pelo aluno em uma atividade prática. */
export interface ActivityAttachmentDto {
  filename: string;
  sizeBytes: number;
  uploadedAt: string;
  /** URL assinada e temporária; nunca um endereço público. */
  url: string;
  checks: AttachmentCheckDto[];
}

/** Um critério da rubrica de correção de uma atividade prática. */
export interface RubricCriterionDto {
  /** Identificador estável, usado na devolutiva e nos relatórios. */
  id: string;
  title: string;
  /** Peso percentual. A soma dos critérios fecha em 100. */
  weight: number;
  /** O que a correção observa no relato do aluno. */
  whatToObserve: string;
}

/**
 * Rubrica de uma atividade prática.
 *
 * É pública para o aluno de propósito: ele precisa saber como será avaliado
 * enquanto ainda pode melhorar a entrega.
 */
export interface ActivityRubricDto {
  /** Nota mínima de aprovação, de 0 a 100. */
  passingScore: number;
  criteria: RubricCriterionDto[];
  /** Situações que reprovam independentemente da nota. */
  criticalFailures: string[];
  /** Tamanho mínimo do relato para que a correção seja possível. */
  minWords: number;
}

/** Nota e comentário de um critério na devolutiva. */
export interface CriterionResultDto {
  criterionId: string;
  title: string;
  weight: number;
  /** Nota do critério, de 0 a 100. */
  score: number;
  /** Comentário curto explicando a nota. */
  comment: string;
}

/** Devolutiva de uma entrega de atividade prática. */
export interface ActivitySubmissionDto {
  id: string;
  lessonId: string;
  notes: string;
  submittedAt: string;
  status: ActivityReviewStatus;
  /** Nota final de 0 a 100; nula enquanto a correção não terminou. */
  score: number | null;
  approved: boolean;
  criteria: CriterionResultDto[];
  strengths: string[];
  improvements: string[];
  /** Falhas críticas encontradas, em texto pronto para exibição. */
  criticalFailures: string[];
  gradedBy: ActivityGraderKind | null;
  gradedAt: string | null;
  /** Arquivo entregue, quando a atividade aceita anexo. */
  attachment: ActivityAttachmentDto | null;
  attemptNumber: number;
  /** Mensagem em português explicando o estado atual da correção. */
  statusMessage: string;
}

export interface QuizDto {
  id: string;
  title: string;
  description: string | null;
  passingScore: number;
  maxAttempts: number | null;
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
  showFeedback: boolean;
  questions: QuizQuestionDto[];
  attemptsUsed: number;
  bestScore: number | null;
  passed: boolean;
}

export interface QuizQuestionDto {
  id: string;
  statement: string;
  type: QuestionType;
  order: number;
  options: QuizOptionDto[];
}

export interface QuizOptionDto {
  id: string;
  text: string;
}

export interface QuizAttemptResultDto {
  attemptId: string;
  status: AttemptStatus;
  score: number;
  passed: boolean;
  passingScore: number;
  attemptNumber: number;
  attemptsRemaining: number | null;
  submittedAt: string;
  /** Devolvido apenas quando o questionário mostra feedback. */
  questions: QuizQuestionFeedbackDto[];
}

export interface QuizQuestionFeedbackDto {
  questionId: string;
  correct: boolean;
  selectedOptionIds: string[];
  correctOptionIds: string[];
  explanation: string | null;
}

// ---------------------------------------------------------------------------
// Comércio
// ---------------------------------------------------------------------------

export interface ProductDto {
  id: string;
  slug: string;
  name: string;
  description: string;
  type: ProductType;
  status: PublicationStatus;
  courseId: string | null;
  programId: string | null;
  offers: OfferDto[];
}

export interface OfferDto {
  id: string;
  productId: string;
  name: string;
  kind: OfferKind;
  status: OfferStatus;
  environment: OfferEnvironment;
  /** Valor em centavos — evita erros de ponto flutuante. */
  priceCents: number;
  currency: string;
  /** Preço "de" apenas quando houver valor comercial aprovado. */
  compareAtPriceCents: number | null;
  installmentsAllowed: number;
  accessDurationDays: number | null;
  availableFrom: string | null;
  availableUntil: string | null;
}

export interface CouponDto {
  id: string;
  code: string;
  discountType: DiscountType;
  discountValue: number;
  maxRedemptions: number | null;
  redemptions: number;
  expiresAt: string | null;
  active: boolean;
}

export interface OrderDto {
  id: string;
  reference: string;
  status: OrderStatus;
  offerId: string;
  productName: string;
  subtotalCents: number;
  discountCents: number;
  totalCents: number;
  currency: string;
  couponCode: string | null;
  createdAt: string;
  paidAt: string | null;
  payment: PaymentDto | null;
}

export interface PaymentDto {
  id: string;
  status: PaymentStatus;
  method: PaymentMethod;
  amountCents: number;
  currency: string;
  gateway: string;
  gatewayPaymentId: string | null;
  /** Instruções de pagamento (copia-e-cola do Pix, link do provedor). */
  checkoutUrl: string | null;
  pixQrCode: string | null;
  pixQrCodeBase64: string | null;
  expiresAt: string | null;
  createdAt: string;
}

export interface CheckoutResultDto {
  order: OrderDto;
  payment: PaymentDto | null;
  /** Verdadeiro quando a oferta gratuita liberou o acesso imediatamente. */
  accessGranted: boolean;
}

// ---------------------------------------------------------------------------
// Certificados
// ---------------------------------------------------------------------------

export interface CertificateDto {
  id: string;
  verificationCode: string;
  scope: CertificateScope;
  status: CertificateStatus;
  studentName: string;
  subjectTitle: string;
  workloadHours: number;
  completedAt: string;
  issuedAt: string;
  issuerName: string;
  verificationUrl: string;
  pdfUrl: string;
}

/** Resposta pública — nunca inclui e-mail, CPF ou telefone. */
export interface CertificateVerificationDto {
  valid: boolean;
  verificationCode: string;
  status: CertificateStatus | null;
  studentName: string | null;
  subjectTitle: string | null;
  workloadHours: number | null;
  completedAt: string | null;
  issuedAt: string | null;
  issuerName: string | null;
  revokedAt: string | null;
  revocationReason: string | null;
}

// ---------------------------------------------------------------------------
// Administração
// ---------------------------------------------------------------------------

export interface AdminDashboardDto {
  users: { total: number; last30Days: number };
  enrollments: { total: number; active: number; completed: number };
  courses: { total: number; published: number; draft: number };
  orders: { total: number; approved: number; pending: number; revenueCents: number };
  certificates: { issued: number; revoked: number };
  webhooks: { failed: number; pending: number };
}

export interface AuditLogDto {
  id: string;
  actorId: string | null;
  actorEmail: string | null;
  action: string;
  entityType: string;
  entityId: string | null;
  summary: string;
  metadata: Record<string, unknown> | null;
  ipAddress: string | null;
  createdAt: string;
}

export interface WebhookEventDto {
  id: string;
  gateway: string;
  eventType: string;
  externalId: string;
  status: WebhookEventStatus;
  attempts: number;
  lastError: string | null;
  receivedAt: string;
  processedAt: string | null;
}

export interface PlatformSettingsDto {
  platformName: string;
  legalName: string;
  supportEmail: string;
  certificateIssuer: string;
  termsVersion: string;
  privacyVersion: string;
  /** Depoimentos só aparecem no site quando forem reais e habilitados aqui. */
  testimonialsEnabled: boolean;
}
