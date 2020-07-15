import { HttpService, Injectable } from '@nestjs/common';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { IsUsername } from '@/shared/customValidators';
import * as jwt from 'jsonwebtoken';
import * as jwkToPem from 'jwk-to-pem';
import { ApiProperty } from '@nestjs/swagger';

import { AuthenticationErrorType, ErrorService } from './error.service';
import { CognitoService } from '@/services/cognito.service';
import { LogService } from './log.service';
import { APPConfig } from '@/config/app.config';

@Injectable()
export class AuthContext {
  @IsString()
  public uuid: string;

  @IsString()
  public email: string;

  @IsString()
  @IsUsername()
  public username: string;

  @IsBoolean()
  public emailVerified: string;

  @IsString()
  public cognitoId: string;

  @IsString()
  public role: string;

  @IsString()
  public eventId: string;
}

export class UserSignInPayload {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @ApiProperty()
  password: string;
}

export enum UserRole {
  user = 'User',
  admin = 'Admin',
  finance = 'Finance',
}

export class UserSignUpPayload extends UserSignInPayload {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  @IsUsername()
  username: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  sshPublicKey?: string;

  @IsEnum(UserRole)
  @IsNotEmpty()
  @ApiProperty({ enum: ['User', 'Finance', 'Admin'] })
  role: UserRole;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: `https://${APPConfig.s3AvatarsBucket}.s3.amazonaws.com/sample-avatar.png`,
  })
  avatar: string;
}

export class UserVerifyCodePayload {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  code: string;
}

export class UserResendCodePayload {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty()
  email: string;
}

export class RefreshTokenPayload {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  refreshToken: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty()
  email: string;
}

export class ForgotPasswordPayload {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty()
  email: string;
}

export class ConfirmPasswordPayload extends ForgotPasswordPayload {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  code: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @ApiProperty()
  password: string;
}

export interface SignUpResponse {
  message: string;
}

export class SignInResponse {
  @ApiProperty()
  token: string;

  @ApiProperty()
  refreshToken: string;

  @ApiProperty()
  mfa: boolean;
}

export interface VerifyCodeResponse {
  message: string;
}

export class RefreshTokenResult {
  token: string;
}

@Injectable()
export class AuthService {
  private pems: any;
  private urlPems = `https://cognito-idp.${APPConfig.regionCognitoPool}.amazonaws.com/${APPConfig.cognitoUserPoolId}/.well-known/jwks.json`;

  constructor(
    private errorService: ErrorService,
    private logService: LogService,
    private httpService: HttpService,
    private cognitoService: CognitoService,
  ) {
    try {
      this.httpService.get(this.urlPems).subscribe((keyPems: any) => {
        this.initPems(keyPems.data);
      });
    } catch (e) {
      this.logService.error('Error init pems', e);
    }
  }

  public async verifyAccessToken(accessToken: string) {
    // validate the token
    const decodedJwt: any = jwt.decode(accessToken, { complete: true });
    if (!decodedJwt) {
      this.logService.warn('Decoding token error', decodedJwt);
      this.errorService.authenticationError(
        AuthenticationErrorType.TOKEN_INVALID,
        'Not a valid token',
      );
    }

    const pem = this.pems[decodedJwt.header.kid];
    if (!pem) {
      this.logService.warn('Invalid token', decodedJwt);
      this.errorService.authenticationError(
        AuthenticationErrorType.TOKEN_INVALID,
        'Not a valid token',
      );
    }

    let authContext = {};
    let payload: any;
    try {
      payload = jwt.verify(accessToken, pem);
    } catch (error) {
      this.logService.warn('Error', error);
      const errorType =
        error.name === 'TokenExpiredError'
          ? AuthenticationErrorType.TOKEN_EXPIRED
          : AuthenticationErrorType.TOKEN_INVALID;
      this.errorService.authenticationError(errorType, error.message);
    }

    authContext = {
      uuid: payload['custom:uuid'],
      email: payload.email,
      emailVerified: payload['email_verified'],
      cognitoId: payload['cognito:username'],
      role: payload['custom:role'],
      username: payload['nickname'],
      eventId: payload['event_id'],
    };

    return authContext as AuthContext;
  }

  private initPems(keyPems: any) {
    const bufferPems: any = {};
    for (const key of keyPems.keys) {
      // Convert each key to PEM
      const keyId = key.kid;
      const modulus = key.n;
      const exponent = key.e;
      const keyType = key.kty;
      const jwk = { kty: keyType, n: modulus, e: exponent };
      const pem = jwkToPem(jwk);
      bufferPems[keyId] = pem;
    }
    this.pems = bufferPems;
  }

  public async login(payload: UserSignInPayload): Promise<SignInResponse> {
    let result: any;
    try {
      result = await this.cognitoService.login(payload);
      return { ...result };
    } catch (error) {
      this.logService.warn('Error Signin', { err: error });
      this.errorService.authenticationError(
        AuthenticationErrorType.BAD_CREDENTIALS,
        error.message,
      );
    }
  }

  public async verifyCode(
    payload: UserVerifyCodePayload,
  ) {
    try {
      const resultVerification = await this.cognitoService.verifyCode(payload);
      this.logService.info('verification result', resultVerification);
    } catch (error) {
      this.logService.warn('Error VerifyCode: ', { err: error });
      this.errorService.authenticationError(
        AuthenticationErrorType.BAD_CREDENTIALS,
        error.message,
      );
    }
  }

  public async resendCode(resendPayload: UserResendCodePayload) {
    try {
      const result = await this.cognitoService.resendConfirmation(
        resendPayload,
      );

      return result;
    } catch (error) {
      this.logService.warn('Error VerifyCode: ', { err: error });
      this.errorService.authenticationError(
        AuthenticationErrorType.BAD_CREDENTIALS,
        error.message,
      );
    }
  }

  public async refreshToken(refreshPayload: RefreshTokenPayload) {
    try {
      const result = await this.cognitoService.refreshToken(refreshPayload);
      return result;
    } catch (error) {
      this.errorService.authenticationError(
        AuthenticationErrorType.BAD_CREDENTIALS,
        error.message,
      );
    }
  }

  public async forgotPassword(forgotPasswordPayload: ForgotPasswordPayload) {
    try {
      const result = await this.cognitoService.forgotPassword(
        forgotPasswordPayload,
      );
      return result;
    } catch (error) {
      this.errorService.authenticationError(
        AuthenticationErrorType.BAD_CREDENTIALS,
        error.message,
      );
    }
  }

  public async confirmPassword(confirmPasswordPayload: ConfirmPasswordPayload) {
    try {
      const result = await this.cognitoService.confirmPassword(
        confirmPasswordPayload,
      );
      return result;
    } catch (error) {
      this.errorService.authenticationError(
        AuthenticationErrorType.BAD_CREDENTIALS,
        error.message,
      );
    }
  }
}
