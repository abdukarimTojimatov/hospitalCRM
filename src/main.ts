import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './filters/http-exception.filter';
import { AuthGuard } from './auth/auth.guard';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions } from 'socket.io';

class SocketIoAdapter extends IoAdapter {
  createIOServer(port: number, options?: ServerOptions) {
    const server = super.createIOServer(port, {
      ...options,
      cors: {
        origin: 'http://localhost:3001',
        methods: ['GET', 'POST'],
        credentials: true,
      },
    });
    return server;
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global validation
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );
  app.setGlobalPrefix('api');
  // Global exception filter
  app.useGlobalFilters(new AllExceptionsFilter());

  //app.useGlobalGuards(app.get(AuthGuard));
  app.useWebSocketAdapter(new SocketIoAdapter(app));

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allowed HTTP methods
    credentials: true, // Allow credentials (cookies, headers)
    allowedHeaders: 'Content-Type, Authorization', // Allowed headers
  });

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
