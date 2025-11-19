import {
  Controller,
  Post,
  UseGuards,
  Request,
  Body,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from '../common/guards/local-auth.guard';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { Throttle } from '@nestjs/throttler';
import { Public } from 'src/common/decorators/public.decorator';

interface AuthRequest extends Request {
  user: {
    sub: number;
    username: string;
    role: string;
  };
}

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // -----------------------
  // LOGIN
  // -----------------------
  @Public()
  @UseGuards(LocalAuthGuard)
  @Throttle({ login: { limit: 5, ttl: 60 } }) // 5 attempts per minute
  @Post('login')
  async login(@Request() req: AuthRequest) {
    return this.authService.login(req.user);
  }

  // -----------------------
  // REFRESH TOKENS
  // -----------------------
  @Throttle({ default: { limit: 10, ttl: 60 } })
  @Post('refresh')
  async refresh(@Body() dto: { refreshToken: string }) {
    if (!dto.refreshToken || typeof dto.refreshToken !== 'string') {
      throw new BadRequestException('Refresh token inválido.');
    }

    return this.authService.refreshTokens(dto.refreshToken);
  }

  // -----------------------
  // LOGOUT
  // -----------------------
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Req() req: AuthRequest) {
    await this.authService.logout(req.user.sub);
    return { ok: true };
  }
}
