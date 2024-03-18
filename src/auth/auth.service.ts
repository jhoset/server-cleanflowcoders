import {
  BadRequestException,
  Injectable, InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { ForgotPasswordDto, LoginUserDto, RegisterUserDto, ResetPasswordDto } from './dto';
import { BcryptAdapter } from 'src/common/adapters/bcrypt.adapter';
import { JwtPayload } from './interfaces';
import { UserWithRolesDto } from 'src/user/dto';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';
import { randomBytes } from 'crypto';
import { MailerAdapter } from '../common/adapters/mailer.adapter';
import { generateResetPasswordMailBody } from '../helpers/constants';

@Injectable()
export class AuthService {
  constructor(
    private _prisma: PrismaService,
    private _bcryptAdapter: BcryptAdapter,
    private _jwtService: JwtService,
    private _configService: ConfigService,
    private _mailerAdapter: MailerAdapter,
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


  private getJwtToken(payload: JwtPayload) {
    const token = this._jwtService.sign(payload);
    return token;
  }

  async  forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const { email } = forgotPasswordDto;
    const existingUser = await this._prisma.user.findFirst({
      where: { email, isDeleted: false },
      select: {
        id: true
      }
    });
    if (!existingUser)
      throw new BadRequestException(`Email provided does not exits in our database`);

    const token = this._jwtService.sign({id: existingUser.id, authorizedToResetPassword: true})
    const resp = await this._mailerAdapter.sendMail({
      to: email,
      html: generateResetPasswordMailBody(this._configService.get('CLIENT_URL'), '/resetPassword', token),
      subject: 'Reset Password',
    })
    if ( !resp ) {
      throw new InternalServerErrorException('An occurred trying to sent email, please try again later');
    }
    return `Email had been sent successfully`;
  }

  async resetPasswordV2(resetPasswordDto: ResetPasswordDto) {
    const {userId, newPassword, tokenToReset} = resetPasswordDto;
    const payload = await this._jwtService.verifyAsync(tokenToReset);
    if (!payload) {
      throw  new UnauthorizedException(`Invalid token to reset password`);
    }
    const { authorizedToResetPassword } = this._jwtService.decode(tokenToReset);
    if (!authorizedToResetPassword)
      throw  new UnauthorizedException(`Invalid token to reset password`);
    const existingUser = await this._prisma.user.findFirst({
      where: { id: userId, isDeleted: false },
      select: {
        id: true
      }
    });
    if (!existingUser)
      throw new BadRequestException(`There is no user with ID ${userId}`);
    const passwordHashed = this._bcryptAdapter.hash(newPassword);
    const userUpdated = await this._prisma.user.update({
      where: {
        id: userId
      },
      data: {
        password: passwordHashed
      }
    })
    if (userUpdated) return "OK"
    return "Something went wrong, please contact Sys Admin";
  }

}
