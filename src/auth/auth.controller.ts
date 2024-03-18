import { Controller, Post, Body, HttpStatus, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
  LoginUserDto,
  RegisterUserDto,
  ForgotPasswordDto, ResetPasswordDto,
} from './dto';

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

  @Post('resetPassword')
  resetPasswordV2(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPasswordV2(resetPasswordDto)
  }

  @Post('forgotPassword')
  forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto)
  }

  @Post('register')
  register(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.register(registerUserDto);
  }
}
