import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';

import { PatientsModule } from './patients/patients.module';
import { DoctorsModule } from './doctors/doctors.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppointmentsModule } from './appointments/appointments.module';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGO_URI),
    PatientsModule,
    DoctorsModule,
    AppointmentsModule,
    UsersModule,
    AuthModule,
  ],
  providers: [],
})
//
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
