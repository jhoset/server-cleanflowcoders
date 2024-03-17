import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PaginationDto, PaginationResultDto } from 'src/common/dto';
import {
  CreateUserDto,
  UpdatePasswordDto,
  UpdateUserDto,
  UserDto,
  UserWithRolesDto,
} from './dto';
import { ConfigService } from '@nestjs/config';
import { generateUserName } from 'src/helpers';
import { BcryptAdapter } from 'src/common/adapters/bcrypt.adapter';
import { Prisma, User } from '@prisma/client';

@Injectable()
export class UserService {
  private readonly serverUrl: string;
  constructor(
    private _prisma: PrismaService,
    private _configService: ConfigService,
    private _bcryptAdapter: BcryptAdapter,
  ) {
    this.serverUrl = this._configService.get<string>('serverUrl');
  }

  async create(createUserDto: CreateUserDto) {
    //TODO: GET CURRENT USER
    await this.checkNotRegisteredEmail(createUserDto.email);
    const roleIds = createUserDto.roles.map(({ id }) => id);
    await this.checkExistingRoles(roleIds);

    createUserDto.password = this._bcryptAdapter.hash(createUserDto.password);
    const userName = generateUserName(
      createUserDto.firstName,
      createUserDto.lastName,
    );

    const userCreated = await this._prisma.user.create({
      data: {
        ...createUserDto,
        userName,
        changedBy: 'system',
        roles: {
          create: roleIds.map((id) => ({
            changedBy: 'system',
            role: { connect: { id } },
          })),
        },
      },
    });
    return UserDto.mapFrom(userCreated);
  }

  async findAll(paginationDto: PaginationDto, search?: string) {
    let whereCondition: Prisma.UserWhereInput = {
      isDeleted: false,
    };
    if (search) {
      whereCondition = {
        ...whereCondition,
        OR: [
          {
            firstName: {
              contains: search,
              mode: 'insensitive',
            },
          },
          {
            lastName: {
              contains: search,
              mode: 'insensitive',
            },
          },
          {
            userName: {
              contains: search,
              mode: 'insensitive',
            },
          },
        ],
      };
    }
    const { offset = 0, limit = 10 } = paginationDto;
    const dbUsers: User[] = await this._prisma.user.findMany({
      where: whereCondition,
      include: {
        roles: {
          select: { role: true },
        },
      },
      skip: offset,
      take: limit,
    });
    const total = dbUsers.length;
    const result = dbUsers.map((user) => UserWithRolesDto.mapFrom(user));
    const prev =
      offset - limit >= 0
        ? `${this.serverUrl}/api/v1/user?offset=${offset - limit}&limit=${limit}`
        : null;
    const next =
      offset + limit < total
        ? `${this.serverUrl}/api/v1/user?offset=${offset + limit}&limit=${limit}`
        : null;
    const pagination = { total, limit, prev, next };
    return new PaginationResultDto(pagination, result);
  }

  async findOne(id: number) {
    const existingUser = await this._prisma.user.findFirst({
      where: { id, isDeleted: false },
      include: {
        roles: {
          select: { role: true },
        },
      },
    });
    if (!existingUser)
      throw new NotFoundException(`There is no user with ID: ${id}`);
    return UserWithRolesDto.mapFrom(existingUser);
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    //TODO: GET CURRENT USER
    const userDb = await this.findOne(id);
    if (userDb.email !== updateUserDto.email)
      await this.checkNotRegisteredEmail(updateUserDto.email);
    const roleIds = updateUserDto.roles.map(({ id }) => id);
    await this.checkExistingRoles(roleIds);

    const userUpdated = await this._prisma.user.update({
      where: { id },
      data: {
        ...updateUserDto,
        changedBy: 'system',
        roles: {
          deleteMany: {},
          create: roleIds.map((id) => ({
            changedBy: 'system',
            role: {
              connect: { id },
            },
          })),
        },
      },
    });
    return UserDto.mapFrom(userUpdated);
  }

  async remove(id: number) {
    //TODO: GET CURRENT USER
    await this.findOne(id);
    const { isDeleted } = await this._prisma.user.update({
      where: { id },
      data: { isDeleted: true, changedBy: 'system' },
    });
    return isDeleted ? true : false;
  }

  async updatePassword(updatePasswordDto: UpdatePasswordDto) {
    const { userId, newPassword } = updatePasswordDto;
    await this.findOne(userId);
    const userDb = await this._prisma.user.findUnique({
      where: { id: userId, isDeleted: false },
      select: { password: true, email: true },
    });
    if (
      this._bcryptAdapter.compare(
        updatePasswordDto.newPassword,
        userDb.password,
      )
    ) {
      throw new BadRequestException(
        'The new password cannot be the same as the previous passwords',
      );
    }
    updatePasswordDto.newPassword = this._bcryptAdapter.hash(newPassword);
    const userUpdated = await this._prisma.user.update({
      where: { id: userId },
      data: {
        password: updatePasswordDto.newPassword,
      },
    });
    return true;
  }

  private async checkNotRegisteredEmail(email: string) {
    const existingUser = await this._prisma.user.findFirst({
      where: { email, isDeleted: false },
    });
    if (existingUser)
      throw new BadRequestException(
        `There is already a user with the email ${email}`,
      );
  }

  private async checkExistingRoles(roleIds: number[]) {
    const dbPermissions = await this._prisma.role.findMany({
      where: {
        isDeleted: false,
        id: { in: roleIds },
      },
    });
    if (roleIds.length !== dbPermissions.length) {
      throw new BadRequestException(
        `At least one Role provided does not exists in the database`,
      );
    }
    return dbPermissions;
  }
}
