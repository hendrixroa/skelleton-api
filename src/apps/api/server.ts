import { join } from 'path';
import { Server } from 'typescript-rest';

import { container } from '@/container';
import { api } from './api';
import { config } from './config';

const port = config.port;
const serveSwagger = config.serveSwagger;
const logService = container.resolve('logService');

if (serveSwagger) {
  Server.swagger(api, {
    endpoint: '/api-docs',
    filePath: join(__dirname, '.swagger', 'swagger.json'),
    host: `localhost:${port}`,
    schemes: ['http'],
  });
}

api.listen(port, async () => {
  logService.logInfo({
    message: `Server listening on ${port}`,
  });
});
