import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Order } from "./order.entity";
import { Products } from "../products/products.entity";

@Entity('order_items')
export class OrderItem {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @ManyToOne(() => Order, order => order.items)
    order: Order;

    @ManyToOne(() => Products)
    product: Products;

    @Column()
    quantity: number;

    // Preço original do produto (antes do desconto)
    @Column('decimal', { precision: 10, scale: 2 })
    price: number;

    // Preço final com desconto aplicado
    @Column('decimal', { precision: 10, scale: 2 })
    finalPrice: number;

    // Desconto unitário aplicado (price - finalPrice)
    @Column('decimal', { precision: 10, scale: 2 })
    discountApplied: number;

    // subtotal = finalPrice * quantity
    @Column('decimal', { precision: 10, scale: 2 })
    subtotal: number;
}
