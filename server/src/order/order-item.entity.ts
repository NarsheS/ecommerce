import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Order } from "./order.entity";
import { Products } from "src/products/products.entity";

@Entity('order_items')
export class OrderItem{
    @PrimaryGeneratedColumn('increment')
    id: number;

    @ManyToOne(() => Order, order => order.items)
    order: Order;

    @ManyToOne(() => Products)
    product: Products;

    @Column()
    quantity: number;

    // preço do produto
    @Column('decimal', { precision: 10, scale: 2 })
    price: number;

    // valor computado
    @Column('decimal', { precision: 10, scale: 2 })
    subtotal: number;
}