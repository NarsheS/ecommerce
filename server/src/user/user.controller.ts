import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { Register } from './dto/register.dto';


@Controller('users')
export class UserController {
    constructor(private userService: UserService) {}


    @Post('register')
    async register(@Body() dto: Register) {
        const user = await this.userService.create(dto);
        // Nunca retornar o hash da senha
        const { password, ...rest } = user as any;
        return rest;
    }
}