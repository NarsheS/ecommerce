import { User } from "../user/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { OrderItem } from "./order-item.entity";
import { Address } from "../address/address.entity";

export enum OrderStatus{
    PENDING = 'pending',
    RESERVED = 'reserved',
    PAID = 'paid',
    SHIPPED = 'shipped',
    COMPLETED = 'completed',
    CANCELLED = 'cancelled',
}

@Entity('orders')
export class Order{
    @PrimaryGeneratedColumn('increment')
    id: number;

    @ManyToOne(() => User, user => user.orders, { nullable: false, onDelete: 'CASCADE' })
    user: User;

    @ManyToOne(() => Address, { nullable: true })
    @JoinColumn({ name: "addressId" })
    address: Address;

    @OneToMany(() => OrderItem, item => item.order, { cascade: ['insert'] })
    items: OrderItem[];

    @Column('decimal', { precision: 10, scale: 2 })
    total: number;

    @Column('decimal', { precision: 10, scale: 2, default: 0 })
    discountTotal: number;

    @Column({
        type: 'enum',
        enum: OrderStatus,
        default: OrderStatus.PENDING
    })
    status: OrderStatus;

    @Column({ nullable: true })
    stripeSessionId?: string;

    @Column({ type: 'timestamp', nullable: true })
    expiresAt?: Date;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}