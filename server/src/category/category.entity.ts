import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Products } from '../products/products.entity';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn('increment')
  id: number;

  // O nome da categoria deve ser único
  @Column({ unique: true })
  name: string;

  // Vários produtos podem ter uma mesma categoria
  @OneToMany(() => Products, product => product.category)
  products: Products[];
}
