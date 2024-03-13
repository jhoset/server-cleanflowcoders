import { Type } from "class-transformer";
import { IsArray, IsBoolean, IsEmail, IsOptional, IsString, MinLength, ValidateNested, minLength } from "class-validator";
import { RoleDto } from "src/role/dto";

export class CreateUserDto {

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
    public password: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => RoleDto)
    public roles: RoleDto[]

}
