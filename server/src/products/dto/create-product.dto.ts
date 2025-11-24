import { IsString, IsNumber, IsOptional, IsInt } from 'class-validator';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsInt()
  inStock?: number;

  @IsNumber()
  price: number;

  @IsOptional()
  @IsInt()
  categoryId?: number;
}
