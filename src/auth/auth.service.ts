import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginUserDto, RegisterUserDto } from './dto';
import { BcryptAdapter } from 'src/common/adapters/bcrypt.adapter';
import { JwtPayload } from './interfaces';
import { UserWithRolesDto } from 'src/user/dto';
import { EmailService } from '../common/services/email.service';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private _prisma: PrismaService,
    private _bcryptAdapter: BcryptAdapter,
    private _jwtService: JwtService,
    private _configService: ConfigService,
    private _emailService: EmailService,
  ) {}

  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;
    const existingUser = await this._prisma.user.findFirst({
      where: { email, isDeleted: false },
      include: {
        roles: {
          select: { role: true },
        },
      },
    });
    if (!existingUser)
      throw new UnauthorizedException('Email or password is incorrect');
    if (!this._bcryptAdapter.compare(password, existingUser.password))
      throw new UnauthorizedException('Email or password is incorrect');
    const userWithRoleDto = UserWithRolesDto.mapFrom(existingUser);
    return {
      user: userWithRoleDto,
      token: this.getJwtToken({ id: existingUser.id }),
    };
  }

  register(registerUserDto: RegisterUserDto) {
    return `This action register`;
  }

  async forgotPassword(email: string) {
    const clientUrl = this._configService.get('CLIENT_URL');
    const token = '';
    const link = `${clientUrl}/restablecer-contraseña?token=${token}`;
    const user: User = await this._prisma.user.findFirst({
      where: { email, isDeleted: false },
    });
    if (user) {
      await this._emailService.sendForgotPassword(email, user.firstName, link);
    }
    return {
      message:
        'If the provided email is associated with an account, ' +
        'an email has been sent with instructions to reset your password. ' +
        'Please check your inbox.',
    };
  }

  private getJwtToken(payload: JwtPayload) {
    const token = this._jwtService.sign(payload);
    return token;
  }
}
