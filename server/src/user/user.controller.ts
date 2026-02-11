import {
  Controller,
  Body,
  Delete,
  Param,
  ParseIntPipe,
  Patch,
  UsePipes,
  ValidationPipe,
  Req,
  Get
} from '@nestjs/common';

import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';

import { Roles } from '../common/roles/roles.decorator';
import { Role } from './user.entity';
import { Public } from '../common/decorators/public.decorator';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  // Remove TUDO do usuario
  private sanitizeUser(user: any) {
    if (!user) return null;

    const clone = { ...user };

    delete clone.password;
    delete clone.currentHashedRefreshToken;
    delete clone.currentHashedRefreshTokenExpiresAt;
    delete clone.resetTokenHash;
    delete clone.resetTokenExpiresAt;
    delete clone.verificationTokenHash;
    delete clone.verificationTokenExpiresAt;

    return clone;
  }

  // Debug - para testes
  @Get('debug')
  @Public()
  debug(@Req() req) {
    return {
      ip: req.ip,
      forwarded: req.headers['x-forwarded-for'],
      proto: req.headers['x-forwarded-proto'],
    };
  }

  // GET LOGGED USER
  @Get('me')
  getMe(@Req() req: any) {
    const userId = req.user.id;
    return this.userService.getCurrentUser(userId);
  }

  // DELETE USER – Deletar a própria conta
  @Delete('remove')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async remove(@Req() req: any){
    const userId = req.user.id;
    const user = await this.userService.removeUser(userId);
    return this.sanitizeUser(user); 
  }

  // DELETE USER – Somente Admin
  @Delete('remove/:id')
  @Roles(Role.ADMIN) // Apenas Admin pode interagir com esse controller
  async removeAdm(@Param('id', ParseIntPipe) id: number) {
    const user = await this.userService.removeUser(id);
    return this.sanitizeUser(user);
  }

  // UPDATE USER
  @Patch('update')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async updateUser(@Req() req: any, @Body() dto: UpdateUserDto) {
    const userId = req.user.id;
    const user = await this.userService.updateUser(userId, dto);
    return this.sanitizeUser(user);
  }
}
