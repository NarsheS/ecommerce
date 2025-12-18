import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Cart } from "./cart.entity";
import { Repository } from "typeorm";
import { CartItem } from "./cart-item.entity";
import { Products } from "../products/products.entity";
import { AddCartItemDto } from "./dto/add-cart-item.dto";
import { User } from "../user/user.entity";

@Injectable()
export class CartService{
    constructor(
        @InjectRepository(Cart) private cartRepo: Repository<Cart>,
        @InjectRepository(CartItem) private itemRepo: Repository<CartItem>,
        @InjectRepository(Products) private productRepo: Repository<Products>,
        @InjectRepository(User) private userRepo: Repository<User>
    ){}

    // GET - Mostra o carrinho de compras do usuário
    async getUserCart(userId: number) {
        // Busca pelo carrinho de compras pelo id do usuário
        let cart = await this.cartRepo.findOne({
            where: { user: { id: userId } },
            relations: ['items', 'items.product']
        });

        // Se não tiver um carrinho
        if (!cart) {
            // Checa se o usuário existe
            const user = await this.userRepo.findOne({
                where: { id: userId }
            });
            if(!user) throw new NotFoundException("Usuário não encontrado.")

            // Cria e salva o carrinho
            cart = this.cartRepo.create({ user });
            await this.cartRepo.save(cart);
        }

        return cart;
    }

    // POST - Adiciona um item ao carrinho de compras
    async addItem(userId: number, dto: AddCartItemDto){
        const cart = await this.getUserCart(userId); // GET carrinho do usuário
        // Busca pelo produto
        const product = await this.productRepo.findOne({
            where: { id: dto.productId }
        });
        // Verifica se existe
        if(!product) throw new NotFoundException("Produto não encontrado!");
      
        const existingItem = await this.itemRepo.findOne({
            where: {
                cart: { id: cart.id },
                product: { id: dto.productId }
            }
        });
        // Checando se este produto já está no carrinho
        if (existingItem) {
            existingItem.quantity += dto.quantity;
            return this.itemRepo.save(existingItem);
        }

        // Salva o produto no carrinho
        const newItem = this.itemRepo.create({
            cart,
            product,
            quantity: dto.quantity,
        });

        await this.itemRepo.save(newItem);
        return this.getUserCart(userId);
    }

    // DELETE - Remove um produto do carrinho
    async removeItem(userId: number, productId: number){
        // Procura pelo carrinho e o item
        const cart = await this.getUserCart(userId);
        const item = cart.items.find(i => i.product.id === productId);

        // Verifica se o item está no carrinho
        if(!item) throw new NotFoundException("Item não encontrado no carrinho!");

        // Remove o item
        await this.itemRepo.remove(item);
        return this.getUserCart(userId);
    }

    // DELETE - Remove todos os produtos do carrinho
    async clearCart(userId: number){
        const cart = await this.getUserCart(userId);
        await this.itemRepo.remove(cart.items); // Remove TODOS os itens
        return this.getUserCart(userId);
    }
}