import { Module } from '@nestjs/common';
import { BcryptAdapter } from './adapters/bcrypt.adapter';
import { DiscordService } from './services/discord.service';

@Module({
  providers: [BcryptAdapter, DiscordService],
  exports: [BcryptAdapter, DiscordService],
})
export class CommonModule {}
