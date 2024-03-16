import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { LoginUserDto, RegisterUserDto } from './dto';

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
}
