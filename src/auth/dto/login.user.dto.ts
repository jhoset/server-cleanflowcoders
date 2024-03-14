import { IsEmail, IsString, MaxLength, MinLength } from "class-validator";

export class LoginUserDto {

    @IsString()
    @IsEmail()
    public email: string;

    @IsString()
    @MinLength(8)
    @MaxLength(50)
    public password: string;
}