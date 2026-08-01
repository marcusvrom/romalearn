import { ActivitySubmission } from '../assessment/entities/activity-submission.entity';
import { Question, QuestionOption } from '../assessment/entities/question.entity';
import { Quiz } from '../assessment/entities/quiz.entity';
import { QuizAttempt } from '../assessment/entities/quiz-attempt.entity';
import { RefreshToken } from '../auth/entities/refresh-token.entity';
import { VerificationToken } from '../auth/entities/verification-token.entity';
import { Course } from '../catalog/entities/course.entity';
import { Instructor } from '../catalog/entities/instructor.entity';
import { Lesson } from '../catalog/entities/lesson.entity';
import { LessonMaterial } from '../catalog/entities/lesson-material.entity';
import { Program, ProgramCourse } from '../catalog/entities/program.entity';
import { Section } from '../catalog/entities/section.entity';
import { Certificate, CertificateEvent } from '../certificates/entities/certificate.entity';
import { Coupon } from '../commerce/entities/coupon.entity';
import { Offer } from '../commerce/entities/offer.entity';
import { Order } from '../commerce/entities/order.entity';
import { Payment } from '../commerce/entities/payment.entity';
import { Product } from '../commerce/entities/product.entity';
import { WebhookEvent } from '../commerce/entities/webhook-event.entity';
import { Enrollment } from '../learning/entities/enrollment.entity';
import { Entitlement } from '../learning/entities/entitlement.entity';
import { LessonProgress } from '../learning/entities/lesson-progress.entity';
import { AuditLog } from '../platform/entities/audit-log.entity';
import { PlatformSetting } from '../platform/entities/platform-setting.entity';
import { User } from '../users/entities/user.entity';

/**
 * Registro único de entidades. Usar uma lista explícita (em vez de glob)
 * mantém o build compilado e os testes apontando exatamente para o mesmo
 * conjunto de tabelas.
 */
export const ENTITIES = [
  // Identidade
  User,
  RefreshToken,
  VerificationToken,
  // Catálogo
  Instructor,
  Course,
  Section,
  Lesson,
  LessonMaterial,
  Program,
  ProgramCourse,
  // Avaliação
  Quiz,
  Question,
  QuestionOption,
  QuizAttempt,
  ActivitySubmission,
  // Aprendizagem
  Enrollment,
  Entitlement,
  LessonProgress,
  // Comércio
  Product,
  Offer,
  Coupon,
  Order,
  Payment,
  WebhookEvent,
  // Certificados
  Certificate,
  CertificateEvent,
  // Plataforma
  AuditLog,
  PlatformSetting,
];
