/**
 * Enums compartilhados entre a API e o front-end.
 *
 * Estes valores são persistidos no banco de dados — alterar um literal exige
 * uma migration correspondente.
 */

/** Papéis de acesso. Um usuário pode acumular mais de um papel. */
export enum UserRole {
  STUDENT = 'STUDENT',
  ADMIN = 'ADMIN',
  CONTENT_MANAGER = 'CONTENT_MANAGER',
  SUPPORT = 'SUPPORT',
}

export enum UserStatus {
  /** Cadastro criado, e-mail ainda não confirmado. */
  PENDING_VERIFICATION = 'PENDING_VERIFICATION',
  ACTIVE = 'ACTIVE',
  /** Bloqueado por um administrador. */
  SUSPENDED = 'SUSPENDED',
  /** Conta anonimizada a pedido do titular (LGPD). */
  ANONYMIZED = 'ANONYMIZED',
}

export enum PublicationStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
}

export enum CourseLevel {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED',
  /** Percorre do básico ao avançado dentro do mesmo curso. */
  PROGRESSIVE = 'PROGRESSIVE',
}

export enum LessonType {
  /** Markdown sanitizado no backend antes de ser servido. */
  RICH_TEXT = 'RICH_TEXT',
  VIDEO = 'VIDEO',
  PDF = 'PDF',
  DOWNLOAD = 'DOWNLOAD',
  /** Instruções + confirmação do aluno (evolui para upload/correção). */
  PRACTICAL_ACTIVITY = 'PRACTICAL_ACTIVITY',
  QUIZ = 'QUIZ',
}

/** Regra que o backend aplica para aceitar a conclusão de uma aula. */
export enum LessonCompletionRule {
  /** O aluno declara que concluiu (texto, PDF, download). */
  MANUAL_CONFIRMATION = 'MANUAL_CONFIRMATION',
  /** Exige tempo mínimo de permanência registrado pelo player. */
  MINIMUM_TIME = 'MINIMUM_TIME',
  /** Exige percentual mínimo assistido do vídeo. */
  VIDEO_WATCH_RATIO = 'VIDEO_WATCH_RATIO',
  /** Exige tentativa aprovada no questionário vinculado. */
  QUIZ_PASSED = 'QUIZ_PASSED',
  /** Exige o envio da confirmação da atividade prática. */
  ACTIVITY_SUBMITTED = 'ACTIVITY_SUBMITTED',
}

export enum ProgressStatus {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
}

export enum EnrollmentStatus {
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  /** Acesso revogado (reembolso, estorno ou ação administrativa). */
  REVOKED = 'REVOKED',
  EXPIRED = 'EXPIRED',
}

/** Origem da permissão de acesso a um conteúdo. */
export enum EntitlementSource {
  FREE_ENROLLMENT = 'FREE_ENROLLMENT',
  PURCHASE = 'PURCHASE',
  MANUAL_GRANT = 'MANUAL_GRANT',
  SEED = 'SEED',
}

export enum EntitlementStatus {
  ACTIVE = 'ACTIVE',
  REVOKED = 'REVOKED',
  EXPIRED = 'EXPIRED',
}

/** O que uma permissão libera. */
export enum EntitlementScope {
  COURSE = 'COURSE',
  PROGRAM = 'PROGRAM',
}

export enum ProductType {
  COURSE = 'COURSE',
  PROGRAM = 'PROGRAM',
}

export enum OfferKind {
  FREE = 'FREE',
  ONE_TIME = 'ONE_TIME',
}

export enum OfferStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  ARCHIVED = 'ARCHIVED',
}

/** Ambiente comercial da oferta — impede vender preço de teste em produção. */
export enum OfferEnvironment {
  /** Preço aprovado comercialmente. */
  PRODUCTION = 'PRODUCTION',
  /** Preço fictício para desenvolvimento/testes. */
  SANDBOX = 'SANDBOX',
}

export enum OrderStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED',
  EXPIRED = 'EXPIRED',
  REFUNDED = 'REFUNDED',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED',
  EXPIRED = 'EXPIRED',
  REFUNDED = 'REFUNDED',
}

export enum PaymentMethod {
  PIX = 'PIX',
  CREDIT_CARD = 'CREDIT_CARD',
  BOLETO = 'BOLETO',
  /** Utilizado apenas por ofertas gratuitas e liberações manuais. */
  NONE = 'NONE',
}

export enum DiscountType {
  PERCENTAGE = 'PERCENTAGE',
  FIXED_AMOUNT = 'FIXED_AMOUNT',
}

export enum CertificateStatus {
  ACTIVE = 'ACTIVE',
  REVOKED = 'REVOKED',
}

export enum CertificateScope {
  COURSE = 'COURSE',
  PROGRAM = 'PROGRAM',
}

export enum QuestionType {
  SINGLE_CHOICE = 'SINGLE_CHOICE',
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
}

export enum AttemptStatus {
  IN_PROGRESS = 'IN_PROGRESS',
  SUBMITTED = 'SUBMITTED',
}

export enum WebhookEventStatus {
  RECEIVED = 'RECEIVED',
  PROCESSED = 'PROCESSED',
  /** Reprocessamento seguro disponível no painel administrativo. */
  FAILED = 'FAILED',
  /** Já processado anteriormente — mantido para auditoria. */
  DUPLICATE = 'DUPLICATE',
}

export enum MaterialKind {
  PDF = 'PDF',
  SPREADSHEET = 'SPREADSHEET',
  DOCUMENT = 'DOCUMENT',
  PRESENTATION = 'PRESENTATION',
  LINK = 'LINK',
  OTHER = 'OTHER',
}

export enum AuditAction {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  PUBLISH = 'PUBLISH',
  UNPUBLISH = 'UNPUBLISH',
  GRANT_ACCESS = 'GRANT_ACCESS',
  REVOKE_ACCESS = 'REVOKE_ACCESS',
  ISSUE_CERTIFICATE = 'ISSUE_CERTIFICATE',
  REVOKE_CERTIFICATE = 'REVOKE_CERTIFICATE',
  REISSUE_CERTIFICATE = 'REISSUE_CERTIFICATE',
  REFUND = 'REFUND',
  REPLAY_WEBHOOK = 'REPLAY_WEBHOOK',
  LOGIN_AS_SUPPORT = 'LOGIN_AS_SUPPORT',
  UPDATE_SETTINGS = 'UPDATE_SETTINGS',
  ANONYMIZE_USER = 'ANONYMIZE_USER',
}
