import { num, parseConfig, port, str, url } from '@/shared/loadConfig';

export const config = parseConfig({
  port: {
    env: 'PORT',
    type: port({
      example: '5000',
    }),
  },
  serveSwagger: {
    env: 'SERVE_SWAGGER',
    type: num({
      default: 0,
    }),
  },
  serviceName: {
    env: 'SERVICE_NAME',
    type: str({
      default: 'api',
    }),
  },
})();
