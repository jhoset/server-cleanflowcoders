import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateRoleDto, RoleDto, RoleWithPermissionsDto, UpdateRoleDto } from './dto';
import { PermissionDto } from 'src/permission/dto';

@Injectable()
export class RoleService {

  constructor(private _prisma: PrismaService) { }


  async create(createRoleDto: CreateRoleDto) {
    const permissionIds = createRoleDto.permissions.map(({ id }) => id);
    await this.checkExistingPermissions(permissionIds);

    const roleCreated = await this._prisma.role.create({
      data: {
        ...createRoleDto,
        changedBy: 'system',
        permissions: {
          create: permissionIds.map(id => (
            {
              changedBy: 'system',
              permission: { connect: { id } }
            }
          ))
        }
      }
    })

    return RoleDto.mapFrom(roleCreated);
  }

  async findAll() {
    const dbRoles = await this._prisma.role.findMany({
      where: { isDeleted: false },
      include: {
        permissions: {
          select: {
            permission: true
          }
        }
      }
    })
    return dbRoles.map(role => RoleWithPermissionsDto.mapFrom(role));
  }

  async findOne(id: number) {
    const existingRole = await this._prisma.role.findFirst({
      where: { id, isDeleted: false },
      include: {
        permissions: {
          select: {
            permission: true
          }
        }
      }
    })
    if (!existingRole) throw new NotFoundException(`There is no Role with ID: ${id}`)
    return RoleWithPermissionsDto.mapFrom(existingRole);
  }

  async update(id: number, updateRoleDto: UpdateRoleDto) {
    await this.findOne(id);
    const permissionIds = updateRoleDto.permissions.map(({ id }) => id);
    await this.checkExistingPermissions(permissionIds);

    const roleUpdated = await this._prisma.role.update({
      where: { id },
      data: {
        ...updateRoleDto,
        changedBy: 'system',
        permissions: {
          deleteMany: {},
          create: permissionIds.map(id => (
            {
              changedBy: 'system',
              permission: { connect: { id } }
            }
          ))
        }
      }
    })
    return RoleDto.mapFrom(roleUpdated);
  }

  async remove(id: number) {
    await this.findOne(id);
    const { isDeleted } = await this._prisma.role.update({
      where: { id },
      data: { isDeleted: true, changedBy: 'system' }
    })
    return isDeleted ? true : false;
  }


  private async checkExistingPermissions(permissionIds: number[]) {
    const dbPermissions = await this._prisma.permission.findMany({
      where: {
        isDeleted: false,
        id: { in: permissionIds }
      }
    })
    if (permissionIds.length !== dbPermissions.length) {
      throw new BadRequestException(`At least one Permission provided does not exists in the database`);
    }
    return dbPermissions;
  }
}
