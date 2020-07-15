import { Controller, Get, Post, Body } from '@nestjs/common';
import { ApiTags, ApiSecurity, ApiResponse } from '@nestjs/swagger';

import { LogService } from '@/services/log.service';
import {
  AuthService,
  UserSignInPayload,
  UserVerifyCodePayload,
  UserResendCodePayload,
  SignInResponse,
  RefreshTokenPayload,
  ForgotPasswordPayload,
  ConfirmPasswordPayload,
} from '@/services/auth.service';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly logService: LogService,
    private readonly authService: AuthService,
  ) {}

  @Post('login')
  @ApiSecurity('api_key', ['api_key'])
  @ApiResponse({ type: SignInResponse, status: 200 })
  async login(@Body() payload: UserSignInPayload): Promise<SignInResponse> {
    return this.authService.login(payload);
  }

  @Post('verifyCode')
  @ApiSecurity('api_key', ['api_key'])
  async verifyCode(@Body() payload: UserVerifyCodePayload) {
    await this.authService.verifyCode(payload);
  }

  @Post('resendVerifyCode')
  @ApiSecurity('api_key', ['api_key'])
  async resendVerifyCode(@Body() payload: UserResendCodePayload) {
    await this.authService.resendCode(payload);
  }

  @Post('refreshToken')
  @ApiSecurity('api_key', ['api_key'])
  async refreshToken(@Body() payload: RefreshTokenPayload) {
    return this.authService.refreshToken(payload);
  }

  @Post('forgotPassword')
  @ApiSecurity('api_key', ['api_key'])
  async forgotPassword(@Body() payload: ForgotPasswordPayload) {
    await this.authService.forgotPassword(payload);
  }

  @Post('confirmPassword')
  @ApiSecurity('api_key', ['api_key'])
  async confirmPassword(@Body() payload: ConfirmPasswordPayload) {
    await this.authService.confirmPassword(payload);
  }
}
