import { IsNumber, IsString, Min, MinLength } from 'class-validator';

export class UpdatePasswordDto {
  @IsNumber()
  @Min(1)
  public userId: number;

  @IsString()
  @MinLength(8)
  public newPassword: string;
}