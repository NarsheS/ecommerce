import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Cart } from "./cart.entity";
import { Products } from "../products/products.entity";

@Entity('cart_items')
export class CartItem{
    @PrimaryGeneratedColumn('increment')
    id: number;

    // Se o carrinho for deletado, os itens tambem são
    @ManyToOne(() => Cart, (cart) => cart.items, { onDelete: 'CASCADE' })
    cart: Cart;

    // Cada carrinho item é um produto
    @ManyToOne(() => Products, { eager: true })
    product: Products;

    // Quantidade do produto
    @Column()
    quantity: number;
}