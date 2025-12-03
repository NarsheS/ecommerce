import {
  Controller,
  Post,
  Body,
  Req,
  Res,
  Get,
  Query,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Throttle } from '@nestjs/throttler';
import { Public } from 'src/common/decorators/public.decorator';
import { LoginDto } from './dto/login.dto';
import { Register } from './dto/register.dto';
import type { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Get('verify')
  async verifyEmail(@Query('token') token: string) {
    return this.authService.verifyEmail(token);
  }

  @Public()
  @Post('register')
  async register(@Body() dto: Register) {
    const user = await this.authService.register(dto);
    return {
      message: 'User created. Please check your email to verify your account.',
      user,
    };
  }

  @Public()
  @Throttle({ login: { limit: 5, ttl: 60 } })
  @Post('login')
  async login(
    @Body() body: LoginDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.authService.validateUser(
      body.identifier,
      body.password,
      req.ip,
    );

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const { safe, refreshPlain } = await this.authService.login(user);

    this.setRefreshCookie(res, refreshPlain);

    return safe;
  }

  @Public()
  @Throttle({ default: { limit: 10, ttl: 60 } })
  @Post('refresh')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies['refresh_token'];

    const { safe, refreshPlain } =
      await this.authService.refreshTokens(refreshToken);

    this.setRefreshCookie(res, refreshPlain);

    return safe;
  }

  @Post('logout')
  async logout(
    @Req() req: any,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.authService.logout(req.user.sub);

    res.clearCookie('refresh_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/api/auth', // <-- padronizado
    });

    return { ok: true };
  }

  private setRefreshCookie(res: Response, refreshToken: string) {
    const isProd = process.env.NODE_ENV === 'production';

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/api/auth', // <-- padronizado
    });
  }
}
