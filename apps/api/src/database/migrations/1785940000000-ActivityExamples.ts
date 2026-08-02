import { MigrationInterface, QueryRunner } from 'typeorm';

/** Exemplo comentado da atividade prática. */
export class ActivityExamples1785940000000 implements MigrationInterface {
  name = 'ActivityExamples1785940000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "lessons" ADD "activityExample" jsonb`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "lessons" DROP COLUMN "activityExample"`);
  }
}
