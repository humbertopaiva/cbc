import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Cron } from '@nestjs/schedule';
import { Movie } from './entities/movie.entity';
import { EmailService } from '../common/email/email.service';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    @InjectRepository(Movie)
    private readonly moviesRepository: Repository<Movie>,
    private readonly emailService: EmailService,
  ) {}

  @Cron('0 9 * * *') // Executar diariamente às 9h
  async sendReleaseNotifications(): Promise<void> {
    this.logger.log('Checking for movie releases today...');

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    try {
      // Buscar filmes que serão lançados hoje
      const releasingMovies = await this.moviesRepository.find({
        where: {
          releaseDate: Between(today, tomorrow),
        },
        relations: ['createdBy'],
      });

      this.logger.log(`Found ${releasingMovies.length} movies releasing today`);

      // Enviar email para cada filme
      for (const movie of releasingMovies) {
        try {
          if (!movie.releaseDate) {
            this.logger.warn(`Movie ${movie.title} has undefined release date`);
            continue;
          }

          if (!movie.createdBy || !movie.createdBy.email) {
            this.logger.warn(`Movie ${movie.title} has no valid creator email`);
            continue;
          }

          await this.emailService.sendReleaseNotification({
            to: movie.createdBy.email,
            subject: `🎬 Lançamento hoje: ${movie.title}`,
            movieTitle: movie.title,
            releaseDate: movie.releaseDate,
          });

          this.logger.log(`Sent notification for movie: ${movie.title}`);
        } catch (error: unknown) {
          if (error instanceof Error) {
            this.logger.error(
              `Failed to send notification for movie ${movie.title}: ${error.message}`,
            );
          } else {
            this.logger.error(`Failed to send notification for movie ${movie.title}`);
          }
        }
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error(`Error in release notification service: ${error.message}`);
      } else {
        this.logger.error('Unknown error in release notification service');
      }
    }
  }
}
