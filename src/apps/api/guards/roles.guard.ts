import {
  Injectable,
  CanActivate,
  ExecutionContext,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {
  ErrorService,
  AuthenticationErrorType,
} from '@/services/error.service';

export const Roles = (...roles: string[]) => SetMetadata('roles', roles);

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private errorService: ErrorService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const userRole = request.user.role;
    const matchRole = roles.includes(userRole);

    if (!matchRole) {
      this.errorService.authenticationError(
        AuthenticationErrorType.ROLES_PERMISSION_ERROR,
        `Only the ${roles} are allowed to perform this action`,
      );
    }
    return matchRole;
  }
}
