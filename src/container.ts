import { asClass, asValue, InjectionMode } from 'awilix';

import { createTypedContainer } from '@/shared/createTypedContainer';
import { ErrorService } from './services/ErrorService';
import { LogContext, LogService } from './services/LogService';

export interface RequestContext {
  origin: string;
  isFrontendRequest: boolean;
}

export const container = createTypedContainer(
  {
    authContext: asValue(undefined),
    errorService: asClass(ErrorService).singleton(),
    logContext: asValue(undefined),
    logService: asClass(LogService).scoped(),
    requestContext: asValue(undefined),
    validServiceKey: asValue(false),
  },
  {
    injectionMode: InjectionMode.CLASSIC,
  },
);

export function createContainerScope(
  logContext?: LogContext,
  requestContext?: RequestContext,
) {
  const scope = container.createScope();
  scope.register('logContext', asValue(logContext));
  scope.register('requestContext', asValue(requestContext));
  return scope;
}

export type ContainerType = typeof container;
