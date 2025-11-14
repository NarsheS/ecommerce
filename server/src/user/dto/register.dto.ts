import { IsString, IsEmail, MinLength } from "class-validator";

export class Register {
        @IsString()
        username: string;   

        @IsEmail()
        email: string;
    
        @MinLength(8)
        password: string;
}