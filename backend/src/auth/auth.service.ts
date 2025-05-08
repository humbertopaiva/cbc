import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { SignUpInput } from './dto/signup.input';
import { AuthPayload } from './dto/auth-payload';
import { LoginInput } from './dto/login.input';

@Injectable()
export class AuthService {
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

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.usersService.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = this.generateToken(user.id);

    return { token, user };
  }

  async login(loginInput: LoginInput): Promise<AuthPayload> {
    const { email, password } = loginInput;

    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Credenciais Inválidas');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciais Inválidas');
    }

    const token = this.generateToken(user.id);

    return { token, user };
  }

  private generateToken(userId: string): string {
    return this.jwtService.sign({ userId });
  }

  async validateUser(userId: string) {
    return this.usersService.findById(userId);
  }
}
