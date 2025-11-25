import {
  Controller,
  Body,
  Delete,
  Param,
  ParseIntPipe,
  Patch,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';

import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';

import { Roles } from '../common/roles/roles.decorator';
import { Role } from './user.entity';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  private sanitizeUser(user: any) {
    if (!user) return user;

    delete user.password;
    delete user.currentHashedRefreshToken;
    delete user.currentHashedRefreshTokenExpiresAt;
    delete user.resetTokenHash;
    delete user.resetTokenExpiresAt;
    delete user.verificationTokenHash;
    delete user.verificationTokenExpiresAt;

    return user;
  }

  // -------------------------
  // DELETE USER – Admin only
  // -------------------------
  @Delete('remove/:userId')
  @Roles(Role.ADMIN)
  async remove(@Param('userId', ParseIntPipe) userId: number) {
    const user = await this.userService.removeUser(userId);
    return this.sanitizeUser(user);
  }

  // -------------------------
  // UPDATE USER – user or admin
  // -------------------------
  @Patch('update/:id')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserDto
  ) {
    const user = await this.userService.updateUser(id, dto);
    return this.sanitizeUser(user);
  }
}
