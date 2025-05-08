import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';
import { User } from '../../users/entities/user.entity';

interface JwtPayload {
  userId: string;
  iat?: number;
  exp?: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET', 'your_jwt_secret_key'),
    });
  }

  async validate(payload: JwtPayload): Promise<User> {
    if (
      !payload ||
      typeof payload !== 'object' ||
      !payload.userId ||
      typeof payload.userId !== 'string'
    ) {
      throw new UnauthorizedException('Payload com token inválido');
    }

    const user = await this.authService.validateUser(payload.userId);

    if (!user) {
      throw new UnauthorizedException('Token inválido');
    }

    return user;
  }
}
