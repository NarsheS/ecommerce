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

  // CREATE USER
  async create(dto: Register) {
    const exists = await this.userRepo.findOne({
      where: [{ username: dto.username }, { email: dto.email }],
    });

    // Verifica se já existe alguém com esse username ou email - error
    if (exists) throw new ConflictException('Username ou email já existe');

    // criptografando senha
    const hash = await bcrypt.hash(dto.password, 10);

    // criando usuário com base na entidade
    const user = this.userRepo.create({
      username: dto.username,
      email: dto.email,
      password: hash,
      role: Role.USER,
      isVerified: false,
    });

    return this.userRepo.save(user); // Salvando usuário
  }

  // GET USER - Encontra usuário por identificador (username ou email)
  async findByIdentifier(identifier: string): Promise<User | null> {
    const lowered = identifier.toLowerCase();

    return this.userRepo
      .createQueryBuilder('u')
      .where('LOWER(u.email) = :identifier', { identifier: lowered })
      .orWhere('LOWER(u.username) = :identifier', { identifier: lowered })
      .getOne();
  }

  // GET USER - Encontra usuário por ID
  async findById(userId: number) {
    return this.userRepo.findOne({ where: { id: userId } });
  }

  // PASSWORD CHECK - Verifica se a senha está correta
  async validatePassword(user: User, plainPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, user.password); // compara senhas (raw com criptografada)
  }

  // DELETE USER - Remove usuário do banco de dados
  async removeUser(userId: number) {
    const user = await this.findById(userId);
    // Verifica se o usuário existe
    if (!user) throw new NotFoundException('Usuário não encontrado.');

    return this.userRepo.remove(user); // remove usuário
  }

  // UPDATE USER - Atualiza os campos que o usuário queira mudar
  async updateUser(userId: number, data: Partial<User>) {
    const user = await this.userRepo.findOne({ where: { id: userId } });

    // Caso não encontre o usuário - error
    if (!user) throw new NotFoundException('Usuário não encontrado.');

    const where: FindOptionsWhere<User>[] = [];

    if (data.username) {
      where.push({ username: data.username });
    }
    if (data.email) {
      where.push({ email: data.email });
    }

    // Impede a mudança de email ou username caso já exista alguém usando os mesmos
    if (where.length > 0) {
      const conflict = await this.userRepo.findOne({ where });

      if (conflict && conflict.id !== userId) {
        throw new ConflictException('Username ou email já está em uso.');
      }
    }

    // Re-hash password/senha caso tenha sido atualizado - criptografia ele novamente
    if (data.password) {
      const salt = await bcrypt.genSalt();
      data.password = await bcrypt.hash(data.password, salt);
    }

    Object.assign(user, data);
    return this.userRepo.save(user);
  }

  // REFRESH TOKENS - Salva o refresh token
  async saveRefreshTokenHash(userId: number, hash: string, expiresAt: number) {
    return this.userRepo.update(userId, {
      currentHashedRefreshToken: hash,
      currentHashedRefreshTokenExpiresAt: expiresAt,
    });
  }

  // Renova o refresh token
  async clearRefreshToken(userId: number) {
    return this.userRepo.update(userId, {
      currentHashedRefreshToken: null,
      currentHashedRefreshTokenExpiresAt: null,
    });
  }

  // Encontra pelo Refresh hash
  async findByRefreshHash(hash: string) {
    return this.userRepo.findOne({
      where: { currentHashedRefreshToken: hash },
    });
  }

  // EMAIL VERIFICATION SYSTEM - Salva o token de verificação
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

  // Encontra pelo token de verificação
  async findByVerificationHash(hash: string) {
    return this.userRepo.findOne({
      where: { verificationTokenHash: hash },
    });
  }

  // Se o usuário estiver verificado, muda isVerified para true
  async markVerified(userId: number) {
    return this.userRepo.update(userId, {
      isVerified: true,
      verificationTokenHash: null,
      verificationTokenExpiresAt: null,
    });
  }

  // PASSWORD RESET SYSTEM
  async saveResetToken(userId: number, tokenHash: string, expiresAt: number) {
    return this.userRepo.update(userId, {
      resetTokenHash: tokenHash,
      resetTokenExpiresAt: expiresAt,
    });
  }

  // Encontra via resetHash
  async findByResetHash(hash: string) {
    return this.userRepo.findOne({
      where: { resetTokenHash: hash },
      select: {
        id: true,
        password: true,
        resetTokenHash: true,
        resetTokenExpiresAt: true,
        currentHashedRefreshToken: true,
        currentHashedRefreshTokenExpiresAt: true,
      },
    });
  }

  // Limpa resetToken
  async clearResetToken(userId: number) {
    return this.userRepo.update(userId, {
      resetTokenHash: null,
      resetTokenExpiresAt: null,
    });
  }
}
