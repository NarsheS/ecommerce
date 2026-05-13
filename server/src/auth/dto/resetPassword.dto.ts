// src/auth/dto/reset-password.dto.ts

import {
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class ResetPasswordDto {
  @IsString()
  token: string;

  @IsString()
  @MinLength(8, { message: 'A senha deve conter 8 caracteres' })
  @Matches(/[A-Z]/, { message: 'A senha deve conter letra maiúscula' })
  @Matches(/[a-z]/, { message: 'A senha deve conter letra minúscula' })
  @Matches(/[0-9]/, { message: 'A senha deve conter número' })
  @Matches(/[^A-Za-z0-9]/, { message: 'A senha deve conter caractere especial' })
  password: string;
}