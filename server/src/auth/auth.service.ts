import { Injectable, UnauthorizedException, HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  // -----------------------
  // BRUTE FORCE PROTECTION
  // -----------------------
  private loginAttempts = new Map<string, { attempts: number; lockedUntil: number }>();

  private MAX_ATTEMPTS = 5;        // allowed attempts
  private LOCK_TIME = 15 * 60_000; // 15 minutes

  private isLocked(identifier: string): boolean {
    const data = this.loginAttempts.get(identifier);
    if (!data) return false;

    if (data.lockedUntil > Date.now()) {
      return true;
    }

    // auto unlock
    if (data.lockedUntil && data.lockedUntil <= Date.now()) {
      this.loginAttempts.delete(identifier);
    }

    return false;
  }

  private registerFailedAttempt(identifier: string) {
    const entry = this.loginAttempts.get(identifier) || {
      attempts: 0,
      lockedUntil: 0,
    };

    entry.attempts++;

    if (entry.attempts >= this.MAX_ATTEMPTS) {
      entry.lockedUntil = Date.now() + this.LOCK_TIME;
    }

    this.loginAttempts.set(identifier, entry);
  }

  private registerSuccess(identifier: string) {
    this.loginAttempts.delete(identifier);
  }

  // -----------------------------------------------------

  async validateUser(identifier: string, pass: string) {
    // BLOCKED?
    if (this.isLocked(identifier)) {
      throw new HttpException(
        'Too many failed login attempts. Try again later.',
        HttpStatus.TOO_MANY_REQUESTS // 429
      );
    }

    const user = await this.usersService.findByIdentifier(identifier);
    if (!user) {
      this.registerFailedAttempt(identifier);
      return null;
    }

    const valid = await this.usersService.validatePassword(user, pass);

    if (!valid) {
      this.registerFailedAttempt(identifier);
      return null;
    }

    // SUCCESS → reset attempts
    this.registerSuccess(identifier);

    const { password, ...result } = user as any;
    return result;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
