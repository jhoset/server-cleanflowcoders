import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateRaffleDto } from '../dto/create-raffle.dto';
import { UpdateRaffleDto } from '../dto/update-raffle.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { Participant, Raffle } from '@prisma/client';
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

  async findAll(timezone: string): Promise<Raffle[]> {
    const raffles: Raffle[] = await this.prismaService.raffle.findMany({
      where: {
        isDeleted: false,
      },
    });
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
      where: { id, isDeleted: false },
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

  async update(
    id: number,
    { timezone, ...rest }: UpdateRaffleDto,
  ): Promise<Raffle> {
    await this.findOne(timezone, id);
    await this.prismaService.raffle.update({
      where: {
        id: id,
      },
      data: rest,
    });
    const raffle = await this.findOne(timezone, id);
    return raffle;
  }

  async remove(timezone: string, id: number): Promise<{ message: string }> {
    await this.findOne(timezone, id);
    await this.prismaService.raffle.update({
      where: {
        id: id,
      },
      data: {
        isDeleted: true,
      },
    });
    return { message: 'Raffle deleted.' };
  }
  async registerParticipant(
    id: string,
    { discordId }: InsertParticipantDto,
  ): Promise<{ message: string }> {
    const raffle: Raffle = await this.findValidRaffleForRegistration(+id);
    const discordUser: GuildMember =
      await this.discordService.getDiscordUser(discordId);
    if (!discordUser)
      throw new BadRequestException('User not found in the discord server.');
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
  async playRaffle(id: string): Promise<Participant> {
    const raffle: Raffle = await this.findValidRaffleForPlay(+id);

    const participants: Participant[] =
      await this.participantService.getParticipantsByRaffleId(raffle.id);

    const winner: Participant =
      await this.selectWinnerAndValidateCommunity(participants);

    try {
      const transaction = await this.prismaService.$transaction(
        async (prisma) => {
          await prisma.raffleParticipant.update({
            where: {
              raffleId_participantId: {
                raffleId: raffle.id,
                participantId: winner.id,
              },
            },
            data: {
              isWinner: true,
            },
          });

          await prisma.raffle.update({
            where: {
              id: raffle.id,
            },
            data: {
              isPlay: true,
            },
          });

          return winner;
        },
      );

      return transaction;
    } catch (error) {
      throw new BadRequestException('An error occurred during the raffle.');
    }
  }
  private async findValidRaffleForRegistration(id: number): Promise<Raffle> {
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
  private async findValidRaffleForPlay(id: number): Promise<Raffle> {
    const tzServer = this.configService.get('TIMEZONE');
    const now = new Date();
    const raffle: Raffle = await this.findOne(tzServer, +id);
    const date = new Date(raffle.date);
    if (raffle.isPlay) {
      throw new BadRequestException(
        'You cannot play this raffle because it has already been play.',
      );
    }
    if (now < date) {
      throw new BadRequestException(
        'You cannot play this raffle because the raffle date has not yet been reached.',
      );
    }
    return raffle;
  }
  private async selectWinnerAndValidateCommunity(
    participants: Participant[],
  ): Promise<Participant> {
    if (participants.length === 0) {
      throw new BadRequestException(
        'No participants available for the raffle.',
      );
    }

    const shuffledParticipants = this.shuffleArray(participants);

    const winner: Participant = shuffledParticipants[0];

    const discordUser: GuildMember | null =
      await this.discordService.getDiscordUser(winner.discordId);
    if (!discordUser) {
      shuffledParticipants.splice(0, 1); // Eliminar al ganador de la lista de participantes mezclada
      return this.selectWinnerAndValidateCommunity(shuffledParticipants);
    }

    return winner;
  }
  // algoritmo Fisher-Yates
  private shuffleArray<T>(array: T[]): T[] {
    const shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [
        shuffledArray[j],
        shuffledArray[i],
      ];
    }
    return shuffledArray;
  }
}
