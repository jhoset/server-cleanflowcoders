import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateRoleDto } from './create-role.dto';
import { IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateRoleDto extends CreateRoleDto {

  @ApiPropertyOptional({
    type: String,
    description: 'A name property that is optional and must be a string with a minimum length of 1.',
  })
    @IsOptional()
    @IsString()
    @MinLength(1)
    public name: string;
 }
