import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client, GatewayIntentBits, GuildMember } from 'discord.js';

@Injectable()
export class DiscordService {
  private readonly client: Client;

  constructor(private configService: ConfigService) {
    // console.log('Hola');
    this.client = new Client({
      intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
    });
    this.client.login(this.configService.get<string>('BOT_TOKEN_DISCORD'));
  }
  async getDiscordUser(discordId: string): Promise<GuildMember | null> {
    try {
      const serverId = this.configService.get<string>('SERVER_ID_DISCORD');
      const server = await this.getServerDiscord(serverId);
      const member = await server.members.fetch(discordId);
      return member;
    } catch (error) {
      return null;
    }
  }
  async getServerDiscord(serverId: string) {
    return await this.client.guilds.fetch(serverId);
  }
}
