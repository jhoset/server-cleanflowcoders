import { Type } from "class-transformer";
import { IsArray, IsBoolean, IsEmail, IsOptional, IsString, MaxLength, MinLength, ValidateNested, minLength } from "class-validator";
import { RoleDto } from "src/role/dto";
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {

    @ApiProperty({
        required: true,
        type: String,
        description: 'The first name of the user.',
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
        required: true,
        type: String,
        description: 'The last name of the user.',
    })
    @IsString()
    @MinLength(1)
    public lastName: string;

    @ApiProperty({
        required: true,
        type: String,
        description: 'The email address of the user.',
    })
    @IsEmail()
    public email: string;

    @ApiProperty({
        required: true,
        type: String,
        description: 'The password for the user account. It must be between 8 and 50 characters long.',
    })
    @IsString()
    @MinLength(8)
    @MaxLength(50)
    public password: string;

    @ApiProperty({
        required: true,
        type: [RoleDto],
        description: 'Array of roles assigned to the user. (Could be empty)',
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => RoleDto)
    public roles: RoleDto[]

}
