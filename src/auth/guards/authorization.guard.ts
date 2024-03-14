import { BadRequestException, CanActivate, ExecutionContext, ForbiddenException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { META_PERMISSIONS } from '../decorators';
import { CurrentUserDto } from '../dto';
import { IPermission } from 'src/helpers/constants';

@Injectable()
export class AuthorizationGuard implements CanActivate {


  constructor(
    private readonly reflector: Reflector
  ) { }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    const requiredPermissions: IPermission[] = this.reflector.get(META_PERMISSIONS, context.getHandler())

    if (!requiredPermissions) return true;
    if (!requiredPermissions.length) return true;

    const req = context.switchToHttp().getRequest();
    const user = req.user as CurrentUserDto;

    if (!user) throw new InternalServerErrorException('User Not Found(Request)');
    const allUserPermissions = user.roles.flatMap(role => role.permissions.map(permission => permission.code));
    const hasRequiredPermissions = requiredPermissions.every(({code}) => allUserPermissions.includes(code));

    if (hasRequiredPermissions) return true;
    throw new ForbiddenException(`Access Denied! - Missing Permissions: [ ${requiredPermissions.map(rp => rp.name)} ]`);
    
  }
}
