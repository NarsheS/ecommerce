import {
  Injectable,
  HttpException,
  HttpStatus,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { MailService } from '../mail/mail.service';
import {
  generateRandomToken,
  hashToken,
  timingSafeEqualHash,
} from '../utilities/token-utils';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private usersService: UserService,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}


  // BRUTE FORCE PROTECTION
  // In-memory store. Trocar para Redis em multi-instance production.
  private attempts = new Map<
    string,
    { count: number; firstAttemptAt: number; lockedUntil?: number }
  >();

  // Config
  private MAX_ATTEMPTS = Number(process.env.MAX_ATTEMPTS);
  private WINDOW_MS = Number(process.env.WINDOW_MS) * 60_000; // 15 min
  private LOCK_MS = Number(process.env.LOCK_MS) * 60_000; // Tranca por 15 min quando excede

  private makeAttemptKey(identifier: string, ip?: string) {
    // Combina identifier + IP para proteção
    return `${identifier}:${ip ?? 'noip'}`;
  }

  private isLocked(key: string): boolean {
    const entry = this.attempts.get(key);
    if (!entry) return false;
    if (entry.lockedUntil && entry.lockedUntil > Date.now()) return true;

    // Se a janela expirou > reset
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

    // Se a janela expirou > reset
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


  // Sanitization helper
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


  // REGISTER & EMAIL VERIFICATION
  // Chama usersService.create() -> Salva verification token -> Envia email
  async register(dto: { username: string; email: string; password: string }) {
    // normaliza email e username
    const email = dto.email.trim().toLowerCase();
    const username = dto.username.trim();

    const user = await this.usersService.create({
      username,
      email,
      password: dto.password,
    });

    // create verification token (plain + hashed)
    const token = generateRandomToken(24); // Retorna para usuário via email
    const tokenHash = hashToken(token);
    const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24h

    await this.usersService.saveVerificationToken(user.id, tokenHash, expiresAt);

    // Envia email (não falha o registro se o email falhar — handle opcional)
    try {
      await this.mailService.sendVerification(user.email, token);
    } catch (err) {
      console.log(`Erro ao enviar verificação de email: ${err}`);
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


  // LOGIN + VALIDATION
  async validateUser(identifier: string, plainPassword: string, ip?: string) {
    identifier = identifier.trim();
    const isEmail = identifier.includes('@');
    // key de attempt usa sempre lowercase para consistência (opcional)
    const key = this.makeAttemptKey(isEmail ? identifier.toLowerCase() : identifier, ip);

    if (this.isLocked(key)) {
      throw new HttpException(
        'Você falhou muitas vezes. Tente novamente mais tarde.',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    // Deixe o usersService cuidar da busca case-insensitive se implementado
    const user = await this.usersService.findByIdentifier(identifier);
    if (!user) {
      this.registerFailed(key);
      return null;
    }

    if (!user.isVerified) {
      throw new HttpException('Email não verificado!', HttpStatus.FORBIDDEN);
    }

    const valid = await this.usersService.validatePassword(user, plainPassword);
    if (!valid) {
      this.registerFailed(key);
      return null;
    }

    this.registerSuccess(key);
    return this.sanitizeUser(user);
  }


  // TOKENS: ACCESS + REFRESH (rotating)
  private createAccessToken(user: any) {
    const payload = { username: user.username, sub: user.id, role: user.role };
    return this.jwtService.sign(payload);
  }

  // Issue tokens e salvar hashed refresh token no DB
  async issueTokensAndSaveRefresh(user: any) {
    const accessToken = this.createAccessToken(user);

    const refreshPlain = generateRandomToken(32);
    const refreshHash = hashToken(refreshPlain);

    const refreshTtlMs = (Number(process.env.REFRESH_TTL_DAYS || '7') || 7) * 24 * 60 * 60 * 1000;

    const refreshExpiresAt = Date.now() + refreshTtlMs;

    await this.usersService.saveRefreshTokenHash(
      user.id,
      refreshHash,
      refreshExpiresAt,
    );

    const decoded = this.jwtService.decode(accessToken) as any;
    const exp = decoded?.exp;

    return {
      /** objeto seguro */
      safe: {
        access_token: accessToken,
        expires_in: exp,
        refresh_expires_at: refreshExpiresAt,
      },

      /** refresh token em texto plano */
      refreshPlain,
    };
  }

  // Refresh endpoint — rotates token
  async refreshTokens(refreshPlain: string) {
    // hash
    const hash = hashToken(refreshPlain);

    // Encontra o usuário pelo refreshHash
    const user = await this.usersService.findByRefreshHash(hash);
    if (!user) {
      // Se necessário invalida o token
      throw new HttpException('Refresh token inválido', HttpStatus.UNAUTHORIZED);
    }

    // Compara hash
    if (!timingSafeEqualHash(user.currentHashedRefreshToken || '', hash)) {
      // token mismatch
      await this.usersService.clearRefreshToken(user.id);
      throw new HttpException('Refresh token inválido', HttpStatus.UNAUTHORIZED);
    }

    // Verifica expiração
    if (!user.currentHashedRefreshTokenExpiresAt || user.currentHashedRefreshTokenExpiresAt < Date.now()) {
      await this.usersService.clearRefreshToken(user.id);
      throw new HttpException('Refresh token expired', HttpStatus.UNAUTHORIZED);
    }

    return this.issueTokensAndSaveRefresh(user);
  }

  // login: assume que 'user' foi sanitazed ou validado de validateUser
  async login(user: any) {
    // User precisa ser um usuário do DB (precisamos de id e Role)
    const dbUser = await this.usersService.findById(user.id);
    if (!dbUser) throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);

    // Opcional: Verifica isVerified novamente
    if (!dbUser.isVerified) {
      throw new HttpException('Email not verified', HttpStatus.FORBIDDEN);
    }

    return this.issueTokensAndSaveRefresh(dbUser);
  }

  async logout(userId: number) {
    await this.usersService.clearRefreshToken(userId);
    return { ok: true };
  }

  async logoutByRefreshToken(refreshToken: string) {
  const hash = hashToken(refreshToken);

  const user = await this.usersService.findByRefreshHash(hash);
  if (user) {
    await this.usersService.clearRefreshToken(user.id);
  }
}



  // PASSWORD RESET FLOW
  async requestPasswordReset(emailOrIdentifier: string) {
    const user = await this.usersService.findByIdentifier(emailOrIdentifier);
    if (!user) {
      // Não revele sua existência
      return { ok: true };
    }

    const token = generateRandomToken(32);
    const tokenHash = hashToken(token);
    const expiresAt = Date.now() + 60 * 60_000; // 1h

    await this.usersService.saveResetToken(user.id, tokenHash, expiresAt);

    // Enviar reset email
    try {
      await this.mailService.sendReset(user.email, token);
    } catch (err) {
      console.log(`Erro ao enviar email: ${err}`)
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

    // Criptografa a nova senha (use bcrypt)
    const hashed = await bcrypt.hash(newPassword, 12);
    await this.usersService.updateUser(user.id, { password: hashed });

    // Limpa e reseta token e refresh token (force logout)
    await this.usersService.clearResetToken(user.id);
    await this.usersService.clearRefreshToken(user.id);

    return { ok: true };
  }
}
