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

  @Cron('0 0 * * *') // Executar diariamente à meia-noite
  async sendReleaseNotifications() {
    this.logger.log('Checking for movie releases today...');

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

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
        // Garantir que releaseDate não seja undefined
        if (!movie.releaseDate) {
          this.logger.warn(`Movie ${movie.title} has no release date. Using today's date.`);
          movie.releaseDate = new Date();
        }

        await this.emailService.sendReleaseNotification({
          to: movie.createdBy.email,
          subject: `🎬 Lançamento hoje: ${movie.title}`,
          movieTitle: movie.title,
          releaseDate: movie.releaseDate, // Agora garantimos que isso nunca será undefined
        });
        this.logger.log(`Sent notification for movie: ${movie.title}`);
      } catch (error) {
        const err = error as Error;
        this.logger.error(`Failed to send notification for movie: ${movie.title} - ${err.message}`);
      }
    }
  }
}
