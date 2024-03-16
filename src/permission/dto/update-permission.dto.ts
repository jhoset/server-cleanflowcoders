import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePermissionDto {
    @ApiProperty({
        type: String,
        description: 'The name of the permission.',
    })
    @MinLength(1)
    @IsString()
    public name: string;
}
