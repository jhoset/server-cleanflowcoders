import { PartialType } from '@nestjs/swagger';
import { CreateRaffleDto } from './create-raffle.dto';

export class UpdateRaffleDto extends PartialType(CreateRaffleDto) {}
