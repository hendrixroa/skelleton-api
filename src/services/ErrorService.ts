import { CustomError } from 'ts-custom-error';

export enum ErrorSeverity {
  WARNING = 'warning',
  ERROR = 'error',
}

export enum ErrorType {
  VALIDATION = 'validation',
  AUTHENTICATION = 'authentication',
  AUTHORIZATION = 'authorization',
  INTERNAL = 'internal',
}

export interface ErrorOptions {
  message?: string;
  severity?: ErrorSeverity;
  type: ErrorType;
  status?: number;
  data?: any;
  originalError?: Error;
}

export class ErrorReason {
  public path: string;
  public message: string;
  public reason?: string;

  constructor(path: string, message: string, reason?: string) {
    this.path = path;
    this.message = message;
    this.reason = reason;
  }
}

export class AppError extends CustomError implements AppError {
  public readonly message: string;
  public readonly severity: ErrorSeverity;
  public readonly type: ErrorType;
  public readonly reasons: ErrorReason[];
  public readonly status: number;
  public originalError?: Error;
  public data: any;

  constructor(options: ErrorOptions) {
    const message = options.message || 'Unknown error';
    super(message);
    this.message = message;
    this.severity = options.severity || ErrorSeverity.ERROR;
    this.type = options.type || ErrorType.INTERNAL;
    this.reasons = [];
    this.status = options.status || 500;
    this.data = options.data;
    this.originalError = options.originalError;
  }

  public addReason(path: string, message: string, reason?: string) {
    this.reasons.push(new ErrorReason(path, message, reason));
    return this;
  }

  public setData(data?: any) {
    this.data = data;
    return this;
  }

  public toJSON() {
    return {
      message: this.message,
      reasons: this.reasons,
      severity: this.severity,
      type: this.type,
    };
  }
}

export class ValidationError extends AppError {
  constructor(message: string = 'Validation Error') {
    super({
      message,
      severity: ErrorSeverity.WARNING,
      status: 400,
      type: ErrorType.VALIDATION,
    });
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication Error') {
    super({
      message,
      severity: ErrorSeverity.WARNING,
      status: 401,
      type: ErrorType.AUTHENTICATION,
    });
  }
}

export class InternalError extends AppError {
  constructor(message: string = 'Internal Error') {
    super({
      message,
      severity: ErrorSeverity.ERROR,
      type: ErrorType.INTERNAL,
    });
  }
}

export class ErrorService {
  public validationError(message?: string) {
    return new ValidationError(message);
  }

  public authenticationError(message?: string) {
    return new AuthenticationError(message);
  }

  public wrapError(err: Error): AppError {
    let error;
    if (err instanceof AppError) {
      error = err;
    } else {
      error = new InternalError();
    }
    return error;
  }
}
