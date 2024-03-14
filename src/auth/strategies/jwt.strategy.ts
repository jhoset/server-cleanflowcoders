import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { JwtPayload } from "../interfaces";
import { PrismaService } from "src/prisma/prisma.service";
import { ConfigService } from "@nestjs/config";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { CurrentUserDto } from "../dto";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

    constructor(
        private _prisma: PrismaService,
        private _configService: ConfigService) {
        super({
            secretOrKey: _configService.get('JWT_SECRET'),
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
        });
    }


    async validate(payload: JwtPayload): Promise<CurrentUserDto> {
        const { id } = payload;

        const userDb = await this.getUserWithRolesAndPermissions(id);
        if (!userDb) throw new UnauthorizedException(`Invalid Token`);

        // TODO - FUTURE FEAT
        // if (!user.emailVerified) throw new UnauthorizedException('User Unverified, please verify your email address');

        const currentUser = CurrentUserDto.mapFromObjWithRolesAndPermissions(userDb)
        return currentUser;
    }

    private async getUserWithRolesAndPermissions(id: number) {
        const userDb = await this._prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                firstName: true,
                middleName: true,
                userName: true,
                email: true,
                roles: {
                    select: {
                        role: {
                            select: {
                                id: true,
                                name: true,
                                permissions: {
                                    select: {
                                        permission: {
                                            select: {
                                                id: true,
                                                code: true,
                                                name: true
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        })
        return userDb;
    }

}