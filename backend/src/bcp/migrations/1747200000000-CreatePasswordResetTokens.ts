import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePasswordResetTokens1747200000000 implements MigrationInterface {
  name = 'CreatePasswordResetTokens1747200000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
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

    await queryRunner.query(`
      CREATE INDEX "idx_password_reset_tokens_token" ON "password_reset_tokens" ("token");
      CREATE INDEX "idx_password_reset_tokens_userId" ON "password_reset_tokens" ("userId");
    `);

    await queryRunner.query(`
      ALTER TABLE "password_reset_tokens" 
      ADD CONSTRAINT "FK_password_reset_tokens_users" 
      FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP INDEX "idx_password_reset_tokens_token";
      DROP INDEX "idx_password_reset_tokens_userId";
    `);

    await queryRunner.query(`
      ALTER TABLE "password_reset_tokens" 
      DROP CONSTRAINT "FK_password_reset_tokens_users"
    `);

    await queryRunner.query(`
      DROP TABLE "password_reset_tokens"
    `);
  }
}
