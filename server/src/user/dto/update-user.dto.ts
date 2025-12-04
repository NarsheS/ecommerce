import { IsString, IsEmail, IsOptional, MinLength, Matches } from "class-validator";
import { Transform } from "class-transformer";

// Faz algumas exigências para mudar alguns campos do usuário e deixa explícito que são opcionais
export class UpdateUserDto {
    @IsOptional()
    @IsString()
    @Transform(({ value }) => value.trim()) // Remove espaços em branco
    username?: string;

    @IsOptional()
    @IsEmail()
    @Transform(({ value }) => value.trim().toLowerCase()) // Coloca tudo em minúsculo (evitar a fadiga)
    email?: string;

    @IsOptional()
    @IsString()
    @MinLength(8)
    @Matches(/[A-Z]/, { message: 'A Senha deve conter pelo menos uma letra maiúscula' })
    @Matches(/[a-z]/, { message: 'A Senha deve conter pelo menos uma letra minúscula' })
    @Matches(/[0-9]/, { message: 'A Senha deve conter pelo menos um número' })
    @Matches(/[^A-Za-z0-9]/, { message: 'A Senha deve conter pelo menos um caractere especial' })
    password?: string;
}
