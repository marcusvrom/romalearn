import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Rubrica na aula e resultado da correção na entrega.
 *
 * As entregas que já existiam permanecem válidas: recebem o status
 * SUBMITTED e seguem contando para a regra ACTIVITY_SUBMITTED, que continua
 * disponível. Nenhum aluno perde progresso por causa desta migration.
 */
export class ActivityGrading1785899000000 implements MigrationInterface {
  name = 'ActivityGrading1785899000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "lessons" ADD "activityRubric" jsonb`);

    await queryRunner.query(
      `ALTER TABLE "activity_submissions" ADD "status" character varying(32) NOT NULL DEFAULT 'SUBMITTED'`,
    );
    await queryRunner.query(`ALTER TABLE "activity_submissions" ADD "score" numeric(5,2)`);
    await queryRunner.query(
      `ALTER TABLE "activity_submissions" ADD "criteriaResults" jsonb NOT NULL DEFAULT '[]'::jsonb`,
    );
    await queryRunner.query(
      `ALTER TABLE "activity_submissions" ADD "strengths" jsonb NOT NULL DEFAULT '[]'::jsonb`,
    );
    await queryRunner.query(
      `ALTER TABLE "activity_submissions" ADD "improvements" jsonb NOT NULL DEFAULT '[]'::jsonb`,
    );
    await queryRunner.query(
      `ALTER TABLE "activity_submissions" ADD "criticalFailures" jsonb NOT NULL DEFAULT '[]'::jsonb`,
    );
    await queryRunner.query(
      `ALTER TABLE "activity_submissions" ADD "gradedBy" character varying(16)`,
    );
    await queryRunner.query(
      `ALTER TABLE "activity_submissions" ADD "graderModel" character varying(120)`,
    );
    await queryRunner.query(
      `ALTER TABLE "activity_submissions" ADD "attemptNumber" integer NOT NULL DEFAULT 1`,
    );
    await queryRunner.query(
      `ALTER TABLE "activity_submissions" ADD "gradedAt" TIMESTAMP WITH TIME ZONE`,
    );

    // A fila de correção pendente é consultada pelo painel administrativo.
    await queryRunner.query(
      `CREATE INDEX "idx_activity_submissions_status" ON "activity_submissions" ("status", "submittedAt")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "idx_activity_submissions_status"`);
    for (const column of [
      'gradedAt',
      'attemptNumber',
      'graderModel',
      'gradedBy',
      'criticalFailures',
      'improvements',
      'strengths',
      'criteriaResults',
      'score',
      'status',
    ]) {
      await queryRunner.query(`ALTER TABLE "activity_submissions" DROP COLUMN "${column}"`);
    }
    await queryRunner.query(`ALTER TABLE "lessons" DROP COLUMN "activityRubric"`);
  }
}
