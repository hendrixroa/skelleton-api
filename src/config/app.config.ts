import { loadConfig, str, url, port, email } from '@/shared/loadConfig';

export const APPConfig = loadConfig({
  appName: {
    env: 'APP',
    type: str({
      example: 'api',
    }),
  },
  dbLogLevel: {
    env: 'DATABASE_LOG_LEVEL',
    type: str({
      choices: ['query', 'info', 'warn', 'error', 'log', 'schema', 'all', ''],
      default: '',
      docs:
        'https://github.com/typeorm/typeorm/blob/master/docs/logging.md#logging-options',
      example: 'info',
    }),
  },
  dbPassword: {
    env: 'DATABASE_PASSWORD',
    type: str({
      default: '',
      desc: 'optional - password can be passed in DATABASE_URL',
      example: '!@#$%^&',
    }),
  },
  dbSsl: {
    env: 'DATABASE_SSL',
    type: str({
      default: 'false',
    }),
  },
  dbUrl: {
    env: 'DATABASE_URL',
    type: url({
      example: 'postgres://user:password@host:port/database',
    }),
  },
  redisUrl: {
    env: 'REDIS_URL',
    type: str({
      example: 'localhost',
    }),
  },
  redisPort: {
    env: 'REDIS_PORT',
    type: port({
      default: 6379,
    }),
  },
  regionCognitoPool: {
    env: 'REGION_COGNITO_POOL',
    type: str({
      default: 'us-east-1',
    }),
  },
  cognitoUserPoolId: {
    env: 'COGNITO_USER_POOL_ID',
    type: str({
      example: 'us-east-2_TBD',
    }),
  },
  cognitoClientId: {
    env: 'COGNITO_CLIENT_ID',
    type: str({
      example: 'hash',
    }),
  },
  authAudience: {
    env: 'AUTH_AUDIENCE',
    type: str({
      example: 'hash',
    }),
  }
});
