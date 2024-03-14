import { IsEmail, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class RegisterUserDto {

    @IsString()
    @MinLength(1)
    public firstName: string;

    @IsOptional()
    @IsString()
    @MinLength(1)
    public middleName?: string;

    @IsString()
    @MinLength(1)
    public lastName: string;

    @IsEmail()
    public email: string;

    @IsString()
    @MinLength(8)
    @MaxLength(50)
    public password: string;

}