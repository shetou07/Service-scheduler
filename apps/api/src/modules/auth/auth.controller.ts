import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import type { Response } from 'express';
import { IsEmail, IsString, MinLength } from 'class-validator';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

class LoginDto {
  @IsEmail() email!: string;
  @IsString() @MinLength(8) password!: string;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('login')
  async login(@Body() body: LoginDto, @Res({ passthrough: true }) response: Response) {
    const result = await this.auth.login(body.email, body.password);
    response.cookie('admin_access', result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 8 * 60 * 60 * 1000,
      path: '/',
    });
    return { admin: result.admin };
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('admin_access', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', path: '/' });
    return { ok: true };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me') me(@Req() request: { admin: { id: string } }) { return this.auth.profile(request.admin.id); }
}
