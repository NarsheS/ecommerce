import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Products } from '../products/products.entity';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ unique: true })
  name: string;

  @OneToMany(() => Products, (product) => product.category)
  products: Products[];
}
