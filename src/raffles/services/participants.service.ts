import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Participant } from '@prisma/client';
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
}
