import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Products } from '../products.entity';
// Uma entity só para imagens e vídeos
@Entity('product_images')
export class ProductImage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  url: string;

  @Column()
  publicId: string;

  // Um produto pode ter varias imagens
  @ManyToOne(() => Products, product => product.images, {
    onDelete: 'CASCADE',
  })
  product: Products;
}
