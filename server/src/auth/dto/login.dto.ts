import { IsString, Matches, MinLength } from "class-validator";
import { Transform } from "class-transformer";
// Restrições para fazer login: username ou email + senha
export class LoginDto {
    @IsString()
    @Transform(({ value }) => value.trim().toLowerCase()) // Caso o identificador tenha espaços
    identifier: string; // Username ou Email

    @IsString()
    @MinLength(8)
    @Matches(/[A-Z]/, { message: 'A senha deve conter pelo menos uma letra maiúscula' })
    @Matches(/[a-z]/, { message: 'A senha deve conter pelo menos uma letra minúscula' })
    @Matches(/[0-9]/, { message: 'A senha deve conter pelo menos um número' })
    @Matches(/[^A-Za-z0-9]/, { message: 'A senha deve conter pelo menos um caractere especial' })
    password: string;
}
