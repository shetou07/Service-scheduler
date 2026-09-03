import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwt: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<{ headers: Record<string, string | undefined>; admin?: { id: string; email: string; role: string } }>();
    const bearer = request.headers.authorization;
    const cookie = request.headers.cookie?.split(';').map((part) => part.trim()).find((part) => part.startsWith('admin_access='))?.slice('admin_access='.length);
    const value = bearer?.startsWith('Bearer ') ? bearer.slice(7) : cookie;
    if (!value) throw new UnauthorizedException('Missing admin access token');
    try {
      const payload = await this.jwt.verifyAsync<{ sub: string; email: string; role: string }>(value);
      request.admin = { id: payload.sub, email: payload.email, role: payload.role };
      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired admin access token');
    }
  }
}
