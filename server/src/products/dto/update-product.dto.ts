import { IsString, IsNumber, IsOptional, IsInt } from 'class-validator';

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsInt()
  inStock?: number;

  @IsOptional()
  @IsNumber()
  price: number;

  @IsOptional()
  @IsInt()
  categoryId?: number;
}
