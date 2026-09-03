import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService, private readonly jwt: JwtService) {}

  async login(email: string, password: string) {
    const admin = await this.prisma.admin.findUnique({ where: { email: email.trim().toLowerCase() } });
    if (!admin || !(await bcrypt.compare(password, admin.passwordHash))) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const profile = { id: admin.id, name: admin.name, email: admin.email, role: admin.role };
    return { accessToken: await this.jwt.signAsync({ sub: admin.id, email: admin.email, role: admin.role }), admin: profile };
  }

  async profile(adminId: string) {
    const admin = await this.prisma.admin.findUnique({ where: { id: adminId }, select: { id: true, name: true, email: true, role: true } });
    if (!admin) throw new UnauthorizedException('Admin account no longer exists');
    return admin;
  }
}
