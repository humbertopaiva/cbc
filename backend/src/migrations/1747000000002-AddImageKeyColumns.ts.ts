import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddImageKeyColumns1747000000002 implements MigrationInterface {
  name = 'AddImageKeyColumns1747000000002';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "movies" 
      ADD COLUMN "image_key" character varying,
      ADD COLUMN "backdrop_key" character varying
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "movies" 
      DROP COLUMN "image_key",
      DROP COLUMN "backdrop_key"
    `);
  }
}
