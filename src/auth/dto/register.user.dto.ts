import { IsEmail, IsOptional, IsString, MaxLength, MinLength } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterUserDto {
    @ApiProperty({
        type: String,
        description: 'The first name of the user.',
        required: true,
    })
    @IsString()
    @MinLength(1)
    public firstName: string;

    @ApiPropertyOptional({
        type: String,
        description: 'The middle name of the user. (Optional)',
    })
    @IsOptional()
    @IsString()
    @MinLength(1)
    public middleName?: string;

    @ApiProperty({
        type: String,
        description: 'The last name of the user.',
        required: true,
    })
    @IsString()
    @MinLength(1)
    public lastName: string;

    @ApiProperty({
        type: String,
        description: 'The email address of the user.',
        required: true,
    })
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