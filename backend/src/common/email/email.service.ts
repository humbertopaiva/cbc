import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

interface SendReleaseNotificationParams {
  to: string;
  subject: string;
  movieTitle: string;
  releaseDate: Date;
}

// Definir interface para o resultado do envio de email
interface SendMailResult {
  messageId: string;
  envelope: {
    from: string;
    to: string[];
  };
  accepted: string[];
  rejected: string[];
  pending: string[];
  response: string;
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    const host = this.configService.get<string>('MAIL_HOST');
    const port = this.configService.get<number>('MAIL_PORT');
    const user = this.configService.get<string>('MAIL_USER');
    const pass = this.configService.get<string>('MAIL_PASS');

    this.logger.log(`Configuring email service with host ${host}:${port}`);

    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure: false, // true para 465, false para outras portas
      auth: user && pass ? { user, pass } : undefined,
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

      const mailOptions = {
        from: `"CUBOS Movies" <${this.configService.get<string>('MAIL_FROM') || 'noreply@cubosmovies.com'}>`,
        to,
        subject,
        html,
      };

      // Usar a interface SendMailResult para tipar corretamente o resultado
      const info = (await this.transporter.sendMail(mailOptions)) as SendMailResult;

      this.logger.log(
        `Release notification email sent to ${to} for movie "${movieTitle}": ${info.messageId}`,
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error(`Failed to send release notification email: ${error.message}`);
        throw new Error(`Could not send notification email: ${error.message}`);
      }
      this.logger.error('Unknown error sending notification email');
      throw new Error('Could not send notification email due to an unknown error');
    }
  }
}
