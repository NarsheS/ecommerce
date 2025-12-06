import { IsInt } from 'class-validator';
// Restrições: cart-item deve ter um id e uma quantidade, estes serão sempre números
export class AddCartItemDto {
  @IsInt()
  productId: number;

  @IsInt()
  quantity: number;
}