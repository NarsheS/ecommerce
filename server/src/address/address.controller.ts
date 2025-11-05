import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { AddressService } from "./address.service";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";
import { CreateAddressDto } from "./dto/create-address.dto";

@Controller('users')
export class AddressController {
    constructor(private readonly addressService: AddressService){}

    @UseGuards(JwtAuthGuard)
    @Post(':id/address')
    add(@Param('id') id: number, @Body() dto: CreateAddressDto){
        return this.addressService.addAddress(id, dto);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id/address')
    list(@Param('id') id: number){
        return this.addressService.listByUser(id);
    }
}