import { Module } from '@nestjs/common';
import { BcryptAdapter } from './adapters/bcrypt.adapter';
import { DiscordService } from './services/discord.service';
import { EmailService } from './services/email.service';

@Module({
  providers: [BcryptAdapter, DiscordService, EmailService],
  exports: [BcryptAdapter, DiscordService, EmailService],
})
export class CommonModule {}
