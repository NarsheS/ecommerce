import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Category } from '../category/category.entity';
import { ProductImage } from './cloudinary/productImage.entity';

@Entity('products')
export class Products {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ unique: true })
  name: string;

  @Column()
  description: string;

  @Column({ default: 0 })
  inStock: number;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @ManyToOne(() => Category, category => category.products, { nullable: true })
  category: Category;

  @OneToMany(() => ProductImage, image => image.product, { cascade: true })
  images: ProductImage[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
