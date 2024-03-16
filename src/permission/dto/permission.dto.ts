import { IsDate, IsNumber, IsOptional, IsString } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PermissionDto {

    @ApiProperty({
        type: Number,
        description: 'The ID of the permission.',
        required: true,
    })
    @IsNumber()
    public id: number;

    @ApiPropertyOptional({
        type: String,
        description: 'The name of the permission. (Optional)',
    })
    @IsOptional()
    @IsString()
    public name?: string;

    @ApiPropertyOptional({
        type: String,
        description: 'The code of the permission. (Optional)',
    })
    @IsOptional()
    @IsString()
    public code?: string;

    @ApiPropertyOptional({
        type: Date,
        description: 'The date and time when the permission was created. (Optional)',
    })
    @IsOptional()
    @IsDate()
    public createdAt?: Date;

    public constructor(id: number, name: string, code: string, createdAt: Date) {
        this.id = id;
        this.name = name;
        this.code = code;
        this.createdAt = createdAt;
    }

    public static mapFrom(obj: { [key: string]: any }): PermissionDto {
        const { id, name, code, createdAt } = obj;
        return new PermissionDto(id, name, code, createdAt);
    }

}