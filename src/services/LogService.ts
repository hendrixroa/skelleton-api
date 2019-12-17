import * as bunyan from 'bunyan';

import { appConfig } from '@/config/appConfig';
import { AppError } from '@/services/ErrorService';

export interface LogContext {
  requestId?: string;
  jobId?: string | number;
  path?: string;
  method?: string;
}

export interface LogData extends LogContext {
  appName: string;
  userId?: string;
  requestId?: string;
}

export class LogService {
  public logger: bunyan;

  constructor(
    public readonly logContext?: LogContext,
  ) {
    const appName = appConfig.appName;
    const logData: LogData = {
      appName,
    };

    if (logContext) {
      logData.requestId = logContext.requestId;
      logData.jobId = logContext.jobId;
      logData.method = logContext.method;
      logData.path = logContext.path;
    }

    this.logger = bunyan
      .createLogger({
        level: appConfig.logLevel as (
          | number
          | 'error'
          | 'info'
          | 'trace'
          | 'debug'
          | 'warn'
          | 'fatal'
          | undefined),
        name: 'app',
        serializers: bunyan.stdSerializers,
      })
      .child(logData);
  }

  public logInfo({ message, data }: { message?: string; data?: object }) {
    this.logger.info(data || {}, message);
  }

  public logWarn({
    message,
    data,
    err,
  }: {
    message?: string;
    data?: object;
    err?: Error;
  }) {
    const logData: any = { ...data, err };
    if (err instanceof AppError) {
      logData.appError = err.toJSON();
    }
    this.logger.warn(logData, message);
  }

  public logError({
    message,
    data,
    err,
  }: {
    message?: string;
    data?: object;
    err?: Error;
  }) {
    const logData: any = { ...data, err };
    if (err instanceof AppError) {
      logData.appError = err.toJSON();
    }

    const statusCodeError = err as any;
    if (
      statusCodeError &&
      statusCodeError.statusCode &&
      statusCodeError.options
    ) {
      const options = statusCodeError.options;

      logData.thridPartyRequest = {
        request: {
          baseUrl: options.baseUrl,
          method: options.method,
          uri: options.uri,
        },
        response: {
          body: statusCodeError.response
            ? statusCodeError.response.body
            : undefined,
          statusCode: statusCodeError.statusCode,
        },
      };
    }

    this.logger.error(logData, message);
  }

  public getChildLog(childData: any) {
    return {
      getChildLog: (childChildData: any) => {
        return this.getChildLog({ ...childData, ...childChildData });
      },
      logError: ({
        message,
        data,
        err,
      }: {
        message?: string;
        data?: object;
        err?: Error;
      }) => {
        return this.logError({
          data: { ...data, ...childData },
          err,
          message,
        });
      },
      logInfo: ({ message, data }: { message?: string; data?: object }) => {
        return this.logInfo({
          data: { ...data, ...childData },
          message,
        });
      },
      logWarn: ({
        message,
        data,
        err,
      }: {
        message?: string;
        data?: object;
        err?: Error;
      }) => {
        return this.logWarn({
          data: { ...data, ...childData },
          err,
          message,
        });
      },
    };
  }
}
