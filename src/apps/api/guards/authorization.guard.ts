import {
  CanActivate,
  createParamDecorator,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';

import { AuthContext, AuthService } from '@/services/auth.service';
import { LogService } from '@/services/log.service';
import {
  AuthenticationErrorType,
  ErrorService,
} from '@/services/error.service';

export const CurrentUser = createParamDecorator(
  (data: any, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    return user as AuthContext;
  },
);

@Injectable()
export class Authorization implements CanActivate {
  constructor(
    private logService: LogService,
    private authService: AuthService,
    private errorService: ErrorService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean | undefined> {
    const request = context.switchToHttp().getRequest();
    const authorization = request.get('authorization');

    const isMFARoute = request.url.includes('mfa');

    if (!authorization) {
      this.errorService.authenticationError(
        AuthenticationErrorType.TOKEN_REQUIRED,
        'The Authorization token is required',
      );
    }

    const match = authorization
      ? authorization.match(/^Bearer (.+)$/i)
      : undefined;

    if (!match) {
      this.errorService.authenticationError(
        AuthenticationErrorType.INVALID_AUTHORIZATION_HEADER_FORMAT,
        'Invalid authorization header format',
      );
    }

    const [, accessToken] = match;

    const authContext = await this.authService.verifyAccessToken(
      isMFARoute,
      accessToken,
    );
    request.user = authContext;

    return true;
  }
}
