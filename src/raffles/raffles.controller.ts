import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RafflesService } from './raffles.service';
import { CreateRaffleDto } from './dto/create-raffle.dto';
import { UpdateRaffleDto } from './dto/update-raffle.dto';

@Controller({
  path:'raffles',
  version:'1'
})
export class RafflesController {
  constructor(private readonly rafflesService: RafflesService) {}

  @Post()
  create(@Body() createRaffleDto: CreateRaffleDto) {
    return this.rafflesService.create(createRaffleDto);
  }

  @Get()
  findAll() {
    return this.rafflesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rafflesService.findOne(+id);
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
