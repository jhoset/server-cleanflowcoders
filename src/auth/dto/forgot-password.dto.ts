import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ForgotPasswordDto{

  @ApiProperty({
    type: String,
    description: 'The Email of the User',
  })
  @IsNotEmpty()
  @IsEmail()
  email:string
}