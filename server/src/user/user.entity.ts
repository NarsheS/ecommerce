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

export enum Role {
  USER = 'user',
  ADMIN = 'admin',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string; // bcrypt hash

  @Column({ type: 'text', default: Role.USER })
  role: Role;

  @Column({ type: 'boolean', default: false })
  isVerified: boolean;

  // -------------------------------------------------
  // EMAIL VERIFICATION
  // -------------------------------------------------
  @Column({ type: 'text', nullable: true, unique: true })
  verificationTokenHash?: string | null;

  @Column({ type: 'bigint', nullable: true })
  verificationTokenExpiresAt?: number | null;

  // -------------------------------------------------
  // PASSWORD RESET
  // -------------------------------------------------
  @Column({ type: 'text', nullable: true, unique: true })
  resetTokenHash?: string | null;

  @Column({ type: 'bigint', nullable: true })
  resetTokenExpiresAt?: number | null;

  // -------------------------------------------------
  // REFRESH TOKEN STORAGE
  // -------------------------------------------------
  @Column({ type: 'text', nullable: true })
  currentHashedRefreshToken: string | null;

  @Column({ type: 'bigint', nullable: true })
  currentHashedRefreshTokenExpiresAt: number | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Address, (address) => address.user, { cascade: true })
  addresses: Address[];

  @OneToMany(() => Cart, (cart) => cart.user)
  carts: Cart[];

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];
}
