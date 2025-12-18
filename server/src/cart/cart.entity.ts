import { User } from "../user/user.entity";
import { Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { CartItem } from "./cart-item.entity";

@Entity('carts')
export class Cart{
    @PrimaryGeneratedColumn('increment')
    id: number;

    // Se o usuário for deletado, o carrinho também é deletado
    @ManyToOne(() => User, user => user.carts, { onDelete: 'CASCADE' })
    user: User;

    // Um carrinho pode ter vários itens
    @OneToMany(() => CartItem, item => item.cart, { cascade: ['insert'] })
    items: CartItem[];
}