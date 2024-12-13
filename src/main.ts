import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './filters/http-exception.filter';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { ResponseLoggingInterceptor } from './common/middleware/response.logger.middleware';
import { AuthGuard } from './auth/auth.guard';

async function bootstrap() {
  const app = await NestFactory.create(
    AppModule,
    //   , {
    //   logger: WinstonModule.createLogger({
    //     transports: [
    //       new winston.transports.Console({
    //         format: winston.format.combine(
    //           winston.format.timestamp(),
    //           winston.format.colorize(),
    //           winston.format.simple(),
    //         ),
    //       }),
    //       new winston.transports.File({
    //         filename: 'logs/error.log',
    //         level: 'error',
    //         format: winston.format.json(),
    //       }),
    //     ],
    //   }),
    // }
  );

  // Global validation
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );
  app.setGlobalPrefix('api');
  // Global exception filter
  app.useGlobalFilters(new AllExceptionsFilter());
  //app.useGlobalInterceptors(new ResponseLoggingInterceptor());
  app.useGlobalGuards(app.get(AuthGuard));

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
