import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Participant, RaffleParticipant } from '@prisma/client';
import { CreateParticipantDto } from '../dto/create-participant.dto';

@Injectable()
export class ParticipantsService {
  constructor(private readonly prismaService: PrismaService) {}
  async findParticipantByDiscordId(
    discordId: string,
  ): Promise<Participant | null> {
    return this.prismaService.participant.findUnique({ where: { discordId } });
  }
  async createParticipant(
    participantData: CreateParticipantDto,
  ): Promise<Participant> {
    const data = participantData;
    return this.prismaService.participant.create({ data });
  }
  async getOrCreateParticipantByDiscordId(
    discordId: string,
    participantData: CreateParticipantDto,
  ): Promise<Participant> {
    const participant: Participant | null =
      await this.findParticipantByDiscordId(discordId);
    if (participant) return participant;
    return this.createParticipant(participantData);
  }
  async getNumberOfParticipantsByRaffleId(raffleId: number): Promise<number> {
    try {
      return await this.prismaService.raffleParticipant.count({
        where: { raffleId },
      });
    } catch (error) {
      throw new BadRequestException(
        `Failed to get number of participants: ${error}`,
      );
    }
  }
  async getWinnerByRaffleId(raffleId: number): Promise<Participant> {
    const winner: Participant | null =
      await this.prismaService.participant.findFirst({
        where: {
          raffles: {
            some: {
              raffleId,
              isWinner: true,
            },
          },
        },
      });

    if (!winner) {
      throw new BadRequestException(
        `There is currently no winner for this raffle.`,
      );
    }

    return winner;
  }
  async getParticipantsByRaffleId(raffleId: number): Promise<Participant[]> {
    return await this.prismaService.participant.findMany({
      where: {
        raffles: {
          some: {
            raffleId,
          },
        },
      },
    });
  }
}
