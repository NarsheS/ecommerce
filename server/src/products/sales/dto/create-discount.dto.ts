import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { DiscountType } from '../discount-rules.entity';

// Restrições para a criação de discontos
export class CreateDiscountDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsEnum(DiscountType)
  type: DiscountType;

  @IsNumber()
  @Min(1)
  discountPercentage: number;

  @IsOptional()
  @IsNumber()
  categoryId?: number;

  @IsOptional()
  @IsNumber()
  productId?: number;

  @IsOptional()
  @IsNumber()
  priceMin?: number;

  @IsOptional()
  @IsDateString()
  @IsString()
  startsAt?: string;

  @IsOptional()
  @IsDateString()
  @IsString()
  endsAt?: string;

  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
