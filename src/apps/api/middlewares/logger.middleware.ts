import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { LogService } from '@/services/log.service';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private logService: LogService) {}

  use(req: Request, res: Response, next: NextFunction) {
    try {
      this.logService.info('Request', {
        method: req.method,
        path: req.baseUrl,
        query: req.query,
      });
      next();
    } catch (err) {
      next(err);
    }
  }
}
