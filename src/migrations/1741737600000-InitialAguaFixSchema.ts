import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialAguaFixSchema1741737600000 implements MigrationInterface {
  name = 'InitialAguaFixSchema1741737600000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "WATER_REPORT" (
        "id" SERIAL NOT NULL,
        "address" character varying(255) NOT NULL,
        "description" text NOT NULL,
        "severity" character varying(20) NOT NULL,
        "reporterPhone" character varying(50) NOT NULL,
        "isResolved" boolean NOT NULL DEFAULT false,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_WATER_REPORT_ID" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "SYSTEM_USER" (
        "id" SERIAL NOT NULL,
        "name" character varying(150) NOT NULL,
        "email" character varying(150) NOT NULL,
        "password" character varying(255) NOT NULL,
        "isNotificationEnabled" boolean NOT NULL DEFAULT true,
        CONSTRAINT "UQ_SYSTEM_USER_EMAIL" UNIQUE ("email"),
        CONSTRAINT "PK_SYSTEM_USER_ID" PRIMARY KEY ("id")
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "SYSTEM_USER"`);
    await queryRunner.query(`DROP TABLE "WATER_REPORT"`);
  }
}
