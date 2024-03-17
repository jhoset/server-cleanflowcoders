import { Optional } from "@nestjs/common";
import { IsDate, IsNumber, IsOptional, IsString, Min, MinLength } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RoleDto {

    @ApiProperty({
        type: Number,
        minimum: 1,
        description: 'The ID of the role.',
        required: true,
    })
    @IsNumber()
    @Min(1)
    public id: number;

    @ApiPropertyOptional({
        type: String,
        description: 'The name of the role. (Optional)',
    })
    @IsOptional()
    @IsString()
    @MinLength(1)
    public name?: string;

    @ApiPropertyOptional({
        type: Date,
        description: 'The date and time when the role was created. (Optional)',
    })
    @IsOptional()
    @IsDate()
    public createdAt?: Date;

    private constructor(id: number, name: string, createdAt: Date) {
        this.id = id;
        this.name = name;
        this.createdAt = createdAt;
    }

    public static mapFrom(obj: { [key: string]: any }): RoleDto {
        const { id, name, createdAt } = obj;
        return new RoleDto(id, name, createdAt);
    }
}