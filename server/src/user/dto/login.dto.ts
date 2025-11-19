import { IsString, MinLength } from "class-validator";
import { Transform } from "class-transformer";

export class LoginDto {
    @IsString()
    @Transform(({ value }) => value.trim().toLowerCase())
    identifier: string; // username or email

    @IsString()
    @MinLength(1)
    password: string;
}
