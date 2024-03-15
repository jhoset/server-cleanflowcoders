import { IsNumber, IsString, Min, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePasswordDto {
  @ApiProperty({
    type: Number,
    minimum: 1,
    description: 'The ID of the user whose password will be updated.',
  })
  @IsNumber()
  @Min(1)
  public userId: number;

  @ApiProperty({
    type: String,
    minLength: 8,
    description: 'The new password for the user account. It must be at least 8 characters long.',
  })
  @IsString()
  @MinLength(8)
  public newPassword: string;
}