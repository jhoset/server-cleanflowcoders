import { Controller, Post, Body, HttpStatus, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { LoginUserDto, RegisterUserDto } from './dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';

@ApiTags('Auth')
@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({
    summary: 'User Login',
  })
  @ApiOkResponse({
    description: 'User authenticated successfully.',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized. Invalid credentials.',
  })
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Post('register')
  register(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.register(registerUserDto);
  }
  @Post('/reset-password')
  @ApiOperation({
    summary: 'Reset Password Email',
  })
  @ApiOkResponse({ description: 'Password reset email sent successfully' })
  @HttpCode(HttpStatus.OK)
  async resetPassword(
    @Body() { email }: ForgotPasswordDto,
  ): Promise<{ message: string }> {
    return this.authService.resetPassword(email);
  }
}
