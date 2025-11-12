import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Register } from './dto/register.dto'; 
import * as bcrypt from 'bcrypt';


@Injectable()
export class UserService {
    constructor(@InjectRepository(User) private userRepo: Repository<User>) {}


    async create(dto: Register) {
        const exists = await this.userRepo.findOne({ where: [{ username: dto.username }, { email: dto.email }] });
        if (exists) throw new ConflictException('Username ou email já existe');


        // Gera salt aleatório e hash — bcrypt já faz salt aleatório com genSalt()
        const salt = await bcrypt.genSalt();
        const hash = await bcrypt.hash(dto.password, salt);


        const user = this.userRepo.create({ username: dto.username, email: dto.email, password: hash });
        return this.userRepo.save(user);
    }


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


    async validatePassword(user: User, plainPassword: string): Promise<boolean> {
        return await bcrypt.compare(plainPassword, user.password);
    }

    async removeUser(userId: number){
        const user = await this.userRepo.findOne({ where: { id: userId } });

        if(!user) throw new NotFoundException("Usuário não encontrado ou não existe.");
        return this.userRepo.remove(user);
    }

}