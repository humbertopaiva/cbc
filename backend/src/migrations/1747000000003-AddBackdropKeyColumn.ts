import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddBackdropKeyColumn1747000000003 implements MigrationInterface {
  name = 'AddBackdropKeyColumn1747000000003';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const backdropKeyExists = await this.columnExists(queryRunner, 'movies', 'backdrop_key');

    if (!backdropKeyExists) {
      await queryRunner.query(`
        ALTER TABLE "movies" 
        ADD COLUMN "backdrop_key" character varying
      `);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const backdropKeyExists = await this.columnExists(queryRunner, 'movies', 'backdrop_key');

    if (backdropKeyExists) {
      await queryRunner.query(`
        ALTER TABLE "movies" 
        DROP COLUMN "backdrop_key"
      `);
    }
  }

  private async columnExists(
    queryRunner: QueryRunner,
    table: string,
    column: string,
  ): Promise<boolean> {
    // Especificar que o resultado é um array de objetos
    const result = (await queryRunner.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = '${table}' AND column_name = '${column}' AND table_schema = 'public'
    `)) as Array<Record<string, any>>;

    return result.length > 0;
  }
}
