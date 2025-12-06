import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Req } from "@nestjs/common";
import { CartService } from "./cart.service";
import { AddCartItemDto } from "./dto/add-cart-item.dto";

@Controller('cart')
export class CartController{
    constructor(private readonly cartService: CartService){}

    // GET - Lista todos os itens do carrinho do usuário
    @Get()
    getCart(@Req() req){
        const userId = req.user.userId;
        return this.cartService.getUserCart(userId);
    }

    // POST - Adiciona um item ao carrinho do usuário
    @Post()
    addItem(@Req() req, @Body() dto: AddCartItemDto){
        const userId = req.user.userId;
        return this.cartService.addItem(userId, dto);
    }

    // DELETE - Remove um item do carrinho do usuário
    @Delete(':productId')
    removeItem(@Req() req, @Param('productId', ParseIntPipe) productId: number) {
        const userId = req.user.userId;
        return this.cartService.removeItem(userId, productId);
    }

    // DELETE - Limpa todo o carrinho do usuário
    @Delete()
    clearCart(@Req() req) {
        const userId = req.user.userId;
        return this.cartService.clearCart(userId);
    }
}