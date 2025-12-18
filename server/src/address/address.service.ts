import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Address } from "./address.entity";
import { User } from "../user/user.entity";
import { CreateAddressDto } from "./dto/create-address.dto";
import { UpdateAddressDto } from "./dto/update-address.dto";


@Injectable()
export class AddressService {
    constructor(
        @InjectRepository(Address)
        private addressRepo: Repository<Address>,

        @InjectRepository(User)
        private userRepo: Repository<User>,
    ){}

    // Cria e atribui um endereço ao usuário
    async addAddress(userId: number, dto: CreateAddressDto){
        // Verifica se o usuário existe
        const user = await this.userRepo.findOne({ where: { id: userId } });
        if(!user) throw new NotFoundException("Usuário não encontrado.");

        // Cria e salva o ou os endereços ao usuário
        const address = this.addressRepo.create({ ...dto, user });
        return this.addressRepo.save(address);
    }

    // Lista todos os endereços do usuário a partir de seu ID
    async listByUser(userId: number){
        return this.addressRepo.find({ where: { user: { id: userId } } });
    }

    // Atualizar endereço
    async updateAddress(userId: number, addressId: number, dto: UpdateAddressDto){
        const address = await this.addressRepo.findOne({
            where: {id: addressId, user: { id: userId } }
        });
        // Verifica se o endereço existe
        if(!address) throw new NotFoundException("Endereço não encontrado.");

        // Isso aqui copia o endereço anterior e em cima disso as mudanças são feitas
        Object.assign(address, dto);

        return this.addressRepo.save(address); // Salva o novo endereço
    }

    // Deleta o endereço
    async removeAddress(userId: number, addressId: number){
        const address = await this.addressRepo.findOne({
            where: { id: addressId, user: { id: userId } }
        });
        // Verifica se o endereço existe
        if(!address) throw new NotFoundException("Endereço não encontrado.");

        return this.addressRepo.remove(address); // Deleta o endereço
    }
}