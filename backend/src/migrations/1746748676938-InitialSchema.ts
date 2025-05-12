import { MigrationInterface, QueryRunner } from 'typeorm';

export class CompleteMigration1747900000000 implements MigrationInterface {
  name = 'CompleteMigration1747900000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Criar a tabela de gêneros
    await queryRunner.query(
      `CREATE TABLE "genres" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, CONSTRAINT "UQ_f105f8230a83b86a346427de94d" UNIQUE ("name"), CONSTRAINT "PK_80ecd718f0f00dde5d77a9be842" PRIMARY KEY ("id"))`,
    );

    // Criar enum de status para filmes
    await queryRunner.query(`
      CREATE TYPE "public"."movie_status_enum" AS ENUM('released', 'in_production')
    `);

    // Criar a tabela de filmes com todos os campos adicionais
    await queryRunner.query(
      `CREATE TABLE "movies" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(), 
        "title" character varying NOT NULL, 
        "original_title" character varying, 
        "description" text, 
        "budget" numeric(15,2), 
        "release_date" TIMESTAMP, 
        "duration" integer, 
        "image_url" character varying, 
        "backdrop_url" character varying, 
        "rating" numeric(3,1), 
        "created_at" TIMESTAMP NOT NULL DEFAULT now(), 
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(), 
        "created_by" uuid,
        "backdrop_key" character varying,
        "image_key" character varying,
        "status" "movie_status_enum" DEFAULT 'in_production',
        "language" character varying,
        "revenue" decimal(15,2),
        "profit" decimal(15,2),
        "trailer_url" character varying,
        "popularity" integer,
        "vote_count" integer,
        "tagline" text,
        CONSTRAINT "PK_c5b2c134e871bfd1c2fe7cc3705" PRIMARY KEY ("id"))`,
    );

    // Criar índices para os novos campos
    await queryRunner.query(`
      CREATE INDEX "idx_movies_status" ON "movies" ("status");
      CREATE INDEX "idx_movies_language" ON "movies" ("language");
      CREATE INDEX "idx_movies_popularity" ON "movies" ("popularity");
    `);

    // Criar a tabela de usuários
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );

    // Criar a tabela de notificações pendentes
    await queryRunner.query(
      `CREATE TABLE "pending_notifications" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "movie_id" uuid NOT NULL, "notification_date" TIMESTAMP NOT NULL, "notification_sent" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_9428eea204ac40d17f70d9f3236" PRIMARY KEY ("id"))`,
    );

    // Criar a tabela de relação entre filmes e gêneros
    await queryRunner.query(
      `CREATE TABLE "movie_genres" ("movie_id" uuid NOT NULL, "genre_id" uuid NOT NULL, CONSTRAINT "PK_ec45eae1bc95d1461ad55713ffc" PRIMARY KEY ("movie_id", "genre_id"))`,
    );

    // Criar índices para a tabela movie_genres
    await queryRunner.query(
      `CREATE INDEX "IDX_ae967ce58ef99e9ff3933ccea4" ON "movie_genres" ("movie_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_bbbc12542564f7ff56e36f5bbf" ON "movie_genres" ("genre_id") `,
    );

    // Criar a tabela para tokens de redefinição de senha
    await queryRunner.query(`
      CREATE TABLE "password_reset_tokens" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "userId" uuid NOT NULL,
        "token" character varying NOT NULL,
        "used" boolean NOT NULL DEFAULT false,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "expiresAt" TIMESTAMP NOT NULL,
        CONSTRAINT "PK_password_reset_tokens" PRIMARY KEY ("id")
      )
    `);

    // Criar índices para tokens de redefinição de senha
    await queryRunner.query(`
      CREATE INDEX "idx_password_reset_tokens_token" ON "password_reset_tokens" ("token");
      CREATE INDEX "idx_password_reset_tokens_userId" ON "password_reset_tokens" ("userId");
    `);

    // Adicionar chaves estrangeiras
    await queryRunner.query(
      `ALTER TABLE "movies" ADD CONSTRAINT "FK_d9bdf4b965d917d35ab4e759f65" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "pending_notifications" ADD CONSTRAINT "FK_b850bf350b54dbc3886b60a9a87" FOREIGN KEY ("movie_id") REFERENCES "movies"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "movie_genres" ADD CONSTRAINT "FK_ae967ce58ef99e9ff3933ccea48" FOREIGN KEY ("movie_id") REFERENCES "movies"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "movie_genres" ADD CONSTRAINT "FK_bbbc12542564f7ff56e36f5bbf6" FOREIGN KEY ("genre_id") REFERENCES "genres"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(`
      ALTER TABLE "password_reset_tokens"
       ADD CONSTRAINT "FK_password_reset_tokens_users"
       FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remover chaves estrangeiras
    await queryRunner.query(
      `ALTER TABLE "password_reset_tokens" DROP CONSTRAINT "FK_password_reset_tokens_users"`,
    );
    await queryRunner.query(
      `ALTER TABLE "movie_genres" DROP CONSTRAINT "FK_bbbc12542564f7ff56e36f5bbf6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "movie_genres" DROP CONSTRAINT "FK_ae967ce58ef99e9ff3933ccea48"`,
    );
    await queryRunner.query(
      `ALTER TABLE "pending_notifications" DROP CONSTRAINT "FK_b850bf350b54dbc3886b60a9a87"`,
    );
    await queryRunner.query(
      `ALTER TABLE "movies" DROP CONSTRAINT "FK_d9bdf4b965d917d35ab4e759f65"`,
    );

    // Remover índices
    await queryRunner.query(`DROP INDEX "public"."idx_password_reset_tokens_token"`);
    await queryRunner.query(`DROP INDEX "public"."idx_password_reset_tokens_userId"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_bbbc12542564f7ff56e36f5bbf"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_ae967ce58ef99e9ff3933ccea4"`);
    await queryRunner.query(`DROP INDEX "public"."idx_movies_status"`);
    await queryRunner.query(`DROP INDEX "public"."idx_movies_language"`);
    await queryRunner.query(`DROP INDEX "public"."idx_movies_popularity"`);

    // Remover tabelas
    await queryRunner.query(`DROP TABLE "password_reset_tokens"`);
    await queryRunner.query(`DROP TABLE "movie_genres"`);
    await queryRunner.query(`DROP TABLE "pending_notifications"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TABLE "movies"`);
    await queryRunner.query(`DROP TABLE "genres"`);

    // Remover enum
    await queryRunner.query(`DROP TYPE "public"."movie_status_enum"`);
  }
}
