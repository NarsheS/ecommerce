import { User } from "src/user/user.entity";
import { Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { CartItem } from "./cart-item.entity";

@Entity('carts')
export class Cart{
    @PrimaryGeneratedColumn('increment')
    id: number;

    @ManyToOne(() => User, user => user.carts, { onDelete: 'CASCADE' })
    user: User;

    @OneToMany(() => CartItem, item => item.cart, { cascade: true })
    items: CartItem[];
}