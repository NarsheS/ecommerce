import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Category } from '../category/category.entity';

@Entity('products')
export class Products {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ unique: true })
  name: string;

  @Column()
  description: string;

  @Column()
  inStock: number;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @ManyToOne(() => Category, (category) => category.products, { nullable: true, eager: true })
  category: Category;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
