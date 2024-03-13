import { IsOptional, IsString, MinLength } from 'class-validator';

export class UpdatePermissionDto {

    @IsOptional()
    @MinLength(1)
    @IsString()
    public code: string;
}
