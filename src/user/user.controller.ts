import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import {
  ApiBearerAuth,
  ApiHeader,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { FilterParametersDto, PaginationDto } from 'src/common/dto';
import { Auth } from 'src/auth/decorators';
import { Permissions } from 'src/helpers/constants';
import { CreateUserDto, UpdatePasswordDto, UpdateUserDto } from './dto';

@ApiTags('Users')
@Auth(Permissions.MANAGE_USER)
@ApiBearerAuth()
@Controller({
  path: 'users',
  version: '1',
})
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'List users' })
  @ApiOkResponse({
    description: 'List of users returned successfully',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'The maximum number of items to return per page',
    type: Number,
  })
  @ApiQuery({
    name: 'offset',
    required: false,
    description: 'The number of items to skip',
    type: Number,
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'A search term to filter users by name',
    type: String,
  })
  findAll(
    @Query() paginationDto: PaginationDto,
    @Query() { search }: FilterParametersDto,
  ) {
    return this.userService.findAll(paginationDto, search);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one User' })
  @ApiOkResponse({
    description: 'User returned successfully',
  })
  @ApiNotFoundResponse({ description: 'User not found' })
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Post('updatePassword')
  @ApiOperation({ summary: 'update password' })
  updatePassword(@Body() updatePasswordDto: UpdatePasswordDto) {
    return this.userService.updatePassword(updatePasswordDto);
  }
  @Patch(':id')
  @ApiOperation({ summary: 'Update a User' })
  @ApiOkResponse({
    description: 'User updated successfully',
  })
  @ApiNotFoundResponse({ description: 'User not found' })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a User' })
  @ApiOkResponse({ description: 'User deleted successfully' })
  @ApiNotFoundResponse({ description: 'User not found' })
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
