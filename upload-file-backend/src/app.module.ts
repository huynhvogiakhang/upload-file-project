import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtStrategyModule } from './core/auth/auth.module';
import { DatabaseModule } from './core/database/database.module';
import { LoggingMiddleware } from './core/logger/logger.middleware';
import { LoggerModule } from './core/logger/logger.module';
import { UserModule } from './user/user.module';
import { FileModule } from './file/file.module';
import { FeedbackModule } from './feedback/feedback.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env`,
      isGlobal: true,
    }),
    LoggerModule,
    JwtStrategyModule,
    FileModule,
    FeedbackModule,
    DatabaseModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService, JwtStrategyModule],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggingMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
