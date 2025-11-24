import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { AddressService } from "./address.service";
import { CreateAddressDto } from "./dto/create-address.dto";
import { UpdateAddressDto } from "./dto/update-address.dto";

@Controller('users')
export class AddressController {
    constructor(private readonly addressService: AddressService){}

    @Post(':userId/address')
    add(@Param('userId') userId: number, @Body() dto: CreateAddressDto){
        return this.addressService.addAddress(userId, dto);
    }

    @Get(':userId/address')
    list(@Param('userId') userId: number){
        return this.addressService.listByUser(userId);
    }

    @Patch(':userId/address/:addressId')
    update(
        @Param('userId') userId: number, 
        @Param('addressId') addressId: number, 
        @Body() dto: UpdateAddressDto
    ){
        return this.addressService.updateAddress(userId, addressId, dto);
    }

    @Delete(':userId/address/:addressId')
    remove(
        @Param('userId') userId: number,
        @Param('addressId') addressId: number
    ){
        return this.addressService.removeAddress(userId, addressId);
    }
}