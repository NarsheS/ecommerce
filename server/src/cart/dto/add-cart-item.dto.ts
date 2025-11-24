import { IsInt } from 'class-validator';

export class AddCartItemDto {
  @IsInt()
  productId: number;

  @IsInt()
  quantity: number;
}