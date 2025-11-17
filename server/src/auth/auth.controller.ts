import { Controller, Post, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from '../common/guards/local-auth.guard';
import { Throttle } from '@nestjs/throttler';


@Controller('auth')
    export class AuthController {
    constructor(private authService: AuthService) {}


    @UseGuards(LocalAuthGuard)
    @Throttle({login: { limit: 5, ttl: 60 }}) // 5 tentativas de login por minuto
    @Post('login')
    async login(@Request() req) {
        return this.authService.login(req.user);
    }
}