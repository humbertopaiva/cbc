import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTaglineColumn1747300000000 implements MigrationInterface {
  name = 'AddTaglineColumn1747300000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const taglineExists = await this.columnExists(queryRunner, 'movies', 'tagline');

    if (!taglineExists) {
      await queryRunner.query(`
        ALTER TABLE "movies" 
        ADD COLUMN "tagline" text
      `);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const taglineExists = await this.columnExists(queryRunner, 'movies', 'tagline');

    if (taglineExists) {
      await queryRunner.query(`
        ALTER TABLE "movies" 
        DROP COLUMN "tagline"
      `);
    }
  }

  private async columnExists(
    queryRunner: QueryRunner,
    table: string,
    column: string,
  ): Promise<boolean> {
    const result = (await queryRunner.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = '${table}' AND column_name = '${column}' AND table_schema = 'public'
    `)) as Array<Record<string, any>>;

    return result.length > 0;
  }
}
