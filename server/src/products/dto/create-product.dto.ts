import { IsString, IsNumber, IsOptional, IsInt, Min } from 'class-validator';
// Restrições na hora de criar produtos para evitar bugs ou exploits
export class CreateProductDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  inStock?: number;

  @IsNumber()
  @Min(0)
  price: number;

  @IsOptional()
  @IsInt()
  categoryId?: number;
}
