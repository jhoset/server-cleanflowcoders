import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePermissionDto, PermissionDto, UpdatePermissionDto } from './dto';

@Injectable()
export class PermissionService {

  constructor(private _prisma: PrismaService) { }

  async create(createPermissionDto: CreatePermissionDto) {
    //TODO: GET CURRENT USER
    const permissionCreated = await this._prisma.permission.create({
      data: {
        ...createPermissionDto,
        changedBy: 'system'
      },
    })
    return PermissionDto.mapFrom(permissionCreated);
  }

  async findAll() {
    const dbPermissions = await this._prisma.permission.findMany({ where: { isDeleted: false } })
    return dbPermissions.map(permission => PermissionDto.mapFrom(permission));
  }

  async findOne(id: number) {
    const existingPermission = await this._prisma.permission.findFirst({ where: { id, isDeleted: false } });
    if (!existingPermission) throw new NotFoundException(`There is no permission with id = ${id}`);
  }

  async update(id: number, updatePermissionDto: UpdatePermissionDto) {
    await this.findOne(id);
    //TODO: GET CURRENT USER
    const permissionUpdated = await this._prisma.permission.update({
      where: { id },
      data: {
        ...updatePermissionDto,
        changedBy: 'sytem'
      }
    })
    return PermissionDto.mapFrom(permissionUpdated);
  }

  async remove(id: number) {
    //TODO: GET CURRENT USER
    await this.findOne(id);
    const { isDeleted } = await this._prisma.permission.update({
      where: { id },
      data: {
        isDeleted: true,
        changedBy: 'system'
      }
    })
    return isDeleted ? true : false;
  }
}
