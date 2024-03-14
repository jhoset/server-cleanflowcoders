
import { UseGuards, applyDecorators } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthorizationGuard } from '../guards';
import { RequiredPermissions } from './required-permissions.decorator';
import { IPermission } from 'src/helpers/constants';

export function Auth(...roles: IPermission[]) {
  return applyDecorators(
    RequiredPermissions(...roles),
    UseGuards(AuthGuard(), AuthorizationGuard)
  );
}
