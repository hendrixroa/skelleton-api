import * as redisStore from 'cache-manager-redis-store';
import {
  CacheInterceptor,
  CacheModule,
  HttpModule,
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_INTERCEPTOR } from '@nestjs/core';

// Config
import { APPConfig } from '@/config/app.config';

// Repositories
import { UserRepository } from '@/repositories/user.repository';

// Services
import { PingService } from '@/services/ping.service';
import { ErrorService } from '@/services/error.service';
import { LogService } from '@/services/log.service';
import { AuthService, AuthContext } from '@/services/auth.service';
import { CognitoService } from '@/services/cognito.service';

// Controllers
import { PingController } from './controllers/ping.controller';
import { AuthController } from './controllers/auth.controller';

// Middlewares
import { LoggerMiddleware } from './middlewares/logger.middleware';

@Module({
  imports: [
    CacheModule.register({
      store: redisStore,
      host: APPConfig.redisUrl,
      port: Number(APPConfig.redisPort),
    }),
    TypeOrmModule.forRoot(),
    TypeOrmModule.forFeature([
      UserRepository,
    ]),
    HttpModule,
  ],
  controllers: [
    PingController,
    AuthController,
  ],
  providers: [
    AuthContext,
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
    ErrorService,
    LogService,
    AuthService,
    PingService,
    CognitoService,
  ],
})
export class APIModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }
}
