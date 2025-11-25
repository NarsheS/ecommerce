import {
  Controller,
  Post,
  Request,
  Body,
  Req,
  BadRequestException,
  UnauthorizedException,
  Get,
  Query,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Throttle } from '@nestjs/throttler';
import { Public } from 'src/common/decorators/public.decorator';
import { LoginDto } from 'src/auth/dto/login.dto';
import { Register } from './dto/register.dto';

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

  @Public()
  @Get('verify')
  async verifyEmail(@Query('token') token: string) {
    return this.authService.verifyEmail(token);
  }

  // -----------------------
  // REGISTER
  // -----------------------
  @Public()
  @Post('register')
  async register(@Body() dto: Register) {
    const user = await this.authService.register(dto);
    return {
      message: 'User created. Please check your email to verify your account.',
      user,
    };
  }

  // -----------------------
  // LOGIN
  // -----------------------
  @Public()
  @Throttle({ login: { limit: 5, ttl: 60 } }) // 5 attempts per minute
  @Post('login')
  async login(@Body() dto: LoginDto) {
    const user = await this.authService.validateUser(
      dto.identifier,
      dto.password,
    );

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.authService.login(user);
  }


  // -----------------------
  // REFRESH TOKENS
  // -----------------------
  @Public()
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
  @Post('logout')
  async logout(@Req() req: AuthRequest) {
    await this.authService.logout(req.user.sub);
    return { ok: true };
  }
}
