import { IsString, IsEmail, MinLength, Matches } from "class-validator";
import { Transform } from "class-transformer";

export class Register {
    @IsString()
    @Transform(({ value }) => value.trim())
    username: string;

    @IsEmail()
    @Transform(({ value }) => value.trim().toLowerCase())
    email: string;

    @IsString()
    @MinLength(8)
    @Matches(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
    @Matches(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
    @Matches(/[0-9]/, { message: 'Password must contain at least one number' })
    @Matches(/[^A-Za-z0-9]/, { message: 'Password must contain at least one special character' })
    password: string;
}
