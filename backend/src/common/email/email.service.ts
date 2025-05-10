import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Resend from 'resend';

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
}

interface SendPasswordResetParams {
  to: string;
  resetToken: string;
  userName: string;
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private resend = null;

  constructor(private configService: ConfigService) {
    const resendApiKey = this.configService.get<string>('RESEND_API_KEY');

    if (resendApiKey) {
      this.resend = Resend(resendApiKey);
      this.logger.log('Resend email service initialized');
    } else {
      this.logger.warn('RESEND_API_KEY not found, falling back to console logging');
    }
  }

  async sendEmail({ to, subject, html }: SendEmailParams): Promise<boolean> {
    try {
      if (this.resend) {
        const fromEmail = this.configService.get<string>('MAIL_FROM') || 'noreply@cubosmovies.com';
        const result = await this.resend.emails.send({
          from: `CUBOS Movies <${fromEmail}>`,
          to,
          subject,
          html,
        });

        this.logger.log(`Email sent to ${to}: ${result.id}`);
        return true;
      } else {
        // Fallback para ambiente de desenvolvimento sem API key do Resend
        this.logger.debug(`[DEV MODE] Email would be sent to: ${to}`);
        this.logger.debug(`[DEV MODE] Subject: ${subject}`);
        this.logger.debug(`[DEV MODE] Content: ${html}`);
        return true;
      }
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(`Failed to send email: ${error.message}`);
        this.logger.error(error.stack);
      } else {
        this.logger.error(`Failed to send email: Unknown error`);
      }
      return false;
    }
  }

  async sendPasswordResetEmail({
    to,
    resetToken,
    userName,
  }: SendPasswordResetParams): Promise<boolean> {
    const frontendUrl = this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3000';
    const resetLink = `${frontendUrl}/reset-password/${resetToken}`;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #6200ea; text-align: center;">Recuperação de Senha</h1>
        <div style="background-color: #f5f5f5; border-radius: 8px; padding: 20px; margin-top: 20px;">
          <h2 style="color: #333;">Olá, ${userName}!</h2>
          <p style="font-size: 16px; color: #555;">
            Você solicitou a recuperação de senha para sua conta no CUBOS Movies.
          </p>
          <p style="font-size: 16px; color: #555;">
            Por favor, clique no botão abaixo para criar uma nova senha. Este link é válido por 1 hora.
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" style="background-color: #6200ea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">
              Recuperar Senha
            </a>
          </div>
          <p style="font-size: 14px; color: #777;">
            Se você não solicitou esta recuperação de senha, ignore este email.
          </p>
        </div>
        <p style="text-align: center; margin-top: 20px; color: #666; font-size: 14px;">
          Este é um email automático da plataforma CUBOS Movies.
          Por favor, não responda a este email.
        </p>
      </div>
    `;

    return this.sendEmail({
      to,
      subject: 'Recuperação de Senha - CUBOS Movies',
      html,
    });
  }
}
