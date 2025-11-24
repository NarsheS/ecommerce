// src/auth/auth.service.ts
import {
  Injectable,
  HttpException,
  HttpStatus,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { MailService } from 'src/mail/mail.service';
import {
  generateRandomToken,
  hashToken,
  timingSafeEqualHash,
} from 'src/utilities/token-utils';
import * as bcrypt from 'bcrypt';

/**
 * FULL FEATURED AUTH SERVICE
 * - brute force protection (identifier+IP)
 * - register -> send verification email
 * - verify email
 * - login -> access + refresh (rotating)
 * - refresh -> rotate refresh token, detect reuse
 * - logout -> clear refresh tokens
 * - requestReset -> send password reset email
 * - resetPassword -> validate + set new password + clear refresh tokens
 *
 * Notes:
 * - For production use Redis for attempt tracking and reuse detection.
 * - All tokens (refresh/verification/reset) stored hashed in DB via UserService.
 */

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private usersService: UserService,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  // -----------------------
  // BRUTE FORCE PROTECTION
  // -----------------------
  // In-memory store. Replace with Redis for multi-instance production.
  private attempts = new Map<
    string,
    { count: number; firstAttemptAt: number; lockedUntil?: number }
  >();

  // Configuration (tune to your needs / move to env)
  private MAX_ATTEMPTS = 5;
  private WINDOW_MS = 15 * 60_000; // 15 minutes window
  private LOCK_MS = 15 * 60_000; // lock for 15 minutes when exceeded

  private makeAttemptKey(identifier: string, ip?: string) {
    // Combine identifier + IP for stricter protection
    return `${identifier}:${ip ?? 'noip'}`;
  }

  private isLocked(key: string): boolean {
    const entry = this.attempts.get(key);
    if (!entry) return false;
    if (entry.lockedUntil && entry.lockedUntil > Date.now()) return true;

    // If window expired, reset
    if (Date.now() - entry.firstAttemptAt > this.WINDOW_MS) {
      this.attempts.delete(key);
      return false;
    }

    return false;
  }

  private registerFailed(key: string) {
    const now = Date.now();
    const existing = this.attempts.get(key);
    if (!existing) {
      this.attempts.set(key, { count: 1, firstAttemptAt: now });
      return;
    }

    // If window expired -> reset
    if (now - existing.firstAttemptAt > this.WINDOW_MS) {
      this.attempts.set(key, { count: 1, firstAttemptAt: now });
      return;
    }

    existing.count += 1;

    if (existing.count >= this.MAX_ATTEMPTS) {
      existing.lockedUntil = Date.now() + this.LOCK_MS;
    }

    this.attempts.set(key, existing);
  }

  private registerSuccess(key: string) {
    this.attempts.delete(key);
  }

  // -----------------------
  // Sanitization helper
  // -----------------------
  private sanitizeUser(user: any) {
    if (!user) return null;
    const copy = { ...user };
    delete copy.password;
    delete copy.currentHashedRefreshToken;
    delete copy.currentHashedRefreshTokenExpiresAt;
    delete copy.resetTokenHash;
    delete copy.resetTokenExpiresAt;
    delete copy.verificationTokenHash;
    delete copy.verificationTokenExpiresAt;
    return copy;
  }

  // -----------------------
  // REGISTER & EMAIL VERIFICATION
  // -----------------------
  // call usersService.create() -> save verification token -> send email
  async register(dto: { username: string; email: string; password: string }) {
    // normalize email
    const email = dto.email.trim().toLowerCase();

    const user = await this.usersService.create({
      username: dto.username.trim(),
      email,
      password: dto.password,
    });

    // create verification token (plain + hashed)
    const token = generateRandomToken(24); // returned to user via email
    const tokenHash = hashToken(token);
    const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24h

    await this.usersService.saveVerificationToken(user.id, tokenHash, expiresAt);

    // send email (do not fail registration if mail fails — optionally handle)
    try {
      await this.mailService.sendVerification(user.email, token);
    } catch (err) {
      // optional: log error
      // do not throw so registration can succeed (or you can throw depending on policy)
    }

    return this.sanitizeUser(user);
  }

  async verifyEmail(tokenPlain: string) {
    const tokenHash = hashToken(tokenPlain);
    const user = await this.usersService.findByVerificationHash(tokenHash);
    if (!user) {
      throw new HttpException('Invalid verification token', HttpStatus.BAD_REQUEST);
    }
    if (!user.verificationTokenExpiresAt || user.verificationTokenExpiresAt < Date.now()) {
      throw new HttpException('Verification token expired', HttpStatus.BAD_REQUEST);
    }

    await this.usersService.markVerified(user.id);
    return { ok: true };
  }

  // -----------------------
  // LOGIN + VALIDATION
  // -----------------------
  // validateUser used by passport-local or custom auth flow.
  async validateUser(identifier: string, plainPassword: string, ip?: string) {
    identifier = identifier.trim().toLowerCase();
    const key = this.makeAttemptKey(identifier, ip);

    if (this.isLocked(key)) {
      throw new HttpException(
        'Too many failed attempts. Try again later.',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    const user = await this.usersService.findByIdentifier(identifier);
    if (!user) {
      this.registerFailed(key);
      return null;
    }

    // Uncomment this when email verification is implemented!
    if (!user.isVerified) {
      throw new HttpException('Email not verified', HttpStatus.FORBIDDEN);
    }

    const valid = await this.usersService.validatePassword(user, plainPassword);
    if (!valid) {
      this.registerFailed(key);
      return null;
    }

    // success
    this.registerSuccess(key);
    return this.sanitizeUser(user);
  }

  // -----------------------
  // TOKENS: ACCESS + REFRESH (rotating)
  // -----------------------
  private createAccessToken(user: any) {
    const payload = { username: user.username, sub: user.id, role: user.role };
    return this.jwtService.sign(payload);
  }

  // issue tokens AND save hashed refresh token in DB
  async issueTokensAndSaveRefresh(user: any) {
    // create access token
    const accessToken = this.createAccessToken(user);

    // create refresh token (opaque)
    const refreshPlain = generateRandomToken(32);
    const refreshHash = hashToken(refreshPlain);
    const refreshTtlMs = (Number(process.env.REFRESH_TTL_DAYS || '7') || 7) * 24 * 60 * 60 * 1000;
    const refreshExpiresAt = Date.now() + refreshTtlMs;

    // save hashed refresh in DB (overwrite previous)
    await this.usersService.saveRefreshTokenHash(user.id, refreshHash, refreshExpiresAt);

    const decoded = this.jwtService.decode(accessToken) as any;
    const exp = decoded?.exp ?? undefined;

    return {
      access_token: accessToken,
      refresh_token: refreshPlain,
      expires_in: exp,
      refresh_expires_at: refreshExpiresAt,
    };
  }

  // Refresh endpoint — rotates token. Uses hashed lookup + safe compare.
  async refreshTokens(refreshPlain: string) {
    // compute hash and lookup user by hashed stored value
    const hash = hashToken(refreshPlain);

    // find user by the stored hashed refresh (exact match)
    const user = await this.usersService.findByRefreshHash(hash);
    if (!user) {
      // POSSIBLE TOKEN REUSE / COMPROMISE — reject and clear any tokens if detected
      throw new HttpException('Invalid refresh token', HttpStatus.UNAUTHORIZED);
    }

    // timing-safe equal protection (compare stored hash and computed hash)
    // If your DB stores the hash exactly, direct equality is fine; timingSafeEqualHash is included for safer checks.
    if (!timingSafeEqualHash(user.currentHashedRefreshToken || '', hash)) {
      // token mismatch — possible tampering
      await this.usersService.clearRefreshToken(user.id);
      throw new HttpException('Invalid refresh token', HttpStatus.UNAUTHORIZED);
    }

    // expiry check
    if (!user.currentHashedRefreshTokenExpiresAt || user.currentHashedRefreshTokenExpiresAt < Date.now()) {
      await this.usersService.clearRefreshToken(user.id);
      throw new HttpException('Refresh token expired', HttpStatus.UNAUTHORIZED);
    }

    // rotate: issue new refresh and invalidate old one by overwriting
    return this.issueTokensAndSaveRefresh(user);
  }

  // login: assume `user` is sanitized or returned from validateUser
  async login(user: any) {
    // user must be actual DB user (we need id & role)
    const dbUser = await this.usersService.findById(user.id);
    if (!dbUser) throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);

    // Optionally check isVerified again
    if (!dbUser.isVerified) {
      throw new HttpException('Email not verified', HttpStatus.FORBIDDEN);
    }

    return this.issueTokensAndSaveRefresh(dbUser);
  }

  async logout(userId: number) {
    await this.usersService.clearRefreshToken(userId);
    return { ok: true };
  }

  // -----------------------
  // PASSWORD RESET FLOW
  // -----------------------
  async requestPasswordReset(emailOrIdentifier: string) {
    // find user
    const user = await this.usersService.findByIdentifier(emailOrIdentifier);
    if (!user) {
      // don't reveal existence
      return { ok: true };
    }

    const token = generateRandomToken(32);
    const tokenHash = hashToken(token);
    const expiresAt = Date.now() + 60 * 60_000; // 1 hour

    await this.usersService.saveResetToken(user.id, tokenHash, expiresAt);

    // send reset email (use mailService)
    try {
      await this.mailService.sendReset(user.email, token);
    } catch (e) {
      // swallow or log
    }

    return { ok: true };
  }

  async resetPassword(tokenPlain: string, newPassword: string) {
    const tokenHash = hashToken(tokenPlain);
    const user = await this.usersService.findByResetHash(tokenHash);
    if (!user) {
      throw new HttpException('Invalid reset token', HttpStatus.BAD_REQUEST);
    }
    if (!user.resetTokenExpiresAt || user.resetTokenExpiresAt < Date.now()) {
      throw new HttpException('Reset token expired', HttpStatus.BAD_REQUEST);
    }

    // Hash the new password (use bcrypt)
    const hashed = await bcrypt.hash(newPassword, 12);
    await this.usersService.updateUser(user.id, { password: hashed });

    // clear reset token and refresh tokens (force logout)
    await this.usersService.clearResetToken(user.id);
    await this.usersService.clearRefreshToken(user.id);

    return { ok: true };
  }
}
