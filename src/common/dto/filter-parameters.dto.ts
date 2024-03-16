import { IsOptional, IsString } from 'class-validator';

export class FilterParametersDto {
  @IsOptional()
  @IsString()
  search?: string;
}
