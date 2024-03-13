import { Type } from "class-transformer";
import { IsArray, IsString, MinLength, ValidateNested } from "class-validator";
import { PermissionDto } from "src/permission/dto";

export class CreateRoleDto {
    @MinLength(1)
    @IsString()
    public name: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => PermissionDto)
    public permissions: PermissionDto[]
}
