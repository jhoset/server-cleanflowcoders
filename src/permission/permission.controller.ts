import { Controller, Get, Body, Patch, Param, Post, Delete } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { CreatePermissionDto, UpdatePermissionDto } from './dto';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/auth/decorators';
import { Permissions } from 'src/helpers/constants';

@ApiTags('Permission')
@Auth()
@Controller('permission')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) { }


  @Get()
  findAll() {
    return this.permissionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.permissionService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePermissionDto: UpdatePermissionDto) {
    return this.permissionService.update(+id, updatePermissionDto);
  }

  @Post()
  create(@Body() createPermissionDto: CreatePermissionDto) {
    return this.permissionService.create(createPermissionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.permissionService.remove(+id);
  }
}
