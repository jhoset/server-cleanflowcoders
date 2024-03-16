import { IsArray, IsEmail, IsOptional, IsString, MinLength } from 'class-validator';
import { CreateUserDto } from './create-user.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto extends CreateUserDto {

    @ApiPropertyOptional({
        type: String,
        description: 'The first name of the user. (Optional)',
    })
    @IsOptional()
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

    @ApiPropertyOptional({
        type: String,
        description: 'The last name of the user. (Optional)',
    })
    @IsOptional()
    @IsString()
    @MinLength(1)
    public lastName: string;

    @ApiPropertyOptional({
        type: String,
        description: 'The password for the user account. (Optional)',
    })
    @IsOptional()
    public password: string;

    @ApiPropertyOptional({
        type: String,
        description: 'The email address of the user. (Optional)',
    })
    @IsOptional()
    @IsEmail()
    public email: string;

}
