import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Cart } from "./cart.entity";
import { Products } from "src/products/products.entity";

@Entity('cart_items')
export class CartItem{
    @PrimaryGeneratedColumn('increment')
    id: number;

    @ManyToOne(() => Cart, (cart) => cart.items, { onDelete: 'CASCADE' })
    cart: Cart;

    @ManyToOne(() => Products, { eager: true })
    product: Products;

    @Column()
    quantity: number;
}