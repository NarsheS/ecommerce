import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { FindOptionsWhere, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Role, User } from './user.entity';
import { Register } from '../auth/dto/register.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  // ---------------------
  //  CREATE
  // ---------------------
  async create(dto: Register) {
    const exists = await this.userRepo.findOne({
      where: [{ username: dto.username }, { email: dto.email }],
    });

    if (exists) {
      throw new ConflictException('Username ou email já existe');
    }

    const hash = await bcrypt.hash(dto.password, 10);

    const user = this.userRepo.create({
      username: dto.username,
      email: dto.email,
      password: hash,
      role: Role.USER,
      isVerified: false,
    });

    return this.userRepo.save(user);
  }

  // ---------------------
  //  GETTERS
  // ---------------------
  async findByUsername(username: string) {
    return this.userRepo.findOne({ where: { username } });
  }

  async findByIdentifier(identifier: string): Promise<User | null> {
    return this.userRepo.findOne({
      where: [{ username: identifier }, { email: identifier }],
    });
  }

  async findById(userId: number) {
    return this.userRepo.findOne({ where: { id: userId } });
  }

  // ---------------------
  //  PASSWORD CHECK
  // ---------------------
  async validatePassword(user: User, plainPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, user.password);
  }

  // ---------------------
  //  DELETE USER
  // ---------------------
  async removeUser(userId: number) {
    const user = await this.findById(userId);
    if (!user) throw new NotFoundException('Usuário não encontrado.');

    return this.userRepo.remove(user);
  }

  // ---------------------
  //  UPDATE USER
  // ---------------------
  async updateUser(userId: number, data: Partial<User>) {
    const user = await this.userRepo.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    const where: FindOptionsWhere<User>[] = [];

    if (data.username) {
      where.push({ username: data.username });
    }
    if (data.email) {
      where.push({ email: data.email });
    }

    if (where.length > 0) {
      const conflict = await this.userRepo.findOne({ where });

      if (conflict && conflict.id !== userId) {
        throw new ConflictException('Username ou email já está em uso.');
      }
    }

    // Re-hash password if updated
    if (data.password) {
      const salt = await bcrypt.genSalt();
      data.password = await bcrypt.hash(data.password, salt);
    }

    Object.assign(user, data);
    return this.userRepo.save(user);
  }

  // ---------------------
  //  REFRESH TOKENS
  // ---------------------
  async saveRefreshTokenHash(userId: number, hash: string, expiresAt: number) {
    return this.userRepo.update(userId, {
      currentHashedRefreshToken: hash,
      currentHashedRefreshTokenExpiresAt: expiresAt,
    });
  }

  async clearRefreshToken(userId: number) {
    return this.userRepo.update(userId, {
      currentHashedRefreshToken: null,
      currentHashedRefreshTokenExpiresAt: null,
    });
  }

  async findByRefreshHash(hash: string) {
    return this.userRepo.findOne({
      where: { currentHashedRefreshToken: hash },
    });
  }

  // =======================================================
  //  EMAIL VERIFICATION SYSTEM
  // =======================================================

  async saveVerificationToken(
    userId: number,
    tokenHash: string,
    expiresAt: number,
  ) {
    return this.userRepo.update(userId, {
      verificationTokenHash: tokenHash,
      verificationTokenExpiresAt: expiresAt,
    });
  }

  async findByVerificationHash(hash: string) {
    return this.userRepo.findOne({
      where: { verificationTokenHash: hash },
    });
  }

  async markVerified(userId: number) {
    return this.userRepo.update(userId, {
      isVerified: true,
      verificationTokenHash: null,
      verificationTokenExpiresAt: null,
    });
  }

  // =======================================================
  //  PASSWORD RESET SYSTEM
  // =======================================================

  async saveResetToken(userId: number, tokenHash: string, expiresAt: number) {
    return this.userRepo.update(userId, {
      resetTokenHash: tokenHash,
      resetTokenExpiresAt: expiresAt,
    });
  }

  async findByResetHash(hash: string) {
    return this.userRepo.findOne({
      where: { resetTokenHash: hash },
    });
  }

  async clearResetToken(userId: number) {
    return this.userRepo.update(userId, {
      resetTokenHash: null,
      resetTokenExpiresAt: null,
    });
  }
}
