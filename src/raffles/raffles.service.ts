import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRaffleDto } from './dto/create-raffle.dto';
import { UpdateRaffleDto } from './dto/update-raffle.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Raffle } from '@prisma/client';
import { TimezoneAdapter } from '../common/adapters';

@Injectable()
export class RafflesService {
  constructor(private readonly prismaService: PrismaService) {}
  async create({ timezone, ...data }: CreateRaffleDto): Promise<Raffle> {
    const raffle: Raffle = await this.prismaService.raffle.create({ data });

    const { startInscriptionDate, endInscriptionDate, date } = raffle;

    const [formattedDate, formattedStartDate, formattedEndDate]: string[] =
      await Promise.all([
        TimezoneAdapter.convertFromSystemToSpecificTimezone(
          date,
          timezone,
        ).format('YYYY-MM-DD HH:mm:ss'),
        TimezoneAdapter.convertFromSystemToSpecificTimezone(
          startInscriptionDate,
          timezone,
        ).format('YYYY-MM-DD HH:mm:ss'),
        TimezoneAdapter.convertFromSystemToSpecificTimezone(
          endInscriptionDate,
          timezone,
        ).format('YYYY-MM-DD HH:mm:ss'),
      ]);

    return {
      ...raffle,
      date: formattedDate,
      startInscriptionDate: formattedStartDate,
      endInscriptionDate: formattedEndDate,
    };
  }

  async findAll(timezone: string) {
    const raffles: Raffle[] = await this.prismaService.raffle.findMany();
    const convertedRaffles: Promise<Raffle>[] = raffles.map(
      async (raffle: Raffle) => {
        const { startInscriptionDate, endInscriptionDate, date, ...rest } =
          raffle;
        const formattedDate =
          TimezoneAdapter.convertFromSystemToSpecificTimezone(
            date,
            timezone,
          ).format('YYYY-MM-DD HH:mm:ss');
        const formattedStartDate =
          TimezoneAdapter.convertFromSystemToSpecificTimezone(
            startInscriptionDate,
            timezone,
          ).format('YYYY-MM-DD HH:mm:ss');
        const formattedEndDate =
          TimezoneAdapter.convertFromSystemToSpecificTimezone(
            endInscriptionDate,
            timezone,
          ).format('YYYY-MM-DD HH:mm:ss');
        return {
          ...rest,
          date: formattedDate,
          startInscriptionDate: formattedStartDate,
          endInscriptionDate: formattedEndDate,
        };
      },
    );
    return Promise.all(convertedRaffles);
  }

  async findOne(timezone: string, id: number): Promise<Raffle> {
    const raffle: Raffle | null = await this.prismaService.raffle.findUnique({
      where: { id },
    });
    if (!raffle) {
      throw new NotFoundException('raffle not found.');
    }
    const { startInscriptionDate, endInscriptionDate, date } = raffle;

    const [formattedDate, formattedStartDate, formattedEndDate]: string[] =
      await Promise.all([
        TimezoneAdapter.convertFromSystemToSpecificTimezone(
          date,
          timezone,
        ).format('YYYY-MM-DD HH:mm:ss'),
        TimezoneAdapter.convertFromSystemToSpecificTimezone(
          startInscriptionDate,
          timezone,
        ).format('YYYY-MM-DD HH:mm:ss'),
        TimezoneAdapter.convertFromSystemToSpecificTimezone(
          endInscriptionDate,
          timezone,
        ).format('YYYY-MM-DD HH:mm:ss'),
      ]);
    return {
      ...raffle,
      date: formattedDate,
      startInscriptionDate: formattedStartDate,
      endInscriptionDate: formattedEndDate,
    };
  }

  update(id: number, updateRaffleDto: UpdateRaffleDto) {
    return `This action updates a #${id} raffle`;
  }

  remove(id: number) {
    return `This action removes a #${id} raffle`;
  }
}
