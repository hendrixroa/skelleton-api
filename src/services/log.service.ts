import * as pino from 'pino';
import { Injectable } from '@nestjs/common';

@Injectable()
export class LogService {
  private readonly logger: pino.Logger;

  constructor() {
    this.logger = pino();
  }

  public info(message: string, data = {}) {
    this.logger.info(data, message);
  }

  public warn(message: string, errors = {}) {
    this.logger.warn(errors, message);
  }

  public error(message: string, errors = {}) {
    this.logger.error(errors, message);
  }
}
