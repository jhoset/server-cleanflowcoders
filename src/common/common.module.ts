import { Module } from '@nestjs/common';
import { BcryptAdapter } from './adapters/bcrypt.adapter';
import { DiscordService } from './services/discord.service';
import { MailerAdapter } from './adapters/mailer.adapter';

@Module({
  providers: [MailerAdapter, BcryptAdapter, DiscordService],
  exports: [MailerAdapter, BcryptAdapter, DiscordService],
})
export class CommonModule {}
