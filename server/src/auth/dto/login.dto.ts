import { IsString, Matches, MinLength } from "class-validator";
import { Transform } from "class-transformer";
// Restrições para fazer login: username ou email + senha
export class LoginDto {
    @IsString()
    @Transform(({ value }) => value.trim().toLowerCase()) // Caso o identificador tenha espaços
    identifier: string; // Username ou Email

    @IsString()
    @MinLength(8)
    @Matches(/[A-Z]/)
    @Matches(/[a-z]/)
    @Matches(/[0-9]/)
    @Matches(/[^A-Za-z0-9]/)
    password: string;
}
