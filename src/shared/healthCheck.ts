import { container } from '@/container';
import * as express from 'express';

const logService = container.resolve('logService');
const api = express();

export function createHealthCheck(port: number, action?: () => Promise<void>) {
  api.get('/health', (req, res) => {
    return res.json({ status: 'UP' });
  });

  api.listen(port || 80, () => {
    logService.logInfo({
      message: `Healthcheck on ${port}`,
    });
  });
}
