import { IsString, IsNumber, IsOptional, IsInt, Min } from 'class-validator';
// Restrições na hora de atualizar produtos para evitar bugs ou exploits
export class UpdateProductDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  inStock?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  price: number;

  @IsOptional()
  @IsInt()
  categoryId?: number;
}
