import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Anexo da atividade prática.
 *
 * Substitui o campo `attachmentKeys`, que era um marcador reservado e nunca
 * chegou a receber dados — nenhuma entrega existente perde informação.
 */
export class ActivityAttachments1785920000000 implements MigrationInterface {
  name = 'ActivityAttachments1785920000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "lessons" ADD "activityAttachmentPolicy" jsonb`);

    await queryRunner.query(`ALTER TABLE "activity_submissions" DROP COLUMN "attachmentKeys"`);
    await queryRunner.query(
      `ALTER TABLE "activity_submissions" ADD "attachmentKey" character varying(512)`,
    );
    await queryRunner.query(
      `ALTER TABLE "activity_submissions" ADD "attachmentName" character varying(255)`,
    );
    await queryRunner.query(`ALTER TABLE "activity_submissions" ADD "attachmentSizeBytes" integer`);
    await queryRunner.query(
      `ALTER TABLE "activity_submissions" ADD "attachmentUploadedAt" TIMESTAMP WITH TIME ZONE`,
    );
    await queryRunner.query(
      `ALTER TABLE "activity_submissions" ADD "attachmentChecks" jsonb NOT NULL DEFAULT '[]'::jsonb`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    for (const column of [
      'attachmentChecks',
      'attachmentUploadedAt',
      'attachmentSizeBytes',
      'attachmentName',
      'attachmentKey',
    ]) {
      await queryRunner.query(`ALTER TABLE "activity_submissions" DROP COLUMN "${column}"`);
    }
    await queryRunner.query(
      `ALTER TABLE "activity_submissions" ADD "attachmentKeys" jsonb NOT NULL DEFAULT '[]'::jsonb`,
    );
    await queryRunner.query(`ALTER TABLE "lessons" DROP COLUMN "activityAttachmentPolicy"`);
  }
}
