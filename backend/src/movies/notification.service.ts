import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Cron } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';
import { Movie } from './entities/movie.entity';
import { PendingNotification } from './entities/pending-notification.entity';
import { EmailService } from '../common/email/email.service';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);
  private readonly isDevelopmentMode: boolean;

  constructor(
    @InjectRepository(Movie)
    private readonly moviesRepository: Repository<Movie>,
    @InjectRepository(PendingNotification)
    private readonly pendingNotificationRepository: Repository<PendingNotification>,
    private readonly emailService: EmailService,
    private readonly configService: ConfigService,
  ) {
    this.isDevelopmentMode = this.configService.get<string>('NOTIFICATION_DEV_MODE') === 'true';
    if (this.isDevelopmentMode) {
      this.logger.log('Running in notification development mode');
    }
  }

  async scheduleReleaseNotification(movie: Movie): Promise<void> {
    if (!movie.releaseDate) {
      return;
    }

    const now = new Date();
    const releaseDate = new Date(movie.releaseDate);

    // Verificar se a data de lançamento é no futuro
    if (releaseDate > now) {
      // Criar registro de notificação pendente
      const notification = this.pendingNotificationRepository.create({
        movie,
        movieId: movie.id,
        notificationDate: releaseDate,
        notificationSent: false,
      });

      await this.pendingNotificationRepository.save(notification);
      this.logger.log(
        `Scheduled notification for movie: ${movie.title} on ${releaseDate.toISOString()}`,
      );

      // No modo de desenvolvimento, enviar notificação imediatamente
      if (this.isDevelopmentMode) {
        this.logger.log(
          `Development mode: Sending immediate test notification for movie: ${movie.title}`,
        );
        await this.sendMovieReleaseNotification(movie);
      }
    }
  }

  private async sendMovieReleaseNotification(movie: Movie): Promise<boolean> {
    try {
      if (!movie.releaseDate || !movie.createdBy || !movie.createdBy.email) {
        this.logger.warn(`Missing required data for movie notification: ${movie.id}`);
        return false;
      }

      await this.emailService.sendReleaseNotification({
        to: movie.createdBy.email,
        subject: `🎬 Lançamento hoje: ${movie.title}`,
        movieTitle: movie.title,
        releaseDate: movie.releaseDate,
      });

      this.logger.log(`Sent release notification for movie: ${movie.title}`);
      return true;
    } catch (error) {
      this.logger.error(
        `Failed to send release notification for movie ${movie.id}: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
      return false;
    }
  }

  @Cron('0 8 * * *')
  async checkAndSendReleaseNotifications(): Promise<void> {
    this.logger.log('Checking for movie releases today...');

    try {
      // Obter a data de hoje (início do dia)
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Obter o final do dia
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      // Buscar notificações pendentes para filmes que serão lançados hoje
      const pendingNotifications = await this.pendingNotificationRepository.find({
        where: {
          notificationDate: Between(today, tomorrow),
          notificationSent: false,
        },
        relations: ['movie', 'movie.createdBy'],
      });

      this.logger.log(`Found ${pendingNotifications.length} pending notifications for today`);

      // Processar cada notificação
      for (const notification of pendingNotifications) {
        if (!notification.movie || !notification.movie.createdBy) {
          this.logger.warn(`Missing movie or user data for notification: ${notification.id}`);
          continue;
        }

        // Enviar notificação
        const sent = await this.sendMovieReleaseNotification(notification.movie);

        if (sent) {
          // Marcar como enviada
          notification.notificationSent = true;
          await this.pendingNotificationRepository.save(notification);
        }
      }
    } catch (error) {
      this.logger.error(
        `Error in release notification service: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
    }
  }

  async forceNotificationsForTestingPurposes(movieId: string): Promise<boolean> {
    try {
      const movie = await this.moviesRepository.findOne({
        where: { id: movieId },
        relations: ['createdBy'],
      });

      if (!movie) {
        return false;
      }

      await this.sendMovieReleaseNotification(movie);
      return true;
    } catch (error) {
      this.logger.error(
        `Error in force notification test: ${error instanceof Error ? error.message : String(error)}`,
      );
      return false;
    }
  }
}
