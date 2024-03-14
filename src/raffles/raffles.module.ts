import { Module } from '@nestjs/common';
import { RafflesService } from './services/raffles.service';
import { RafflesController } from './controllers/raffles.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { ParticipantsController } from './controllers/participants.controller';
import { CommonModule } from '../common/common.module';
import { ParticipantsService } from './services/participants.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [PrismaModule, CommonModule, AuthModule],
  controllers: [RafflesController, ParticipantsController],
  providers: [RafflesService, ParticipantsService],
})
export class RafflesModule {}
