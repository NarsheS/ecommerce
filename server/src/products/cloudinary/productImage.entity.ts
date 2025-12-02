import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Products } from '../products.entity';

@Entity('product_images')
export class ProductImage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  url: string;

  @ManyToOne(() => Products, product => product.images, {
    onDelete: 'CASCADE',
  })
  product: Products;
}
