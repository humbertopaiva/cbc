import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

interface SendReleaseNotificationParams {
  to: string;
  subject: string;
  movieTitle: string;
  releaseDate: Date;
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('MAIL_HOST'),
      port: this.configService.get<number>('MAIL_PORT'),
      secure: false, // true para 465, false para outras portas
      auth: {
        user: this.configService.get<string>('MAIL_USER') || '',
        pass: this.configService.get<string>('MAIL_PASS') || '',
      },
    });
  }

  async sendReleaseNotification({
    to,
    subject,
    movieTitle,
    releaseDate,
  }: SendReleaseNotificationParams): Promise<void> {
    try {
      const formattedDate = new Date(releaseDate).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      });

      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #6200ea; text-align: center;">Lançamento de Filme Hoje! 🎬</h1>
          <div style="background-color: #f5f5f5; border-radius: 8px; padding: 20px; margin-top: 20px;">
            <h2 style="color: #333;">${movieTitle}</h2>
            <p style="font-size: 16px; color: #555;">
              O filme <strong>${movieTitle}</strong> está sendo lançado hoje, ${formattedDate}!
            </p>
            <p style="font-size: 16px; color: #555;">
              Não se esqueça de conferir este lançamento que você adicionou à nossa plataforma.
            </p>
          </div>
          <p style="text-align: center; margin-top: 20px; color: #666; font-size: 14px;">
            Este é um email automático da plataforma CUBOS Movies.
            Por favor, não responda a este email.
          </p>
        </div>
      `;

      await this.transporter.sendMail({
        from: `"CUBOS Movies" <${this.configService.get<string>('MAIL_FROM') || 'noreply@cubosmovies.com'}>`,
        to,
        subject,
        html,
      });

      this.logger.log(
        `Email·de·notificação·de·lançamento·enviado·para·${to}·for·movie·"${movieTitle}"`,
      );
    } catch (err) {
      const error = err as Error;
      this.logger.error(`Falha ao enviar email de notificação: ${error.message}`);
      throw new Error(`O email de notificação nao pôde ser enviado: ${error.message}`);
    }
  }
}
