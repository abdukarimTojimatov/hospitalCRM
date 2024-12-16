// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);

    const isMatch = await bcrypt.compare(password, user.password);

    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user.toObject();
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user._id, role: user.role };
    return {
      token: await this.jwtService.signAsync(payload),
    };
  }

  async register(email: string, password: string, name: string, role: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    return this.usersService.create({
      email,
      password: hashedPassword,
      name,
      role,
    });
  }
}
