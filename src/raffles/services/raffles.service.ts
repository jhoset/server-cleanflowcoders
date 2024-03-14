import {
  BadRequestException,
  Body,
  Headers,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  Param,
} from '@nestjs/common';
import { CreateRaffleDto } from '../dto/create-raffle.dto';
import { UpdateRaffleDto } from '../dto/update-raffle.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { Participant, Raffle, RaffleParticipant } from '@prisma/client';
import { TimezoneAdapter } from '../../common/adapters';
import { GuildMember } from 'discord.js';
import { InsertParticipantDto } from '../dto/insert-participant.dto';
import { DiscordService } from '../../common/services/discord.service';
import { ParticipantsService } from './participants.service';
import { CreateParticipantDto } from '../dto/create-participant.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RafflesService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
    private readonly discordService: DiscordService,
    private readonly participantService: ParticipantsService,
  ) {}
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
  async findValidRaffleForRegistration(id: number): Promise<Raffle> {
    const tzServer = this.configService.get('TIMEZONE');
    const now = new Date();
    const raffle: Raffle = await this.findOne(tzServer, +id);
    const startInscriptionDate = new Date(raffle.startInscriptionDate);
    const endInscriptionDate = new Date(raffle.endInscriptionDate);

    if (now < startInscriptionDate || now > endInscriptionDate) {
      throw new BadRequestException(
        'You cannot register for this raffle as it is not within the registration period.',
      );
    }
    return raffle;
  }
  async insertParticipant(id: string, { discordId }: InsertParticipantDto) {
    const raffle: Raffle = await this.findValidRaffleForRegistration(+id);
    const discordUser: GuildMember =
      await this.discordService.getDiscordUser(discordId);
    try {
      const transaction = await this.prismaService.$transaction(
        async (prisma) => {
          const participantDto: CreateParticipantDto = {
            discordId: discordUser.id,
            globalName: discordUser.user.globalName,
            username: discordUser.user.username,
            avatarUrl: discordUser.user.displayAvatarURL(),
            joinedAt: discordUser.joinedAt,
          };

          const participant: Participant =
            await this.participantService.getOrCreateParticipantByDiscordId(
              discordId,
              participantDto,
            );

          await prisma.raffleParticipant.create({
            data: {
              raffleId: raffle.id,
              participantId: participant.id,
            },
          });

          return {
            message: 'Your registration for this raffle has been successful.',
          };
        },
      );
      return transaction;
    } catch (e) {
      if (e.code === 'P2002') {
        throw new BadRequestException(
          'You are already participating in this raffle.',
        );
      }
      console.log(e);
      throw new InternalServerErrorException(e.message);
    }
  }
}
