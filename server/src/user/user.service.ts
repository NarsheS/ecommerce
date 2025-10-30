import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Register } from './dto/register.dto'; 
import * as bcrypt from 'bcrypt';


@Injectable()
export class UserService {
    constructor(@InjectRepository(User) private repo: Repository<User>) {}


    async create(dto: Register) {
    const exists = await this.repo.findOne({ where: [{ username: dto.username }, { email: dto.email }] });
    if (exists) throw new ConflictException('Username or email already exists');


    // Gera salt aleatório e hash — bcrypt já faz salt aleatório com genSalt()
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(dto.password, salt);


    const user = this.repo.create({ username: dto.username, email: dto.email, password: hash });
        return this.repo.save(user);
    }


    async findByUsername(username: string) {
        return this.repo.findOne({ where: { username } });
    }

    async findByIdentifier(identifier: string): Promise<User | null> {
        return this.repo.findOne({
            where: [{ username: identifier }, { email: identifier }],
        });
    }


    async findById(id: number) {
        return this.repo.findOne({ where: { id } });
    }


    async validatePassword(user: User, plainPassword: string): Promise<boolean> {
        return await bcrypt.compare(plainPassword, user.password);
    }

}