import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { GenresService } from '../genres/genres.service';
import { Logger } from '@nestjs/common';

async function bootstrap(): Promise<void> {
  const logger = new Logger('Seed');
  logger.log('Starting application seeding...');

  const app = await NestFactory.createApplicationContext(AppModule);

  try {
    const genresService = app.get(GenresService);

    const genres = [
      'Ação',
      'Aventura',
      'Animação',
      'Comédia',
      'Crime',
      'Documentário',
      'Drama',
      'Família',
      'Fantasia',
      'História',
      'Terror',
      'Música',
      'Mistério',
      'Romance',
      'Ficção Científica',
      'Thriller',
      'Guerra',
      'Faroeste',
    ];

    logger.log(`Seeding ${genres.length} genres...`);

    for (const genreName of genres) {
      try {
        // Verificar se o gênero já existe
        const existingGenre = await genresService.findByName(genreName);
        if (!existingGenre) {
          await genresService.create({ name: genreName });
          logger.log(`Created genre: ${genreName}`);
        } else {
          logger.log(`Genre already exists: ${genreName}`);
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          logger.error(`Error creating genre ${genreName}: ${error.message}`);
        } else {
          logger.error(`Unknown error creating genre ${genreName}`);
        }
      }
    }

    logger.log('Seeds completed successfully!');
  } catch (error: unknown) {
    if (error instanceof Error) {
      logger.error(`Error during seeding: ${error.message}`);
    } else {
      logger.error('Unknown error during seeding');
    }
  } finally {
    await app.close();
  }
}

bootstrap().catch((err: unknown) => {
  if (err instanceof Error) {
    console.error(`Failed to seed database: ${err.message}`);
  } else {
    console.error('Failed to seed database with unknown error');
  }
  process.exit(1);
});
