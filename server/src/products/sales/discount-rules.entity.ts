import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

export enum DiscountType {
  CATEGORY = 'category',
  PRICE_MIN = 'price_min',
  PRODUCT = 'product',
  GLOBAL = 'global',
}

@Entity()
export class DiscountRule {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'enum', enum: DiscountType })
  type: DiscountType;

  @Column({ nullable: true })
  categoryId?: number;

  @Column({ nullable: true })
  productId?: number;

  @Column({ type: 'numeric' })
  discountPercentage: number;

  @Column({ nullable: true, type: 'timestamp' })
  startsAt?: Date;

  @Column({ nullable: true, type: 'timestamp' })
  endsAt?: Date;

  @Column({ nullable: true, type: 'numeric' })
  priceMin?: number;

  @Column({ default: true })
  active: boolean;
}
