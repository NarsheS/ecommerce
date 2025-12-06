import { User } from "src/user/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { OrderItem } from "./order-item.entity";

export enum OrderStatus{
    PENDING = 'pending',
    PAID = 'paid',
    SHIPPED = 'shipped',
    COMPLETED = 'completed',
    CANCELLED = 'cancelled',
}

@Entity('orders')
export class Order{
    @PrimaryGeneratedColumn('increment')
    id: number;

    @ManyToOne(() => User, user => user.orders)
    user: User;

    @OneToMany(() => OrderItem, item => item.order, { cascade: ['insert'] })
    items: OrderItem[];

    @Column('decimal', { precision: 10, scale: 2 })
    total: number;

    @Column({
        type: 'text',
        enum: OrderStatus,
        default: OrderStatus.PENDING
    })
    status: OrderStatus;

    @Column({ nullable: true })
    stripeSessionId?: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}