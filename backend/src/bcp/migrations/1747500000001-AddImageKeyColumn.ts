import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddImageKeyColumn1747500000001 implements MigrationInterface {
  name = 'AddImageKeyColumn1747500000001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const imageKeyExists = await this.columnExists(queryRunner, 'movies', 'image_key');

    if (!imageKeyExists) {
      await queryRunner.query(`
        ALTER TABLE "movies" 
        ADD COLUMN "image_key" character varying
      `);
      console.log('Coluna image_key adicionada com sucesso');
    } else {
      console.log('Coluna image_key já existe, ignorando');
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const imageKeyExists = await this.columnExists(queryRunner, 'movies', 'image_key');

    if (imageKeyExists) {
      await queryRunner.query(`
        ALTER TABLE "movies" 
        DROP COLUMN "image_key"
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
