import { Body, Controller, Delete, Get, Param, Post, Req } from "@nestjs/common";
import { CartService } from "./cart.service";
import { AddCartItemDto } from "./dto/add-cart-item.dto";

@Controller('cart')
export class CartController{
    constructor(private readonly cartService: CartService){}

    @Get()
    getCart(@Req() req){
        return this.cartService.getUserCart(req.user.userId);
    }

    @Post()
    addItem(@Req() req, @Body() dto: AddCartItemDto){
        return this.cartService.addItem(req.user.userId, dto);
    }

    @Delete(':productId')
    removeItem(@Req() req, @Param('productId') productId: number) {
        return this.cartService.removeItem(req.user.userId, productId);
    }

    @Delete()
    clearCart(@Req() req) {
        return this.cartService.clearCart(req.user.userId);
    }
}