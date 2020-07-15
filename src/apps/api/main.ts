import * as compression from 'compression';
import * as helmet from 'helmet';
import { SwaggerModule } from '@nestjs/swagger';
import * as pino from 'pino';
import { ValidationPipe } from '@nestjs/common';

import { initApp, generateSwagger } from './api.helpers';
import { APIConfig } from './config';

async function bootstrap() {
  const dest = pino.destination();
  const logger = pino(dest);

  try {
    const app = await initApp();

    // Middlewares
    app.useGlobalPipes(new ValidationPipe());
    app.use(helmet());
    app.use(compression());

    const document = await generateSwagger(app);
    SwaggerModule.setup('docs', app, document);

    await app.listen(APIConfig.port);
    logger.info(`Application is running on: ${await app.getUrl()}`);
  } catch (error) {
    logger.error('Error', error);
  }
}
bootstrap();
