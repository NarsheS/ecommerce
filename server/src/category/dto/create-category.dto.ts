import { IsString } from 'class-validator';

// Restrição: Nome da categoria deve ser uma string
export class CreateCategoryDto {
  @IsString()
  name: string;
}
