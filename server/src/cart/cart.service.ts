import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Cart } from "./cart.entity";
import { Repository } from "typeorm";
import { CartItem } from "./cart-item.entity";
import { Products } from "src/products/products.entity";
import { AddCartItemDto } from "./dto/add-cart-item.dto";

@Injectable()
export class CartService{
    constructor(
        @InjectRepository(Cart) private cartRepo: Repository<Cart>,
        @InjectRepository(CartItem) private itemRepo: Repository<CartItem>,
        @InjectRepository(Products) private productRepo: Repository<Products>,
    ){}

    async getUserCart(userId: number){
        let cart = await this.cartRepo.findOne({
            where: { user: { id: userId} },
            relations: ['items', 'items.product']
        });

        if(!cart) {
            cart = this.cartRepo.create({ user: { id: userId }, items: [] });
            await this.cartRepo.save(cart);
        }

        return cart;
    }

    async addItem(userId: number, dto: AddCartItemDto){
        const cart = await this.getUserCart(userId);
        const product = await this.productRepo.findOne({
            where: { id: dto.productId }
        });

        if(!product) throw new NotFoundException("Produto não encontrado!");

        // checando se já está no carrinho
        const existingItem = cart.items?.find(i => i.product.id === dto.productId);
        if(existingItem){
            existingItem.quantity += dto.quantity;
            return this.itemRepo.save(existingItem);
        }

        const newItem = this.itemRepo.create({
            cart,
            product,
            quantity: dto.quantity,
        });

        await this.itemRepo.save(newItem);
        return this.getUserCart(userId);
    }

    async removeItem(userId: number, productId: number){
        const cart = await this.getUserCart(userId);
        const item = cart.items.find(i => i.product.id === productId);

        if(!item) throw new NotFoundException("Item não encontrado no carrinho!");

        await this.itemRepo.remove(item);
        return this.getUserCart(userId);
    }

    async clearCart(userId: number){
        const cart = await this.getUserCart(userId);
        await this.itemRepo.remove(cart.items);
        return this.getUserCart(userId);
    }
}