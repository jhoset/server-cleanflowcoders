import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ValidateResetPasswordTokenDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @IsNotEmpty()
  @IsString()
  token: string;
}
