import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Post,
  Delete,
} from '@nestjs/common';
import { PermissionService } from './permission.service';
import { CreatePermissionDto, UpdatePermissionDto } from './dto';
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Auth } from 'src/auth/decorators';

@ApiTags('Permissions')
@Auth()
@ApiBearerAuth()
@Controller({
  path: 'permissions',
  version: '1',
})
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Get()
  @ApiOperation({ summary: 'List permission' })
  @ApiOkResponse({
    description: 'List of permission returned successfully',
  })
  findAll() {
    return this.permissionService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one Permission' })
  @ApiOkResponse({
    description: 'Permission returned successfully',
  })
  @ApiNotFoundResponse({ description: 'Permission not found' })
  findOne(@Param('id') id: string) {
    return this.permissionService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a Permission' })
  @ApiOkResponse({
    description: 'Permission updated successfully',
  })
  @ApiNotFoundResponse({ description: 'Permission not found' })
  update(
    @Param('id') id: string,
    @Body() updatePermissionDto: UpdatePermissionDto,
  ) {
    return this.permissionService.update(+id, updatePermissionDto);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new permission' })
  create(@Body() createPermissionDto: CreatePermissionDto) {
    return this.permissionService.create(createPermissionDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a Permission' })
  @ApiOkResponse({ description: 'Permission deleted successfully' })
  @ApiNotFoundResponse({ description: 'Permission not found' })
  remove(@Param('id') id: string) {
    return this.permissionService.remove(+id);
  }
}
