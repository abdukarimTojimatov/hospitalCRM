import { Injectable } from '@nestjs/common';
import { CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtWsAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const client = context.switchToWs().getClient();
    const token = client.handshake.headers.authorization?.split(' ')[1]; // Extract token from Authorization header

    if (!token) {
      return false; // Reject connection if no token is present
    }

    try {
      const user = this.jwtService.verify(token); // Verify the JWT token
      client.user = user; // Attach the authenticated user information to the client
      return true;
    } catch (e) {
      return false; // Reject connection if token is invalid
    }
  }
}
