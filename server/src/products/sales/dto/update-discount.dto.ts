import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { DiscountType } from '../discount-rules.entity';

// Restrições para a atualização de discontos
export class UpdateDiscountDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEnum(DiscountType)
  type?: DiscountType;

  @IsOptional()
  @IsNumber()
  discountPercentage?: number;

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
