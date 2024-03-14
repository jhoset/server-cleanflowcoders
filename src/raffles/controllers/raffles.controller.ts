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
import { RafflesService } from '../services/raffles.service';
import { CreateRaffleDto } from '../dto/create-raffle.dto';
import { UpdateRaffleDto } from '../dto/update-raffle.dto';
import {
  TimezoneHeaderInterceptor,
  SetTimezoneHeaderRequest,
} from '../../common/interceptors';
import { InsertParticipantDto } from '../dto/insert-participant.dto';
import { Participant, Raffle } from '@prisma/client';

@Controller({
  path: 'raffles',
  version: '1',
})
export class RafflesController {
  constructor(private readonly rafflesService: RafflesService) {}

  @Post()
  @UseInterceptors(TimezoneHeaderInterceptor)
  @UseInterceptors(SetTimezoneHeaderRequest)
  async create(@Body() createRaffleDto: CreateRaffleDto): Promise<Raffle> {
    return this.rafflesService.create(createRaffleDto);
  }

  @Get()
  @UseInterceptors(TimezoneHeaderInterceptor)
  async findAll(@Headers('timezone') timezone: string): Promise<Raffle[]> {
    return this.rafflesService.findAll(timezone);
  }

  @Get(':id')
  @UseInterceptors(TimezoneHeaderInterceptor)
  async findOne(
    @Headers('timezone') timezone: string,
    @Param('id') id: string,
  ): Promise<Raffle> {
    return this.rafflesService.findOne(timezone, +id);
  }

  @Patch(':id')
  @UseInterceptors(TimezoneHeaderInterceptor)
  @UseInterceptors(SetTimezoneHeaderRequest)
  async update(
    @Param('id') id: string,
    @Body() updateRaffleDto: UpdateRaffleDto,
  ): Promise<Raffle> {
    return this.rafflesService.update(+id, updateRaffleDto);
  }

  @Delete(':id')
  @UseInterceptors(TimezoneHeaderInterceptor)
  async remove(
    @Headers('timezone') timezone: string,
    @Param('id') id: string,
  ): Promise<{ message: string }> {
    return this.rafflesService.remove(timezone, +id);
  }
  @Post(':id/participants')
  async registerParticipant(
    @Param('id') id: string,
    @Body() insertParticipant: InsertParticipantDto,
  ): Promise<{ message: string }> {
    return this.rafflesService.registerParticipant(id, insertParticipant);
  }
  @Get(':id/play')
  async playRaffle(@Param('id') id: string): Promise<{ winner: Participant }> {
    const winner: Participant = await this.rafflesService.playRaffle(id);
    return { winner };
  }
}
