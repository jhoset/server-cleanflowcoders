import { SetMetadata } from '@nestjs/common';
import { IPermission } from 'src/helpers/constants';


export const META_PERMISSIONS = 'permissions';

export const RequiredPermissions = (...args: IPermission[]) => SetMetadata(META_PERMISSIONS, args);
