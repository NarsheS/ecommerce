import { Address } from 'src/address/address.entity';
import { Cart } from 'src/cart/cart.entity';
import { Order } from 'src/order/order.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

// Deixando explícito que só existem 2 "Roles", usuário ou administrador
export enum Role {
  USER = 'user',
  ADMIN = 'admin',
}

@Entity('users')
export class User {
  // ID
  @PrimaryGeneratedColumn('increment')
  id: number;

  // Nome de usuário
  @Column({ unique: true })
  username: string;

  // Email
  @Column({ unique: true })
  email: string;

  // Senha
  @Column()
  password: string; // bcrypt hash

  // User ou Admin
  @Column({ type: 'text', default: Role.USER })
  role: Role;

  // Email verificado
  @Column({ type: 'boolean', default: false })
  isVerified: boolean;

  @Column({ type: 'text', nullable: true, unique: true })
  verificationTokenHash?: string | null;

  @Column({ type: 'bigint', nullable: true })
  verificationTokenExpiresAt?: number | null;

  // Reset password
  @Column({ type: 'text', nullable: true, unique: true })
  resetTokenHash?: string | null;

  @Column({ type: 'bigint', nullable: true })
  resetTokenExpiresAt?: number | null;

  // Refresh token
  @Column({ type: 'text', nullable: true })
  currentHashedRefreshToken: string | null;

  @Column({ type: 'bigint', nullable: true })
  currentHashedRefreshTokenExpiresAt: number | null;

  // Date
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Endereço
  @OneToMany(() => Address, (address) => address.user)
  addresses: Address[];

  // Carrinho
  @OneToMany(() => Cart, (cart) => cart.user)
  carts: Cart[];

  // Orders
  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];
}
