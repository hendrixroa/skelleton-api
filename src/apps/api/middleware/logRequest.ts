import { NextFunction, Request, Response } from 'express';

export function logRequest() {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.container.resolve('logService').logInfo({
        data: {
          method: req.method,
          path: req.path,
          query: req.query,
        },
        message: 'Request',
      });
      next();
    } catch (err) {
      next(err);
    }
  };
}
