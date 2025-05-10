import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { SignUpInput } from './dto/signup.input';
import { AuthPayload } from './dto/auth-payload';
import { LoginInput } from './dto/login.input';
import { User } from '../users/entities/user.entity';
import { randomBytes } from 'crypto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PasswordResetToken } from './entities/password-reset-token.entity';
import { EmailService } from '../common/email/email.service';

interface RequestPasswordResetResult {
  success: boolean;
  message: string;
}

interface ResetPasswordResult {
  success: boolean;
  message: string;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
    @InjectRepository(PasswordResetToken)
    private readonly passwordResetTokenRepository: Repository<PasswordResetToken>,
  ) {}

  async signUp(signUpInput: SignUpInput): Promise<AuthPayload> {
    const { name, email, password, passwordConfirmation } = signUpInput;

    if (password !== passwordConfirmation) {
      throw new Error('Passwords do not match');
    }

    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      throw new Error('Email already in use');
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await this.usersService.create({
        name,
        email,
        password: hashedPassword,
      });

      const token = this.generateToken(user.id);

      return { token, user };
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error(`Error during sign up: ${error.message}`);
        throw new Error(`Failed to create user: ${error.message}`);
      }
      throw new Error('Failed to create user due to an unknown error');
    }
  }

  async login(loginInput: LoginInput): Promise<AuthPayload> {
    const { email, password } = loginInput;

    try {
      const user = await this.usersService.findByEmail(email);
      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const token = this.generateToken(user.id);

      return { token, user };
    } catch (error: unknown) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      if (error instanceof Error) {
        this.logger.error(`Error during login: ${error.message}`);
      }
      throw new UnauthorizedException('Failed to authenticate');
    }
  }

  private generateToken(userId: string): string {
    return this.jwtService.sign({ userId });
  }

  async validateUser(userId: string): Promise<User> {
    return this.usersService.findById(userId);
  }

  async requestPasswordReset(email: string): Promise<RequestPasswordResetResult> {
    try {
      const user = await this.usersService.findByEmail(email);
      if (!user) {
        return {
          success: true,
          message:
            'Se o email existir no sistema, você receberá instruções para recuperação de senha.',
        };
      }

      // Gerar token aleatório
      const token = randomBytes(32).toString('hex');

      // Calcular data de expiração (1 hora)
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 1);

      // Salvar token no banco de dados
      const passwordResetToken = this.passwordResetTokenRepository.create({
        userId: user.id,
        token,
        expiresAt,
      });
      await this.passwordResetTokenRepository.save(passwordResetToken);

      // Enviar email de recuperação com mais informações de log
      this.logger.log(`Attempting to send password reset email to ${user.email}`);
      const emailSent = await this.emailService.sendPasswordResetEmail({
        to: user.email,
        resetToken: token,
        userName: user.name,
      });

      if (!emailSent) {
        this.logger.error(`Failed to send password reset email to: ${user.email}`);
        return {
          success: false,
          message: 'Falha ao enviar email de recuperação. Por favor, tente novamente mais tarde.',
        };
      }

      this.logger.log(`Password reset email successfully sent to: ${user.email}`);
      return {
        success: true,
        message:
          'Se o email existir no sistema, você receberá instruções para recuperação de senha.',
      };
    } catch (error) {
      this.logger.error(
        `Error during password reset request: ${error instanceof Error ? error.message : String(error)}`,
        error instanceof Error ? error.stack : undefined,
      );
      return {
        success: false,
        message:
          'Ocorreu um erro ao processar sua solicitação. Por favor, tente novamente mais tarde.',
      };
    }
  }

  async resetPassword(token: string, newPassword: string): Promise<ResetPasswordResult> {
    try {
      // Buscar token no banco de dados
      const passwordResetToken = await this.passwordResetTokenRepository.findOne({
        where: { token, used: false },
      });

      // Verificar se token existe e não expirou
      if (!passwordResetToken) {
        return {
          success: false,
          message: 'Token de recuperação inválido ou expirado.',
        };
      }

      const now = new Date();
      if (now > passwordResetToken.expiresAt) {
        return {
          success: false,
          message:
            'Token de recuperação expirado. Por favor, solicite uma nova recuperação de senha.',
        };
      }

      // Buscar usuário
      const user = await this.usersService.findById(passwordResetToken.userId);
      if (!user) {
        return {
          success: false,
          message: 'Usuário não encontrado.',
        };
      }

      // Atualizar senha
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await this.usersService.updatePassword(user.id, hashedPassword);

      // Marcar token como usado
      passwordResetToken.used = true;
      await this.passwordResetTokenRepository.save(passwordResetToken);

      return {
        success: true,
        message: 'Senha atualizada com sucesso! Você já pode fazer login com sua nova senha.',
      };
    } catch (error) {
      this.logger.error(
        `Error during password reset: ${error instanceof Error ? error.message : String(error)}`,
      );
      return {
        success: false,
        message: 'Ocorreu um erro ao redefinir sua senha. Por favor, tente novamente mais tarde.',
      };
    }
  }
}
