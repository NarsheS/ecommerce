import { IsString, IsOptional } from 'class-validator';

// Restrições para atualizar endereço de usuário
export class UpdateAddressDto {
    @IsOptional()
    @IsString()
    street?: string;

    @IsOptional()
    @IsString()
    number?: string;

    @IsOptional()
    @IsString()
    city?: string;

    @IsOptional()
    @IsString()
    state?: string;

    @IsOptional()
    @IsString()
    zipcode?: string;
}
