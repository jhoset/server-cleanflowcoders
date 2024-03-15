import { IsEmail, IsString, MaxLength, MinLength } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
    @ApiProperty({
        type: String,
        description: 'The email address of the user.',
        required: true,
    })
    @IsString()
    @IsEmail()
    public email: string;

    @ApiProperty({
        type: String,
        description: 'The password for the user account. It must be between 8 and 50 characters long.',
        required: true,
    })
    @IsString()
    @MinLength(8)
    @MaxLength(50)
    public password: string;
}