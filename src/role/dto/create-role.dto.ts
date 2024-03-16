import { Type } from "class-transformer";
import { IsArray, IsString, MinLength, ValidateNested } from "class-validator";
import { PermissionDto } from "src/permission/dto";
import { ApiProperty } from '@nestjs/swagger';

export class CreateRoleDto {
    @ApiProperty({
        type: String,
        description: 'The name of the role.',
        required: true,
    })
    @MinLength(1)
    @IsString()
    public name: string;

    @ApiProperty({
        type: [PermissionDto],
        description: 'Array of permissions assigned to the role. (Could be empty)',
        required: true,
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => PermissionDto)
    public permissions: PermissionDto[]
}
