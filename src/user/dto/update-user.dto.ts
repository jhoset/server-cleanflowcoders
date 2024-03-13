import { IsArray, IsEmail, IsOptional, IsString, MinLength } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends CreateUserDto {

    @IsOptional()
    @IsString()
    @MinLength(1)
    public firstName: string;

    @IsOptional()
    @IsString()
    @MinLength(1)
    public middleName?: string;
    
    @IsOptional()
    @IsString()
    @MinLength(1)
    public lastName: string;

    @IsOptional()
    public password: string;

    @IsOptional()
    @IsEmail()
    public email: string;

}
