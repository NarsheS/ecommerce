import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Address } from "./address.entity";
import { User } from "src/user/user.entity";
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

    async addAddress(userId: number, dto: CreateAddressDto){
        const user = await this.userRepo.findOne({ where: { id: userId } });
        if(!user) throw new NotFoundException("Usuário não encontrado.");

        const address = this.addressRepo.create({ ...dto, user });
        return this.addressRepo.save(address);
    }

    async listByUser(userId: number){
        return this.addressRepo.find({ where: { user: { id: userId } } });
    }

    async updateAddress(userId: number, addressId: number, dto: UpdateAddressDto){
        const address = await this.addressRepo.findOne({
            where: {id: addressId, user: { id: userId } }
        });

        if(!address) throw new NotFoundException("Endereço não encontrado.");

        Object.assign(address, dto);

        return this.addressRepo.save(address);
    }

    async removeAddress(userId: number, addressId: number){
        const address = await this.addressRepo.findOne({
            where: { id: addressId, user: { id: userId } }
        });

        if(!address) throw new NotFoundException("Endereço não encontrado.");

        return this.addressRepo.remove(address);
    }
}