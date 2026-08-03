import { MigrationInterface, QueryRunner } from 'typeorm';

/** Metadados editoriais para apresentar uma trilha como jornada, inclusive com bifurcações. */
export class ProgramJourneyStages1786000000000 implements MigrationInterface {
  name = 'ProgramJourneyStages1786000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "program_courses" ADD "stage" integer NOT NULL DEFAULT 0`);
    await queryRunner.query(
      `ALTER TABLE "program_courses" ADD "stageTitle" character varying(200) NOT NULL DEFAULT ''`,
    );
    await queryRunner.query(
      `ALTER TABLE "program_courses" ADD "stageDescription" character varying(500) NOT NULL DEFAULT ''`,
    );
    await queryRunner.query(
      `ALTER TABLE "program_courses" ADD "isRequired" boolean NOT NULL DEFAULT true`,
    );
    await queryRunner.query(
      `ALTER TABLE "program_courses" ADD "alternativeGroup" character varying(120)`,
    );
    await queryRunner.query(
      `ALTER TABLE "program_courses" ADD "portfolioOutcome" character varying(400) NOT NULL DEFAULT ''`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "program_courses" DROP COLUMN "portfolioOutcome"`);
    await queryRunner.query(`ALTER TABLE "program_courses" DROP COLUMN "alternativeGroup"`);
    await queryRunner.query(`ALTER TABLE "program_courses" DROP COLUMN "isRequired"`);
    await queryRunner.query(`ALTER TABLE "program_courses" DROP COLUMN "stageDescription"`);
    await queryRunner.query(`ALTER TABLE "program_courses" DROP COLUMN "stageTitle"`);
    await queryRunner.query(`ALTER TABLE "program_courses" DROP COLUMN "stage"`);
  }
}
