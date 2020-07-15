import { loadConfig, port, str } from '@/shared/loadConfig';

export const APIConfig = loadConfig({
  appName: {
    env: 'APP',
    type: str({
      example: 'api',
    }),
  },
  port: {
    env: 'PORT',
    type: port({
      example: '3000',
    }),
  },
});
