import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddNewMovieFields1747100000000 implements MigrationInterface {
  name = 'AddNewMovieFields1747100000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE "public"."movie_status_enum" AS ENUM('released', 'in_production')
    `);

    await queryRunner.query(`
      ALTER TABLE "movies" 
      ADD COLUMN IF NOT EXISTS "status" "movie_status_enum" DEFAULT 'in_production',
      ADD COLUMN IF NOT EXISTS "language" character varying,
      ADD COLUMN IF NOT EXISTS "revenue" decimal(15,2),
      ADD COLUMN IF NOT EXISTS "profit" decimal(15,2),
      ADD COLUMN IF NOT EXISTS "trailer_url" character varying,
      ADD COLUMN IF NOT EXISTS "popularity" integer,
      ADD COLUMN IF NOT EXISTS "vote_count" integer
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "idx_movies_status" ON "movies" ("status");
      CREATE INDEX IF NOT EXISTS "idx_movies_language" ON "movies" ("language");
      CREATE INDEX IF NOT EXISTS "idx_movies_popularity" ON "movies" ("popularity");
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP INDEX IF EXISTS "idx_movies_status";
      DROP INDEX IF EXISTS "idx_movies_language";
      DROP INDEX IF EXISTS "idx_movies_popularity";
    `);

    await queryRunner.query(`
      ALTER TABLE "movies" 
      DROP COLUMN IF EXISTS "status",
      DROP COLUMN IF EXISTS "language",
      DROP COLUMN IF EXISTS "revenue",
      DROP COLUMN IF EXISTS "profit",
      DROP COLUMN IF EXISTS "trailer_url",
      DROP COLUMN IF EXISTS "popularity",
      DROP COLUMN IF EXISTS "vote_count"
    `);

    await queryRunner.query(`
      DROP TYPE IF EXISTS "public"."movie_status_enum"
    `);
  }
}
