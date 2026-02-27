import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Cart } from "./cart.entity";
import { Repository } from "typeorm";
import { CartItem } from "./cart-item.entity";
import { Products } from "../products/products.entity";
import { AddCartItemDto } from "./dto/add-cart-item.dto";
import { User } from "../user/user.entity";
import { PricingService } from "../products/pricing/pricing.service";

@Injectable()
export class CartService{
    constructor(
        @InjectRepository(Cart) private cartRepo: Repository<Cart>,
        @InjectRepository(CartItem) private itemRepo: Repository<CartItem>,
        @InjectRepository(Products) private productRepo: Repository<Products>,
        @InjectRepository(User) private userRepo: Repository<User>,
        private readonly pricingService: PricingService
    ){}

    // GET - Mostra o carrinho de compras do usuário
    async getUserCart(userId: number) {
        let cart = await this.cartRepo.findOne({
            where: { user: { id: userId } },
            relations: [
                'items',
                'items.product',
                'items.product.category'
                ],
        });

        if (!cart) {
            const user = await this.userRepo.findOne({ where: { id: userId } });
            if (!user) throw new NotFoundException("Usuário não encontrado.");

            cart = this.cartRepo.create({ user });
            await this.cartRepo.save(cart);
        }

        let total = 0;

        for (const item of cart.items) {
            const pricing = await this.pricingService.calculate(item.product);

            (item as any).pricing = pricing;
            (item as any).subtotal = Number((pricing.finalPrice * item.quantity).toFixed(2));

            total += (item as any).subtotal;
        }

        (cart as any).total = Number(total.toFixed(2));

        return cart;
    }


    // POST - Adiciona um item ao carrinho de compras
    async addItem(userId: number, dto: AddCartItemDto) {
        const cart = await this.getUserCart(userId);

        const product = await this.productRepo.findOne({
            where: { id: dto.productId },
            relations: ['category'], // importante para regras por categoria
        });

        if (!product) throw new NotFoundException("Produto não encontrado!");

        const existingItem = await this.itemRepo.findOne({
            where: {
            cart: { id: cart.id },
            product: { id: dto.productId },
            },
        });

        if (existingItem) {
            existingItem.quantity += dto.quantity;
            await this.itemRepo.save(existingItem);
            return this.getUserCart(userId);
        }

        const newItem = this.itemRepo.create({
            cart,
            product,
            quantity: dto.quantity,
        });

        await this.itemRepo.save(newItem);
        return this.getUserCart(userId);
    }


    // DELETE - Remove um produto do carrinho
    async removeItem(userId: number, productId: number) {
        const cart = await this.getUserCart(userId);
        const item = cart.items.find(i => i.product.id === productId);

        if (!item) throw new NotFoundException("Item não encontrado no carrinho!");

        await this.itemRepo.remove(item);
        return this.getUserCart(userId);
    }


    // DELETE - Remove todos os produtos do carrinho
    async clearCart(userId: number){
        const cart = await this.getUserCart(userId);
        await this.itemRepo.remove(cart.items);
        return this.getUserCart(userId);
    }
}