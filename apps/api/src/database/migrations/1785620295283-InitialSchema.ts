import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Schema inicial da plataforma: identidade, catálogo, avaliação,
 * aprendizagem, comércio, certificados e auditoria.
 */
export class InitialSchema1785620295283 implements MigrationInterface {
  name = 'InitialSchema1785620295283';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Necessária para os identificadores gerados com uuid_generate_v4().
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
    await queryRunner.query(
      `CREATE TABLE "questions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "quizId" uuid NOT NULL, "statement" text NOT NULL, "type" character varying(24) NOT NULL DEFAULT 'SINGLE_CHOICE', "order" integer NOT NULL DEFAULT '0', "explanation" text, CONSTRAINT "PK_08a6d4b0f49ff300bf3a0ca60ac" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_questions_quiz_order" ON "questions" ("quizId", "order") `,
    );
    await queryRunner.query(
      `CREATE TABLE "question_options" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "questionId" uuid NOT NULL, "text" text NOT NULL, "isCorrect" boolean NOT NULL DEFAULT false, "order" integer NOT NULL DEFAULT '0', CONSTRAINT "PK_13be20e51c0738def32f00cf7d5" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_question_options_question_order" ON "question_options" ("questionId", "order") `,
    );
    await queryRunner.query(
      `CREATE TABLE "quizzes" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "lessonId" uuid NOT NULL, "title" character varying(200) NOT NULL, "description" text, "passingScore" integer NOT NULL DEFAULT '70', "maxAttempts" integer, "shuffleQuestions" boolean NOT NULL DEFAULT false, "shuffleOptions" boolean NOT NULL DEFAULT false, "showFeedback" boolean NOT NULL DEFAULT true, CONSTRAINT "REL_eba9ff0775c843581aab6916b3" UNIQUE ("lessonId"), CONSTRAINT "PK_b24f0f7662cf6b3a0e7dba0a1b4" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`CREATE UNIQUE INDEX "idx_quizzes_lesson" ON "quizzes" ("lessonId") `);
    await queryRunner.query(
      `CREATE TABLE "instructors" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "name" character varying(160) NOT NULL, "title" character varying(160), "bio" text, "avatarUrl" character varying(512), CONSTRAINT "PK_95e3da69ca76176ea4ab8435098" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "sections" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "courseId" uuid NOT NULL, "title" character varying(200) NOT NULL, "summary" text, "order" integer NOT NULL DEFAULT '0', CONSTRAINT "PK_f9749dd3bffd880a497d007e450" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_sections_course_order" ON "sections" ("courseId", "order") `,
    );
    await queryRunner.query(
      `CREATE TABLE "courses" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "slug" character varying(160) NOT NULL, "title" character varying(200) NOT NULL, "subtitle" character varying(240), "shortDescription" character varying(400) NOT NULL, "fullDescription" text NOT NULL DEFAULT '', "coverImageUrl" character varying(512), "objectives" jsonb NOT NULL DEFAULT '[]'::jsonb, "targetAudience" jsonb NOT NULL DEFAULT '[]'::jsonb, "prerequisites" jsonb NOT NULL DEFAULT '[]'::jsonb, "workloadHours" integer NOT NULL DEFAULT '0', "level" character varying(24) NOT NULL DEFAULT 'BEGINNER', "status" character varying(16) NOT NULL DEFAULT 'DRAFT', "isFree" boolean NOT NULL DEFAULT false, "order" integer NOT NULL DEFAULT '0', "completionCriteria" jsonb NOT NULL DEFAULT '{"minimumLessonCompletionPercent":100,"requireAllQuizzesPassed":true,"requireAllActivitiesSubmitted":true}'::jsonb, "instructorId" uuid, "publishedAt" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_3f70a487cc718ad8eda4e6d58c9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`CREATE UNIQUE INDEX "idx_courses_slug" ON "courses" ("slug") `);
    await queryRunner.query(
      `CREATE TABLE "lesson_materials" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "lessonId" uuid NOT NULL, "title" character varying(200) NOT NULL, "description" text, "kind" character varying(24) NOT NULL DEFAULT 'PDF', "storageKey" character varying(512), "externalUrl" character varying(512), "sizeBytes" bigint, "order" integer NOT NULL DEFAULT '0', CONSTRAINT "PK_546aa37092097e45987093d7c4c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_lesson_materials_lesson_order" ON "lesson_materials" ("lessonId", "order") `,
    );
    await queryRunner.query(
      `CREATE TABLE "lessons" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "courseId" uuid NOT NULL, "sectionId" uuid NOT NULL, "slug" character varying(160) NOT NULL, "title" character varying(200) NOT NULL, "type" character varying(32) NOT NULL DEFAULT 'RICH_TEXT', "order" integer NOT NULL DEFAULT '0', "estimatedMinutes" integer NOT NULL DEFAULT '10', "completionRule" character varying(32) NOT NULL DEFAULT 'MANUAL_CONFIRMATION', "completionThreshold" numeric(8,2), "contentMarkdown" text, "videoUrl" character varying(512), "videoProvider" character varying(32), "fileStorageKey" character varying(512), "activityInstructions" text, "isPreview" boolean NOT NULL DEFAULT false, "status" character varying(16) NOT NULL DEFAULT 'PUBLISHED', CONSTRAINT "PK_9b9a8d455cac672d262d7275730" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "idx_lessons_course_slug" ON "lessons" ("courseId", "slug") `,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_lessons_section_order" ON "lessons" ("sectionId", "order") `,
    );
    await queryRunner.query(
      `CREATE TABLE "programs" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "slug" character varying(160) NOT NULL, "title" character varying(200) NOT NULL, "shortDescription" character varying(400) NOT NULL, "fullDescription" text NOT NULL DEFAULT '', "coverImageUrl" character varying(512), "objectives" jsonb NOT NULL DEFAULT '[]'::jsonb, "status" character varying(16) NOT NULL DEFAULT 'DRAFT', "order" integer NOT NULL DEFAULT '0', CONSTRAINT "PK_d43c664bcaafc0e8a06dfd34e05" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`CREATE UNIQUE INDEX "idx_programs_slug" ON "programs" ("slug") `);
    await queryRunner.query(
      `CREATE TABLE "program_courses" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "programId" uuid NOT NULL, "courseId" uuid NOT NULL, "order" integer NOT NULL DEFAULT '0', CONSTRAINT "PK_5cda740b813b3103368cc8ba854" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "idx_program_courses_unique" ON "program_courses" ("programId", "courseId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "certificates" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "verificationCode" character varying(24) NOT NULL, "userId" uuid NOT NULL, "scope" character varying(16) NOT NULL, "courseId" uuid, "programId" uuid, "status" character varying(16) NOT NULL DEFAULT 'ACTIVE', "studentName" character varying(160) NOT NULL, "subjectTitle" character varying(200) NOT NULL, "workloadHours" integer NOT NULL, "completedAt" TIMESTAMP WITH TIME ZONE NOT NULL, "issuedAt" TIMESTAMP WITH TIME ZONE NOT NULL, "issuerName" character varying(200) NOT NULL, "snapshot" jsonb NOT NULL, "pdfStorageKey" character varying(512), "revokedAt" TIMESTAMP WITH TIME ZONE, "revocationReason" character varying(255), "version" integer NOT NULL DEFAULT '1', CONSTRAINT "PK_e4c7e31e2144300bea7d89eb165" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "idx_certificates_verification_code" ON "certificates" ("verificationCode") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "idx_certificates_user_program" ON "certificates" ("userId", "programId") WHERE "programId" IS NOT NULL`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "idx_certificates_user_course" ON "certificates" ("userId", "courseId") WHERE "courseId" IS NOT NULL`,
    );
    await queryRunner.query(
      `CREATE TABLE "certificate_events" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "certificateId" uuid NOT NULL, "type" character varying(24) NOT NULL, "actorId" uuid, "reason" character varying(500), CONSTRAINT "PK_91950154408b3948b4d7a2d6ce2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_certificate_events_certificate" ON "certificate_events" ("certificateId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "enrollments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "userId" uuid NOT NULL, "courseId" uuid NOT NULL, "status" character varying(16) NOT NULL DEFAULT 'ACTIVE', "source" character varying(24) NOT NULL DEFAULT 'FREE_ENROLLMENT', "startedAt" TIMESTAMP WITH TIME ZONE, "completedAt" TIMESTAMP WITH TIME ZONE, "lastAccessedLessonId" uuid, "lastAccessedAt" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_7c0f752f9fb68bf6ed7367ab00f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "idx_enrollments_unique" ON "enrollments" ("userId", "courseId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "entitlements" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "userId" uuid NOT NULL, "scope" character varying(16) NOT NULL, "courseId" uuid, "programId" uuid, "source" character varying(24) NOT NULL, "status" character varying(16) NOT NULL DEFAULT 'ACTIVE', "orderId" uuid, "grantedById" uuid, "grantedAt" TIMESTAMP WITH TIME ZONE NOT NULL, "expiresAt" TIMESTAMP WITH TIME ZONE, "revokedAt" TIMESTAMP WITH TIME ZONE, "revocationReason" character varying(255), CONSTRAINT "PK_6a45cb6f5747d49365a879bffde" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_entitlements_user_program" ON "entitlements" ("userId", "programId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_entitlements_user_course" ON "entitlements" ("userId", "courseId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "coupons" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "code" character varying(40) NOT NULL, "description" character varying(160) NOT NULL DEFAULT '', "discountType" character varying(16) NOT NULL, "discountValue" integer NOT NULL, "offerId" uuid, "maxRedemptions" integer, "redemptions" integer NOT NULL DEFAULT '0', "expiresAt" TIMESTAMP WITH TIME ZONE, "active" boolean NOT NULL DEFAULT true, CONSTRAINT "PK_d7ea8864a0150183770f3e9a8cb" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`CREATE UNIQUE INDEX "idx_coupons_code" ON "coupons" ("code") `);
    await queryRunner.query(
      `CREATE TABLE "products" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "slug" character varying(160) NOT NULL, "name" character varying(200) NOT NULL, "description" text NOT NULL DEFAULT '', "type" character varying(16) NOT NULL, "status" character varying(16) NOT NULL DEFAULT 'DRAFT', "courseId" uuid, "programId" uuid, CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`CREATE UNIQUE INDEX "idx_products_slug" ON "products" ("slug") `);
    await queryRunner.query(
      `CREATE TABLE "offers" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "slug" character varying(160) NOT NULL, "productId" uuid NOT NULL, "name" character varying(200) NOT NULL, "kind" character varying(16) NOT NULL, "status" character varying(16) NOT NULL DEFAULT 'DRAFT', "environment" character varying(16) NOT NULL DEFAULT 'SANDBOX', "priceCents" integer NOT NULL DEFAULT '0', "currency" character varying(3) NOT NULL DEFAULT 'BRL', "compareAtPriceCents" integer, "installmentsAllowed" integer NOT NULL DEFAULT '1', "accessDurationDays" integer, "availableFrom" TIMESTAMP WITH TIME ZONE, "availableUntil" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_4c88e956195bba85977da21b8f4" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`CREATE UNIQUE INDEX "idx_offers_slug" ON "offers" ("slug") `);
    await queryRunner.query(
      `CREATE TABLE "payments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "orderId" uuid NOT NULL, "status" character varying(16) NOT NULL DEFAULT 'PENDING', "method" character varying(16) NOT NULL DEFAULT 'NONE', "amountCents" integer NOT NULL, "currency" character varying(3) NOT NULL DEFAULT 'BRL', "gateway" character varying(32) NOT NULL, "gatewayPaymentId" character varying(128), "checkoutUrl" character varying(1024), "pixQrCode" text, "pixQrCodeBase64" text, "gatewayPayload" jsonb, "expiresAt" TIMESTAMP WITH TIME ZONE, "approvedAt" TIMESTAMP WITH TIME ZONE, "failureReason" character varying(255), CONSTRAINT "PK_197ab7af18c93fbb0c9b28b4a59" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "idx_payments_gateway_ref" ON "payments" ("gateway", "gatewayPaymentId") WHERE "gatewayPaymentId" IS NOT NULL`,
    );
    await queryRunner.query(`CREATE INDEX "idx_payments_order" ON "payments" ("orderId") `);
    await queryRunner.query(
      `CREATE TABLE "orders" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "reference" character varying(32) NOT NULL, "userId" uuid NOT NULL, "offerId" uuid NOT NULL, "status" character varying(16) NOT NULL DEFAULT 'PENDING', "subtotalCents" integer NOT NULL, "discountCents" integer NOT NULL DEFAULT '0', "totalCents" integer NOT NULL, "currency" character varying(3) NOT NULL DEFAULT 'BRL', "couponId" uuid, "snapshot" jsonb NOT NULL, "paidAt" TIMESTAMP WITH TIME ZONE, "expiresAt" TIMESTAMP WITH TIME ZONE, "cancelledAt" TIMESTAMP WITH TIME ZONE, "refundedAt" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_710e2d4957aa5878dfe94e4ac2f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "idx_orders_reference" ON "orders" ("reference") `,
    );
    await queryRunner.query(`CREATE INDEX "idx_orders_user" ON "orders" ("userId") `);
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "name" character varying(160) NOT NULL, "email" character varying(254) NOT NULL, "passwordHash" character varying(255) NOT NULL, "phone" character varying(32), "roles" jsonb NOT NULL DEFAULT '["STUDENT"]'::jsonb, "status" character varying(32) NOT NULL DEFAULT 'PENDING_VERIFICATION', "emailVerifiedAt" TIMESTAMP WITH TIME ZONE, "termsAcceptedVersion" character varying(32), "termsAcceptedAt" TIMESTAMP WITH TIME ZONE, "privacyAcceptedVersion" character varying(32), "privacyAcceptedAt" TIMESTAMP WITH TIME ZONE, "lastLoginAt" TIMESTAMP WITH TIME ZONE, "deletedAt" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`CREATE UNIQUE INDEX "idx_users_email" ON "users" ("email") `);
    await queryRunner.query(
      `CREATE TABLE "activity_submissions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "lessonId" uuid NOT NULL, "userId" uuid NOT NULL, "notes" text, "attachmentKeys" jsonb NOT NULL DEFAULT '[]'::jsonb, "submittedAt" TIMESTAMP WITH TIME ZONE NOT NULL, "reviewedById" uuid, "reviewedAt" TIMESTAMP WITH TIME ZONE, "reviewFeedback" text, CONSTRAINT "PK_621adcfa4ca2206ca656f2bbd03" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "idx_activity_submissions_unique" ON "activity_submissions" ("userId", "lessonId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "quiz_attempts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "quizId" uuid NOT NULL, "userId" uuid NOT NULL, "attemptNumber" integer NOT NULL, "status" character varying(24) NOT NULL DEFAULT 'SUBMITTED', "score" integer NOT NULL DEFAULT '0', "passed" boolean NOT NULL DEFAULT false, "answers" jsonb NOT NULL DEFAULT '[]'::jsonb, "submittedAt" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_a84a93fb092359516dc5b325b90" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "idx_quiz_attempts_number" ON "quiz_attempts" ("userId", "quizId", "attemptNumber") `,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_quiz_attempts_user_quiz" ON "quiz_attempts" ("userId", "quizId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "refresh_tokens" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "userId" uuid NOT NULL, "tokenHash" character varying(128) NOT NULL, "familyId" uuid NOT NULL, "expiresAt" TIMESTAMP WITH TIME ZONE NOT NULL, "revokedAt" TIMESTAMP WITH TIME ZONE, "revokedReason" character varying(64), "userAgent" character varying(255), "ipAddress" character varying(64), CONSTRAINT "PK_7d8bee0204106019488c4c50ffa" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_refresh_tokens_user" ON "refresh_tokens" ("userId") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "idx_refresh_tokens_hash" ON "refresh_tokens" ("tokenHash") `,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_refresh_tokens_family" ON "refresh_tokens" ("familyId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "verification_tokens" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "userId" uuid NOT NULL, "type" character varying(32) NOT NULL, "tokenHash" character varying(128) NOT NULL, "expiresAt" TIMESTAMP WITH TIME ZONE NOT NULL, "usedAt" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_f2d4d7a2aa57ef199e61567db22" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_verification_tokens_user" ON "verification_tokens" ("userId") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "idx_verification_tokens_hash" ON "verification_tokens" ("tokenHash") `,
    );
    await queryRunner.query(
      `CREATE TABLE "webhook_events" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "gateway" character varying(32) NOT NULL, "eventType" character varying(64) NOT NULL, "externalId" character varying(128) NOT NULL, "payload" jsonb NOT NULL, "status" character varying(16) NOT NULL DEFAULT 'RECEIVED', "attempts" integer NOT NULL DEFAULT '0', "lastError" text, "receivedAt" TIMESTAMP WITH TIME ZONE NOT NULL, "processedAt" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_4cba37e6a0acb5e1fc49c34ebfd" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "idx_webhook_events_unique" ON "webhook_events" ("gateway", "externalId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "lesson_progress" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "enrollmentId" uuid NOT NULL, "lessonId" uuid NOT NULL, "userId" uuid NOT NULL, "status" character varying(16) NOT NULL DEFAULT 'NOT_STARTED', "secondsSpent" integer NOT NULL DEFAULT '0', "watchRatio" numeric(5,4) NOT NULL DEFAULT '0', "lastPositionSeconds" integer NOT NULL DEFAULT '0', "completedAt" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_e6223ebbc5f8f5fce40e0193de1" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "idx_lesson_progress_unique" ON "lesson_progress" ("enrollmentId", "lessonId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "audit_logs" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "actorId" uuid, "actorEmail" character varying(254), "action" character varying(40) NOT NULL, "entityType" character varying(60) NOT NULL, "entityId" character varying(64), "summary" character varying(500) NOT NULL, "metadata" jsonb, "ipAddress" character varying(64), "userAgent" character varying(255), CONSTRAINT "PK_1bb179d048bbc581caa3b013439" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`CREATE INDEX "idx_audit_logs_created" ON "audit_logs" ("createdAt") `);
    await queryRunner.query(
      `CREATE INDEX "idx_audit_logs_entity" ON "audit_logs" ("entityType", "entityId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "platform_settings" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "key" character varying(80) NOT NULL, "value" jsonb NOT NULL, "description" character varying(255) NOT NULL DEFAULT '', CONSTRAINT "PK_2934aeb70ec285196dcab4a2e96" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "idx_platform_settings_key" ON "platform_settings" ("key") `,
    );
    await queryRunner.query(
      `ALTER TABLE "questions" ADD CONSTRAINT "FK_35d54f06d12ea78d4842aed6b6d" FOREIGN KEY ("quizId") REFERENCES "quizzes"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "question_options" ADD CONSTRAINT "FK_c654af7759a681f1b1addbe35bf" FOREIGN KEY ("questionId") REFERENCES "questions"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "quizzes" ADD CONSTRAINT "FK_eba9ff0775c843581aab6916b32" FOREIGN KEY ("lessonId") REFERENCES "lessons"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "sections" ADD CONSTRAINT "FK_0fc0dc8ce98e7dc47c273f85e3d" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "courses" ADD CONSTRAINT "FK_e6714597bea722629fa7d32124a" FOREIGN KEY ("instructorId") REFERENCES "instructors"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "lesson_materials" ADD CONSTRAINT "FK_366d3fab29482cd3c71a0d98cfa" FOREIGN KEY ("lessonId") REFERENCES "lessons"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "lessons" ADD CONSTRAINT "FK_1a9ff2409a84c76560ae8a92590" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "lessons" ADD CONSTRAINT "FK_6dc4890fa16a7a866b6144f4929" FOREIGN KEY ("sectionId") REFERENCES "sections"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "program_courses" ADD CONSTRAINT "FK_e0e163c38c1ad3e4514fbc3cb7e" FOREIGN KEY ("programId") REFERENCES "programs"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "program_courses" ADD CONSTRAINT "FK_3b1c16fc6385863703953cb9ebe" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "certificates" ADD CONSTRAINT "FK_7d072194aef1ecb98664c83e861" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "certificates" ADD CONSTRAINT "FK_e50e73bc3bdcfb0eb3d561f1494" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "certificates" ADD CONSTRAINT "FK_f217c995f5e4d5e1385505c56be" FOREIGN KEY ("programId") REFERENCES "programs"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "certificate_events" ADD CONSTRAINT "FK_0af80272520c98fb985a2a08c49" FOREIGN KEY ("certificateId") REFERENCES "certificates"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "enrollments" ADD CONSTRAINT "FK_de33d443c8ae36800c37c58c929" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "enrollments" ADD CONSTRAINT "FK_60dd0ae4e21002e63a5fdefeec8" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "enrollments" ADD CONSTRAINT "FK_a219c5d26acefcdf880222b4d0a" FOREIGN KEY ("lastAccessedLessonId") REFERENCES "lessons"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "entitlements" ADD CONSTRAINT "FK_ce5285303a2e4073b2b745bb1e3" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "entitlements" ADD CONSTRAINT "FK_6ddb05fec91a22216938d3c2419" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "entitlements" ADD CONSTRAINT "FK_87ef00b2543e8e3f3508efcb4d0" FOREIGN KEY ("programId") REFERENCES "programs"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "products" ADD CONSTRAINT "FK_62cb70129719259a70750834751" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "products" ADD CONSTRAINT "FK_6f8f47ee621eb21943265e88da0" FOREIGN KEY ("programId") REFERENCES "programs"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "offers" ADD CONSTRAINT "FK_54bcb6bc59c301d3d43146df19f" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "payments" ADD CONSTRAINT "FK_af929a5f2a400fdb6913b4967e1" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" ADD CONSTRAINT "FK_151b79a83ba240b0cb31b2302d1" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" ADD CONSTRAINT "FK_64a6ac9b5af68bf37e781eebb37" FOREIGN KEY ("offerId") REFERENCES "offers"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" ADD CONSTRAINT "FK_c26db6c65929ecfeab91073e80c" FOREIGN KEY ("couponId") REFERENCES "coupons"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "activity_submissions" ADD CONSTRAINT "FK_cec8c612271ab2cb34eff021ac3" FOREIGN KEY ("lessonId") REFERENCES "lessons"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "activity_submissions" ADD CONSTRAINT "FK_ec08f80c8403a4805765756c025" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "quiz_attempts" ADD CONSTRAINT "FK_23f2bbe9288b221b1b377372782" FOREIGN KEY ("quizId") REFERENCES "quizzes"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "quiz_attempts" ADD CONSTRAINT "FK_ff7b1d71fabdc7e1f4aff552859" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "refresh_tokens" ADD CONSTRAINT "FK_610102b60fea1455310ccd299de" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "verification_tokens" ADD CONSTRAINT "FK_8eb720a87e85b20fdfc69c38269" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "lesson_progress" ADD CONSTRAINT "FK_5bc4ad7572c19f8c12a67fee6b1" FOREIGN KEY ("enrollmentId") REFERENCES "enrollments"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "lesson_progress" ADD CONSTRAINT "FK_df13299d2740b302dd44a368df9" FOREIGN KEY ("lessonId") REFERENCES "lessons"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "lesson_progress" ADD CONSTRAINT "FK_eb4349e70765bb218bb4f833f68" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "lesson_progress" DROP CONSTRAINT "FK_eb4349e70765bb218bb4f833f68"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lesson_progress" DROP CONSTRAINT "FK_df13299d2740b302dd44a368df9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lesson_progress" DROP CONSTRAINT "FK_5bc4ad7572c19f8c12a67fee6b1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "verification_tokens" DROP CONSTRAINT "FK_8eb720a87e85b20fdfc69c38269"`,
    );
    await queryRunner.query(
      `ALTER TABLE "refresh_tokens" DROP CONSTRAINT "FK_610102b60fea1455310ccd299de"`,
    );
    await queryRunner.query(
      `ALTER TABLE "quiz_attempts" DROP CONSTRAINT "FK_ff7b1d71fabdc7e1f4aff552859"`,
    );
    await queryRunner.query(
      `ALTER TABLE "quiz_attempts" DROP CONSTRAINT "FK_23f2bbe9288b221b1b377372782"`,
    );
    await queryRunner.query(
      `ALTER TABLE "activity_submissions" DROP CONSTRAINT "FK_ec08f80c8403a4805765756c025"`,
    );
    await queryRunner.query(
      `ALTER TABLE "activity_submissions" DROP CONSTRAINT "FK_cec8c612271ab2cb34eff021ac3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" DROP CONSTRAINT "FK_c26db6c65929ecfeab91073e80c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" DROP CONSTRAINT "FK_64a6ac9b5af68bf37e781eebb37"`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" DROP CONSTRAINT "FK_151b79a83ba240b0cb31b2302d1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payments" DROP CONSTRAINT "FK_af929a5f2a400fdb6913b4967e1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "offers" DROP CONSTRAINT "FK_54bcb6bc59c301d3d43146df19f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "products" DROP CONSTRAINT "FK_6f8f47ee621eb21943265e88da0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "products" DROP CONSTRAINT "FK_62cb70129719259a70750834751"`,
    );
    await queryRunner.query(
      `ALTER TABLE "entitlements" DROP CONSTRAINT "FK_87ef00b2543e8e3f3508efcb4d0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "entitlements" DROP CONSTRAINT "FK_6ddb05fec91a22216938d3c2419"`,
    );
    await queryRunner.query(
      `ALTER TABLE "entitlements" DROP CONSTRAINT "FK_ce5285303a2e4073b2b745bb1e3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "enrollments" DROP CONSTRAINT "FK_a219c5d26acefcdf880222b4d0a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "enrollments" DROP CONSTRAINT "FK_60dd0ae4e21002e63a5fdefeec8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "enrollments" DROP CONSTRAINT "FK_de33d443c8ae36800c37c58c929"`,
    );
    await queryRunner.query(
      `ALTER TABLE "certificate_events" DROP CONSTRAINT "FK_0af80272520c98fb985a2a08c49"`,
    );
    await queryRunner.query(
      `ALTER TABLE "certificates" DROP CONSTRAINT "FK_f217c995f5e4d5e1385505c56be"`,
    );
    await queryRunner.query(
      `ALTER TABLE "certificates" DROP CONSTRAINT "FK_e50e73bc3bdcfb0eb3d561f1494"`,
    );
    await queryRunner.query(
      `ALTER TABLE "certificates" DROP CONSTRAINT "FK_7d072194aef1ecb98664c83e861"`,
    );
    await queryRunner.query(
      `ALTER TABLE "program_courses" DROP CONSTRAINT "FK_3b1c16fc6385863703953cb9ebe"`,
    );
    await queryRunner.query(
      `ALTER TABLE "program_courses" DROP CONSTRAINT "FK_e0e163c38c1ad3e4514fbc3cb7e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lessons" DROP CONSTRAINT "FK_6dc4890fa16a7a866b6144f4929"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lessons" DROP CONSTRAINT "FK_1a9ff2409a84c76560ae8a92590"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lesson_materials" DROP CONSTRAINT "FK_366d3fab29482cd3c71a0d98cfa"`,
    );
    await queryRunner.query(
      `ALTER TABLE "courses" DROP CONSTRAINT "FK_e6714597bea722629fa7d32124a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sections" DROP CONSTRAINT "FK_0fc0dc8ce98e7dc47c273f85e3d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "quizzes" DROP CONSTRAINT "FK_eba9ff0775c843581aab6916b32"`,
    );
    await queryRunner.query(
      `ALTER TABLE "question_options" DROP CONSTRAINT "FK_c654af7759a681f1b1addbe35bf"`,
    );
    await queryRunner.query(
      `ALTER TABLE "questions" DROP CONSTRAINT "FK_35d54f06d12ea78d4842aed6b6d"`,
    );
    await queryRunner.query(`DROP INDEX "public"."idx_platform_settings_key"`);
    await queryRunner.query(`DROP TABLE "platform_settings"`);
    await queryRunner.query(`DROP INDEX "public"."idx_audit_logs_entity"`);
    await queryRunner.query(`DROP INDEX "public"."idx_audit_logs_created"`);
    await queryRunner.query(`DROP TABLE "audit_logs"`);
    await queryRunner.query(`DROP INDEX "public"."idx_lesson_progress_unique"`);
    await queryRunner.query(`DROP TABLE "lesson_progress"`);
    await queryRunner.query(`DROP INDEX "public"."idx_webhook_events_unique"`);
    await queryRunner.query(`DROP TABLE "webhook_events"`);
    await queryRunner.query(`DROP INDEX "public"."idx_verification_tokens_hash"`);
    await queryRunner.query(`DROP INDEX "public"."idx_verification_tokens_user"`);
    await queryRunner.query(`DROP TABLE "verification_tokens"`);
    await queryRunner.query(`DROP INDEX "public"."idx_refresh_tokens_family"`);
    await queryRunner.query(`DROP INDEX "public"."idx_refresh_tokens_hash"`);
    await queryRunner.query(`DROP INDEX "public"."idx_refresh_tokens_user"`);
    await queryRunner.query(`DROP TABLE "refresh_tokens"`);
    await queryRunner.query(`DROP INDEX "public"."idx_quiz_attempts_user_quiz"`);
    await queryRunner.query(`DROP INDEX "public"."idx_quiz_attempts_number"`);
    await queryRunner.query(`DROP TABLE "quiz_attempts"`);
    await queryRunner.query(`DROP INDEX "public"."idx_activity_submissions_unique"`);
    await queryRunner.query(`DROP TABLE "activity_submissions"`);
    await queryRunner.query(`DROP INDEX "public"."idx_users_email"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP INDEX "public"."idx_orders_user"`);
    await queryRunner.query(`DROP INDEX "public"."idx_orders_reference"`);
    await queryRunner.query(`DROP TABLE "orders"`);
    await queryRunner.query(`DROP INDEX "public"."idx_payments_order"`);
    await queryRunner.query(`DROP INDEX "public"."idx_payments_gateway_ref"`);
    await queryRunner.query(`DROP TABLE "payments"`);
    await queryRunner.query(`DROP INDEX "public"."idx_offers_slug"`);
    await queryRunner.query(`DROP TABLE "offers"`);
    await queryRunner.query(`DROP INDEX "public"."idx_products_slug"`);
    await queryRunner.query(`DROP TABLE "products"`);
    await queryRunner.query(`DROP INDEX "public"."idx_coupons_code"`);
    await queryRunner.query(`DROP TABLE "coupons"`);
    await queryRunner.query(`DROP INDEX "public"."idx_entitlements_user_course"`);
    await queryRunner.query(`DROP INDEX "public"."idx_entitlements_user_program"`);
    await queryRunner.query(`DROP TABLE "entitlements"`);
    await queryRunner.query(`DROP INDEX "public"."idx_enrollments_unique"`);
    await queryRunner.query(`DROP TABLE "enrollments"`);
    await queryRunner.query(`DROP INDEX "public"."idx_certificate_events_certificate"`);
    await queryRunner.query(`DROP TABLE "certificate_events"`);
    await queryRunner.query(`DROP INDEX "public"."idx_certificates_user_course"`);
    await queryRunner.query(`DROP INDEX "public"."idx_certificates_user_program"`);
    await queryRunner.query(`DROP INDEX "public"."idx_certificates_verification_code"`);
    await queryRunner.query(`DROP TABLE "certificates"`);
    await queryRunner.query(`DROP INDEX "public"."idx_program_courses_unique"`);
    await queryRunner.query(`DROP TABLE "program_courses"`);
    await queryRunner.query(`DROP INDEX "public"."idx_programs_slug"`);
    await queryRunner.query(`DROP TABLE "programs"`);
    await queryRunner.query(`DROP INDEX "public"."idx_lessons_section_order"`);
    await queryRunner.query(`DROP INDEX "public"."idx_lessons_course_slug"`);
    await queryRunner.query(`DROP TABLE "lessons"`);
    await queryRunner.query(`DROP INDEX "public"."idx_lesson_materials_lesson_order"`);
    await queryRunner.query(`DROP TABLE "lesson_materials"`);
    await queryRunner.query(`DROP INDEX "public"."idx_courses_slug"`);
    await queryRunner.query(`DROP TABLE "courses"`);
    await queryRunner.query(`DROP INDEX "public"."idx_sections_course_order"`);
    await queryRunner.query(`DROP TABLE "sections"`);
    await queryRunner.query(`DROP TABLE "instructors"`);
    await queryRunner.query(`DROP INDEX "public"."idx_quizzes_lesson"`);
    await queryRunner.query(`DROP TABLE "quizzes"`);
    await queryRunner.query(`DROP INDEX "public"."idx_question_options_question_order"`);
    await queryRunner.query(`DROP TABLE "question_options"`);
    await queryRunner.query(`DROP INDEX "public"."idx_questions_quiz_order"`);
    await queryRunner.query(`DROP TABLE "questions"`);
  }
}
