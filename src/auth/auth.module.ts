// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthGuard } from './auth.guard'; // Import the custom AuthGuard
import { UsersModule } from '../users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
    }),
    UsersModule, // Import UsersModule to access UsersService
  ],
  providers: [AuthService, AuthGuard], // Provide AuthGuard in AuthModule
  controllers: [AuthController],
  exports: [AuthService, AuthGuard], // Export AuthGuard if needed elsewhere
})
export class AuthModule {}
