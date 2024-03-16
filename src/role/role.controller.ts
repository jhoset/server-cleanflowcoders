import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto, UpdateRoleDto } from './dto';
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Auth } from 'src/auth/decorators';
import { Permissions } from 'src/helpers/constants';

@ApiTags('Roles')
@ApiBearerAuth()
@Auth(Permissions.MANAGE_USER)
@Controller({
  path: 'roles',
  version: '1',
})
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  @Post()
  @ApiOperation({ summary: 'Create a new role' })
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.create(createRoleDto);
  }

  @Get()
  @ApiOperation({ summary: 'List roles' })
  @ApiOkResponse({
    description: 'List of roles returned successfully',
  })
  findAll() {
    return this.roleService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one Role' })
  @ApiOkResponse({
    description: 'Role returned successfully',
  })
  @ApiNotFoundResponse({ description: 'Role not found' })
  findOne(@Param('id') id: string) {
    return this.roleService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a Role' })
  @ApiOkResponse({
    description: 'Role updated successfully',
  })
  @ApiNotFoundResponse({ description: 'Role not found' })
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.roleService.update(+id, updateRoleDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a Role' })
  @ApiOkResponse({ description: 'Role deleted successfully' })
  @ApiNotFoundResponse({ description: 'Role not found' })
  remove(@Param('id') id: string) {
    return this.roleService.remove(+id);
  }
}
