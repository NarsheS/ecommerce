import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { AddressService } from "./address.service";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";
import { CreateAddressDto } from "./dto/create-address.dto";
import { UpdateAddressDto } from "./dto/update-address.dto";

@Controller('users')
export class AddressController {
    constructor(private readonly addressService: AddressService){}

    @UseGuards(JwtAuthGuard)
    @Post(':userId/address')
    add(@Param('userId') userId: number, @Body() dto: CreateAddressDto){
        return this.addressService.addAddress(userId, dto);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':userId/address')
    list(@Param('userId') userId: number){
        return this.addressService.listByUser(userId);
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':userId/address/:addressId')
    update(
        @Param('userId') userId: number, 
        @Param('addressId') addressId: number, 
        @Body() dto: UpdateAddressDto
    ){
        return this.addressService.updateAddress(userId, addressId, dto);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':userId/address/:addressId')
    remove(
        @Param('userId') userId: number,
        @Param('addressId') addressId: number
    ){
        return this.addressService.removeAddress(userId, addressId);
    }
}