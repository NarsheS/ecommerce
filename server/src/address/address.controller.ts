import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Req, UsePipes, ValidationPipe } from "@nestjs/common";
import { AddressService } from "./address.service";
import { CreateAddressDto } from "./dto/create-address.dto";
import { UpdateAddressDto } from "./dto/update-address.dto";

@Controller('users')
export class AddressController {
    constructor(private readonly addressService: AddressService){}

    // CREATE - Cria e atribui um endereço ao usuário
    @Post('address')
    @UsePipes(new ValidationPipe({ whitelist: true }))
    add(@Req() req: any, @Body() dto: CreateAddressDto){
        const userId = req.user.id;
        return this.addressService.addAddress(userId, dto);
    }

    // GET - Lista todos os endereços do usuário
    @Get('address')
    @UsePipes(new ValidationPipe({ whitelist: true }))
    list(@Req() req: any){
        const userId = req.user.id;
        return this.addressService.listByUser(userId);
    }

    // PATCH - Atualiza um endereço do usuário
    @Patch('address/:addressId')
    @UsePipes(new ValidationPipe({ whitelist: true }))
    update(
        @Req() req: any, 
        @Param('addressId', ParseIntPipe) addressId: number, 
        @Body() dto: UpdateAddressDto
    ){
        const userId = req.user.id;
        return this.addressService.updateAddress(userId, addressId, dto);
    }

    // DELETE - Deleta um endereço do usuário
    @Delete('address/:addressId')
    @UsePipes(new ValidationPipe({ whitelist: true }))
    remove(
        @Req() req: any,
        @Param('addressId', ParseIntPipe) addressId: number
    ){
        const userId = req.user.id;
        return this.addressService.removeAddress(userId, addressId);
    }
}