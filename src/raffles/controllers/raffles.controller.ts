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
  Query,
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
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiHeader,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import {
  FilterParametersDto,
  PaginationDto,
  PaginationResultDto,
} from '../../common/dto';
import { Auth } from '../../auth/decorators';
import { Permissions } from '../../helpers/constants';
import { RafflesErrorCodes } from '../constants/raffle-error.constan';

@ApiTags('Raffles')
@Controller({
  path: 'raffles',
  version: '1',
})
export class RafflesController {
  constructor(private readonly rafflesService: RafflesService) {}

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new raffle' })
  @ApiCreatedResponse({
    description: 'The raffle has been created successfully.',
  })
  @ApiHeader({
    name: 'timezone',
    description: 'The client time zone',
    required: true,
  })
  @Auth(Permissions.MANAGE_RAFFLE)
  @UseInterceptors(TimezoneHeaderInterceptor)
  @UseInterceptors(SetTimezoneHeaderRequest)
  async create(@Body() createRaffleDto: CreateRaffleDto): Promise<Raffle> {
    return this.rafflesService.create(createRaffleDto);
  }

  @Get()
  @ApiOperation({ summary: 'List raffles' })
  @ApiOkResponse({
    description: 'List of raffles returned successfully',
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
    description: 'A search term to filter raffles by name',
    type: String,
  })
  @UseInterceptors(TimezoneHeaderInterceptor)
  async findAll(
    @Headers('timezone') timezone: string,
    @Query() paginationDto: PaginationDto,
    @Query() { search }: FilterParametersDto,
  ): Promise<PaginationResultDto> {
    return this.rafflesService.findAll(timezone, paginationDto, search);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one raffle' })
  @ApiOkResponse({
    description: 'Raffle returned successfully',
  })
  @ApiNotFoundResponse({ description: 'Raffle not found' })
  @ApiHeader({
    name: 'timezone',
    description: 'The client time zone',
    required: true,
  })
  @UseInterceptors(TimezoneHeaderInterceptor)
  async findOne(
    @Headers('timezone') timezone: string,
    @Param('id') id: string,
  ): Promise<Raffle> {
    return this.rafflesService.findOne(timezone, +id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a raffle' })
  @ApiHeader({
    name: 'timezone',
    description: 'The client time zone',
    required: true,
  })
  @ApiOkResponse({
    description: 'Raffle updated successfully',
  })
  @ApiNotFoundResponse({ description: 'Raffle not found' })
  @Auth(Permissions.MANAGE_RAFFLE)
  @UseInterceptors(TimezoneHeaderInterceptor)
  @UseInterceptors(SetTimezoneHeaderRequest)
  async update(
    @Param('id') id: string,
    @Body() updateRaffleDto: UpdateRaffleDto,
  ): Promise<Raffle> {
    return this.rafflesService.update(+id, updateRaffleDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a raffle' })
  @ApiHeader({
    name: 'timezone',
    description: 'The client time zone',
    required: true,
  })
  @ApiOkResponse({ description: 'Raffle deleted successfully' })
  @ApiNotFoundResponse({ description: 'Raffle not found' })
  @Auth(Permissions.MANAGE_RAFFLE)
  @UseInterceptors(TimezoneHeaderInterceptor)
  async remove(
    @Headers('timezone') timezone: string,
    @Param('id') id: string,
  ): Promise<{ message: string }> {
    return this.rafflesService.remove(timezone, +id);
  }
  @Get(':id/participants')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List participants of a raffle' })
  @ApiHeader({
    name: 'timezone',
    description: 'The client time zone',
    required: true,
  })
  @ApiOkResponse({
    description: 'List of participants returned successfully',
  })
  @ApiNotFoundResponse({ description: 'Raffle not found' })
  @Auth(Permissions.MANAGE_RAFFLE)
  @UseInterceptors(TimezoneHeaderInterceptor)
  async listParticipants(
    @Headers('timezone') timezone: string,
    @Param('id') id: string,
  ): Promise<Participant[]> {
    return await this.rafflesService.listParticipants(timezone, +id);
  }
  @Post(':id/participants')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Register a participant for a raffle' })
  @ApiCreatedResponse({ description: 'Participant successfully registered' })
  @ApiNotFoundResponse({ description: 'Raffle not found' })
  @ApiBadRequestResponse({
    description: 'Error related to raffle',
    content: {
      'application/json': {
        schema: {
          oneOf: Object.values(RafflesErrorCodes)
            .filter(
              (error) =>
                error === RafflesErrorCodes.RaffleRegistrationPeriod ||
                error === RafflesErrorCodes.RaffleMaxParticipants ||
                error === RafflesErrorCodes.DiscordUserNotFound ||
                error === RafflesErrorCodes.AlreadyParticipating,
            )
            .map((error) => ({
              type: 'object',
              properties: {
                code: { type: 'string', example: error.code },
                message: { type: 'string', example: error.message },
              },
            })),
        },
      },
    },
  })
  async registerParticipant(
    @Param('id') id: string,
    @Body() insertParticipant: InsertParticipantDto,
  ): Promise<{ message: string }> {
    return this.rafflesService.registerParticipant(id, insertParticipant);
  }
  @Get(':id/winner')
  @ApiOperation({ summary: 'Get winner of a raffle by ID' })
  @ApiOkResponse({ description: 'Winner of the raffle found' })
  @ApiNotFoundResponse({ description: 'Raffle or winner not found' })
  @ApiBadRequestResponse({
    description: 'No winner for this raffle',
    schema: {
      properties: {
        message: {
          type: 'string',
          example: 'There is currently no winner for this raffle.',
        },
      },
    },
  })
  async getWinnerByRaffleId(@Param('id') id: string): Promise<Participant> {
    return this.rafflesService.getWinnerByRaffleId(+id);
  }
  @Get(':id/play')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Play raffle by ID' })
  @ApiOkResponse({
    description: 'Raffle played successfully',
  })
  @ApiNotFoundResponse({ description: 'Raffle not found' })
  @ApiBadRequestResponse({
    description: 'Error related to raffle',
    content: {
      'application/json': {
        schema: {
          oneOf: Object.values(RafflesErrorCodes)
            .filter(
              (error) =>
                error === RafflesErrorCodes.RaffleAlreadyPlayed ||
                error === RafflesErrorCodes.RaffleDateNotReached,
            )
            .map((error) => ({
              type: 'object',
              properties: {
                code: { type: 'string', example: error.code },
                message: { type: 'string', example: error.message },
              },
            })),
        },
      },
    },
  })
  @Auth(Permissions.MANAGE_RAFFLE)
  async playRaffle(@Param('id') id: string): Promise<{ winner: Participant }> {
    const winner: Participant = await this.rafflesService.playRaffle(id);
    return { winner };
  }
}
