import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { SignUpInput } from './dto/signup.input';
import { LoginInput } from './dto/login.input';
import { AuthPayload } from './dto/auth-payload';
import { RequestPasswordResetInput } from './dto/request-password-reset.input';
import { ResetPasswordInput } from './dto/reset-password.input';
import { RequestPasswordResetResponse } from './dto/request-password-reset-response';
import { ResetPasswordResponse } from './dto/reset-password-response';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AuthPayload)
  async signUp(@Args('input') signUpInput: SignUpInput): Promise<AuthPayload> {
    return this.authService.signUp(signUpInput);
  }

  @Mutation(() => AuthPayload)
  async login(@Args('input') loginInput: LoginInput): Promise<AuthPayload> {
    return this.authService.login(loginInput);
  }

  @Mutation(() => RequestPasswordResetResponse)
  async requestPasswordReset(
    @Args('input') input: RequestPasswordResetInput,
  ): Promise<RequestPasswordResetResponse> {
    const result = await this.authService.requestPasswordReset(input.email);
    return result;
  }

  @Mutation(() => ResetPasswordResponse)
  async resetPassword(@Args('input') input: ResetPasswordInput): Promise<ResetPasswordResponse> {
    const result = await this.authService.resetPassword(input.token, input.newPassword);
    return result;
  }
}
