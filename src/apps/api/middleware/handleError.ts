import { NextFunction, Request, Response } from 'express';
import * as qs from 'query-string';

import { ErrorSeverity } from '@/services/ErrorService';

export function handleError() {
  return (err: Error, req: Request, res: Response, next: NextFunction) => {
    const error = req.container.resolve('errorService').wrapError(err);
    const logService = req.container.resolve('logService');

    const logData: any = {
      method: req.method,
      path: req.path,
      query: req.query,
      queryStr: qs.stringify(req.query || {}),
      requestId: req.requestId,
    };

    const logOptions = {
      data: logData,
      err,
      message: err.message,
    };

    const statusCodeError = err as any;
    if (statusCodeError.statusCode && statusCodeError.options) {
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

    if (error.severity === ErrorSeverity.ERROR) {
      logService.logError(logOptions);
    } else {
      logService.logWarn(logOptions);
    }
    res.status(error.status).json({ error: error.toJSON() });
  };
}
