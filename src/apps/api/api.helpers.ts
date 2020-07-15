import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';
import { APIModule } from './api.module';

export async function initApp() {
  return await NestFactory.create(APIModule, { cors: true });
}

const desc = `### Authentication

Get access token and refresh token from \`POST /auth/login\` endpoint.
Authentication is done with \`Authorization: Bearer <accessToken>\` header.
Refresh access token with \`POST /auth/refreshAccessToken\` endpoint.

### Success responses
HTTP status = 2xx

\`\`\`
{
  data: { ... }
}
\`\`\`

by convention for paginated endpoint:

\`\`\`
{
  data: { items: [], meta: { count, limit, offset } }
}
\`\`\`

### Error responses

HTTP status = 4xx/5xx

\`\`\`
{
  error: {
    message: 'Error message',
  } 
}
\`\`\`

* status 401 - type = 'authentication'
* status 400 - type = 'validation'
* status 5xx - type = 'internal'`;

export async function generateSwagger(app?: INestApplication) {
  if (!app) {
    app = await initApp();
  }

  const options = new DocumentBuilder()
    .addApiKey({
      type: 'apiKey',
      name: 'x-api-key',
      in: 'header',
      description: 'API Key For External calls',
    })
    .addBearerAuth()
    .setTitle('Skelleton-API')
    .setDescription(desc)
    .setVersion('0.0.1')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  return document;
}
