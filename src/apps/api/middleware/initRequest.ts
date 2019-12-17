import { NextFunction, Request, Response } from 'express';
import * as uuid from 'uuid/v4';

import { container, ContainerType } from '@/container';

declare global {
  namespace Express {
    interface Request {
      requestId: string;
      container: ContainerType;
    }
  }
}

export function initRequest() {
  return (req: Request, res: Response, next: NextFunction) => {
    req.requestId = uuid();
    req.container = container;
    next();
  };
}
