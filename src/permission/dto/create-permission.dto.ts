import { IsString, MinLength } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class CreatePermissionDto {
    @ApiProperty({
        type: String,
        description: 'The name of the permission. It must be a string with a minimum length of 1.',
        required: true,
    })
    @MinLength(1)
    @IsString()
    public name: string;

    @ApiProperty({
        type: String,
        description: 'The code of the permission. It must be a string with a minimum length of 4.',
        required: true,
    })
    @MinLength(4)
    @IsString()
    public code: string;

}
