import { loadConfig, num, port, str } from '@/shared/loadConfig';

const isTest = process.env.NODE_ENV === 'test';

export const appConfig = loadConfig({
  appName: {
    env: 'APP',
    type: str({
      example: 'api',
    }),
  },
  healthchekPort: {
    env: 'HEALTHCHECK_PORT',
    type: port({
      example: '5000',
    }),
  },
  logLevel: {
    env: 'LOG_LEVEL',
    type: str({
      choices: ['debug', 'info', 'error', 'fatal'],
      default: isTest ? 'fatal' : 'info',
    }),
  },
  maxPaginationLimit: {
    env: 'MAX_PAGINATION_LIMIT',
    type: num({
      default: 20,
    }),
  },
});
