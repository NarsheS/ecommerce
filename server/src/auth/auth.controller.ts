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
import { Public } from '../common/decorators/public.decorator';
import { LoginDto } from './dto/login.dto';
import { Register } from './dto/register.dto';
import type { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // GET - Um link pra clicar e verificar o email
  @Public()
  @Get('verify')
  async verifyEmail(@Query('token') token: string) {
    return this.authService.verifyEmail(token);
  }

  // POST - Registro de usuário
  @Public()
  @Post('register')
  async register(@Body() dto: Register) {
    const user = await this.authService.register(dto);
    return {
      message: 'Usuário criado. Por favor de uma olhada seu email para verificar sua conta.',
      user,
    };
  }

  // POST - Login de usuário
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

    if (!user) throw new UnauthorizedException('Credenciais inválidas');

    const { safe, refreshPlain } = await this.authService.login(user);
    this.setRefreshCookie(res, refreshPlain);

    return safe;
  }

  // POST - Refresh token
  @Public()
  @Throttle({ default: { limit: 10, ttl: 60 } })
  @Post('refresh')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies?.refresh_token;

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token missing');
    }

    try {
      const { safe, refreshPlain } =
        await this.authService.refreshTokens(refreshToken);

      this.setRefreshCookie(res, refreshPlain);
      return safe;
    } catch (err) {
      // limpa cookie inválido → evita loop infinito
      res.clearCookie('refresh_token', {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        path: '/api/auth',
      });

      throw err;
    }
  }

  // POST - Sair da conta
  @Public()
  @Post('logout')
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies?.refresh_token;

    if (refreshToken) {
      await this.authService.logoutByRefreshToken(refreshToken);
    }

    res.clearCookie('refresh_token', {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/api/auth',
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
