import { Controller, Post, Body, Delete, Param, ParseIntPipe, Patch } from '@nestjs/common';
import { UserService } from './user.service';
import { Register } from './dto/register.dto';
import { UpdateUserDto } from './dto/update-user.dto';


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

    @Delete('remove/:userId')
    async remove(@Param('userId', ParseIntPipe) userId: number){
        return this.userService.removeUser(userId);
    }

    @Patch('update/:id')
    updateUser(
        @Param('id') id: number,
        @Body() dto: UpdateUserDto
    ) {
        return this.userService.updateUser(id, dto);
    }
}