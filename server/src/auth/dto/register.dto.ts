import { IsString, IsEmail, MinLength, Matches } from "class-validator";
import { Transform } from "class-transformer";
// Restrições para cadastro de usuário
export class Register {
    @IsString()
    @Transform(({ value }) => value.trim()) // Caso o username tenha espaços
    username: string;

    @IsEmail()
    @Transform(({ value }) => value.trim().toLowerCase()) // Caso o email tenha espaços ou letra maiúscula
    email: string;

    @IsString()
    @MinLength(8, { message: 'A senha deve conter 8 caracteres' })
    @Matches(/[A-Z]/, { message: 'A senha deve conter letra maiúscula' })
    @Matches(/[a-z]/, { message: 'A senha deve conter letra minúscula' })
    @Matches(/[0-9]/, { message: 'A senha deve conter número' })
    @Matches(/[^A-Za-z0-9]/, { message: 'A senha deve conter caractere especial' })
    password: string;
}
