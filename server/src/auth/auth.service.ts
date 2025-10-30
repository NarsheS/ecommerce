import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';


@Injectable()
export class AuthService {
constructor(private usersService: UserService, private jwtService: JwtService) {}


async validateUser(identifier: string, pass: string) {
  const user = await this.usersService.findByIdentifier(identifier);
  if (!user) return null;

  const valid = await this.usersService.validatePassword(user, pass);
  if (valid) {
    const { password, ...result } = user as any;
    return result;
  }
  return null;
}



async login(user: any) {
        const payload = { username: user.username, sub: user.id };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}