import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Headers,
  UseInterceptors,
} from '@nestjs/common';
import { RafflesService } from './raffles.service';
import { CreateRaffleDto } from './dto/create-raffle.dto';
import { UpdateRaffleDto } from './dto/update-raffle.dto';
import {
  TimezoneHeaderInterceptor,
  SetTimezoneHeaderRequest,
} from '../common/interceptors';
import { Auth } from 'src/auth/decorators';
import { Permissions } from 'src/helpers/constants';

@Auth(Permissions.MANAGE_RAFFLE)
@Controller({
  path: 'raffles',
  version: '1',
})
export class RafflesController {
  constructor(private readonly rafflesService: RafflesService) { }

  @Post()
  @UseInterceptors(TimezoneHeaderInterceptor)
  @UseInterceptors(SetTimezoneHeaderRequest)
  create(@Body() createRaffleDto: CreateRaffleDto) {
    return this.rafflesService.create(createRaffleDto);
  }

  @Get()
  @UseInterceptors(TimezoneHeaderInterceptor)
  findAll(@Headers('timezone') timezone: string) {
    return this.rafflesService.findAll(timezone);
  }

  @Get(':id')
  @UseInterceptors(TimezoneHeaderInterceptor)
  findOne(@Headers('timezone') timezone: string, @Param('id') id: string) {
    return this.rafflesService.findOne(timezone, +id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRaffleDto: UpdateRaffleDto) {
    return this.rafflesService.update(+id, updateRaffleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rafflesService.remove(+id);
  }
}
