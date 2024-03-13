import { PartialType } from '@nestjs/swagger';
import { CreateRoleDto } from './create-role.dto';
import { IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateRoleDto extends CreateRoleDto {

    @IsOptional()
    @IsString()
    @MinLength(1)
    public name: string;

 }
