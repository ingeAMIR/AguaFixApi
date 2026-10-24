import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPhotosToWaterReport1741800000000 implements MigrationInterface {
  name = 'AddPhotosToWaterReport1741800000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "WATER_REPORT"
      ADD COLUMN "photoUrl" character varying(500),
      ADD COLUMN "repairPhotoUrl" character varying(500)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "WATER_REPORT"
      DROP COLUMN "repairPhotoUrl",
      DROP COLUMN "photoUrl"
    `);
  }
}
