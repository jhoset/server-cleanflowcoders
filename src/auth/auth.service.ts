import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginUserDto, RegisterUserDto } from './dto';
import { BcryptAdapter } from 'src/common/adapters/bcrypt.adapter';
import { JwtPayload } from './interfaces';
import { UserWithRolesDto } from 'src/user/dto';

@Injectable()
export class AuthService {


  constructor(
    private _prisma: PrismaService,
    private _bcryptAdapter: BcryptAdapter,
    private _jwtService: JwtService) { }


  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;
    const existingUser = await this._prisma.user.findUnique({
      where: { email, isDeleted: false },
      include: {
        roles: {
          select: { role: true }
        },
      }
    })
    if (!existingUser) throw new UnauthorizedException('Email or password is incorrect');
    if (!this._bcryptAdapter.compare(password, existingUser.password)) throw new UnauthorizedException('Email or password is incorrect');
    const userWithRoleDto = UserWithRolesDto.mapFrom(existingUser);
    return { user: userWithRoleDto, token: this.getJwtToken({ id: existingUser.id }) };
  }

  register(registerUserDto: RegisterUserDto) {
    return `This action register`;
  }


  private getJwtToken(payload: JwtPayload) {
    const token = this._jwtService.sign(payload);
    return token;
  }
}
