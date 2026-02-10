import { Column, CreateDateColumn, Entity, Index, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Category } from '../category/category.entity';
import { ProductImage } from './cloudinary/productImage.entity';

@Entity('products')
export class Products {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ unique: true })
  @Index()
  name: string;

  @Column()
  @Index()
  description: string;

  @Column({ default: 0 }) // Se não for dado um valor, o mesmo será 0.
  inStock: number;

  @Column('decimal', { precision: 10, scale: 2 }) // Faz com que fique em formato de dinheiro
  price: number;

  // Vários produtos podem ter a mesma categoria
  @ManyToOne(() => Category, category => category.products, { nullable: true })
  category: Category;

  // Um produto pode ter várias imagens
  @OneToMany(() => ProductImage, image => image.product, { cascade: true })
  images: ProductImage[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
