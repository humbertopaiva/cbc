import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { SignUpInput } from './dto/signup.input';
import { AuthPayload } from './dto/auth-payload';
import { LoginInput } from './dto/login.input';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
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
}
