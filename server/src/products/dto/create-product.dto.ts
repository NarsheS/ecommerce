export class CreateProductDto {
  name: string;
  description: string;
  inStock?: number;
  price: number;
  categoryId?: number;
}
