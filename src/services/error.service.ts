import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

export enum AuthenticationErrorType {
  TOKEN_EXPIRED = 'token_expired',
  BAD_CREDENTIALS = 'bad_credentials',
  TOKEN_INVALID = 'token_invalid',
  TOKEN_REQUIRED = 'token_required',
  INVALID_AUTHORIZATION_HEADER_FORMAT = 'invalid_authorization_header_format',
  MFA_DEVICE_NOT_SETTLED = 'mfa_device_not_settled',
  MFA_AUTHENTICATION_REQUIRED = 'mfa_authentication_required',
  ROLES_PERMISSION_ERROR = 'ROLES_PERMISSION_ERROR',
}

export class AuthenticationError extends UnauthorizedException {
  constructor(error: string, message?: string) {
    super({ error_type: error, message: message });
  }
}

export class BadRequestError extends BadRequestException {
  constructor(error = 'BadRequest Error', message?: string) {
    super(error, message);
  }
}

export class InternalError extends InternalServerErrorException {
  constructor(error = 'Internal Error', message?: string) {
    super(error, message);
  }
}

export class NotFoundError extends NotFoundException {
  constructor(error = 'Entity Not Found', message?: string) {
    super(error, message);
  }
}

@Injectable()
export class ErrorService {
  public authenticationError(errorType: string, message?: string) {
    throw new AuthenticationError(errorType, message);
  }

  public badRequestError(message?: string) {
    throw new BadRequestError(message);
  }

  public internalError(message?: string) {
    throw new InternalError(message);
  }

  public notFoundError(message?: string) {
    throw new NotFoundError(message);
  }
}
